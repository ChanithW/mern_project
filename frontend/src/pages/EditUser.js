import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bgImage from '../assets/images/shrilanka-tea-estates.jpg';

const EditUser = () => {
  const { id } = useParams(); // Get user ID from URL
  const navigate = useNavigate();
  const Swal = require("sweetalert2");
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    username: "",
    password: "",
    
  });

  // Fetch user data by ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`);
        const data = await response.json();
        if (response.ok) {
          setFormData(data);
        } else {
          alert("User not found!");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire("User updated successfully!");
        navigate("/admin-dashboard");
      } else {
        Swal.fire("Failed to update user.");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
            required
          >
            <option value="" disabled selected>select a role</option>
            <option value="Owner">Owner</option>
            <option value="Estate manager">Estate manager</option>
            <option value="Inventory manager">Inventory manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Agricultural technician">Agricultural technician</option>
            <option value="Finance officer">Finance officer</option>
            <option value="Driver">Driver</option>
          </select>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="New Password (Leave blank if unchanged)"
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
            onChange={handleChange}
          />
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
