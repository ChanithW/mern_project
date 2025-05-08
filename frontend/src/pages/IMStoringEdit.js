import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import bgImage from '../assets/images/bg1.jpg';

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

    // Validate Total Amount
  if (formData.totalAmount <= 0 || isNaN(formData.totalAmount)) {
    alert("Total Amount must be a positive number.");
    return;
  }

    try {
      if (!formData.Date && !formData.totalAmount) return;

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
    <div className="flex justify-center items-center min-h-screen bg-green-200 p-6 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
    <Card className="w-full max-w-lg p-6 border border-green-700 bg-white bg-opacity-70 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-4">Edit Stock Records</h2>

        {/* Show Current Stock Details */}
        {tStock ? (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md ">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Stock Details</h3>
            <p><strong>Date:</strong> {tStock.Date ? new Date(tStock.Date).toLocaleDateString() : "N/A"}</p>
            <p><strong>Total Amount:</strong> {tStock.totalAmount || "N/A"}</p>
          </div>
        ) : (
          <p className="text-red-500 text-center">No stock details available</p>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* <div>
            <Label htmlFor="Date" value="Date" />
            <TextInput id="Date" type="date" name="Date" value={formData.Date} onChange={handleChange} />
          </div> */}
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
