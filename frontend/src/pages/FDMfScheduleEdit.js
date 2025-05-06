import React, { useState, useEffect } from "react";
import { useParams , useNavigate  } from "react-router-dom"; // If using React Router
import Header from '../components/header';


function FDMfScheduleEdit() {

  const navigate = useNavigate();

  const { id } = useParams();
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
 
  const fertilizerOptions = [
    "VP/Uva 945",
    "VP/Uva 1055",
    "VP/LC 880",
    "VP/LC 1075",
    "VP/UM 910",
    "VP/UM 1020",
  ];
  const statusOptions = ["Pending", "Completed", "In Progress"];

  // Fetch existing data when component mounts
  useEffect(() => {
    fetch(`http://localhost:5000/api/schedules/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setFormData({
          ...data,
          date: formatDateForInput(data.date),
          dueDate: formatDateForInput(data.dueDate),
          // Add other fields here if needed
        });
      })
      .catch((error) => console.error("Error fetching schedule:", error));
  }, [id]);
  
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    return isoDate.split("T")[0]; 
  };
  
  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/updateschedule/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Fertilization record updated successfully!");
        navigate(`/fdm-scheduleRead`);
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
        <h2 className="text-xl font-bold text-green-700 mb-4">
          Edit Fertilization Record
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fertilizer Mixture
            </label>
            <select
              name="fertilizerMixture"
              value={formData.fertilizerMixture}
              onChange={handleChange}
              required
              className="w-full p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a mixture</option>
              {fertilizerOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Urea Parts</label>
            <input
              type="number"
              name="urea"
              value={formData.urea}
              onChange={handleChange}
              required
              className="w-full p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ERP Parts</label>
            <input
              type="number"
              name="erp"
              value={formData.erp}
              onChange={handleChange}
              required
              className="w-full p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">MOP Parts</label>
            <input
              type="number"
              name="mop"
              value={formData.mop}
              onChange={handleChange}
              required
              className="w-full p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Area</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              className="w-full p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
            />
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
                <option key={index} value={option}>
                  {option}
                </option>
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

export default FDMfScheduleEdit;
