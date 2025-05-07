import React from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { Button, Card } from "flowbite-react";
import empImg from "../assets/images/employee.jpg";
import employeeImg from "../assets/images/research.png";
import harvestImg from "../assets/images/woman.png";
import catImg from "../assets/images/podium.png";
import Header from '../components/header';

const EmployeeDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
        {/* Title centered at the top */}
        <h1 className="text-4xl font-bold text-center mb-10">
          Employee Management Dashboard
        </h1>
        {/* Flexbox container for image and cards */}
        <div className="flex w-full justify-between items-start">
          {/* Left side image */}
          <div className="w-[900px] mr-10">
            <img
              src={empImg}
              alt="employee"
              className="w-full h-auto rounded-xl shadow-lg mt-20"
            />
          </div>

          {/* Right side content */}
          <div className="w-1/2 mt-20 space-y-6">
            <div className="flex flex-wrap justify-between space-x-4">
              {/* First row with two cards */}
              <DashboardCard
                title="Employee Overview"
                buttonText="Go to Overview"
                cardClass="border-green-500 bg-white-100"
                imgSrc={employeeImg}
                imgAlt="Employee"
                navigateTo="/EMview"
              />
              <DashboardCard
                title="Daily Harvest Overview"
                buttonText="View Harvest"
                cardClass="border-green-500 bg-white-100"
                imgSrc={harvestImg}
                imgAlt="Harvest"
                navigateTo="/TeaPluckingTable"
              />
            </div>
            <div className="flex flex-wrap justify-between space-x-4">
              {/* Second row with two cards */}
              <DashboardCard
                title="Employee Category"
                buttonText="Manage Categories"
                cardClass="border-green-500 bg-white-100"
                imgSrc={catImg}
                imgAlt="Category"
                navigateTo="/EmployeePerformance"
              />
              <DashboardCard
                title="Employee Attendance"
                buttonText="View Attendance"
                cardClass="border-green-500 bg-white-100"
                imgSrc={catImg}
                imgAlt="Performance"
                navigateTo="/EmAttendance"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, buttonText, cardClass, imgSrc, imgAlt, navigateTo }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleButtonClick = () => {
    navigate(navigateTo); // Navigate to the specified path
  };

  return (
    <Card className={`p-4 shadow-lg rounded-xl text-center ${cardClass}`}>
      {/* Flex container to improve balance */}
      <div className="flex flex-col items-center space-y-4">
        {/* Image centered and larger */}
        <img
          src={imgSrc}
          alt={imgAlt}
          className="w-24 h-24 object-cover rounded-full shadow-md"
        />
        {/* Card title styled for emphasis */}
        <h2 className="text-lg font-bold text-gray-700">{title}</h2>
        <Button
          className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          onClick={handleButtonClick} // Trigger navigate when button is clicked
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};

export default EmployeeDashboard;
