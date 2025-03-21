import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";

export default function IMStoringEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ Date: "", totalAmount: "" });
  const [tStock, setTStock] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tstock/${id}`);
        setTStock(response.data.tStock)
      } catch (err) {
        console.error("Error fetching stock data", err);
      }
    };
    fetchStock();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!formData.Date && !formData.totalAmount) return; // Prevent empty request

      // Create an object with only changed values
      const updatedData = {};
      if (formData.Date) updatedData.Date = formData.Date;
      if (formData.totalAmount) updatedData.totalAmount = Number(formData.totalAmount);

      await axios.put(`http://localhost:5000/tstock/${id}`, updatedData);
      navigate("/IMStoring");
    } catch (err) {
      console.error("Failed to update stock.", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Edit Stock Record</h2>

        {/* Show Current Stock Details */}
        {tStock ? (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Stock Details</h3>
            <p><strong>Date:</strong> {tStock.Date ? new Date(tStock.Date).toLocaleDateString() : "N/A"}</p>
            <p><strong>Total Amount:</strong> {tStock.totalAmount || "N/A"}</p>
          </div>
        ) : (
          <p className="text-red-500 text-center">No stock details available</p>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <Label htmlFor="Date" value="Date" />
            <TextInput id="Date" type="date" name="Date" value={formData.Date} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="totalAmount" value="Total Amount" />
            <TextInput id="totalAmount" type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} />
          </div>
          <Button type="submit" gradientDuoTone="greenToBlue" className="bg-green-500 text-white w-full mt-4">
            Update
          </Button>
        </form>
      </Card>
    </div>
  );
}
