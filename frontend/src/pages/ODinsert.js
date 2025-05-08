import { useState } from "react";
import axios from "axios";
import { Card, Label, TextInput, Button } from "flowbite-react";
import { useNavigate } from "react-router-dom"; 
import bgImage from '../assets/images/bg.jpg';

export default function ODinsert() {
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
    FuelConsumption: ""
  });

  const [errorMessages, setErrorMessages] = useState({});  // for validation eror
  const navigate = useNavigate();

  // Handle form data changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation 
  const validateForm = () => {
    let errors = {};
    
    // Required Fields Validation
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        errors[key] = `${key} is required`;
      }
    });

    // Validation on TripDate (should be a valid date)
    if (formData.TripDate && isNaN(new Date(formData.TripDate).setHours(0, 0, 0, 0))) {
      errors.TripDate = "Please enter a valid Trip Date";
    }

    // Validation on DepartureTime and EstimatedArrivalTime (HH:MM format)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
    if (formData.DepartureTime && !timeRegex.test(formData.DepartureTime)) {
      errors.DepartureTime = "Please enter a valid Departure Time (HH:MM)";
    }
    if (formData.EstimatedArrivalTime && !timeRegex.test(formData.EstimatedArrivalTime)) {
      errors.EstimatedArrivalTime = "Please enter a valid Estimated Arrival Time (HH:MM)";
    }

    // Validation on VehicleNumber (e.g., VE9999 or ASD123)
    const vehicleRegex = /^[A-Z]{2,3}\d{4}$/;
      if (formData.VehicleNumber && !vehicleRegex.test(formData.VehicleNumber)) {
        errors.VehicleNumber = "Please enter a valid Vehicle Number (e.g., VE9999 or ASD1234)";
}

    // Validation on TraveledDistance (should be a number)
    if (formData.TraveledDistance && (isNaN(formData.TraveledDistance) || parseFloat(formData.TraveledDistance) <= 0)) {
      errors.TraveledDistance = "Please enter a valid Traveled Distance (greater than 0)";
    }

    // Validation on FuelConsumption (should be a number)
    if (formData.FuelConsumption && (isNaN(formData.FuelConsumption) || parseFloat(formData.FuelConsumption) <= 0)) {
      errors.FuelConsumption = "Please enter a valid Fuel Consumption";
    }

    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  // control form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const response = await axios.post("http://localhost:5000/drive", formData);
      console.log("Data inserted successfully:", response.data);
      alert("Delivery Record Added Successfully!");
      
      // Redirect to ODMview
      navigate("/ODMview");

      // Reset the form
      setFormData({
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
        FuelConsumption: ""
      });
    } catch (error) {
      console.error("Error inserting data:", error);
      alert("Failed to add record.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10 space-y-6 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <Card className="w-1/2 p-4 bg-white bg-opacity-70">
        <h2 className="text-3xl font-bold text-center mb-4">Add Delivery Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <Label htmlFor={key} value={key} />
              <TextInput 
                id={key} 
                type={key === "TripDate" ? "date" : "text"} 
                name={key} 
                value={formData[key]} 
                onChange={handleChange} 
                required 
              />
              {errorMessages[key] && <p className="text-red-500 text-sm">{errorMessages[key]}</p>}  {/* Show error messages */}
            </div>
          ))}
          <Button type="submit" className="bg-green-500 text-white w-full mt-4">Submit</Button>
          <Button
            className="bg-gray-500 text-white w-full mt-4"
            type="button"
            onClick={() => setFormData({
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
              FuelConsumption: ""
            })}
          >
            Reset
          </Button>
        </form>
      </Card>
    </div>
  );
}
