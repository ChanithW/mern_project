import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button, Card, Label, TextInput, Select } from 'flowbite-react';
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from 'qrcode.react'; // Fixed import using named exports
import bgImage from '../assets/images/tealeaves.jpg';

function EMregister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    empType: "",
    name: "",
    age: "",
    address: "",
    gender: "",
    phoneNumber: "",
    employeeId: "" // This will store the generated employee ID
  });
  const [showQRCode, setShowQRCode] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const qrRef = useRef(null);

  // Generate a unique employee ID
  const generateEmployeeId = () => {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 10000);
    return `EMP${timestamp}${randomNum}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate name
    if (!/^[A-Za-z ]+$/.test(formData.name)) {
      alert("Name can only contain letters");
      return;
    }
    //valodate age
    if (!/^(?:1[89]|[2-5][0-9]|60)$/.test(formData.age)) {
      alert("Age must be between 18 and 60 and cannot be negative");
      return;
    }
    //validate address
    if (!/^[A-Za-z0-9 /]+$/.test(formData.address)) {
      alert("Address can only contain letters, numbers, spaces, and '/'");
      return;
    }

    //validate phonenumber
    if (!/^0\d{9}$/.test(formData.phoneNumber)) {
      alert("Phone number must start with 0 and be exactly 10 digits");
      return;
    }
    // genarate emp id before submit
    const employeeId = generateEmployeeId();
    const dataWithId = { ...formData, employeeId };

    try {
      const response = await axios.post("http://localhost:8000/EMployee", dataWithId);
      setSubmittedData(response.data);
      setShowQRCode(true);
      alert("Employee added successfully! QR code generated.");


    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee.");
    }
  };

  //download qr
  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");
      if (canvas) {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `qrcode-${submittedData?.employeeId || formData.name}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleDone = () => {
    navigate("/EMview");
  };

  const resetForm = () => {
    setFormData({
      empType: "",
      name: "",
      age: "",
      address: "",
      gender: "",
      phoneNumber: "",
      employeeId: ""
    });
    setShowQRCode(false);
    setSubmittedData(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="flex w-full max-w-4xl justify-center items-center">
        <Card className="w-full p-6 shadow-lg rounded-lg bg-white bg-opacity-70">
          <h2 className="text-3xl font-bold text-center mb-4">Employee Registration</h2>
          {!showQRCode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="empType" value="Employee Type" />
                <Select id="empType" name="empType" value={formData.empType} onChange={handleChange} required>
                  <option value="">Select Type</option>
                  <option value="permanent">Permanent</option>
                  <option value="non_permanent">Non-Permanent</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="name" value="Name" />
                <TextInput id="name" type="String" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="age" value="Age" />
                <TextInput id="age" type="number" name="age" value={formData.age} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="address" value="Address" />
                <TextInput id="address" type="String" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <div>
                <Label value="Gender" />
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} required className="mr-1" />  Male
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} required className="mr-1" /> Female
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="gender" value="other" checked={formData.gender === "other"} onChange={handleChange} required className="mr-1" /> Other
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="phoneNumber" value="Phone Number" />
                <TextInput id="phoneNumber" type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
              </div>
              <Button type="submit" gradientDuoTone="greenToBlue" className="bg-green-500 text-white w-full mt-4">Submit</Button>
              <Button
                className="bg-green-500 text-white w-full mt-4"
                type="button"
                onClick={resetForm}
              >
                Reset
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center space-y-6" ref={qrRef}>
              <h3 className="text-xl font-bold">Employee QR Code</h3>
              <div className="border border-gray-300 p-4 rounded-lg">
                <QRCodeCanvas
                  value={JSON.stringify({
                    employeeId: submittedData?.employeeId || formData.employeeId,
                    name: formData.name,
                    phoneNumber: formData.phoneNumber
                  })}
                  size={200}
                  level={"H"}
                  includeMargin={true}
                />
              </div>
              <p className="text-center font-medium">Employee ID: {submittedData?.employeeId || formData.employeeId}</p>
              <p className="text-center text-sm text-gray-600">Scan this QR code for attendance</p>

              <div className="flex space-x-4 mt-4">
                <Button onClick={downloadQRCode} gradientDuoTone="purpleToBlue" className='bg-green-500'>
                  Download QR Code
                </Button>
                <Button onClick={handleDone} gradientDuoTone="greenToBlue" className='bg-green-500'>
                  Done
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default EMregister;
