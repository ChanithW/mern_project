import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from '../assets/images/tealeaves.jpg';

function EMedit() {
  const { id } = useParams(); // get the emp id from url
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    empType: "",
    name: "",
    age: "",
    address: "",
    gender: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({
    empType: "",
    name: "",
    age: "",
    address: "",
    gender: "",
    phoneNumber: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch existing employee data
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/EMployee/${id}`);
        const fetchedEmployee = response.data.employee;
        setFormData(fetchedEmployee);

        // Validate the fetched data
        validateForm(fetchedEmployee);
      } catch (err) {
        console.error("Error fetching employee data", err);
      }
    };

    fetchEmployee();
  }, [id]);

  const validateForm = (data) => {
    let formIsValid = true;
    const newErrors = { ...errors };
  
    // Validate employee type
    if (!data.empType) {
      newErrors.empType = "Employee Type is required";
      formIsValid = false;
    } else {
      newErrors.empType = "";
    }
  
    // Validate name 
    if (!data.name || !/^[A-Za-z ]+$/.test(data.name)) {
      newErrors.name = "Name can only contain letters";
      formIsValid = false;
    } else {
      newErrors.name = "";
    }
  
    // Validate age 
    if (!data.age || !/^(?:[1-9][0-9]?|60)$/.test(data.age)) {
      newErrors.age = "Age must be between 18 and 60";
      formIsValid = false;
    } else {
      newErrors.age = "";
    }
  
    // Validate address 
    if (!data.address || !/^[A-Za-z0-9 /]+$/.test(data.address)) {
      newErrors.address = "Address can only contain letters, numbers, spaces, and '/'";
      formIsValid = false;
    } else {
      newErrors.address = "";
    }
  
    // Validate gender
    if (!data.gender) {
      newErrors.gender = "Gender is required";
      formIsValid = false;
    } else {
      newErrors.gender = "";
    }
  
    // Validate phone number 
    if (!data.phoneNumber || !/^0\d{9}$/.test(data.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must start with 0 and be exactly 10 digits";
      formIsValid = false;
    } else {
      newErrors.phoneNumber = "";
    }
  
    setErrors(newErrors);
    return formIsValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    try {
      await axios.put(`http://localhost:5000/EMployee/${id}`, formData);
      setMessage("Employee updated successfully!");
      setTimeout(() => navigate("/EMview"), 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error("Error updating employee", err);
      setMessage("Error updating employee. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-10 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md bg-opacity-80 ">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Edit Employee
        </h2>

        {message && (
          <div className={`p-4 mb-4 rounded-md ${message.includes("Error") ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <div>
            <label className="block text-gray-600">Employee Type</label>
            <input
              type="text"
              name="empType"
              readOnly
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.empType && <span className="text-red-500 text-sm">{errors.empType}</span>}
          </div> */}
          <div>
            <label className="block text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
          </div>
          <div>
            <label className="block text-gray-600">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.age && <span className="text-red-500 text-sm">{errors.age}</span>}
          </div>
          <div>
            <label className="block text-gray-600">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
          </div>
          <div>
            <label className="block text-gray-600">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
          </div>
          <div>
            <label className="block text-gray-600">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber}</span>}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/EMview")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Save Changes 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EMedit;
