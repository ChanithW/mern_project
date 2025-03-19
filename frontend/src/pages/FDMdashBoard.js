import React from 'react'
import bgImage from '../assets/images/shrilanka-tea-estates.jpg';
import { useNavigate } from "react-router-dom";
import Header from '../components/header';

function FDMdashBoard() {

const navigate = useNavigate();

  return (

    <div className="min-h-screen flex flex-col">
    <Header />
          <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
    
      {/* Rounded Rectangle */}
      <div className="bg-white shadow-lg rounded-2xl p-10 w-96 border-2 border-green-500">
        <h2 className="text-xl font-bold text-green-700 text-center mb-4">Fertilization & Disease Management</h2>

        {/* Buttons */}
        <div className="flex flex-col space-y-3">
          <button className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md" href="/fdm-scheduleRead" onClick={() => navigate("/fdm-scheduleRead")}>
            Fertilization Records
          </button>
          <button className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md" href="/fdm-drecordsRead" onClick={() => navigate("/fdm-drecordsRead")}>
            Disease Records
          </button>
          <button className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md">
            Annual Fertilization Schedule Calculator
          </button>
          <button className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md">
            Disease & Treatments
          </button>
        </div>
      </div>
  
    </div>
    </div>
  )
}

export default FDMdashBoard
