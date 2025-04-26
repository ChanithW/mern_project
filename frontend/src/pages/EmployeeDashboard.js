import React from "react";
import { useNavigate } from "react-router-dom";  // Import the useNavigate hook
import { Button, Card } from "flowbite-react";
import empImg from "../assets/images/employee.jpg";
import employeeImg from "../assets/images/research.png";
import harvestImg from "../assets/images/woman.png";
import catImg from "../assets/images/podium.png";
import Header from '../components/header';

const EmployeeDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col" >
    <Header />
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      {/* Title centered at the top */}
      <h1 className="text-4xl font-bold text-center">
        Employee Management Dashboard
      </h1>
      {/* Flexbox container for image and cards */}
      <div className="flex w-full justify-between items-start">
        {/* Left side image */}
        <div className="w-[900px]">
          <img
            src={empImg}
            alt="employee"
            className="w-[2400px] h-auto rounded-xl shadow-lg mt-20"
          />
        </div>

        {/* Right side content */}
        <div className="w-1/3 space-y-6 mt-20">
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
          <DashboardCard
            title="Employee Category"
            buttonText="Manage Categories"
            cardClass="border-green-500 bg-white-100"
            imgSrc={catImg}
            imgAlt="Category"
            navigateTo="/EmployeePerformance"
          />
        </div>
      </div>
    </div>
    </div>
  );
};

const DashboardCard = ({ title, buttonText, cardClass, imgSrc, imgAlt, navigateTo }) => {
  const navigate = useNavigate();  // Hook for navigation

  const handleButtonClick = () => {
    navigate(navigateTo);  // Navigate to the specified path
  };

  return (
    
    <Card className={`p-6 shadow-lg rounded-2xl text-center ${cardClass}`}>
      {/* Flex container to position image to the left of the text */}
      <div className="flex items-center space-x-4 mb-4">
        {/* Image to the left (increased size) */}
        <img
          src={imgSrc}
          alt={imgAlt}
          className="w-20 h-20 object-cover"
        />
        {/* Card title and button to the right */}
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button 
            className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white"
            onClick={handleButtonClick}  // Trigger navigate when button is clicked
          >
            {buttonText}
          </Button>
        </div>
      </div>
      
    </Card>
   
    
  );
};

export default EmployeeDashboard;
