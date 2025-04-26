import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
//import bgImage from '../assets/images/shrilanka-tea-estates.jpg';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const Swal = require("sweetalert2");

  // Fetch users from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDeleteConfirmation = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(userId);
      }
    });
  };
  // Handle user deletion
  const handleDelete = (userId) => {
    axios
      .delete(`http://localhost:5000/api/users/${userId}`)
      .then(() => {
        setUsers(users.filter((user) => user._id !== userId));
        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted.",
          icon: "success",
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-green-200 p-6">
        <div className="flex flex-col items-center">
          <img
            src="https://th.bing.com/th/id/OIP.eU8MYLNMRBadK-YgTT6FJQHaHw?rs=1&pid=ImgDetMain"
            alt="Admin Avatar"
            className="w-24 h-24 rounded-full"
          />
          <h2 className="mt-3 text-3xl font-bold">Admin Dashboard</h2>
        </div>
        <div className="mt-6 space-y-4">
          <Button
            className="w-full bg-green-600 text-white w-full py-2 mt-4 hover:bg-green-700"
            color="gray"
            onClick={() => navigate("/")}
          >
            🏠 Home
          </Button>
          <Button
            className="w-full bg-green-600 text-white w-full py-2 mt-4 hover:bg-green-700"
            color="gray"
            onClick={() => navigate("/add-user")}
          >
            ➕ Add New User
          </Button>
          <Button
            className="w-full bg-red-600 text-white w-full py-2 mt-4 hover:bg-red-700"
            color="failure"
            onClick={() => navigate("/admin-login")}
          >
            🚪 Log Out
          </Button>
        </div>
      </div>

      <div className="w-3/4 p-6 bg-green-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-4">Welcome Admin</h2>
        <h2 className="text-2xl font-bold mb-4">Current users</h2>

        <table className="w-full border-collapse border border-black">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="border border-black p-2">Name</th>
              <th className="border border-black p-2">Role</th>
              <th className="border border-black p-2">Email</th>
              <th className="border border-black p-2">Username</th>
              <th className="border border-black p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="text-center border border-black bg-green-50 hover:bg-green-200"
                >
                  <td className="border border-black p-2">{user.name}</td>
                  <td className="border border-black p-2">{user.role}</td>
                  <td className="border border-black p-2">{user.email}</td>
                  <td className="border border-black p-2">{user.username}</td>
                  <td className="border border-black p-2">
                    <div className="flex justify-center space-x-2">
                      <Button
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        onClick={() => navigate(`/edit-user/${user._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDeleteConfirmation(user._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border border-black">
                <td
                  colSpan="5"
                  className="border border-black p-4 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
