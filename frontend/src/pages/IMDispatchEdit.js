import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import Header from '../components/header';

export default function IMStoringEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ StockId: "", Date: "", Qty: "", Driver: "", Location: "" });
  const [tDispatch, setTDispatch] = useState(null);

  useEffect(() => {
    const fetchDispatch = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tdispatch/${id}`);
        setTDispatch(response.data.tDispatch)
      } catch (err) {
        console.error("Error fetching stock data", err);
      }
    };
    fetchDispatch();
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
      if (!formData.StockId && !formData.Date && !formData.Qty && !formData.Driver && !formData.Location) return; // Prevent empty request

      // Create an object with only changed values
      const updatedData = {};
      if (formData.StockId) updatedData.StockId = formData.StockId;
      if (formData.Date) updatedData.Date = formData.Date;
      if (formData.Qty) updatedData.Qty = Number(formData.Qty);
      if (formData.Driver) updatedData.Driver = formData.Driver;
      if (formData.Location) updatedData.Location = formData.Location;

      await axios.put(`http://localhost:5000/tdispatch/${id}`, updatedData);
      navigate("/IMDispatch");
    } catch (err) {
      console.error("Failed to update stock.", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
    <Header />
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Edit Dispatch Record</h2>

        {/* Show Current Stock Details */}
        {tDispatch ? (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Stock Details</h3>
            <p><strong>Stock ID:</strong> {tDispatch.StockId || "N/A"}</p>
            <p><strong>Date:</strong> {tDispatch.Date ? new Date(tDispatch.Date).toLocaleDateString() : "N/A"}</p>
            <p><strong>Quantitiy:</strong> {tDispatch.Qty || "N/A"}</p>
            <p><strong>Driver:</strong> {tDispatch.Driver || "N/A"}</p>
            <p><strong>Location:</strong> {tDispatch.Location || "N/A"}</p>
          </div>
        ) : (
          <p className="text-red-500 text-center">No details available</p>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
        <div>
            <Label htmlFor="StockId" value="StockId" />
            <TextInput id="StockId" type="String" name="StockId" value={formData.StockId} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="Date" value="Date" />
            <TextInput id="Date" type="date" name="Date" value={formData.Date} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="Qty" value="Qty" />
            <TextInput id="Qty" type="number" name="Qty" value={formData.Qty} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="Driver" value="Driver" />
            <TextInput id="Driver" type="String" name="Driver" value={formData.Driver} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="Location" value="Location" />
            <TextInput id="Location" type="String" name="Location" value={formData.Location} onChange={handleChange} />
          </div>
          <Button type="submit" gradientDuoTone="greenToBlue" className="bg-green-500 text-white w-full mt-4">
            Update
          </Button>
        </form>
      </Card>
    </div>
    </div>
  );
}
