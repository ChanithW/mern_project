import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import * as XLSX from "xlsx";
import "jspdf-autotable"
import { Textarea } from 'flowbite-react';
import Header from '../components/header';
import notifyImg from "../assets/images/apple.png";

export default function IMDispatch() {
  const [formData, setFormData] = useState({ StockId: "", Date: "", Qty: "", Driver: "", Location: "" });
  const [tDispatch, setTDispatch] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  /*------*/
  const [whatsappDetails, setWhatsappDetails] = useState({
    number: "", message: ""
  });
  /*------*/
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tdispatch");
        setTDispatch(response.data.tDispatch);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
/*------*/
  const handleWhatsappChange = (e) => {
    setWhatsappDetails({ ...whatsappDetails, [e.target.name]: e.target.value });
  };
/*-------*/
  const handleSubmit = async (e) => {
    e.preventDefault();

  const today = new Date().toISOString().split("T")[0];

  // Check for duplicate Stock ID
  const isDuplicate = tDispatch.some(dispatch => dispatch.StockId === formData.StockId);
  if (isDuplicate) {
    alert("This Stock ID already exists. Please enter a unique Stock ID.");
    return;
  }

  // Validate Date (Prevent Past Dates)
  if (formData.Date < today) {
    alert("You cannot select a past date. Please select today's or a future date.");
    return;
  }

  // Validate Qty (Prevent Negative Numbers)
  if (formData.Qty <= 0 || isNaN(formData.Qty)) {
    alert("Quantity must be a positive number.");
    return;
  }

  // Validate Driver's Name (only letters allowed)
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(formData.Driver)) {
    alert("Driver name can only contain letters.");
    return;
  }

  // Validate Location (Only Letters, Numbers, and "/")
  const locationRegex = /^[A-Za-z0-9/]+$/;
  if (!locationRegex.test(formData.Location)) {
    alert("Location can only contain letters, numbers, and '/'.");
    return;
  }

    try {
      await axios.post("http://localhost:5000/tdispatch", formData);
      setFormData({ StockId: "", Date: "", Qty: "", Driver: "", Location: "" });

      const response = await axios.get("http://localhost:5000/tdispatch");
      setTDispatch(response.data.tDispatch);
    } catch (err) {
      console.error("Failed to dispatch stock.");
    }
  };
/*-------*/
  const handleSendWhatsapp = async (e) => {
    e.preventDefault();
    const { number, message } = whatsappDetails;

    try {
      await axios.post("http://localhost:5000/send-whatsapp", {
        from: "+94765832812",
        to: number,
        message: message
      });

      alert('Message sent successfully!');
      window.location.reload();  // Refresh the page after message sent
    } catch (err) {
      console.error("Failed to send message", err);
      alert("Error sending message.");
    }
  };
/*-------*/
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this record?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/tdispatch/${id}`);
        const response = await axios.get("http://localhost:5000/tdispatch");
        setTDispatch(response.data.tDispatch);
      } catch (err) {
        console.error("Error deleting record", err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/IMDispatchEdit/${id}`);
  };

  const handleDownloadExcel = () => {
      const ws = XLSX.utils.json_to_sheet(tDispatch);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Delivery Data");
      XLSX.writeFile(wb, "Dispatch_Data.xlsx");
    };

  const filteredTDispatch = tDispatch.filter((dispatch) => dispatch.Date.startsWith(searchDate));

  const handleSearchDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  
    if (selectedDate > today) {
      alert("Please search for a past date.");
      return;
    }
  
    setSearchDate(selectedDate);
  };
  
  const chartOptions = {
    chart: { type: "area", height: "100%", maxWidth: "100%" },
    series: [{ name: "Dispatch Stock Amount", data: tDispatch.map((dispatch) => dispatch.Qty) }],
    xaxis: { categories: tDispatch.map((dispatch) => new Date(dispatch.Date).toLocaleDateString()) },
  };

  return (
    <div className="min-h-screen flex flex-col">
    <Header />
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10 space-y-6">
    <h1 className="text-4xl font-extrabold text-center text-gray-800">
        Delivery Overview
      </h1>
      <div className="flex w-full max-w-6xl space-x-6">
        {/* Add Stock Form */}
        <Card className="w-1/2 p-4 border border-green-500">
          <h2 className="text-2xl font-bold text-center mb-4">Stock Delivery Records</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
              <Label htmlFor="StockId" value="StockId" />
              <TextInput id="StockId" type="String" name="StockId" value={formData.StockId} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="Date" value="Date" />
              <TextInput id="Date" type="date" name="Date" value={formData.Date} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="Qty" value="Qty" />
              <TextInput id="Qty" type="number" name="Qty" value={formData.Qty} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="Driver" value="Driver" />
              <TextInput id="Driver" type="String" name="Driver" value={formData.Driver} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="Location" value="Location" />
              <TextInput id="Location" type="String" name="Location" value={formData.Location} onChange={handleChange} required />
            </div>
            <Button type="submit" gradientDuoTone="greenToBlue" className="bg-green-500 text-white w-full mt-4">Submit</Button>
            <Button
               className="bg-green-500 text-white w-full mt-4"
               type="button"
               onClick={() => setFormData({ StockId: "", Date: "", Qty: "", Driver: "", Location: "" })}
             >
               Reset
             </Button>
          </form>
        </Card>
        
        {/* Chart Section */}
        <Card className="w-1/2 p-4 border border-green-500 bg-green-100">
          <h2 className="text-2xl font-bold text-center mb-4">Flow Overview</h2>
          <ApexCharts options={chartOptions} series={chartOptions.series} type="area" height={250} />
        {/* WhatsApp Messaging Section */}
        <div className="flex items-center justify-center mt-5">
        <img src={notifyImg} alt="notification" className="w-10 h-10 object-cover mr-4 transform -translate-y-2" />
        <h2 className="text-2xl font-bold text-center mb-4">Send WhatsApp Message</h2>
</div>
            <form onSubmit={handleSendWhatsapp} className="space-y-4">
              <div>
                <Label htmlFor="number" value="Receiver's Number" />
                <TextInput
                  id="number"
                  name="number"
                  type="text"
                  value={whatsappDetails.number}
                  onChange={handleWhatsappChange}
                  placeholder="Enter receiver's phone number (e.g., +94765832812)"
                  required
                />
              </div>
              <div>
                <Label htmlFor="message" value="Message" />
                <Textarea
                  id="message"
                  name="message"
                  value={whatsappDetails.message}
                  onChange={handleWhatsappChange}
                  placeholder="Enter message content"
                  required
                />
              </div>
              <Button type="submit" gradientDuoTone="greenToBlue" className="bg-green-500 text-white w-full mt-4">
                Send Message
              </Button>
            </form>
        </Card>
      </div>
    
      {/* Table Section */}
      <div className="w-full max-w-6xl border border-green-500 border rounded">
      <h3 className="text-2xl font-bold text-black pl-5 mt-5 text-center bg-white">All Entries</h3>
        <div className="p-4 bg-gray-50 flex justify-end ">
          <Label htmlFor="searchDate" className="mr-4 p-5">Filter by Date:</Label>
          <TextInput id="searchDate" type="date" value={searchDate} onChange={handleSearchDateChange} className="p-2 border rounded" />
          {/*<TextInput id="searchDate" type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="p-2 border rounded" />*/}
        </div>

        {/* Scrollable Table */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-80 overflow-y-auto ">
          <table className="w-full text-sm text-left text-gray-500 bg-gray-200">
            <thead className="sticky top-0 bg-gray-50 text-gray-700">
              <tr className="bg-gray-300">
                <th className="px-6 py-3">StockId</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Qty</th>
                <th className="px-6 py-3">Driver</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTDispatch.length > 0 ? (
                filteredTDispatch.map((dispatch) => (
                  <tr key={dispatch._id} className="border-b">
                    <td className="px-6 py-4">{dispatch.StockId}</td>
                    <td className="px-6 py-4">{new Date(dispatch.Date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{dispatch.Qty}</td>
                    <td className="px-6 py-4">{dispatch.Driver}</td>
                    <td className="px-6 py-4">{dispatch.Location}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button onClick={() => handleEdit(dispatch._id)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(dispatch._id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Download Buttons */}
        <div className="flex justify-end space-x-4 mt-4">
  <Button onClick={handleDownloadExcel} className="bg-green-500 text-white">Download Excel</Button>
</div>
      </div>
    </div>
    </div>
  );
}