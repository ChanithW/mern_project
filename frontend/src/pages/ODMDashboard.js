import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "flowbite-react";

const OrderDeliveryDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      {/* Title centered at the top */}
      <h1 className="text-4xl font-bold text-center">
        Order & Delivery Management
      </h1>
      {/* Flexbox container for cards */}
      <div className="w-1/3 space-y-6 mt-20">
        <DashboardCard
          title="Delivery Records"
          buttonText="View Records"
          cardClass="border-blue-500 bg-white-100"
          navigateTo="/ODMview"
        />
        <DashboardCard
          title="Add New Delivery Record"
          buttonText="Add Record"
          cardClass="border-blue-500 bg-white-100"
          navigateTo="/ODinsert"
        />
        <DashboardCard
          title="Track Delivery Vehicle"
          buttonText="Track Vehicle"
          cardClass="border-blue-500 bg-white-100"
          navigateTo="/ODMtracker"
        />
      </div>
    </div>
  );
};

const DashboardCard = ({ title, buttonText, cardClass, navigateTo }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(navigateTo);
  };

  return (
    <Card className={`p-6 shadow-lg rounded-2xl text-center ${cardClass}`}>
      {/* Card title and button */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button 
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleButtonClick} 
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};

export default OrderDeliveryDashboard;