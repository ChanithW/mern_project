import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { v4 as uuidv4 } from "uuid";

// Optional custom icon for own location
const selfIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png", // A simple marker icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const RealTimeTracking = () => {
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);
  const deviceId = useRef(uuidv4());

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([7.8731, 80.7718], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Connect to WebSocket and handle location updates
  useEffect(() => {
    socketRef.current = io("http://localhost:4000");

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to WebSocket server");
    });

    socketRef.current.on("updateLocations", (devices) => {
      console.log("📡 Received locations:", devices);

      // Remove markers not in latest update
      for (let id in markersRef.current) {
        if (!devices[id]) {
          mapRef.current.removeLayer(markersRef.current[id]);
          delete markersRef.current[id];
        }
      }

      // Update/Add all devices (including self for now)
      for (let id in devices) {
        const { lat, lng } = devices[id];

        if (markersRef.current[id]) {
          markersRef.current[id].setLatLng([lat, lng]);
        } else {
          const marker = L.marker([lat, lng], {
            icon: id === deviceId.current ? selfIcon : undefined,
          })
            .addTo(mapRef.current)
            .bindPopup(`Device: ${id === deviceId.current ? "You" : id}`);
          
          markersRef.current[id] = marker;
        }
      }
    });

    return () => {
      socketRef.current.disconnect();
      console.log("🔌 Disconnected from WebSocket server");
    };
  }, []);

  // Geolocation tracking
  useEffect(() => {
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("📍 Sending location:", latitude, longitude);

          socketRef.current.emit("sendLocation", {
            id: deviceId.current,
            lat: latitude,
            lng: longitude,
          });
        },
        (error) => {
          console.error("⚠️ Geolocation error:", error);
          if (error.code === error.PERMISSION_DENIED) {
            alert("Location access denied. Please enable it to track.");
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
        }
      );
    } else {
      console.log("❌ Geolocation not supported.");
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        console.log("🛑 Cleared geolocation watch.");
      }
    };
  }, []);

  return (
    <div>
      <h2>Real-Time Device Tracking</h2>
      <div id="map" style={{ height: "500px", width: "100%" }}></div>
    </div>
  );
};

export default RealTimeTracking;
