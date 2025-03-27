import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import bgImage from '../assets/images/bg1.jpg';

export default function IMStoringEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ StockId: "", Date: "", Qty: "", Driver: "", Location: "" });
  const [tDispatch, setTDispatch] = useState(null);
  const [existingStockIds, setExistingStockIds] = useState([]);

  useEffect(() => {
    const fetchDispatch = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tdispatch/${id}`);
        setTDispatch(response.data.tDispatch);
      } catch (err) {
        console.error("Error fetching stock data", err);
      }
    };

    const fetchAllStockIds = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tdispatch");
        const stockIds = response.data.tDispatch.map((item) => item.StockId);
        setExistingStockIds(stockIds);
      } catch (err) {
        console.error("Error fetching all stock IDs", err);
      }
    };

    fetchDispatch();
    fetchAllStockIds();
  }, [id]);

  useEffect(() => {
    if (tDispatch) {
      setFormData({
        StockId: tDispatch.StockId || "",
        Date: tDispatch.Date ? new Date(tDispatch.Date).toISOString().split("T")[0] : "",
        Qty: tDispatch.Qty || "",
        Driver: tDispatch.Driver || "",
        Location: tDispatch.Location || "",
      });
    }
  }, [tDispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.StockId || !formData.Date || !formData.Qty || !formData.Driver || !formData.Location) {
      alert("All fields are required!");
      return;
    }

    // validate id's
    if (existingStockIds.includes(formData.StockId) && formData.StockId !== tDispatch.StockId) {
      alert("This Stock ID already exists. Please enter a unique Stock ID.");
      return;
    }

    // validate qty
    if (formData.Qty <= 0) {
      alert("Quantity must be a positive number.");
      return;
    }

    // validate driver
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.Driver)) {
      alert("Driver name can only contain letters and spaces.");
      return;
    }

    const locationRegex = /^[A-Za-z0-9/ ]+$/;
  if (!locationRegex.test(formData.Location)) {
  alert("Location can only contain letters, numbers, spaces, and '/'.");
  return;
}


    try {
      const updatedData = {
        StockId: formData.StockId,
        Date: formData.Date,
        Qty: Number(formData.Qty),
        Driver: formData.Driver,
        Location: formData.Location,
      };

      await axios.put(`http://localhost:5000/tdispatch/${id}`, updatedData);
      navigate("/IMDispatch");
    } catch (err) {
      console.error("Failed to update stock.", err);
    }
  };

  return (
      <div className="flex justify-center items-center min-h-screen bg-green-200 p-6 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <Card className="w-full max-w-lg p-6 border border-green-700 bg-white bg-opacity-30 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-4">Edit Dispatch Record</h2>

          {/* Show Current Stock Details */}
          {tDispatch ? (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Stock Details</h3>
              <p><strong>Stock ID:</strong> {tDispatch.StockId || "N/A"}</p>
              <p><strong>Date:</strong> {tDispatch.Date ? new Date(tDispatch.Date).toLocaleDateString() : "N/A"}</p>
              <p><strong>Quantity:</strong> {tDispatch.Qty || "N/A"}</p>
              <p><strong>Driver:</strong> {tDispatch.Driver || "N/A"}</p>
              <p><strong>Location:</strong> {tDispatch.Location || "N/A"}</p>
            </div>
          ) : (
            <p className="text-red-500 text-center">No details available</p>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="StockId" value="Stock ID" />
              <TextInput id="StockId" type="text" name="StockId" value={formData.StockId} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="Date" value="Date" />
              <TextInput id="Date" type="date" name="Date" value={formData.Date} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="Qty" value="Quantity" />
              <TextInput id="Qty" type="number" name="Qty" value={formData.Qty} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="Driver" value="Driver" />
              <TextInput id="Driver" type="text" name="Driver" value={formData.Driver} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="Location" value="Location" />
              <TextInput id="Location" type="text" name="Location" value={formData.Location} onChange={handleChange} required />
            </div>
            <Button type="submit" gradientDuoTone="greenToBlue" className="bg-green-500 text-white w-full mt-4">
              Update
            </Button>
          </form>
        </Card>
      </div>
  );
}
