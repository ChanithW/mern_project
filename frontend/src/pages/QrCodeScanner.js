import React, { useState } from "react";
import WebcamCapture from "./WebcamCapture";
import jsQR from 'jsqr';

const QRScanner = () => {
    const [qrCode, setQrCode] = useState(null);

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
            </div>
        </div>
    );
}

export default QRScanner;