import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
import { Button, Card, Alert } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

function AttendanceScanner() {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceInfo, setAttendanceInfo] = useState({
    employeeId: '',
    name: '',
    phoneNumber: '',
    checkInTime: '',
    status: ''
  });

  const handleScan = async (data) => {
    if (data && !scanResult) {
      setScanning(false);
      setScanResult(data);
      
      try {
        // Parse the QR code data
        const parsedData = JSON.parse(data);
        
        // Prepare attendance data
        const attendanceData = {
          employeeId: parsedData.employeeId,
          name: parsedData.name,
          phoneNumber: parsedData.phoneNumber,
          checkInTime: new Date().toISOString(),
          status: 'present'
        };
        
        setAttendanceInfo(attendanceData);
        
        // Send attendance data to your API
        const response = await axios.post('http://localhost:8000/attendance', attendanceData);
        
        if (response.status === 200 || response.status === 201) {
          setAttendanceMarked(true);
        } else {
          setError('Failed to mark attendance. Please try again.');
        }
      } catch (error) {
        console.error('Error marking attendance:', error);
        setError('Error processing QR code or marking attendance.');
      }
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner Error:', err);
    setError('Error accessing camera. Please check permissions and try again.');
  };

  const resetScanner = () => {
    setScanResult(null);
    setAttendanceMarked(false);
    setError(null);
    setScanning(true);
  };

  const navigateToAttendanceList = () => {
    navigate('/attendance-list');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Attendance Scanner</h2>
        
        {error && (
          <Alert color="failure" className="mb-4">
            <span className="font-medium">Error!</span> {error}
          </Alert>
        )}
        
        {scanning && !scanResult && (
          <div className="mb-4">
            <p className="text-center mb-2">Please scan employee QR code</p>
            <div className="qr-reader-container">
              <QrReader
                constraints={{ facingMode: 'environment' }}
                onResult={(result) => {
                  if (result) {
                    handleScan(result.text);
                  }
                }}
                onError={handleError}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
        
        {scanResult && !error && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Scan Result:</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Employee ID:</span> {attendanceInfo.employeeId}</p>
                <p><span className="font-medium">Name:</span> {attendanceInfo.name}</p>
                <p><span className="font-medium">Phone:</span> {attendanceInfo.phoneNumber}</p>
                <p><span className="font-medium">Time:</span> {new Date(attendanceInfo.checkInTime).toLocaleString()}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className="text-green-600 font-medium"> {attendanceMarked ? 'Attendance Marked' : 'Processing...'}</span>
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button onClick={resetScanner} gradientDuoTone="purpleToBlue" className="w-1/2">
                Scan Again
              </Button>
              <Button onClick={navigateToAttendanceList} gradientDuoTone="greenToBlue" className="w-1/2">
                View Attendance
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default AttendanceScanner;