import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import Header from "../components/header";

export default function IMStoring() {
  const [formData, setFormData] = useState({ Date: "", totalAmount: "" });
  const [tStock, setTStock] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/tstock");
        setTStock(response.data.tStock);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to fetch data. Please try again.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If date is being changed and plucking totals exist
    if (name === "Date" && localStorage.getItem("pluckingTotals")) {
      const totals = JSON.parse(localStorage.getItem("pluckingTotals"));
      setFormData(prev => ({
        ...prev,
        totalAmount: totals.kgPlucked.toFixed(2)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.Date) {
      setErrorMessage("Please select a date");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (!formData.totalAmount || formData.totalAmount <= 0) {
      setErrorMessage("Total Amount must be a positive number");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      await axios.post("http://localhost:8000/tstock", formData);
      setFormData({ Date: "", totalAmount: "" });

      const response = await axios.get("http://localhost:8000/tstock");
      setTStock(response.data.tStock);
    } catch (err) {
      console.error("Failed to add stock.");
      console.log("Submitting form data:", {
        date: formData.Date,
        totalAmount: Number(formData.totalAmount)
      });

      const response = await axios.post("http://localhost:8000/tstock", {
        date: formData.Date,
        totalAmount: Number(formData.totalAmount)
      });

      console.log("Server response:", response.data);

      if (response.data.tStock) {
        setFormData({
          Date: "",
          totalAmount: ""
        });
        setSuccessMessage("Stock added successfully!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        
        // Refresh the stock list
        const updatedResponse = await axios.get("http://localhost:8000/tstock");
        setTStock(updatedResponse.data.tStock);
      }
    } catch (error) {
      console.error("Error adding stock:", error);
      setErrorMessage(
        error.response?.data?.message || 
        "Error adding stock. Please try again."
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  // Add function to check if record exists for today
  const checkTodayRecord = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await axios.get("http://localhost:8000/tstock");
      const todayRecord = response.data.tStock.find(
        (record) => new Date(record.Date).toISOString().split("T")[0] === today
      );
      return todayRecord;
    } catch (err) {
      console.error("Error checking today's record:", err);
      return null;
    }
  };

  // Add useEffect to check for today's record when component mounts
  useEffect(() => {
    const checkRecord = async () => {
      const todayRecord = await checkTodayRecord();
      if (todayRecord) {
        alert("A record already exists for today. Only one record per day is allowed.");
        setFormData({ Date: "", totalAmount: "" });
      }
    };
    checkRecord();
  }, []);

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
    const today = new Date().toISOString().split("T")[0];

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
        <h1 className="text-4xl font-extrabold text-center text-gray-800">Inventory storage</h1>

        <div className="flex w-full max-w-6xl space-x-6">
          {/* Add Stock Form with Notification */}
          <Card className="w-1/2 p-4 border border-green-500 relative">
            <h2 className="text-2xl font-bold text-center mb-4">Add New Records</h2>

            {/* Notification Bell Icon */}
            {localStorage.getItem("pluckingTotals") && (
              <div className="absolute top-4 right-4 group cursor-pointer">
                <span className="text-2xl">🔔</span>
                <div className="absolute top-8 right-0 w-60 bg-white border rounded-lg shadow-lg p-4 z-10 hidden group-hover:block">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Plucking Totals</h4>
                  {(() => {
                    const totals = JSON.parse(localStorage.getItem("pluckingTotals"));
                    return (
                      <>
                        <p>
                          <strong>KG Plucked:</strong> {totals.kgPlucked.toFixed(2)} kg
                        </p>
                        <p>
                          <strong>Total Amount:</strong> RS.{totals.dailyWage.toFixed(2)}
                        </p>
                        <button
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              totalAmount: totals.kgPlucked.toFixed(2),
                            }))
                          }
                          className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm"
                        >
                          Use This Total
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="Date" value="Date" />
                <TextInput
                  id="Date"
                  type="date"
                  name="Date"
                  value={formData.Date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="totalAmount" value="Total Amount" />
                <TextInput
                  id="totalAmount"
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" gradientDuoTone="greenToBlue" className="bg-green-500 text-white w-full mt-4">
                Submit
              </Button>
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
          <h3 className="text-2xl font-bold text-black pl-5 mt-5 text-center">All Entries</h3>
          <div className="p-4 flex justify-end">
            <Label htmlFor="searchDate" className="mr-4 p-5">
              Filter by Date:
            </Label>
            <TextInput id="searchDate" type="date" value={searchDate} onChange={handleSearchDateChange} />
          </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-64 overflow-y-auto bg-gray-200">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="sticky top-0 text-gray-700 bg-gray-300">
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
                        <button onClick={() => handleEdit(stock._id)} className="text-blue-600 hover:underline">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(stock._id)} className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <Button onClick={handleDownloadExcel} className="bg-green-500 text-white">
              Download Excel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
