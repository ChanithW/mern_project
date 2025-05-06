const Attendance = require("../model/AttendanceModel")

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
                    // Set  beginning of current week
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
    }
    
    // not found
    if (!attendance) {
        return res.status(404).json({ message: "Attendance records not found" });
    }
    // Display
    return res.status(200).json({ attendance });
};

// Mark attendance
const markAttendance = async (req, res, next) => {
    const { employeeId, name, phoneNumber, status } = req.body;
    
    let attendance;
    
    try {
        // Check  attendance already marked  today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const existingAttendance = await Attendance.find({
            employeeId: employeeId,
            checkInTime: {
                $gte: today,
                $lt: tomorrow
            }
        });
        
        if (existingAttendance) {
            return res.status(400).json({
                message: 'Attendance already marked for today',
                attendance: existingAttendance
            });
        }
        
        // Create new attendance record
        attendance = new Attendance({
            employeeId,
            name,
            phoneNumber,
            checkInTime: new Date(),
            status: status || 'present'
        });
        
        await attendance.save();
    } catch (err) {
        console.log(err);
    }
    
    //  not inserted
    if (!attendance) {
        return res.status(404).json({ message: "Unable to mark attendance" });
    }
    return res.status(200).json({ attendance });
};

// Get attendance by employee ID
const getAttendanceByEmployeeId = async (req, res, next) => {
    const employeeId = req.params.employeeId;
    const { startDate, endDate } = req.query;
    
    let attendance;
    
    try {
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
        
        attendance = await Attendance.find(query).sort({ checkInTime: -1 });
    } catch (err) {
        console.log(err);
    }
    
    // If not available
    if (!attendance) {
        return res.status(404).json({ message: "Attendance records not found" });
    }
    return res.status(200).json({ attendance });
};

// Get attendance by ID
const getAttendanceById = async (req, res, next) => {
    const id = req.params.id;
    
    let attendance;
    
    try {
        attendance = await Attendance.findById(id);
    } catch (err) {
        console.log(err);
    }
    
    // If not available
    if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" });
    }
    return res.status(200).json({ attendance });
};

// Update attendance
const updateAttendance = async (req, res, next) => {
    const id = req.params.id;
    const { employeeId, name, phoneNumber, checkInTime, status } = req.body;
    
    let attendance;
    
    try {
        attendance = await Attendance.findByIdAndUpdate(id, {
            employeeId,
            name,
            phoneNumber,
            checkInTime,
            status
        });
        attendance = await attendance.save();
    } catch (err) {
        console.log(err);
    }
    
    // If not available
    if (!attendance) {
        return res.status(404).json({ message: "Unable to update attendance" });
    }
    return res.status(200).json({ attendance });
};

// Delete attendance
const deleteAttendance = async (req, res, next) => {
    const id = req.params.id;
    
    let attendance;
    
    try {
        attendance = await Attendance.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }
    
    // If not available
    if (!attendance) {
        return res.status(404).json({ message: "Unable to delete attendance" });
    }
    return res.status(200).json({ attendance });
};

exports.getAllAttendance = getAllAttendance;
exports.markAttendance = markAttendance;
exports.getAttendanceByEmployeeId = getAttendanceByEmployeeId;
exports.getAttendanceById = getAttendanceById;
exports.updateAttendance = updateAttendance;
exports.deleteAttendance = deleteAttendance;