// src/pages/FDMfemail.js

import React, { useState } from 'react';
import Header from '../components/header';

function FDMfemail() {
  const [subject, setSubject] = useState('New fertilization schedule released'); // Pre-filled Subject
  const [message, setMessage] = useState('Check new fertilization schedule');   // Pre-filled Message
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation for WhatsApp number
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(whatsappNumber)) {
      setError('Please enter a valid 10-digit WhatsApp number starting with 0.');
      return;
    }

    // Convert number to international format (example: 0712345678 -> 94712345678)
    const formattedNumber = '94' + whatsappNumber.slice(1);

    // Create WhatsApp message URL with subject in bold
    const url = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(`*${subject}*\n\n${message}`)}`;

    // Open WhatsApp Web
    window.open(url, '_blank');

    // Clear the form
    setSubject('new fertilization schedule released');
    setMessage('Check new fertilization schedule');
    setWhatsappNumber('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="min-h-screen flex flex-col justify-center items-center bg-green-100 p-8">
        <div className="bg-white p-10 rounded-2xl border-2 border-green-600 shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Send WhatsApp Message to Supervisor/ Agricultural Technician</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Supervisor's WhatsApp Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                required
                maxLength="10"
                placeholder="0XXXXXXXXX"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <small className="text-gray-500">Enter a 10-digit number starting with 0</small>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 text-white font-bold rounded-lg bg-green-600 hover:bg-green-700"
            >
              Send WhatsApp Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FDMfemail;




