import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import * as XLSX from "xlsx";
import "jspdf-autotable"
import Header from '../components/header';

export default function IMStoring() {
  const [formData, setFormData] = useState({ Date: "", totalAmount: "" });
  const [tStock, setTStock] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/tstock");
        setTStock(response.data.tStock);
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
  // Date validation
  if (formData.Date !== today) {
    alert("You can only select today's date.");
    return;
  }

    // Validate Total Amount (Prevent Negative Numbers)
  if (formData.totalAmount <= 0 || isNaN(formData.totalAmount)) {
    alert("Total Amount must be a positive number.");
    return;
  }

    try {
      await axios.post("http://localhost:8000/tstock", formData);
      setFormData({ Date: "", totalAmount: "" });

      const response = await axios.get("http://localhost:8000/tstock");
      setTStock(response.data.tStock);
    } catch (err) {
      console.error("Failed to add stock.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this record?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/tstock/${id}`);
        const response = await axios.get("http://localhost:8000/tstock");
        setTStock(response.data.tStock);
      } catch (err) {
        console.error("Error deleting stock", err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/IMStoringEdit/${id}`);
  };

  const handleDownloadExcel = () => {
      const dataToDownload = searchDate ? filteredTStock : tStock;
      const ws = XLSX.utils.json_to_sheet(dataToDownload);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Stock Data");
      XLSX.writeFile(wb, "Stock_Data.xlsx");
    }; 
  
  const filteredTStock = tStock.filter((stock) => stock.Date.startsWith(searchDate));

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
    series: [{ name: "Stock Amount", data: tStock.map((stock) => stock.totalAmount) }],
    xaxis: { categories: tStock.map((stock) => new Date(stock.Date).toLocaleDateString()) },
  };

  return (
    <div className="min-h-screen flex flex-col">
    <Header />
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10 space-y-6">
    <h1 className="text-4xl font-extrabold text-center text-gray-800">
        Inventory storage
      </h1>
      <div className="flex w-full max-w-6xl space-x-6">
        {/* Add Stock Form */}
        <Card className="w-1/2 p-4 border border-green-500">
          <h2 className="text-2xl font-bold text-center mb-4 ">Add New Records</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="Date" value="Date" />
              <TextInput id="Date" type="date" name="Date" value={formData.Date} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="totalAmount" value="Total Amount" />
              <TextInput id="totalAmount" type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} required />
            </div>
            <Button type="submit" gradientDuoTone="greenToBlue" className="bg-green-500 text-white w-full mt-4">Submit</Button>
            <Button
               className="bg-green-500 text-white w-full mt-4"
               type="button"
               onClick={() => setFormData({ Date: "", totalAmount: "" })}
             >
               Reset
             </Button>
          </form>
        </Card>
        
        {/* Chart Section */}
        <Card className="w-1/2 p-4 border border-green-500 bg-green-100">
          <h2 className="text-2xl font-bold text-center mb-4">Stock Overview</h2>
          <ApexCharts options={chartOptions} series={chartOptions.series} type="area" height={250} />
        </Card>
      </div>
      
      {/* Table Section */}
      <div className="w-full max-w-6xl border border-green-500 border rounded bg-white">
      <h3 className="text-2xl font-bold text-black pl-5 mt-5 text-center ">All Entries</h3>
        <div className="p-4 flex justify-end  ">
            
          <Label htmlFor="searchDate" className="mr-4 p-5">Filter by Date:</Label>
          <TextInput id="searchDate" type="date" value={searchDate} onChange={handleSearchDateChange} className="p-2 border rounded" />
          {/*<TextInput id="searchDate" type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="p-2 border rounded" />*/}
        </div>

        {/* Scrollable Table */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-64 overflow-y-auto bg-gray-200">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="sticky top-0  text-gray-700 bg-gray-300">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTStock.length > 0 ? (
                filteredTStock.map((stock) => (
                  <tr key={stock._id} className="border-b ">
                    <td className="px-6 py-4">{new Date(stock.Date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{stock.totalAmount}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button onClick={() => handleEdit(stock._id)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(stock._id)} className="text-red-600 hover:underline">Delete</button>
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