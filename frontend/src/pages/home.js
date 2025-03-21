import React from 'react'
import { Button, Card } from 'flowbite-react';


function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-700 p-8">
    <div className="bg-white p-10 rounded-2xl shadow-xl max-w-4xl w-full flex">
      {/* Left Section */}
      <div className="w-1/2 pr-8 flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-black mb-4">TEA ESTATE MANAGEMENT SYSTEM</h1>
        <Button className="bg-green-500 text-white w-full py-2 mt-4" href="/admin-login">
          Admin Login Portal
        </Button>
      </div>

      {/* Right Section */}
      <Card className="w-1/2 bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <Button className="bg-green-500 text-white w-full py-2" href="/fertilization">Fertilization & Disease Management</Button>
          <Button className="bg-green-500 text-white w-full py-2" href="/inventory">Inventory Management</Button>
          <Button className="bg-green-500 text-white w-full py-2" href="/employees">Employee Management</Button>
          <Button className="bg-green-500 text-white w-full py-2" href="/orders">Order and Delivery Management</Button>
          <Button className="bg-green-500 text-white w-full py-2" href="/finance">Finance Management</Button>
        </div>
      </Card>
    </div>
  </div>
  )
}

export default Home
