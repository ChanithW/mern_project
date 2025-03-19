import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const navigate = useNavigate();

  // Fetch users from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle user deletion
  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/api/users/${deleteUserId}`)
      .then(() => {
        setUsers(users.filter((user) => user._id !== deleteUserId));
        setOpenModal(false);
        alert("User deleted successfully!");
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
            className="w-full bg-green-500 text-black w-full py-2 mt-4"
            color="gray"
            onClick={() => navigate("/")}
          >
            🏠 Home
          </Button>
          <Button
            className="w-full bg-green-500 text-black w-full py-2 mt-4"
            color="gray"
            onClick={() => navigate("/add-user")}
          >
            ➕ Add New User
          </Button>
          <Button
            className="w-full bg-red-400 text-black w-full py-2 mt-4"
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
            <tr className="bg-green-200 border border-black">
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
                <tr key={user._id} className="text-center border border-black">
                  <td className="border border-black p-2">{user.name}</td>
                  <td className="border border-black p-2">{user.role}</td>
                  <td className="border border-black p-2">{user.email}</td>
                  <td className="border border-black p-2">{user.username}</td>
                  <td className="border border-black p-2">
                    <Button className="px-5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2" onClick={() => navigate(`/edit-user/${user._id}`)}>
                      Edit
                    </Button>
                    <Button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700" onClick={() => {
                        setDeleteUserId(user._id);
                        setOpenModal(true);
                      }}
                    >
                      Delete
                    </Button>
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

        {/* Delete Confirmation Modal */}
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Confirm Delete</Modal.Header>
          <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
          <Modal.Footer>
            <Button color="failure" onClick={handleDelete}>
              Yes, Delete
            </Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
