import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({ onScan }) => {
    const webcamRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            capture();
        }, 500);
        return () => clearInterval(timer);
    }, []);

    const videoConstraints = {
        width: 500,
        height: 500,
        facingMode: "environment"
    };

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        onScan(imageSrc);
    }

    return (
        <div className="w-full rounded-lg overflow-hidden border-4 border-green-600">
            <Webcam
                className="w-full h-auto"
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onClick={() => capture()}
            />
        </div>
    );
}

export default WebcamCapture;