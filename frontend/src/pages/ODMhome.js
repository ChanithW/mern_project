import React from 'react'
import { Button, Card } from 'flowbite-react';
import { useNavigate } from "react-router-dom";
import bgImage from '../assets/images/shrilanka-tea-estates.jpg';


function Home() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
    <div className="bg-white p-10 rounded-2xl shadow-xl max-w-4xl w-full flex">
      {/* Left Section */}
      <div className="w-1/2 pr-8 flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-black mb-4">ORDER & DELIVERY MANAGEMENT SYSTEM</h1>
      </div>

      {/* Right Section */}
      <Card className="w-1/2 bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <Button className="bg-green-500 text-white w-full py-2" onClick={() => navigate("/ODMview")}>Delivery Records</Button>
          <Button className="bg-green-500 text-white w-full py-2" onClick={() => navigate("/ODinsert")}>Add New Delivery Records</Button>
          <Button className="bg-green-500 text-white w-full py-2" onClick={() => navigate("/ODMtracker")}>Track Delivery Vehicle</Button>
        </div>
      </Card>
    </div>
  </div>
  )
}

export default Home
