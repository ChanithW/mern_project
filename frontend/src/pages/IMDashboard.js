import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import Header from "../components/header";
import inventoryImg from "../assets/images/inventory.png";
import deliveryImg from "../assets/images/delivery.png";

export default function IMDashboard() {
  const [tStock, setTStock] = useState([]);
  const [tDispatch, setTDispatch] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tstock");
        setTStock(response.data.tStock);
      } catch (err) {
        console.error("Error fetching stock data", err);
      }
    };

    const fetchDispatchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tdispatch");
        setTDispatch(response.data.tDispatch);
      } catch (err) {
        console.error("Error fetching dispatch data", err);
      }
    };

    fetchStockData();
    fetchDispatchData();
  }, []);

  // Total Stock and Total Dispatch Calculation
  const totalStock = tStock.reduce((acc, stock) => acc + (stock.totalAmount || 0), 0);
  const totalDispatch = tDispatch.reduce((acc, dispatch) => acc + (dispatch.Qty || 0), 0);
  const currentStock = totalStock - totalDispatch;

  // Stock Status
  const stockStatus = currentStock < 300 ? "Low Stock" : "Sufficient Stock";
  const statusColor = currentStock < 300 ? "text-red-600 font-bold" : "text-green-600 font-bold";

  // Chart Data for Stock Overview
  const chartOptions2 = {
    chart: { type: "area", height: "100%", maxWidth: "100%" },
    series: [{ name: "Stock Amount", data: tStock.map((stock) => stock.totalAmount) }],
    xaxis: { categories: tStock.map((stock) => new Date(stock.Date).toLocaleDateString()) },
  };

  // Chart Data for Dispatch Overview
  const chartOptions1 = {
    chart: { type: "area", height: "100%", maxWidth: "100%" },
    series: [{ name: "Dispatched Stock Amount", data: tDispatch.map((dispatch) => dispatch.Qty) }],
    xaxis: { categories: tDispatch.map((dispatch) => new Date(dispatch.Date).toLocaleDateString()) },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10 space-y-6">
      <h1 className="text-4xl font-extrabold text-center text-gray-800">
        Inventory Control Dashboard
      </h1>
        {/* Stock Summary Table */}
        <div className="w-full max-w-6xl bg-opacity-200 shadow-2xl rounded-lg p-6 border border-green-500">
          <h2 className="text-2xl font-bold text-center mb-4">Current Stock Overview</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-green-400">
                <th className="border p-2 ">Total Stock</th>
                <th className="border p-2">Total Dispatched</th>
                <th className="border p-2">Current Stock</th>
                <th className="border p-2">Stock Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border p-2">{totalStock}</td>
                <td className="border p-2">{totalDispatch}</td>
                <td className="border p-2 font-bold">{currentStock}</td>
                <td className={`border p-2 ${statusColor}`}>{stockStatus}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-6xl" >
          {/* Stock Overview Chart */}
          <div className="p-4 rounded-lg shadow-md border border-green-500">
            <h2 className="text-2xl font-bold text-center mb-4">Stock Overview</h2>
            <ApexCharts options={chartOptions2} series={chartOptions2.series} type="area" height={250} />
          </div>

          {/* Flow Overview Chart */}
          <div className="p-4 rounded-lg shadow-md   border border-green-500">
            <h2 className="text-2xl font-bold text-center mb-4">Dispatch Overview</h2>
            <ApexCharts options={chartOptions1} series={chartOptions1.series} type="area" height={250} />
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-6xl ">
          {/* Storing Inventories Card */}
          <Card className="p-10 bg-green-100 hover:bg-green-300 shadow-md cursor-pointer border border-green-500 relative" onClick={() => navigate("/IMStoring")}>
            <div className="absolute top-1/2 right-10 transform -translate-y-1/2">
              <img src={inventoryImg} alt="Delivery" className="w-14 h-16 object-cover" />
            </div>
            <h3 className="text-xl font-semibold">Storing Inventories</h3>
            <p className="text-gray-600">Manage and track your inventory stock levels.</p>  
          </Card>

          {/* Stock Delivery Card */}
          <Card className="p-10 bg-green-100 hover:bg-green-300 via-green-200 to-green-100 shadow-md cursor-pointer border border-green-500 relative" onClick={() => navigate("/IMDispatch")}>
            <div className="absolute top-1/2 right-10 transform -translate-y-1/2">
              <img src={deliveryImg} alt="Delivery" className="w-16 h-16 object-cover" />
            </div>
            <h3 className="text-xl font-semibold">Stock Delivery</h3>
            <p className="text-gray-600">Track and manage your dispatched stock details.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
