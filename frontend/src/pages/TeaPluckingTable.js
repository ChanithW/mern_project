import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';

function TeaPluckingTable() {
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchDate, setSearchDate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecordsByDate(selectedDate);
  }, [selectedDate]);

  const fetchRecordsByDate = async (date) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:8000/tea-plucking/date/${date}`);

      if (response.data.records) {
        setRecords(response.data.records);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Error fetching records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this record?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/tea-plucking/${id}`);
        fetchRecordsByDate(selectedDate); // Refresh list
      } catch (err) {
        console.error("Error deleting record", err);
        setError(`Error deleting record: ${err.response?.data?.message || "Please try again."}`);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/TeaPluckingEdit/${id}`);
  };

  const handleAddRecord = () => {
    navigate("/TeaPluckingForm");
  };

  const goToEmployeeView = () => {
    navigate("/EMview");
  };

  const goToCatagorization = () => {
    navigate("/EmployeePerformance");
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    const today = new Date().toISOString().split("T")[0];
    setSearchDate(newDate);
  };

  const calculateTotals = () => {
    return records.reduce(
      (totals, record) => {
        return {
          kgPlucked: totals.kgPlucked + parseFloat(record.kgPlucked || 0),
          dailyWage: totals.dailyWage + parseFloat(record.dailyWage || 0),
        };
      },
      { kgPlucked: 0, dailyWage: 0 }
    );
  };

  const totals = calculateTotals();

  const handleSendToInventory = () => {
    localStorage.setItem("pluckingTotals", JSON.stringify(totals));
    alert("Totals sent to inventory successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10 space-y-6">
        <h1 className="text-4xl font-bold text-center">Daily Harvest Records</h1>
        <div className="w-full max-w-6xl">
          {/* Header with Date Selector and Action Buttons */}
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={handleAddRecord}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Add New Record
            </button>

            <div className="flex items-center space-x-2">
              <label htmlFor="date-picker" className="text-gray-700 font-medium">
                Select Date:
              </label>
              <input
                id="date-picker"
                type="date"
                value={searchDate}
                onChange={handleDateChange}
                className="border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* Loading and Error Messages */}
          {loading && (
            <div className="text-center py-4 text-gray-600">Loading records...</div>
          )}

          {error && (
            <div className="text-center py-4 text-red-600 bg-red-100 rounded-lg">{error}</div>
          )}

          {/* Scrollable Table */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-800 overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="sticky top-0 bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-3">Employee Name</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">KG Plucked</th>
                  <th className="px-6 py-3">Daily Wage</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((record) => (
                    <tr key={record._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{record.employeeName}</td>
                      <td className="px-6 py-4">{format(new Date(record.date), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-4">{record.kgPlucked} kg</td>
                      <td className="px-6 py-4">RS.{record.dailyWage}</td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => handleEdit(record._id)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No records found for the selected date.
                    </td>
                  </tr>
                )}
              </tbody>
              {records.length > 0 && (
                <tfoot className="bg-gray-50 font-medium text-gray-700">
                  <tr>
                    <td className="px-6 py-3" colSpan="2"><strong>Totals</strong></td>
                    <td className="px-6 py-3"><strong>{totals.kgPlucked.toFixed(2)} kg</strong></td>
                    <td className="px-6 py-3"><strong>RS.{totals.dailyWage.toFixed(2)}</strong></td>
                    <td className="px-6 py-3"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Send to Inventory Button */}
          {records.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSendToInventory}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
              >
                Send Totals to Inventory
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeaPluckingTable;
