import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const FMDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);

  // Fetch the record details
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/finance/${id}`)
      .then((res) => setRecord(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // Handle delete request
  const handleDelete = () => {
    axios
      .delete(`http://localhost:8000/api/finance/${id}`)
      .then(() => {
        alert("Deleted!", "Your record has been deleted.", "success");
        navigate("/finance-dashboard");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6 bg-green-100 min-h-screen flex flex-col items-center justify-center">
      {record ? (
        <div className="bg-white p-6 rounded shadow-md w-96 text-center shadow-lg rounded-lg border-2 border-green-500">
          <h2 className="text-3xl font-bold mb-4 text-center">Delete Record</h2>
          <p className="mb-4 text-lg">
            Are you sure you want to delete this record?
          </p>
          <p>
            <strong>Date:</strong> {record.date}
          </p>
          <p>
            <strong>Name:</strong> {record.name}
          </p>
          <p>
            <strong>Type:</strong> {record.type}
          </p>
          <p>
            <strong>Value:</strong> {record.value}
          </p>
          <p>
            <strong>Image:</strong>
            {record.image ? (
              <div className="mt-2">
                <img
                  src={`http://localhost:8000${record.image}`}
                  alt="Transaction"
                  className="w-32 h-32 object-cover mx-auto"
                />
              </div>
            ) : (
              <span className="block mt-2"> No image available</span>
            )}
          </p>

          <div className="mt-4 flex justify-between">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={handleDelete}
            >
              Yes, Delete
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={() => navigate("/finance-dashboard")}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (<p>Loading record details...</p>)}
    </div>
  );
};

export default FMDelete;
