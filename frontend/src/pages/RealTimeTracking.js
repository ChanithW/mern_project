import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const RealTimeTracking = () => {
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const socketRef = useRef(null);

    useEffect(() => {
        // ✅ Use the correct WebSocket URL
        socketRef.current = io("http://localhost:4000");

        socketRef.current.on("connect", () => {
            console.log("✅ Connected to WebSocket server");
        });

        socketRef.current.on("updateLocations", (devices) => {
            console.log("📡 Received location update:", devices);
            for (let id in devices) {
                let { lat, lng } = devices[id];

                if (markersRef.current[id]) {
                    markersRef.current[id].setLatLng([lat, lng]);
                } else {
                    markersRef.current[id] = L.marker([lat, lng]).addTo(mapRef.current)
                        .bindPopup(`Device: ${id}`).openPopup();
                }
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map("map").setView([7.8731, 80.7718], 8);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapRef.current);
        }
    }, []);

    // ✅ Simulate sending location
    const sendLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    console.log("📍 Sending location:", position.coords.latitude, position.coords.longitude);
                    socketRef.current.emit("sendLocation", {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.error("⚠️ Error getting location:", error),
                { enableHighAccuracy: true }
            );
        } else {
            console.log("❌ Geolocation not supported.");
        }
    };

    useEffect(() => {
        sendLocation();
    }, []);

    return (
        <div>
            <h2>Real-Time Device Tracking</h2>
            <div id="map" style={{ height: "500px", width: "100%" }}></div>
        </div>
    );
};

export default RealTimeTracking;
