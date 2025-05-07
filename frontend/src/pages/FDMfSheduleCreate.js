import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from '../components/header';

function FDMfSheduleCreate() {
  const [formData, setFormData] = useState({
    date: "",
    dueDate: "",
    fertilizerMixture: "",
    urea: "",
    erp: "",
    mop: "",
    area: "",
    status: "",
    
  });
  const navigate = useNavigate();

  const fertilizerOptions = ["VP/Uva 945", "VP/Uva 1055", "VP/LC 880", "VP/LC 1075", "VP/UM 910", "VP/UM 1020"];
  const statusOptions = ["Pending", "Completed", "In Progress"];

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }; 

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/createschedule", formData);
      console.log(response.data); 
      alert(response.data.message);
      setFormData({
        date: "",
        dueDate: "",
        fertilizerMixture: "",
        urea: "",
        erp: "",
        mop: "",
        area: "",
        status: "",
        
      });
      navigate(`/fdm-scheduleRead`);
    } catch (error) {
      alert("Error adding record!");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
    <Header />
    <div className="p-6 bg-green-100 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-6 shadow-lg rounded-lg border-2 border-green-500">
        <h2 className="text-xl font-bold text-green-700 mb-4">Add New Fertilization Record</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-2 border border-green-400 rounded-lg" min={new Date().toISOString().split("T")[0]} max={new Date().toISOString().split("T")[0]}/>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="w-full p-2 border border-green-400 rounded-lg" min={new Date().toISOString().split("T")[0]}/>
          </div>

          {/* Fertilizer Mixture */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fertilizer Mixture</label>
            <select name="fertilizerMixture" value={formData.fertilizerMixture} onChange={handleChange} required className="w-full p-2 border border-green-400 rounded-lg">
              <option value="">Select a mixture</option>
              {fertilizerOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Urea Parts */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Urea Parts</label>
            <input type="number" name="urea" value={formData.urea} onChange={handleChange} required className="w-full p-2 border border-green-400 rounded-lg" min="1" step="1"/>
          </div>

          {/* ERP Parts */}
          <div>
            <label className="block text-sm font-medium text-gray-700">ERP Parts</label>
            <input type="number" name="erp" value={formData.erp} onChange={handleChange} required className="w-full p-2 border border-green-400 rounded-lg" min="1" step="1" />
          </div>

          {/* MOP Parts */}
          <div>
            <label className="block text-sm font-medium text-gray-700">MOP Parts</label>
            <input type="number" name="mop" value={formData.mop} onChange={handleChange} required className="w-full p-2 border border-green-400 rounded-lg" min="1" step="1" />
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Area</label>
            <input type="text" name="area" value={formData.area} onChange={handleChange} required className="w-full p-2 border border-green-400 rounded-lg" />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} required className="w-full p-2 border border-green-400 rounded-lg">
              <option value="">Select Status</option>
              {statusOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>

           

          {/* Submit Button */}
          <button type="submit" className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Add Record</button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default FDMfSheduleCreate;

