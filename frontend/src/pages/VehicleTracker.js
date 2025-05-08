import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const API_URL = 'http://localhost:5000';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom red marker for current location
const redMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom truck icon for vehicles
const truckIcon = L.divIcon({
  className: 'custom-truck-icon',
  html: `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="#2196F3">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

// Sri Lanka's approximate center coordinates
const SRI_LANKA_CENTER = [7.8731, 80.7718];

// Map component to handle position updates
function MapUpdater({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && map) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
}

function VehicleTracker() {
  const [vehicleId, setVehicleId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [socket, setSocket] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [status, setStatus] = useState('');
  const [vehicles, setVehicles] = useState({});
  const [mapCenter, setMapCenter] = useState(SRI_LANKA_CENTER);
  const [mapZoom, setMapZoom] = useState(8);

  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    // Get current location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(newLocation);
          setMapCenter([newLocation.lat, newLocation.lng]);
          setMapZoom(15);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Listen for location updates from other vehicles
    newSocket.on('locationUpdate', (data) => {
      setVehicles(prevVehicles => ({
        ...prevVehicles,
        [data.vehicleId]: {
          ...prevVehicles[data.vehicleId],
          lastLocation: data.location
        }
      }));
    });

    return () => {
      newSocket.disconnect();
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const startTracking = async () => {
    if (!vehicleId) {
      setStatus('Please enter a vehicle ID');
      return;
    }

    try {
      // Register vehicle if it doesn't exist
      await axios.post(`${API_URL}/api/vehicles`, { vehicleId });
      
      // Start watching position
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed, heading } = position.coords;
          const newLocation = { 
            lat: latitude, 
            lng: longitude,
            speed: speed || 0,
            heading: heading || 0
          };
          setCurrentLocation(newLocation);
          setMapCenter([latitude, longitude]);
          setMapZoom(15);
          
          // Send location update through WebSocket
          socket.emit('updateLocation', {
            vehicleId,
            lat: latitude,
            lng: longitude,
            speed: speed || 0,
            heading: heading || 0,
            timestamp: new Date()
          });

          setStatus('Tracking active');
        },
        (error) => {
          console.error('Error getting location:', error);
          setStatus('Error getting location. Please check your location permissions.');
          stopTracking();
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );
      
      setWatchId(id);
      setIsTracking(true);
    } catch (error) {
      console.error('Error starting tracking:', error);
      setStatus('Error starting tracking. Please try again.');
    }
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    setCurrentLocation(null);
    setStatus('Tracking stopped');
  };

  return (
    <div className="vehicle-tracker">
      <div className="tracker-header">
        <h1>Vehicle Tracking System</h1>
        <div className="tracking-controls">
          <div className="vehicle-id-input">
            <input
              type="text"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              placeholder="Enter Vehicle ID"
              disabled={isTracking}
            />
            <button
              onClick={isTracking ? stopTracking : startTracking}
              className={isTracking ? 'stop' : 'start'}
            >
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </button>
          </div>
          {status && <div className="status-message">{status}</div>}
        </div>
      </div>

      <div className="map-section">
        <div className="tracker-map">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '70vh', width: '100%' }}
            whenCreated={(map) => {
              map.setView(mapCenter, mapZoom);
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapUpdater center={mapCenter} zoom={mapZoom} />
            
            {/* Current Location Marker */}
            {currentLocation && (
              <Marker
                position={[currentLocation.lat, currentLocation.lng]}
                icon={redMarkerIcon}
              >
                <Popup>
                  <div>
                    <h3>Your Current Location</h3>
                    <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
                    <p>Longitude: {currentLocation.lng.toFixed(6)}</p>
                    <p>Speed: {currentLocation.speed ? `${(currentLocation.speed * 3.6).toFixed(1)} km/h` : 'N/A'}</p>
                    <p>Heading: {currentLocation.heading ? `${currentLocation.heading.toFixed(1)}°` : 'N/A'}</p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Vehicle Markers */}
            {Object.entries(vehicles).map(([id, vehicle]) => (
              vehicle.lastLocation && (
                <Marker
                  key={id}
                  position={[vehicle.lastLocation.lat, vehicle.lastLocation.lng]}
                  icon={truckIcon}
                >
                  <Popup>
                    <div>
                      <h3>Vehicle ID: {id}</h3>
                      <p>Last Updated: {new Date(vehicle.lastLocation.timestamp).toLocaleString()}</p>
                      <p>Location: {vehicle.lastLocation.lat.toFixed(6)}, {vehicle.lastLocation.lng.toFixed(6)}</p>
                      {vehicle.lastLocation.speed && (
                        <p>Speed: {(vehicle.lastLocation.speed * 3.6).toFixed(1)} km/h</p>
                      )}
                      {vehicle.lastLocation.heading && (
                        <p>Heading: {vehicle.lastLocation.heading.toFixed(1)}°</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>

        {currentLocation && isTracking && (
          <div className="location-info">
            <h3>Current Status</h3>
            <p>Vehicle ID: {vehicleId}</p>
            <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
            <p>Longitude: {currentLocation.lng.toFixed(6)}</p>
            <p>Speed: {currentLocation.speed ? `${(currentLocation.speed * 3.6).toFixed(1)} km/h` : 'N/A'}</p>
            <p>Heading: {currentLocation.heading ? `${currentLocation.heading.toFixed(1)}°` : 'N/A'}</p>
            <p>Last Updated: {new Date().toLocaleTimeString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VehicleTracker; 


