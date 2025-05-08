import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/header';

function FDMscheduleRead() {
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Fetch schedules from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/getschedules")
      .then((response) => response.json())
      .then((data) => setScheduleData(data))
      .catch((error) => console.error("Error fetching schedules:", error));
  }, []);

  // Handle Edit
  const handleEdit = (id) => {
    navigate(`/fdm-fScheduleEdit/${id}`);
  };

  // Handle Delete with Confirmation
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (confirmDelete) {
      fetch(`http://localhost:5000/api/schedules/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setScheduleData((prevData) =>
              prevData.filter((row) => row._id !== id)
            );
            alert("Schedule deleted successfully!");
          } else {
            alert("Failed to delete schedule.");
          }
        })
        .catch((error) => console.error("Error deleting schedule:", error));
    }
  };

  // Filter schedules based on search term
  const filteredSchedules = scheduleData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Function to Download Report as CSV
  const handleDownloadReport = () => {
    if (filteredSchedules.length === 0) {
      alert("No matching data available to download.");
      return;
    }

    // Define CSV headers
    const headers = [
      "Date",
      "Due Date",
      "Fertilizer Mixture",
      "Urea",
      "ERP",
      "MOP",
      "Area",
      "Status",
    ];

    // Convert filtered data into CSV format
    const csvRows = [
      headers.join(","), // Add headers first
      ...filteredSchedules.map((row) =>
        [
          row.date ? new Date(row.date).toISOString().split("T")[0] : "",
          row.dueDate ? new Date(row.dueDate).toISOString().split("T")[0] : "",
          row.fertilizerMixture,
          row.urea,
          row.erp,
          row.mop,
          row.area,
          row.status,
        ].map(value => `"${String(value).replace(/"/g, '""')}"`) // Escape quotes for CSV safety
         .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    // Create a Blob and download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Fertilization_Schedule_Report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Notify supervisor
  const handleNotifySupervisor = () => {
    navigate('/fdm-femail');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="p-9 bg-green-100 min-h-screen">
        <div className="max-w-8xl mx-auto bg-white p-6 shadow-lg rounded-lg border-2 border-green-500">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Fertilization Records
          </h2>

          <div className="flex justify-between items-center mb-4">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={() => navigate("/fertilization-dashboard")}
            >
              Back
            </button>
            <input
              type="text"
              placeholder="🔍 Search..."
              className="p-2 border border-green-400 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="space-x-3">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => navigate("/fdm-fScheduleCreate")}
              >
                ➕ Add new Schedule
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={handleDownloadReport}
              >
                📥 Download Report
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                onClick={handleNotifySupervisor}
              >
                ✉️ Notify Supervisor
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-green-400">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="p-2 border border-green-400">Date</th>
                  <th className="p-2 border border-green-400">Due Date</th>
                  <th className="p-2 border border-green-400">Mixture</th>
                  <th className="p-2 border border-green-400">Urea Parts</th>
                  <th className="p-2 border border-green-400">ERP Parts</th>
                  <th className="p-2 border border-green-400">MOP Parts</th>
                  <th className="p-2 border border-green-400">Area</th>
                  <th className="p-2 border border-green-400">Status</th>
                  <th className="p-2 border border-green-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((row) => (
                    <tr
                      key={row._id}
                      className="text-center bg-green-50 hover:bg-green-200"
                    >
                      <td className="p-2 border border-green-400">
                        {new Date(row.date).toISOString().split("T")[0]}
                      </td>
                      <td className="p-2 border border-green-400">
                        {new Date(row.dueDate).toISOString().split("T")[0]}
                      </td>
                      <td className="p-2 border border-green-400">{row.fertilizerMixture}</td>
                      <td className="p-2 border border-green-400">{row.urea}</td>
                      <td className="p-2 border border-green-400">{row.erp}</td>
                      <td className="p-2 border border-green-400">{row.mop}</td>
                      <td className="p-2 border border-green-400">{row.area}</td>
                      <td className="p-2 border border-green-400">{row.status}</td>
                      <td className="p-2 border border-green-400">
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg mr-2"
                          onClick={() => handleEdit(row._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded-lg"
                          onClick={() => handleDelete(row._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-600">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default FDMscheduleRead;

