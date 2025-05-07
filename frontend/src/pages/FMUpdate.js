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
    image: "", // Include image in formData to store the existing image path
  });
  const [image, setImage] = useState(null); // State for new image file

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

  // Handle image file change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the new image file
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(); // Use FormData for multipart/form-data
    data.append("date", formData.date);
    data.append("name", formData.name);
    data.append("type", formData.type);
    data.append("value", formData.value);
    if (image) {
      data.append("image", image); // Append new image if selected
    }

    try {
      await axios.put(`http://localhost:5000/api/finance/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Record updated successfully!");
      navigate("/finance-dashboard");
    } catch (error) {
      console.error("Error updating record:", error.response?.data || error.message);
      alert(`Failed to update record: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-full p-6 bg-green-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
          <h2 className="text-2xl font-bold mb-4">Update Finance Record</h2>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <label className="block font-semibold">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                max={new Date().toISOString().split("T")[0]} //restrict adding future dates
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
                pattern="[A-Za-z\s]+" title="Only letters allowed"
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
                min="1"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Current Image</label>
              {formData.image ? (
                <img
                  src={`http://localhost:5000${formData.image}`}
                  alt="Current Transaction"
                  className="w-32 h-32 object-cover mb-2"
                />
              ) : (
                <p>No image available</p>
              )}
              <label className="block font-semibold">Upload New Image (optional)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
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
