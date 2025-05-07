const Attendance = require("../model/AttendanceModel");
const Employee = require("../model/EMregistermodel");
const MonthlyAttendance = require("../model/EMMonthlyAttendanceModel");


// View all attendance records
const getAllAttendance = async (req, res, next) => {
    let attendance;
    const { period } = req.query;
    
    try {
        let query = {};
        
        // Add date filtering based on period
        if (period) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            let startDate = new Date(today);
            
            switch (period) {
                case 'today':
                    // Set to today
                    query.checkInTime = { 
                        $gte: startDate, 
                        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) 
                    };
                    break;
                case 'week':
                    // Set beginning of current week
                    startDate.setDate(today.getDate() - today.getDay());
                    query.checkInTime = { $gte: startDate };
                    break;
                case 'month':
                    // Set to beginning of current month
                    startDate.setDate(1);
                    query.checkInTime = { $gte: startDate };
                    break;
                default:
                    // 'all' or any other value - no date filtering
                    break;
            }
        }
        
        attendance = await Attendance.find(query).sort({ checkInTime: -1 });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error fetching attendance records" });
    }
    
    // not found
    if (!attendance) {
        return res.status(404).json({ message: "Attendance records not found" });
    }
    // Display
    return res.status(200).json({ attendance });
};

// Calculate monthly attendance for an employee
const calculateMonthlyAttendance = async (employeeId, month, year) => {
    try {
        // Get the start and end dates for the given month
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);

        // Get all attendance records for the given employee within the month
        const attendanceRecords = await Attendance.find({
            employeeId: employeeId,
            checkInTime: {
                $gte: startOfMonth,
                $lt: endOfMonth,
            },
        });

        let totalHoursWorked = 0;
        attendanceRecords.forEach(record => {
            if (record.hoursWorked) {
                totalHoursWorked += record.hoursWorked;
            }
        });

        // Return monthly attendance summary
        return {
            month,
            year,
            totalHoursWorked: parseFloat(totalHoursWorked.toFixed(2)),
            attendanceRecords,
        };
    } catch (err) {
        console.log(err);
        throw new Error("Error calculating monthly attendance");
    }
};

// Mark attendance (check-in or check-out)
const markAttendance = async (req, res, next) => {
    const { employeeId, name, phoneNumber } = req.body;

    try {
        // Validate employee existence
        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found in database" });
        }

        // Get the current time in Sri Lankan timezone (UTC+5:30)
        const now = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
        now.setSeconds(0, 0); // Optional: reset seconds and milliseconds for clean data

        // Define the start and end of the current day in Sri Lankan time
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        // Check if attendance already exists for today
        const existingAttendance = await Attendance.findOne({
            employeeId: employeeId,
            checkInTime: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });

        // Handle checkout if attendance is already marked with check-in time
        if (existingAttendance && existingAttendance.checkInTime && !existingAttendance.checkOutTime) {
            const checkInTime = new Date(existingAttendance.checkInTime);
            const diffMinutes = (now - checkInTime) / (1 * 60); // difference in minutes

            // Prevent checkout if employee has worked less than 5 minutes
            if (diffMinutes < 5) {
                return res.status(400).json({
                    message: `You must work at least 5 minutes before checking out. You have worked only ${diffMinutes.toFixed(2)} minutes.`,
                });
            }

            // Update checkout time and calculate hours worked
            existingAttendance.checkOutTime = now;

            const hoursWorked = (existingAttendance.checkOutTime - existingAttendance.checkInTime) / (1000 * 60 * 60);
            existingAttendance.hoursWorked = parseFloat(hoursWorked.toFixed(2));
            existingAttendance.status = 'complete';

            await existingAttendance.save();

            // Calculate and update monthly attendance after checkout
            const month = now.getMonth() + 1; // JavaScript months are 0-based
            const year = now.getFullYear();

            let monthlyAttendance = await MonthlyAttendance.findOne({ employeeId, month, year });

            if (!monthlyAttendance) {
                monthlyAttendance = new MonthlyAttendance({
                    employeeId,
                    month,
                    year,
                    totalHoursWorked: 0,
                    totalDaysWorked: 0,
                });
            }

            // Update the monthly attendance
            monthlyAttendance.totalHoursWorked += existingAttendance.hoursWorked;
            monthlyAttendance.totalDaysWorked += 1; // Increase the days worked count

            await monthlyAttendance.save();

            return res.status(200).json({
                message: 'Checkout successful. Attendance record complete.',
                attendance: existingAttendance,
                monthlyAttendance,
            });
        }

        // If attendance already exists but check-out is done, send a message
        if (existingAttendance && existingAttendance.checkOutTime) {
            return res.status(400).json({
                message: 'Attendance cycle complete for today. Both check-in and check-out already recorded.',
                attendance: existingAttendance,
            });
        }

        // Create a new attendance record (Check-in)
        const attendance = new Attendance({
            employeeId,
            name: name || employee.name,
            phoneNumber: phoneNumber || employee.phoneNumber,
            checkInTime: now,
            status: 'pending',
        });

        await attendance.save();

        return res.status(200).json({
            message: 'Morning check-in successful. Please remember to check out in the evening.',
            attendance,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error marking attendance" });
    }
};


// Get attendance by employee ID
const getAttendanceByEmployeeId = async (req, res, next) => {
    const employeeId = req.params.employeeId;
    const { startDate, endDate } = req.query;
    
    try {
        // Validate if employee exists
        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        
        let query = { employeeId };
        
        if (startDate || endDate) {
            query.checkInTime = {};
            
            if (startDate) {
                query.checkInTime.$gte = new Date(startDate);
            }
            
            if (endDate) {
                query.checkInTime.$lte = new Date(endDate);
            }
        }
        
        const attendance = await Attendance.find(query).sort({ checkInTime: -1 });
        
        if (!attendance || attendance.length === 0) {
            return res.status(404).json({ message: "No attendance records found for this employee" });
        }
        
        return res.status(200).json({ attendance });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error fetching attendance records" });
    }
};

// Get attendance summary for an employee (count of complete, pending, and absent days)
const getAttendanceSummary = async (req, res, next) => {
    const employeeId = req.params.employeeId;
    const { month, year } = req.query;
    
    try {
        // Validate if employee exists
        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        
        // Set default to current month and year if not provided
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth(); // Month is 0-indexed in JS
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();
        
        // Get first and last day of the month
        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0); // Last day of month
        
        // Get all attendance records for this employee in this month
        const attendanceRecords = await Attendance.find({
            employeeId,
            checkInTime: {
                $gte: startDate,
                $lte: endDate
            }
        });
        
        // Count complete attendance days (both check-in and check-out)
        const completeDays = attendanceRecords.filter(record => 
            record.checkInTime && record.checkOutTime).length;
        
        // Count pending attendance days (check-in only)
        const pendingDays = attendanceRecords.filter(record => 
            record.checkInTime && !record.checkOutTime).length;
        
        // Calculate total working days in the month (excluding weekends)
        let totalWorkingDays = 0;
        let currentDay = new Date(startDate);
        
        while (currentDay <= endDate) {
            // Check if not weekend (0 = Sunday, 6 = Saturday)
            const dayOfWeek = currentDay.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                totalWorkingDays++;
            }
            // Move to next day
            currentDay.setDate(currentDay.getDate() + 1);
        }
        
        // Calculate absent days (working days minus complete and pending days)
        const absentDays = Math.max(0, totalWorkingDays - (completeDays + pendingDays));
        
        return res.status(200).json({
            employeeId,
            name: employee.name,
            month: targetMonth + 1,
            year: targetYear,
            summary: {
                totalWorkingDays,
                completeDays,
                pendingDays,
                absentDays
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error generating attendance summary" });
    }
};

// Get attendance by ID
const getAttendanceById = async (req, res, next) => {
    const id = req.params.id;
    
    try {
        const attendance = await Attendance.findById(id);
        
        if (!attendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }
        
        return res.status(200).json({ attendance });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error fetching attendance record" });
    }
};

// Update attendance
const updateAttendance = async (req, res, next) => {
    const id = req.params.id;
    const { employeeId, name, phoneNumber, checkInTime, checkOutTime, status } = req.body;
    
    try {
        // If employeeId is being updated, verify it exists
        if (employeeId) {
            const employee = await Employee.findOne({ employeeId });
            if (!employee) {
                return res.status(404).json({ message: "Employee not found" });
            }
        }
        
        // Find the attendance record to update
        const existingAttendance = await Attendance.findById(id);
        
        if (!existingAttendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }
        
        // Update fields
        if (employeeId) existingAttendance.employeeId = employeeId;
        if (name) existingAttendance.name = name;
        if (phoneNumber) existingAttendance.phoneNumber = phoneNumber;
        if (checkInTime) existingAttendance.checkInTime = new Date(checkInTime);
        if (checkOutTime) existingAttendance.checkOutTime = new Date(checkOutTime);
        
        // Calculate hours worked if both check-in and check-out times are present
        if (existingAttendance.checkInTime && existingAttendance.checkOutTime) {
            const checkIn = new Date(existingAttendance.checkInTime);
            const checkOut = new Date(existingAttendance.checkOutTime);
            const hours = (checkOut - checkIn) / (1000 * 60 * 60);
            existingAttendance.hoursWorked = parseFloat(hours.toFixed(2));
            
            // Update status to complete if both times are present
            existingAttendance.status = 'complete';
        } else if (existingAttendance.checkInTime && !existingAttendance.checkOutTime) {
            // Only check-in is present
            existingAttendance.status = 'pending';
        } else if (status) {
            // Manual status update
            existingAttendance.status = status;
        }
        
        await existingAttendance.save();
        
        return res.status(200).json({ 
            message: "Attendance updated successfully",
            attendance: existingAttendance 
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error updating attendance" });
    }
};

// Delete attendance
const deleteAttendance = async (req, res, next) => {
    const id = req.params.id;
    
    try {
        const attendance = await Attendance.findByIdAndDelete(id);
        
        if (!attendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }
        
        return res.status(200).json({ 
            message: "Attendance deleted successfully",
            attendance 
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error deleting attendance" });
    }
};

exports.getAllAttendance = getAllAttendance;
exports.markAttendance = markAttendance;
exports.getAttendanceByEmployeeId = getAttendanceByEmployeeId;
exports.getAttendanceSummary = getAttendanceSummary;
exports.getAttendanceById = getAttendanceById;
exports.updateAttendance = updateAttendance;
exports.deleteAttendance = deleteAttendance;
exports.calculateMonthlyAttendance = calculateMonthlyAttendance;