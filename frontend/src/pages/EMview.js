import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from '../components/header';

function EMview() {
  const [employee, setEmployee] = useState([]);
  const [searchName, setSearchName] = useState(""); 
  const [empTypeFilter, setEmpTypeFilter] = useState("all"); // New state for employee type filter
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/EMployee");
        setEmployee(response.data.employee);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/EMployee/${id}`);
        const response = await axios.get("http://localhost:8000/EMployee");
        setEmployee(response.data.employee);
      } catch (err) {
        console.error("Error deleting record", err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/EMedit/${id}`);
  };

  const handleAddEmployee = () => {
    navigate("/EMregister");
  };

  // Filter employees based on search query and employee type
  const filteredEmployees = employee.filter((emp) => 
    // Name filter
    emp.name.toLowerCase().includes(searchName.toLowerCase()) &&
    // Employee type filter
    (empTypeFilter === "all" || emp.empType.toLowerCase() === empTypeFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col" >
    <Header />
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10 space-y-6">
      <h1 className="text-4xl font-bold text-center">Employee Details</h1>
      <div className="w-full max-w-6xl mt-50">
        {/* Header with Search, Add Button, and Employee Type Filter */}
        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={handleAddEmployee}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Add New Employee
          </button> 

          <div className="flex items-center space-x-4">
            {/* Employee Type Dropdown Filter */}
            <select
              value={empTypeFilter}
              onChange={(e) => setEmpTypeFilter(e.target.value)}
              className="border-2 border-green-100 rounded-lg px-4 py-2"
            >
              <option value="all">All Employee Types</option>
              <option value="permanent">Permanent</option>
              <option value="non_permanent">Non-Permanent</option>
            </select>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by name..."
              className="border-2 border-green-100 rounded-lg px-4 py-2 w-64"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-800 overflow-y-auto border-green-500">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="sticky top-0 text-gray-700 bg-gray-200">
              <tr>
                <th className="px-6 py-3">Employee Type</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Age</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">Gender</th>
                <th className="px-6 py-3">Phone Number</th>
                <th className="px-6 py-3">Action</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="border-b">
                    <td className="px-6 py-4">{emp.empType}</td>
                    <td className="px-6 py-4">{emp.name}</td>
                    <td className="px-6 py-4">{emp.age}</td>
                    <td className="px-6 py-4">{emp.address}</td>
                    <td className="px-6 py-4">{emp.gender}</td>
                    <td className="px-6 py-4">{emp.phoneNumber}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(emp._id)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
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

export default EMview;