import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";

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
    navigate(`/edit-stock/${id}`);
  };

  const filteredTStock = tStock.filter((stock) => stock.Date.startsWith(searchDate));

  const chartOptions = {
    chart: { type: "area", height: "100%", maxWidth: "100%" },
    series: [{ name: "Stock Amount", data: tStock.map((stock) => stock.totalAmount) }],
    xaxis: { categories: tStock.map((stock) => new Date(stock.Date).toLocaleDateString()) },
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10 space-y-6">
      <div className="flex w-full max-w-6xl space-x-6">
        {/* Add Stock Form */}
        <Card className="w-1/2 p-4">
          <h2 className="text-2xl font-bold text-center mb-4">Add New Records</h2>
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
        <Card className="w-1/2 p-4">
          <h2 className="text-2xl font-bold text-center mb-4">Stock Overview</h2>
          <ApexCharts options={chartOptions} series={chartOptions.series} type="area" height={250} />
        </Card>
      </div>
      
      {/* Table Section */}
      <div className="w-full max-w-6xl">
        <div className="p-4 bg-gray-50 flex justify-end">
          <Label htmlFor="searchDate" className="mr-4 p-5">Filter by Date:</Label>
          <TextInput id="searchDate" type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="p-2 border rounded" />
        </div>

        {/* Scrollable Table */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-64 overflow-y-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="sticky top-0 bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTStock.length > 0 ? (
                filteredTStock.map((stock) => (
                  <tr key={stock._id} className="border-b">
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
      </div>
    </div>
  );
}