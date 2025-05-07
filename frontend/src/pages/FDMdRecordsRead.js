import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

function FDMdRecordsRead() {
  const navigate = useNavigate();
  const [diseaseData, setDiseaseData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch disease records from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/getrecords")
      .then((response) => response.json())
      .then((data) => setDiseaseData(data))
      .catch((error) => console.error("Error fetching records:", error));
  }, []);

  // Handle Edit
  const handleEdit = (id) => {
    navigate(`/fdm-dRecordsEdit/${id}`);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/deleterecord/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setDiseaseData(diseaseData.filter((row) => row._id !== id));
        } else {
          console.error("Failed to delete the record");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  // Filter records based on search term
  const filteredData = diseaseData.filter((row) => {
    return Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Convert filtered data to CSV and download
  const downloadReport = () => {
    const headers = ["Found Date", "Disease Name","Spread Status", "Spread Area","Treatments", "Notes", "Status"];
    const rows = filteredData.map((row) => [
      new Date(row.foundDate).toISOString().split("T")[0],
      row.diseaseName,
      row.spreadStatus,
      row.spreadArea,
      row.treatments,
      row.notes,
      row.status,
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";

    rows.forEach((row) => {
      const escapedRow = row.map((value) =>
        `"${(value || "").toString().replace(/"/g, '""')}"`
      );
      csvContent += escapedRow.join(",") + "\n";
    });

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "disease_records_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Notify agricultural technician
  const handleNotifyAgriculturalTechnician = () => {
    navigate('/fdm-femail');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="p-6 bg-green-100 min-h-screen">
        <div className="max-w-8xl mx-auto bg-white p-6 shadow-lg rounded-lg border-2 border-green-500">
          <h2 className="text-xl font-bold text-green-700 mb-4">Disease Records</h2>

          {/* Search & Action Buttons */}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <div className="space-x-3">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => navigate("/fdm-dRecordsCreate")}
              >
                ➕ Add New Record
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                onClick={downloadReport}
                disabled={filteredData.length === 0} // Disable if no data to download
              >
                📥 Download Report
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                onClick={handleNotifyAgriculturalTechnician}
              >
                ✉️ Notify Agricultural Technician
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-green-400">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="p-2 border border-green-400">Found Date</th>
                  <th className="p-2 border border-green-400">Disease Name</th>
                  <th className="p-2 border border-green-400">Spread Status</th>
                  <th className="p-2 border border-green-400">Spread Area</th>
                  <th className="p-2 border border-green-400">Treatments (ROP NO)</th>
                  <th className="p-2 border border-green-400">Notes</th>
                  <th className="p-2 border border-green-400">Status</th>
                  <th className="p-2 border border-green-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row._id} className="text-center bg-green-50 hover:bg-green-200">
                    <td className="p-2 border border-green-400">
                      {new Date(row.foundDate).toISOString().split("T")[0]}
                    </td>
                    <td className="p-2 border border-green-400">{row.diseaseName}</td>
                    <td className="p-2 border border-green-400">{row.spreadStatus}</td>
                    <td className="p-2 border border-green-400">{row.spreadArea}</td>
                    <td className="p-2 border border-green-400">{row.treatments}</td>
                    <td className="p-2 border border-green-400">{row.notes}</td>
                    <td className="p-2 border border-green-400">{row.status}</td>
                    <td className="p-2 border border-green-400">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
                        onClick={() => handleEdit(row._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        onClick={() => handleDelete(row._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      No records found.
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

export default FDMdRecordsRead;

