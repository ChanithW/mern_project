import React, { useState } from "react";
import axios from "axios";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const FMCreate = () => {
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    type: "",
    value: "",
  });
  const [image, setImage] = useState(null); // Added state for image file

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(); // Use FormData for form-data
    data.append("date", formData.date);
    data.append("name", formData.name);
    data.append("type", formData.type);
    data.append("value", formData.value);
    if (image) {
      data.append("image", image); // Append image if selected
    }
  
    try {
      await axios.post("http://localhost:5000/api/finance", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Record added successfully!");
      navigate("/finance-dashboard");
    } catch (error) {
      console.error("Error adding record:", error.response?.data || error.message);
      alert(`Failed to add record: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="p-6 bg-green-100 min-h-screen">
      <div className="w-full p-6 bg-green-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 border-2 border-green-500">
          <h2 className="text-2xl font-bold mb-4 text-center">Add New Finance Record</h2>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <label className="block font-semibold">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                max={new Date().toISOString().split("T")[0]} //restrict adding future dates
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Transaction Name</label>
              <input
                type="text"
                pattern="[A-Za-z\s]+" title="Only letters allowed" //add validation*
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
                required
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
                min="1" //validation for negt values
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Upload Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 hover:bg-green-700"
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
