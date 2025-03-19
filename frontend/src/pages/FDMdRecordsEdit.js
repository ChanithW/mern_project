import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from '../components/header';

function FDMdRecordsEdit() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the record ID from URL

  const [formData, setFormData] = useState({
    foundDate: "",
    diseaseName: "",
    spreadStatus: "",
    treatments: "",
    notes: "",
    status: "",
  });

  const spreadOptions = ["Low", "Moderate", "High"];
  const statusOptions = ["Ongoing", "Resolved", "Under Monitoring"];

  // Fetch the existing record when the component loads
  useEffect(() => {
    fetch(`http://localhost:8000/api/getrecord/${id}`) // Adjust the API URL
      .then((response) => response.json())
      .then((data) => {
        setFormData({
          ...data,
          foundDate: formatDateForInput(data.foundDate), // Convert ISO date format
        });
      })
      .catch((error) => console.error("Error fetching record:", error));
  }, [id]);

  // Format ISO Date for Input Field
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    return isoDate.split("T")[0]; // Extract YYYY-MM-DD
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/api/updaterecord/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Disease record updated successfully!");
        navigate(`/fdm-drecordsRead`); // Redirect after update
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating record:", error);
      alert("Failed to update the record.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="p-6 bg-green-100 min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full bg-white p-6 shadow-lg rounded-lg border-2 border-green-500">
          <h2 className="text-xl font-bold text-green-700 mb-4">Edit Disease Record</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>

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
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Update Record
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FDMdRecordsEdit;
