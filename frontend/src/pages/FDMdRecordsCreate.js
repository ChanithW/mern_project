import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from '../components/header';


function FDMdRecordsCreate() {
    const [formData, setFormData] = useState({
        foundDate: "",
        diseaseName: "",
        spreadStatus: "",
        treatments: "",
        notes: "",
        status: "",
      }); 
       const navigate = useNavigate();
    
      const spreadOptions = ["Low", "Moderate", "High"];
      const statusOptions = ["Ongoing", "Resolved", "Under Monitoring"];
    
      // Handle Input Change
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/createdrecord", formData);
      console.log(response.data); 
      alert(response.data.message);
      setFormData({
        foundDate: "",
        diseaseName: "",
        spreadStatus: "",
        treatments: "",
        notes: "",
        status: "",
      });
      navigate(`/fdm-drecordsRead`);
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
            <h2 className="text-xl font-bold text-green-700 mb-4">Add New Disease Record</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Found Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Found Date</label>
                <input
                  type="date"
                  name="foundDate"
                  value={formData.foundDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
    
              {/* Disease Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Disease Name</label>
                <input
                  type="text"
                  name="diseaseName"
                  value={formData.diseaseName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
    
              {/* Spread Status (Dropdown) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Spread Status</label>
                <select
                  name="spreadStatus"
                  value={formData.spreadStatus}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Spread Status</option>
                  {spreadOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
    
              {/* Treatments */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Treatments</label>
                <input
                  type="text"
                  name="treatments"
                  value={formData.treatments}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
    
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>
    
              {/* Status (Dropdown) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
    
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Record
              </button>
            </form>
          </div>
        </div>
        </div>
      );
}

export default FDMdRecordsCreate;
