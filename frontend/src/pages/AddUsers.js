import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/images/shrilanka-tea-estates.jpg";

const AddUsers = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    username: "",
    password: "",
    
  });

  //email validation
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const vaildateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const navigate = useNavigate();
  const Swal = require("sweetalert2");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    //email
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
      if (!vaildateEmail(value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //email
    if (!vaildateEmail(email)) {
      setEmailError("Invalid email");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire("User added successfully!");
        navigate("/admin-dashboard"); // Redirect to Admin Dashboard
      } else {
        Swal.fire("Failed to add user.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Add New User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            pattern="[A-Za-z\s]+"
            title="Only letters allowed" //validation
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          />
          <select
            name="role"
            placeholder="Role"
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          >
            <option value="" disabled selected>
              select a role
            </option>
            <option value="Owner">Owner</option>
            <option value="Estate manager">Estate manager</option>
            <option value="Inventory manager">Inventory manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Agricultural technician">
              Agricultural technician
            </option>
            <option value="Finance officer">Finance officer</option>
            <option value="Driver">Driver</option>
          </select>
          <input
            type="email"
            name="email"
            value={email}  /* editd */
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          />{" "}{emailError && (<p style={{ color: "red", fontSize: "14px" }}>{emailError}</p>)}{" "}    {/* edited */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            pattern="[A-Za-z\s]+" title="Only letters allowed" //add validation*
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$" // password validation for 5 characs, uppercase, lowercase & numbers
            title="Password should be atleast 5 characters. including atleast a one uppercase, lowercase letter and number."
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUsers;
