import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Card } from "flowbite-react";
import bgImage from '../assets/images/shrilanka-tea-estates.jpg';
import Header from '../components/header';

function FDM_Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Admin Login Attempt:", { username, password });
        // Redirect to admin dashboard (to be implemented)
        navigate("/");
    
        if (username === "chim" && password === "chim123") {
            navigate("/fdm-dashboard"); // Redirect to the admin dashboard
        } else {
            alert("Invalid username or password");
            navigate("/fdm-login"); // Redirect to the admin login page
        }
    };

  return (
    <div className="min-h-screen flex flex-col">
    <Header />
      <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <Card className="w-96 p-6">
          <h3 className="text-2xl font-bold text-center mb-4">Fertilization & Disease Management System</h3>
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" value="Username" />
              <TextInput
                id="username"
                type="text"
                placeholder="Enter username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" value="Password" />
              <TextInput
                id="password"
                type="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" gradientDuoTone="greenToBlue" className="bg-green-500 text-white w-full py-2 mt-4">
              Login
            </Button>
          </form>
        </Card>
      </div>
      </div>
    )
}

export default FDM_Login
