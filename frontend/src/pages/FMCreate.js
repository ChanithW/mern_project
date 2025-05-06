import React, { useState } from "react";
import axios from "axios";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const FMCreate = () => {
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    type: "income",
    value: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/finance", formData);
      alert("Record added successfully!");
      navigate("/finance-dashboard");
    } catch (error) {
      console.error("Error adding record:", error);
      alert("Failed to add record.");
    }
  };

  return (
    <div className="p-6 bg-green-100 min-h-screen">
      
      <div className="w-full p-6 bg-green-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 border-2 border-green-500">
          <h2 className="text-2xl font-bold mb-4 text-center">Add New Finance Record</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Transaction Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Transaction Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="" disabled selected>select a type</option>
                <option value="income">income</option>
                <option value="expense">expense</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold">Value</label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 text-white py-2"
            >
              ➕ Add Record
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FMCreate;
