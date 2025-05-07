import React, { useState } from "react";
import WebcamCapture from "./WebcamCapture";
import jsQR from 'jsqr';
import axios from 'axios'; // Make sure to install axios: npm install axios

const QRScanner = () => {
    const [qrCode, setQrCode] = useState(null);
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const markAttendance = async (employeeData) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8000/attendance', {
                ...employeeData,
                status: 'present' // Default status
            });
            
            setAttendanceStatus({
                success: true,
                message: 'Attendance marked successfully!',
                data: response.data.attendance
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000); // 2000ms = 2 seconds
        } catch (error) {
            setAttendanceStatus({
                success: false,
                message: error.response?.data?.message || 'Failed to mark attendance',
                data: error.response?.data?.attendance || null
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000); // 2000ms = 2 seconds
        } finally {
            setLoading(false);
        }
    };

    const handleScan = (imageSrc) => {
        if (imageSrc) {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert"});
                
                if (code) {
                    setQrCode(code);
                    console.log("code: ", code);
                    
                    try {
                        // Parse the QR code data
                        const employeeData = JSON.parse(code.data);
                        
                        // Check if data contains required fields
                        if (employeeData && employeeData.name && employeeData.phoneNumber) {
                            // Call the markAttendance function with the parsed data
                            markAttendance(employeeData);
                        } else {
                            setAttendanceStatus({
                                success: false,
                                message: 'Invalid QR code data format',
                                data: null
                            });
                        }
                    } catch (error) {
                        setAttendanceStatus({
                            success: false,
                            message: 'Invalid QR code data',
                            data: null
                        });
                    }
                }
            }
        }
    }

    return (
        <div className="bg-white min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-green-100 rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 bg-green-600 text-white text-center">
                    <h2 className="text-xl font-bold">QR Code Scanner</h2>
                </div>
                <div className="p-4">
                    <WebcamCapture onScan={handleScan} />
                </div>
                {qrCode && (
                    <div className="p-4 bg-green-50 border-t border-green-100">
                        <p className="text-green-800 font-semibold text-center">
                            QR Code Detected: 
                            <span className="block mt-2 text-green-600 break-words">
                                {qrCode.data}
                            </span>
                        </p>
                    </div>
                )}
                
                {loading && (
                    <div className="p-4 bg-blue-50 border-t border-blue-100">
                        <p className="text-blue-800 text-center">Processing attendance...</p>
                    </div>
                )}
                
                {attendanceStatus && (
                    <div className={`p-4 ${attendanceStatus.success ? 'bg-green-50 border-t border-green-100' : 'bg-red-50 border-t border-red-100'}`}>
                        <p className={`${attendanceStatus.success ? 'text-green-800' : 'text-red-800'} font-semibold text-center`}>
                            {attendanceStatus.message}
                        </p>
                        {attendanceStatus.data && (
                            <div className="mt-2 text-sm">
                                <p>Name: {attendanceStatus.data.name}</p>
                                <p>Time: {new Date(attendanceStatus.data.checkInTime).toLocaleTimeString()}</p>
                                <p>Status: {attendanceStatus.data.status}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default QRScanner;