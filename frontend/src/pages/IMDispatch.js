import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import * as XLSX from "xlsx";
import "jspdf-autotable"
//import { Textarea } from 'flowbite-react';
import Header from '../components/header';

//import notifyImg from "../assets/images/apple.png";

export default function IMDispatch() {
  const [formData, setFormData] = useState({ StockId: "", Date: "", Qty: "", Driver: "", Location: "" });
  const [tDispatch, setTDispatch] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [recipient, setRecipient] = useState('');
const [messageBody, setMessageBody] = useState('');
const [status, setStatus] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/tdispatch");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

  const today = new Date().toISOString().split("T")[0];

  //stockID
  // Ensure the value is only the number part first
  const stockIdInput = formData.StockId.trim(); // user input like "7"

  const isNumeric = /^\d+$/.test(stockIdInput);
  if (!isNumeric) {
    alert("Stock ID must be a number, e.g., 1, 2, 9 — not including 'STM'.");
    return;
  }

  // Now format it properly
  formData.StockId = `STM${stockIdInput}`;

  // Final validation for format like STM1, STM7, STM99
  const isValidFormat = /^STM\d+$/.test(formData.StockId);
  if (!isValidFormat) {
    alert("Invalid Stock ID format. It must be in the format 'STM' followed by numbers.");
    return;
  }

  // Check for duplicates
  const isDuplicate = tDispatch.some(dispatch => dispatch.StockId === formData.StockId);
  if (isDuplicate) {
    alert("This Stock ID already exists. Please enter a unique Stock ID.");
    return;
  }

  

  // Date validation
  if (formData.Date !== today) {
    alert("You can only select today's date.");
    return;
  }

  // Validate Qty
  if (formData.Qty <= 0 || isNaN(formData.Qty)) {
    alert("Quantity must be a positive number.");
    return;
  }

  // Validate Driver's Name
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(formData.Driver)) {
    alert("Driver name can only contain letters.");
    return;
  }

  // Validate Location
  const locationRegex = /^[A-Za-z0-9/\s]+$/;
  if (!locationRegex.test(formData.Location)) {
    alert("Location can only contain letters, numbers, '/', and spaces.");
    return;
  }

    try {
      await axios.post("http://localhost:8000/tdispatch", formData);
      setFormData({ StockId: "", Date: "", Qty: "", Driver: "", Location: "" });

      const response = await axios.get("http://localhost:8000/tdispatch");
      setTDispatch(response.data.tDispatch);
    } catch (err) {
      console.error("Failed to dispatch stock.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this record?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/tdispatch/${id}`);
        const response = await axios.get("http://localhost:8000/tdispatch");
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
    const dataToDownload = searchDate ? filteredTDispatch : tDispatch;
    const ws = XLSX.utils.json_to_sheet(dataToDownload);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Delivery Data");
    XLSX.writeFile(wb, "Dispatch_Data.xlsx");
  };  

  const filteredTDispatch = tDispatch.filter((dispatch) => dispatch.Date.startsWith(searchDate));

  const handleSearchDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];
  
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
  //gmail ---------------------------------------
 
  const receivers = [
    'amath.markperera@gmail.com',
    'shivantha008@gmail.com',
    'guwaniemesha@gmail.com',
    'nehanperera484@gmail.com'
  ];
  
  const sendEmail = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/email/send-email', {
        recipient,
        messageBody
      });
      setStatus(response.data.message);
    } catch (err) {
      setStatus('Failed to send email');
    }
  };

  //-------------------------------------------
  
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
        {/* Gmail Sending Section */}

      <h2 className="text-xl font-bold mb-4">Send Email</h2>

      <select
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">Select Receiver</option>
        {receivers.map(email => (
          <option key={email} value={email}>{email}</option>
        ))}
      </select>

      <textarea
        value={messageBody}
        onChange={(e) => setMessageBody(e.target.value)}
        placeholder="Enter message here"
        className="w-full p-2 h-32 mb-4 border rounded"
      />

      <button
        onClick={sendEmail}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send
      </button>

      {status && <p className="mt-4 text-sm">{status}</p>}

        </Card>
      </div>
    
      {/* Table Section */}
      <div className="w-full max-w-6xl border border-green-500 border rounded">
      <h3 className="text-2xl font-bold text-black pl-5 mt-5 text-center bg-white">All Entries</h3>
        <div className="p-4 bg-gray-50 flex justify-end ">
          <Label htmlFor="searchDate" className="mr-4 p-5">Filter by Date:</Label>
          <TextInput id="searchDate" type="date" value={searchDate} onChange={handleSearchDateChange} className="p-2 border rounded" />
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