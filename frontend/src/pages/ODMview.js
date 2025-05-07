import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from '../components/header';

function ODMview() {
  const [deliveries, setDeliveries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/drive");
        setDeliveries(response.data.drive);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/drive/${id}`);
        setDeliveries(deliveries.filter((delivery) => delivery._id !== id));
      } catch (err) {
        console.error("Error deleting record", err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/ODMedit/${id}`);
  };

  const handleAddDelivery = () => {
    navigate("/ODinsert");
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesDate = searchDate ? (delivery.TripDate || "").startsWith(searchDate) : true;
    const matchesID = searchQuery ? (delivery.DeliveryID || "").toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesDate && matchesID;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10 space-y-6">
        <div className="w-full max-w-16xl">
          {/* 🔹 Filter Section */}
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={handleAddDelivery}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Add New Delivery Record
            </button>

            {/* 🔹 Search by Delivery ID */}
            <input
              type="text"
              placeholder="Search by Delivery ID..."
              className="border rounded-lg px-4 py-2 w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* 🔹 Filter by Trip Date */}
            <input
              type="date"
              className="border rounded-lg px-4 py-2 w-1/3"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>

          {/* Table to display records */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-800 overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="sticky top-0 bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-3">Delivery ID</th>
                  <th className="px-6 py-3">Trip Date</th>
                  <th className="px-6 py-3">Departure Time</th>
                  <th className="px-6 py-3">Vehicle Number</th>
                  <th className="px-6 py-3">Stock ID</th>
                  <th className="px-6 py-3">Factory Location</th>
                  <th className="px-6 py-3">Estimated Arrival Time</th>
                  <th className="px-6 py-3">Actual Arrival Time</th>
                  <th className="px-6 py-3">Delivery Status</th>
                  <th className="px-6 py-3">Delivery Notes</th>
                  <th className="px-6 py-3">Traveled Distance</th>
                  <th className="px-6 py-3">Fuel Consumption</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((delivery) => (
                    <tr key={delivery._id} className="border-b">
                      <td className="px-6 py-4">{delivery.DeliveryID}</td>
                      <td className="px-6 py-4">{new Date(delivery.TripDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{delivery.DepartureTime}</td>
                      <td className="px-6 py-4">{delivery.VehicleNumber}</td>
                      <td className="px-6 py-4">{delivery.StockID}</td>
                      <td className="px-6 py-4">{delivery.FactoryLocation}</td>
                      <td className="px-6 py-4">{delivery.EstimatedArrivalTime}</td>
                      <td className="px-6 py-4">{delivery.ActualArrivalTime}</td>
                      <td className="px-6 py-4">{delivery.Deliverystatus}</td>
                      <td className="px-6 py-4">{delivery.DeliveryNotes}</td>
                      <td className="px-6 py-4">{delivery.TraveledDistance}</td>
                      <td className="px-6 py-4">{delivery.FuelConsumption}</td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => handleEdit(delivery._id)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(delivery._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="px-6 py-4 text-center text-gray-500">
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

export default ODMview;
