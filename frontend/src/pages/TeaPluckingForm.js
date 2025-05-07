import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/images/tealeaves.jpg';

const TeaPluckingForm = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    kgPlucked: '',
    dailyWage: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tea-plucking/employees/nonP');
        setEmployees(response.data.employees || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setMessage('Error fetching employees. Please try again.');
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
   //can add only current date
    if (name === 'date') {
      const currentDate = new Date().toISOString().split('T')[0];
      if (value > currentDate) {
        alert("You can only select today's date or earlier");
        return;
      }
    }
  
    setFormData({
      ...formData,
      [name]: value
    });
  
    // Calculate daily wages
    if (name === 'kgPlucked' && value) {
      const ratePerKg = 10;  // Edit the rate per KG
      setFormData(prev => ({
        ...prev,
        dailyWage: (parseFloat(value) * ratePerKg).toFixed(2)
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:5000/tea-plucking', formData);
      setMessage('Record added successfully!');
      setFormData({
        employeeId: '',
        date: formData.date,
        kgPlucked: '',
        dailyWage: ''
      });
    } catch (error) {
      console.error('Error adding record:', error);
      setMessage('Error adding record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-10 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 bg-white bg-opacity-70 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Tea Plucking Record</h2>
          <button
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Back to List
          </button>
        </div>

        {message && (
          <div className={`p-4 mb-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee:</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Employee</option>
              {employees.length > 0 ? (
                employees.map(employee => (
                  <option key={employee._id} value={employee._id}>{employee.name}</option>
                ))
              ) : (
                <option disabled>No employees available</option>
              )}
            </select>
          </div>

          <div className="form-group">
  <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
  <input
    type="date"
    name="date"
    value={formData.date}
    onChange={handleChange}
    max={new Date().toISOString().split('T')[0]}
    required
    className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">KG of Tea Plucked:</label>
            <input
              type="number"
              name="kgPlucked"
              value={formData.kgPlucked}
              onChange={handleChange}
              step="0.1"
              min="0"
              required
              className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Wage (RS.):</label>
            <input
              type="number"
              name="dailyWage"
              value={formData.dailyWage}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-calculated based on KG plucked (can be adjusted)</p>
          </div>

          <div className="mt-6">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeaPluckingForm;