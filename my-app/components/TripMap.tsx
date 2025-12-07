'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Activity {
  time: string;
  place: string;
  description: string;
  coordinates: [number, number];
}

interface TripMapProps {
  activities: Activity[];
}

export default function TripMap({ activities }: TripMapProps) {
  if (!activities || activities.length === 0) {
    return <div className="h-96 w-full rounded-lg bg-gray-100 flex items-center justify-center">No locations to display</div>;
  }

  const center = activities[0]?.coordinates || [0, 0];

  return (
    <MapContainer center={center} zoom={13} className="h-96 w-full rounded-lg">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {activities.map((activity, idx) => (
        <Marker key={idx} position={activity.coordinates} icon={icon}>
          <Popup>
            <strong>{activity.place}</strong>
            <p>{activity.time}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}