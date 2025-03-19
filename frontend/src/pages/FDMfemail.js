// src/pages/FDMfemail.js

import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/header';

function FDMfemail() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [supervisorEmail, setSupervisorEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailData = {
      subject: subject,
      message: message,
      supervisorEmail: supervisorEmail,
    };

    try {
      // Send POST request to the backend to send the email
      await axios.post('http://localhost:3000/send-email', emailData);
      alert('Email sent successfully!');
      setSubject('');
      setMessage('');
      setSupervisorEmail('');
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Failed to send email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
    <Header />
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-100 p-8">
      <div className="bg-white p-10 rounded-2xl border-2 border-green-600 shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Send Email to Supervisor</h2>
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
            <label className="block text-sm font-medium text-black">Supervisor's Email</label>
            <input
              type="email"
              value={supervisorEmail}
              onChange={(e) => setSupervisorEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-bold rounded-lg ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? 'Sending...' : 'Send Email'}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default FDMfemail;
