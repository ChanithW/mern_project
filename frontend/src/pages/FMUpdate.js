import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";

const FMUpdate = () => {
  
  const { id } = useParams(); // Get ID
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    type: "",
    value: "",
  });

  // Fetch existing data
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/finance/${id}`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error("Error fetching record:", err));
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/finance/${id}`, formData);
      alert("Record updated successfully!");
      navigate("/finance-dashboard");
    } catch (error) {
      console.error("Error updating record:", error);
      alert("Failed to update record.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      <div className="w-full p-6 bg-green-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
          <h2 className="text-2xl font-bold mb-4">Update Finance Record</h2>
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
                <option value="income">Income</option>
                <option value="expense">Expense</option>
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
            <Button type="submit" className="w-full bg-green-600 text-white px-4 py-2 hover:bg-green-700">
              🔄 Update Record
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FMUpdate;
