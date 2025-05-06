import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const FMRead = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/finance")
      .then((res) => {
        console.log("Response data:", res.data);
        setRecords(res.data);
      })
      .catch((err) => console.error("Axios error:", err));
  }, []);

  const handleDownload = () => {
    axios
      .get("http://localhost:8000/api/finance/download", {
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Finance_Report.csv");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => console.error("Error downloading file:", err));
  };

  // Filter records based on search query
  const filteredRecords = records.filter((record) => {
    const searchLower = search.toLowerCase();

    const nameMatch = record.name.toLowerCase().includes(searchLower);
    const dateMatch = record.date.toLowerCase().includes(searchLower);
    const valueMatch = record.value.toString().includes(search);

    return nameMatch || dateMatch || valueMatch;
  });

  // Separate incomes and expenses
  const incomes = filteredRecords.filter((record) => record.type === "income");
  const expenses = filteredRecords.filter(
    (record) => record.type === "expense"
  );

  // Calculate totals
  const totalIncome = incomes.reduce((sum, record) => sum + record.value, 0);
  const totalExpense = expenses.reduce((sum, record) => sum + record.value, 0);

  return (
    <div className="p-6 bg-green-100 min-h-screen">
      <div className="max-w-8xl mx-auto bg-white p-6 shadow-lg rounded-lg border-2 border-green-500">
        <div>
          <h2 className="mt-3 text-3xl font-bold">Finance Dashboard</h2>
          <br></br>

          <div className="mb-4 flex space-x-2">
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

          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="border border-black p-2 text-left">Date</th>
                <th className="border border-black p-2">Transaction Name</th>
                <th className="border border-black p-2">Type</th>
                <th className="border border-black p-2">Value (LKR)</th>
                <th className="border border-black p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Incomes Section */}
              <tr className="bg-gray-200">
                <td className="border border-black p-2 font-bold" colSpan="4">
                  Incomes
                </td>
              </tr>
              {incomes.map((record) => (
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
                    {record.value.toFixed(2)}
                  </td>
                  <td className="border border-black p-2">
                    <div className="flex justify-center space-x-2">
                      <Button
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        //onClick={() => navigate(`/edit-record/${record._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        //onClick={() => handleDeleteConfirmation(record._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Total Incomes */}
              <tr className="bg-yellow-200 font-bold">
                <td className="border border-black p-2 text-right" colSpan="3">
                  Total Incomes:
                </td>
                <td className="border border-black p-2">
                  {totalIncome.toFixed(2)}
                </td>
              </tr>

              {/* Expenses Section */}
              <tr className="bg-gray-200">
                <td className="border border-black p-2 font-bold" colSpan="4">
                  Expenses
                </td>
              </tr>
              {expenses.map((record) => (
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
                    {record.value.toFixed(2)}
                  </td>
                  <td className="border border-black p-2">
                    <div className="flex justify-center space-x-2">
                      <Button
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        //onClick={() => navigate(`/edit-record/${record._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        //onClick={() => handleDeleteConfirmation(record._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Total Expenses */}
              <tr className="bg-yellow-200 font-bold">
                <td className="border border-black p-2 text-right" colSpan="3">
                  Total Expenses:
                </td>
                <td className="border border-black p-2">
                  {totalExpense.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FMRead;
