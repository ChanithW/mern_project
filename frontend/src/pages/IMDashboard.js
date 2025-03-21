import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";

export default function IMDashboard() {
    //const [] = useState({ Date: "", totalAmount: "" });
    const [tStock, setTStock] = useState([]);
    //const [] = useState({ StockId: "", Date: "", Qty: "", Driver: "", Location: "" });
    const [tDispatch, setTDispatch] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get("http://localhost:5000/tstock");
            setTStock(response.data.tStock);
          } catch (err) {
            console.error("Error fetching data", err);
          }
        };
        fetchData();
      }, []);


      const chartOptions2 = {
        chart: { type: "area", height: "100%", maxWidth: "100%" },
        series: [{ name: "Stock Amount", data: tStock.map((stock) => stock.totalAmount) }],
        xaxis: { categories: tStock.map((stock) => new Date(stock.Date).toLocaleDateString()) },
      };

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


      const chartOptions1 = {
        chart: { type: "area", height: "100%", maxWidth: "100%" },
        series: [{ name: "Dispatch Stock Amount", data: tDispatch.map((dispatch) => dispatch.Qty) }],
        xaxis: { categories: tDispatch.map((dispatch) => new Date(dispatch.Date).toLocaleDateString()) },
      };

      return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10 space-y-6">
          <div className="grid grid-cols-2 gap-6 w-full max-w-6xl">
            {/* Stock Overview Chart */}
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mb-4">Stock Overview</h2>
              <ApexCharts options={chartOptions2} series={chartOptions2.series} type="area" height={250} />
            </div>
    
            {/* Flow Overview Chart */}
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mb-4">Flow Overview</h2>
              <ApexCharts options={chartOptions1} series={chartOptions1.series} type="area" height={250} />
            </div>
          </div>
    
          <div className="grid grid-cols-2 gap-6 w-full max-w-6xl">
            {/* Storing Inventories Card */}
            <Card className="p-10 bg-white shadow-md" onClick={() => navigate("/IMStoring") }>
              <h3 className="text-xl font-semibold">Storing Inventories</h3>
              <p className="text-gray-600">Manage and track your inventory stock levels.</p>
            </Card>
    
            {/* Stock Delivery Card */}
            <Card className="p-10 bg-white shadow-md" onClick={() => navigate("/IMDispatch") }>
              <h3 className="text-xl font-semibold">Stock Delivery</h3>
              <p className="text-gray-600">Track and manage your dispatched stock details.</p>
            </Card>
          </div>
        </div>
      );
}