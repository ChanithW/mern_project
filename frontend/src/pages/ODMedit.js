import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import bgImage from '../assets/images/bg.jpg';

export default function ODMedit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    DeliveryID: "",
    TripDate: "",
    DepartureTime: "",
    VehicleNumber: "",
    StockID: "",
    FactoryLocation: "",
    EstimatedArrivalTime: "",
    ActualArrivalTime: "",
    Deliverystatus: "",
    DeliveryNotes: "",
    TraveledDistance: "",
    FuelConsumption: "",
  });
  const [drive, setDrive] = useState(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/drive/${id}`);
        setDrive(response.data.drive);
        setFormData(response.data.drive);
      } catch (err) {
        console.error("Error fetching delivery data", err);
      }
    };
    fetchDelivery();
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
      await axios.put(`http://localhost:8000/drive/${id}`, formData);
      navigate("/ODMview");
    } catch (err) {
      console.error("Failed to update delivery details.", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <Card className="w-full max-w-lg p-6 bg-white bg-opacity-70">
        <h2 className="text-3xl font-bold text-center mb-4">Edit Delivery Record</h2>


        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <Label htmlFor="TripDate" value="Trip Date" />
            <TextInput type="date" id="TripDate" name="TripDate" value={formData.TripDate} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="DepartureTime" value="Departure Time" />
            <TextInput type="time" id="DepartureTime" name="DepartureTime" value={formData.DepartureTime} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="VehicleNumber" value="Vehicle Number" />
            <TextInput id="VehicleNumber" name="VehicleNumber" value={formData.VehicleNumber} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="FactoryLocation" value="Factory Location" />
            <TextInput id="FactoryLocation" name="FactoryLocation" value={formData.FactoryLocation} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="EstimatedArrivalTime" value="Estimated Arrival Time" />
            <TextInput type="time" id="EstimatedArrivalTime" name="EstimatedArrivalTime" value={formData.EstimatedArrivalTime} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="ActualArrivalTime" value="Actual Arrival Time" />
            <TextInput type="time" id="ActualArrivalTime" name="ActualArrivalTime" value={formData.ActualArrivalTime} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="TraveledDistance" value="Traveled Distance (km)" />
            <TextInput type="number" id="TraveledDistance" name="TraveledDistance" value={formData.TraveledDistance} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="FuelConsumption" value="Fuel Consumption (L)" />
            <TextInput type="number" id="FuelConsumption" name="FuelConsumption" value={formData.FuelConsumption} onChange={handleChange} />
          </div>
          <div className="flex justify-between mt-4">
          <Button 
            type="button" 
            gradientDuoTone="redToOrange" 
            className="bg-red-500 text-white px-4 py-2 w-1/3"
            onClick={() => navigate("/ODMview")} // Redirect to ODMview
          >
            Cancel
          </Button>
          <Button type="submit" gradientDuoTone="greenToBlue" className="bg-green-500 text-white px-4 py-2 w-1/3">
            Update
          </Button>
          
          </div>
        </form>
      </Card>
    </div>
  );
}
