import React from "react";
import { Button, Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/images/shrilanka-tea-estates.jpg";
import Header from "../components/header";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div
        className="flex flex-1 items-center justify-center p-8 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-4xl w-full flex">
          {/* Left Section */}
          <div className="w-1/2 pr-8 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-black mb-4">
              TEA ESTATE MANAGEMENT SYSTEM
            </h1>
            <Button
              className="bg-green-500 text-white w-full py-2 mt-4"
              onClick={() => navigate("/admin-login")}
              gradientDuoTone="greenToBlue"
            >
              Admin Login Portal
            </Button>
          </div>

          {/* Right Section */}
          <Card className="w-1/2 bg-gray-100 border-green-500 p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <Button
                className="bg-green-500 text-white w-full py-2"
                href="/fdm-login"
              >
                Fertilization & Disease Management
              </Button>
              <Button
                className="bg-green-500 text-white w-full py-2"
                onClick={() => navigate("/IMLogin")}
              >
                Inventory Management
              </Button>
              <Button
                className="bg-green-500 text-white w-full py-2"
                onClick={() => navigate("/EMlogin")}
              >
                Employee Management
              </Button>
              <Button
                className="bg-green-500 text-white w-full py-2"
                onClick={() => navigate("/ODMdriverlogin")}
              >
                Order and Delivery Management
              </Button>
              <Button
                className="bg-green-500 text-white w-full py-2"
                href="/finance-login"
              >
                Finance Management
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
