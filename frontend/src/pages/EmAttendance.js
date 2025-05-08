import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import Modal from 'react-modal';
import Header from '../components/header';
import { useNavigate } from 'react-router-dom'; // <-- use useNavigate, not Navigate

Modal.setAppElement('#root'); // Set the root element for accessibility

const EmAttendance = () => {
  const [records, setRecords] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate(); // <-- initialize navigate

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/attendance');
      setRecords(response.data.attendance);
    } catch (err) {
      setError('Failed to fetch records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  const handleQRScan = () => {
    navigate("/QrScanner");
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid date';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const calculateMonthlyAttendance = (records) => {
    const attendanceCount = records.reduce((count, record) => {
      const date = new Date(record.checkInTime);
      const currentMonth = new Date().getMonth();
      if (date.getMonth() === currentMonth) {
        return count + 1;
      }
      return count;
    }, 0);
    return attendanceCount;
  };

  const filteredRecords = searchDate
    ? records.filter((record) => {
        const recordDate = format(parseISO(record.checkInTime), 'yyyy-MM-dd');
        return recordDate === searchDate;
      })
    : records;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10 space-y-6">
        <h1 className="text-4xl font-bold text-center">Employee Attendance Overview</h1>
        <div className="w-full max-w-6xl">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <label htmlFor="date-picker" className="text-gray-700 font-medium">Select Date:</label>
              <input
                id="date-picker"
                type="date"
                value={searchDate}
                onChange={handleDateChange}
                className="border rounded-lg px-4 py-2"
              />
              <button
                onClick={handleQRScan}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                QR Code
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-4 text-gray-600">Loading records...</div>
          )}

          {error && (
            <div className="text-center py-4 text-red-600 bg-red-100 rounded-lg">{error}</div>
          )}

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-800 overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="sticky top-0 bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-3">Employee Name</th>
                  <th className="px-6 py-3">Check In</th>
                  <th className="px-6 py-3">Check Out</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record._id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(record)}>
                      <td className="px-6 py-4">{record.name}</td>
                      <td className="px-6 py-4">{formatDate(record.checkInTime)}</td>
                      <td className="px-6 py-4">{formatDate(record.checkOutTime)}</td>
                      <td className="px-6 py-4">{record.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Employee Details"
            className="modal"
            overlayClassName="modal-overlay"
          >
            {selectedEmployee && (
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Details for {selectedEmployee.name}</h2>
                <p><strong>Check In:</strong> {formatDate(selectedEmployee.checkInTime)}</p>
                <p><strong>Check Out:</strong> {formatDate(selectedEmployee.checkOutTime)}</p>
                <p><strong>Status:</strong> {selectedEmployee.status}</p>
                <p><strong>Monthly Attendance Count:</strong> {calculateMonthlyAttendance(records)}</p>
                <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Close</button>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default EmAttendance;