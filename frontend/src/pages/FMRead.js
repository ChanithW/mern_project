import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Chart from "react-apexcharts";
import AuthContext from "../context/AuthContext";

const FMRead = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Axios instance with auth header
  const authAxios = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [financeRes] = await Promise.all([
        authAxios.get("/finance")
      ]);
      setRecords(financeRes.data);
      setTransactions(financeRes.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
      if (err.response?.status === 401) {
        // Handle unauthorized access
        navigate("/finance-login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      navigate("/finance-login");
    }
  }, [token]);

  const handleDownload = async () => {
    try {
      const response = await authAxios.get(`/finance/download?search=${encodeURIComponent(search)}`, {
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Finance_Report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading file:", err);
      alert("Failed to download report. Please try again.");
      if (err.response?.status === 401) {
        navigate("/finance-login");
      }
    }
  };

  const filteredRecords = records.filter((record) => {
    const searchLower = search.toLowerCase();
    const nameMatch = record.name?.toLowerCase().includes(searchLower);
    const dateMatch = record.date?.toLowerCase().includes(searchLower);
    const valueMatch = record.value?.toString().includes(search);

    return nameMatch || dateMatch || valueMatch;
  });

  const incomes = filteredRecords.filter((record) => record.type === "income");
  const expenses = filteredRecords.filter((record) => record.type === "expense");

  const totalIncomes = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (t.value || 0), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (t.value || 0), 0);

  const balance = totalIncomes - totalExpenses;

  const chartOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: ["Incomes", "Expenses"],
    },
    colors: ["#4CAF50", "#F44336"],
    plotOptions: {
      bar: {
        distributed: true,
      },
    },
    title: {
      text: "Financial Overview",
      align: "center",
    },
  };

  const chartSeries = [
    {
      name: "Amount",
      data: [totalIncomes, totalExpenses],
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-semibold">Loading financial data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-semibold text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="p-6 bg-green-100 min-h-screen">
        <div className="max-w-8xl mx-auto bg-white p-6 shadow-lg rounded-lg border-2 border-green-500">
          <div>
            <h2 className="mt-3 text-3xl font-bold">Finance Dashboard</h2>
            <br />
            <div className="mb-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search records..."
                  className="p-2 border border-green-400 rounded-lg"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  className="bg-gray-600 text-white px-4 py-2"
                  onClick={handleDownload}
                >
                  📥 Download Report
                </Button>
                <Button
                  className="bg-green-600 text-white px-4 py-2 hover:bg-green-700"
                  onClick={() => navigate("/add-finance")}
                >
                  ➕ Add New Record
                </Button>
              </div>
              <Button
                className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
                onClick={() => navigate("/payroll-management")}
              >
                💼 Payroll Management
              </Button>
            </div>
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="border border-black p-2 text-left">Date</th>
                  <th className="border border-black p-2">Transaction Name</th>
                  <th className="border border-black p-2">Type</th>
                  <th className="border border-black p-2">Value (LKR)</th>
                  <th className="border border-black p-2">Image</th>
                  <th className="border border-black p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-200">
                  <td className="border border-black p-2 font-bold" colSpan="6">
                    Incomes
                  </td>
                </tr>
                {incomes.length > 0 ? (
                  incomes.map((record) => (
                    <tr
                      key={record._id}
                      className="text-center border border-black bg-green-50 hover:bg-green-200"
                    >
                      <td className="border border-black p-2 text-left">
                        {record.date}
                      </td>
                      <td className="border border-black p-2">{record.name}</td>
                      <td className="border border-black p-2">{record.type}</td>
                      <td className="border border-black p-2">
                        {record.value?.toFixed(2)}
                      </td>
                      <td className="border border-black p-2">
                        {record.image ? (
                          <img
                            src={`http://localhost:8000${record.image}`}
                            alt="Transaction"
                            className="w-16 h-16 object-cover mx-auto"
                          />
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td className="border border-black p-2">
                        <div className="flex justify-center space-x-2">
                          <Button
                            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                            onClick={() =>
                              navigate(`/edit-finance/${record._id}`)
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                            onClick={() =>
                              navigate(`/delete-finance/${record._id}`)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border border-black">
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No income records found
                    </td>
                  </tr>
                )}

                <tr className="bg-gray-200">
                  <td className="border border-black p-2 font-bold" colSpan="6">
                    Expenses
                  </td>
                </tr>
                {expenses.length > 0 ? (
                  expenses.map((record) => (
                    <tr
                      key={record._id}
                      className="text-center border border-black bg-red-50 hover:bg-red-200"
                    >
                      <td className="border border-black p-2 text-left">
                        {record.date}
                      </td>
                      <td className="border border-black p-2">{record.name}</td>
                      <td className="border border-black p-2">{record.type}</td>
                      <td className="border border-black p-2">
                        {record.value?.toFixed(2)}
                      </td>
                      <td className="border border-black p-2">
                        {record.image ? (
                          <img
                            src={`http://localhost:8000${record.image}`}
                            alt="Transaction"
                            className="w-16 h-16 object-cover mx-auto"
                          />
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td className="border border-black p-2">
                        <div className="flex justify-center space-x-2">
                          <Button
                            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                            onClick={() =>
                              navigate(`/edit-finance/${record._id}`)
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                            onClick={() =>
                              navigate(`/delete-finance/${record._id}`)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border border-black">
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No expense records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <br />
            <div className="flex gap-2">
              <div className="w-1/3 h-1/4 mt-6 p-4 bg-white border border-black rounded-lg">
                <h3 className="text-3xl font-bold">Financial Summary</h3>
                <br />
                <p className="text-green-600 font-bold text-xl">
                  Total Income: LKR{totalIncomes.toFixed(2)}
                </p>
                <p className="text-red-600 font-bold text-xl">
                  Total Expenses: LKR{totalExpenses.toFixed(2)}
                </p>
                <br />
                <p
                  className={`text-2xl font-bold ${
                    balance >= 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  Balance: LKR{balance.toFixed(2)}
                </p>
              </div>

              <div className="w-2/3 mt-6 p-4 bg-white border border-black rounded-lg">
                <h3 className="text-2xl font-semibold mb-2">Financial Summary Chart</h3>
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="bar"
                  height={350}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FMRead;
