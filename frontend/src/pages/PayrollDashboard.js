import React, { useEffect, useState, useContext, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import { Button, Modal, Label, TextInput, Select } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import AuthContext from "../context/AuthContext";

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
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Axios instance with auth header - memoized to prevent recreation on every render
  const authAxios = useMemo(() => axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }), [token]);

  const fetchPayrollData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authAxios.get("/payroll");
      setRecords(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching payroll data:", err);
      setError("Failed to fetch payroll data. Please try again.");
      if (err.response?.status === 401) {
        navigate("/finance-login");
      }
    } finally {
      setLoading(false);
    }
  }, [authAxios, navigate]);

  const fetchEmployeeData = async (empId) => {
    if (!empId || !selectedDate || empId === "") return;

    try {
      const response = await authAxios.get(`/employee/payment/${empId}`, {
        params: { date: selectedDate }
      });
      setEmployeeName(response.data.employeeName || "");
      setDailyWage(response.data.dailyWage || 0);

      let bonus = 0;
      if (performanceLevel === "high") bonus = 3000;
      else if (performanceLevel === "moderate") bonus = 1000;
      setPaymentAmount((response.data.dailyWage || 0) + bonus);
    } catch (err) {
      console.error("Error fetching employee data:", err);
      alert("Failed to fetch employee data. Please check the Employee ID and date.");
      setEmployeeName("");
      setDailyWage(0);
      setPaymentAmount(0);
    }
  };

  // Debounced fetch for employee data
  const debouncedFetchEmployeeData = useRef(debounce(fetchEmployeeData, 500)).current;

  useEffect(() => {
    if (token) {
      fetchPayrollData();
    } else {
      navigate("/finance-login");
    }
  }, [token, fetchPayrollData, navigate]);

  // Separate effect to fetch employee data when employeeId or selectedDate changes
  useEffect(() => {
    if (employeeId) {
      debouncedFetchEmployeeData(employeeId);
    } else {
      setEmployeeName("");
      setDailyWage(0);
      setPaymentAmount(0);
    }
  }, [employeeId, selectedDate, debouncedFetchEmployeeData]);

  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handlePerformanceChange = (e) => {
    const level = e.target.value;
    setPerformanceLevel(level);

    let bonus = 0;
    if (level === "high") bonus = 3000;
    else if (level === "moderate") bonus = 1000;
    setPaymentAmount(dailyWage + bonus);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleAddPayroll = async () => {
    try {
      await authAxios.post("/payroll/add", {
        employeeId,
        employeeName,
        performanceLevel,
        dailyWage,
        paymentAmount,
        date: new Date().toISOString().split("T")[0],
      });

      fetchPayrollData();
      setShowModal(false);
      setEmployeeId("");
      setEmployeeName("");
      setPerformanceLevel("low");
      setDailyWage(0);
      setPaymentAmount(0);
      setSelectedDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      console.error("Error adding payroll record:", err);
      alert("Failed to add payroll record. Please try again.");
      if (err.response?.status === 401) {
        navigate("/finance-login");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await authAxios.delete(`/payroll/${id}`);
        fetchPayrollData();
      } catch (err) {
        console.error("Error deleting payroll record:", err);
        alert("Failed to delete payroll record. Please try again.");
        if (err.response?.status === 401) {
          navigate("/finance-login");
        }
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await authAxios.get(`/payroll/download?search=${encodeURIComponent(search)}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Payroll_Report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading payroll report:", err);
      alert("Failed to download payroll report. Please try again.");
      if (err.response?.status === 401) {
        navigate("/finance-login");
      }
    }
  };

  const filteredRecords = records.filter((record) => {
    const searchLower = search.toLowerCase();
    const nameMatch = record.employeeName?.toLowerCase().includes(searchLower);
    const idMatch = record.employeeId?.toString().includes(search);
    const dateMatch = record.date?.toLowerCase().includes(searchLower);
    return nameMatch || idMatch || dateMatch;
  });

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
          <div className="text-xl font-semibold text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="p-6 bg-green-100 min-h-screen">
        <div className="max-w-8xl mx-auto bg-white p-6 shadow-lg rounded-lg border-2 border-green-500">
          <div>
            <h2 className="mt-3 text-3xl font-bold">Payroll Dashboard</h2>
            <br />
            <div className="mb-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search payroll records..."
                  className="p-2 border border-green-400 rounded-lg"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  className="bg-gray-600 text-white px-4 py-2"
                  onClick={handleDownload}
                >
                  📥 Download Report
                </Button>
              </div>
              <Button
                className="bg-green-600 text-white px-4 py-2 hover:bg-green-700"
                onClick={() => setShowModal(true)}
              >
                ➕ Add Payroll
              </Button>
            </div>
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="border border-black p-2 text-left">Employee ID</th>
                  <th className="border border-black p-2">Employee Name</th>
                  <th className="border border-black p-2">Performance Level</th>
                  <th className="border border-black p-2">Daily Wage (LKR)</th>
                  <th className="border border-black p-2">Payment Amount (LKR)</th>
                  <th className="border border-black p-2">Date</th>
                  <th className="border border-black p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr
                      key={record._id}
                      className="text-center border border-black hover:bg-gray-100"
                    >
                      <td className="border border-black p-2 text-left">{record.employeeId}</td>
                      <td className="border border-black p-2">{record.employeeName}</td>
                      <td className="border border-black p-2 capitalize">{record.performanceLevel}</td>
                      <td className="border border-black p-2">{record.dailyWage?.toFixed(2)}</td>
                      <td className="border border-black p-2">{record.paymentAmount?.toFixed(2)}</td>
                      <td className="border border-black p-2">{record.date}</td>
                      <td className="border border-black p-2">
                        <Button
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 mr-2"
                          onClick={() => handleDelete(record._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border border-black">
                    <td colSpan="7" className="text-center p-4 text-gray-500">
                      No payroll records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>Add New Payroll Record</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div>
                <Label htmlFor="date">Select Date for Tea Plucking Record</Label>
                <TextInput
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <TextInput
                  id="employeeId"
                  value={employeeId}
                  onChange={handleEmployeeIdChange}
                  placeholder="Enter Employee ID"
                />
              </div>
              <div>
                <Label htmlFor="employeeName">Employee Name</Label>
                <TextInput
                  id="employeeName"
                  value={employeeName}
                  readOnly
                  placeholder="Will be fetched"
                />
              </div>
              <div>
                <Label htmlFor="dailyWage">Daily Wage (LKR)</Label>
                <TextInput
                  id="dailyWage"
                  value={dailyWage.toFixed(2)}
                  readOnly
                  placeholder="Will be fetched"
                />
              </div>
              <div>
                <Label htmlFor="performanceLevel">Performance Level</Label>
                <Select
                  id="performanceLevel"
                  value={performanceLevel}
                  onChange={handlePerformanceChange}
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </Select>
              </div>
              <div>
                <Label>Payment Amount (LKR)</Label>
                <TextInput
                  value={paymentAmount.toFixed(2)}
                  readOnly
                  placeholder="Will be calculated"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleAddPayroll}
            >
              Add Record
            </Button>
            <Button
              className="bg-gray-500 text-white hover:bg-gray-600"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default PayrollDashboard;