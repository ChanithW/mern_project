import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from '../assets/images/tealeaves.jpg';
import { format } from "date-fns";

function TeaPluckingEdit() {
  const { id } = useParams(); // Get the tea plucking record ID from the URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: "",
    kgPlucked: "",
    dailyWage: "",
    date: "",
  });

  useEffect(() => {
    // Fetch existing tea plucking record
    const fetchRecord = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tea-plucking/record/${id}`);
        setFormData(response.data.record);
      } catch (err) {
        console.error("Error fetching tea plucking record", err);
      }
    };

    fetchRecord();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      if (name === "kgPlucked" && value) {
        const ratePerKg = 10; // Adjust rate per KG if needed
        updatedData.dailyWage = (parseFloat(value) * ratePerKg).toFixed(2);
      }

      return updatedData;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/tea-plucking/${id}`, formData);
      alert("Tea plucking record updated successfully!");
      navigate("/TeaPluckingTable"); // Redirect to tea plucking records view
    } catch (err) {
      console.error("Error updating tea plucking record", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md bg-white bg-opacity-70">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Edit Tea Plucking Record
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600">Employee Name</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeName}
              readOnly
              //onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-gray-600">KG Plucked</label>
            <input
              type="number"
              name="kgPlucked"
              value={formData.kgPlucked}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-600">Daily Wage</label>
            <input
              type="number"
              name="dailyWage"
              value={formData.dailyWage}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          {/* <div>
            <label className="block text-gray-600">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date }
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div> */}

          <div>
            <label className="block text-gray-600">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date ? format(new Date(formData.date), "yyyy-MM-dd") : ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/TeaPluckingTable")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeaPluckingEdit;