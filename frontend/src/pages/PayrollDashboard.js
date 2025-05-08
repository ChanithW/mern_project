import React, { useEffect, useState, useContext, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import { Button, Modal, Label, TextInput, Select } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";

// Debounce utility
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const PayrollDashboard = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [performanceLevel, setPerformanceLevel] = useState("low");
  const [dailyWage, setDailyWage] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Axios instance with auth header
  const authAxios = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    instance.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          navigate("/finance-login");
        }
        return Promise.reject(error);
      }
    );
    
    return instance;
  }, [token, navigate]);

  const fetchPayrollData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authAxios.get("/payroll");
      if (response.data && Array.isArray(response.data)) {
        setRecords(response.data);
        setError(null);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      console.error("Error fetching payroll data:", err);
      setError(err.response?.data?.message || "Failed to fetch payroll data. Please try again.");
      toast.error(err.response?.data?.message || "Failed to fetch payroll data");
    } finally {
      setLoading(false);
    }
  }, [authAxios]);

  const fetchEmployeeOptions = useCallback(async () => {
    try {
      const response = await authAxios.get("/tea-plucking/employees");
      if (response.data?.employees && Array.isArray(response.data.employees)) {
        setEmployeeOptions(response.data.employees);
      }
    } catch (err) {
      console.error("Error fetching employee options:", err);
      toast.error("Failed to load employee list");
    }
  }, [authAxios]);

  const fetchEmployeeData = async (empId) => {
    if (!empId || !selectedDate || empId === "") return;

    try {
      const response = await authAxios.get(`/employee/payment/${empId}`, {
        params: { date: selectedDate }
      });
      
      if (response.data) {
        setEmployeeName(response.data.employeeName || "");
        setDailyWage(response.data.dailyWage || 0);
        
        let bonus = 0;
        if (performanceLevel === "high") bonus = 3000;
        else if (performanceLevel === "moderate") bonus = 1000;
        setPaymentAmount((response.data.dailyWage || 0) + bonus);
      }
    } catch (err) {
      console.error("Error fetching employee data:", err);
      toast.error("Failed to fetch employee data");
      setEmployeeName("");
      setDailyWage(0);
      setPaymentAmount(0);
    }
  };

  const debouncedFetchEmployeeData = useRef(debounce(fetchEmployeeData, 500)).current;

  useEffect(() => {
    if (token) {
      fetchPayrollData();
      fetchEmployeeOptions();
    } else {
      navigate("/finance-login");
    }
  }, [token, fetchPayrollData, fetchEmployeeOptions, navigate]);

  useEffect(() => {
    if (employeeId) {
      debouncedFetchEmployeeData(employeeId);
    } else {
      setEmployeeName("");
      setDailyWage(0);
      setPaymentAmount(0);
    }
  }, [employeeId, selectedDate, debouncedFetchEmployeeData, performanceLevel]);

  const handleAddPayroll = async () => {
    try {
      if (!employeeId || !employeeName || !paymentAmount) {
        toast.error("Please fill all required fields");
        return;
      }

      await authAxios.post("/payroll/add", {
        employeeId,
        employeeName,
        performanceLevel,
        dailyWage,
        paymentAmount,
        date: selectedDate,
      });

      toast.success("Payroll record added successfully");
      fetchPayrollData();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Error adding payroll record:", err);
      toast.error(err.response?.data?.message || "Failed to add payroll record");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await authAxios.delete(`/payroll/${id}`);
        toast.success("Record deleted successfully");
        fetchPayrollData();
      } catch (err) {
        console.error("Error deleting payroll record:", err);
        toast.error("Failed to delete record");
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await authAxios.get(
        `/payroll/download?search=${encodeURIComponent(search)}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payroll_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading report:", err);
      toast.error("Failed to download report");
    }
  };

  const resetForm = () => {
    setEmployeeId("");
    setEmployeeName("");
    setPerformanceLevel("low");
    setDailyWage(0);
    setPaymentAmount(0);
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const searchLower = search.toLowerCase();
      return (
        record.employeeName?.toLowerCase().includes(searchLower) ||
        record.employeeId?.toString().includes(search) ||
        record.date?.toLowerCase().includes(searchLower)
      );
    });
  }, [records, search]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-semibold">Loading payroll data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-semibold text-red-600">
            {error}
            <Button onClick={fetchPayrollData} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="p-6 bg-green-100 min-h-screen">
        <div className="max-w-8xl mx-auto bg-white p-6 shadow-lg rounded-lg border-2 border-green-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Payroll Dashboard</h2>
            <div className="flex space-x-2">
              <Button
                color="success"
                onClick={() => setShowModal(true)}
              >
                ➕ Add Payroll
              </Button>
            </div>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <TextInput
              type="text"
              placeholder="Search payroll records..."
              className="w-64"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <Button
              color="gray"
              onClick={handleDownload}
            >
              📥 Download Report
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="border border-gray-300 p-3 text-left">Employee ID</th>
                  <th className="border border-gray-300 p-3">Employee Name</th>
                  <th className="border border-gray-300 p-3">Performance</th>
                  <th className="border border-gray-300 p-3">Daily Wage (LKR)</th>
                  <th className="border border-gray-300 p-3">Payment (LKR)</th>
                  <th className="border border-gray-300 p-3">Date</th>
                  <th className="border border-gray-300 p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr
                      key={record._id}
                      className="hover:bg-gray-50 even:bg-gray-100"
                    >
                      <td className="border border-gray-300 p-3">{record.employeeId}</td>
                      <td className="border border-gray-300 p-3">{record.employeeName}</td>
                      <td className="border border-gray-300 p-3 capitalize">{record.performanceLevel}</td>
                      <td className="border border-gray-300 p-3 text-right">{record.dailyWage?.toFixed(2)}</td>
                      <td className="border border-gray-300 p-3 text-right">{record.paymentAmount?.toFixed(2)}</td>
                      <td className="border border-gray-300 p-3">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="border border-gray-300 p-3">
                        <Button
                          color="failure"
                          size="xs"
                          onClick={() => handleDelete(record._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-4 text-gray-500">
                      No payroll records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
          <Modal.Header>Add New Payroll Record</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Record Date</Label>
                <TextInput
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="employeeId">Employee</Label>
                <Select
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                >
                  <option value="">Select employee</option>
                  {employeeOptions.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee._id} - {employee.name}
                    </option>
                  ))}
                </Select>
              </div>
              
              <div>
                <Label htmlFor="employeeName">Employee Name</Label>
                <TextInput
                  id="employeeName"
                  value={employeeName}
                  readOnly
                />
              </div>
              
              <div>
                <Label htmlFor="dailyWage">Daily Wage (LKR)</Label>
                <TextInput
                  id="dailyWage"
                  value={dailyWage.toFixed(2)}
                  readOnly
                />
              </div>
              
              <div>
                <Label htmlFor="performanceLevel">Performance Level</Label>
                <Select
                  id="performanceLevel"
                  value={performanceLevel}
                  onChange={(e) => setPerformanceLevel(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="paymentAmount">Payment Amount (LKR)</Label>
                <TextInput
                  id="paymentAmount"
                  value={paymentAmount.toFixed(2)}
                  readOnly
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button color="success" onClick={handleAddPayroll}>
              Add Record
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default PayrollDashboard;