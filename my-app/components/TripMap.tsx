'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Custom icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selectedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const recommendationIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [20, 33],
  iconAnchor: [10, 33],
});

interface Activity {
  time: string;
  place: string;
  description: string;
  coordinates: [number, number];
  recommendations?: Recommendation[];
}

interface Recommendation {
  name: string;
  type: string;
  coordinates: [number, number];
}

interface TripMapProps {
  activities: Activity[];
  selectedActivity: Activity | null;
  onSelectActivity: (activity: Activity) => void;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export default function TripMap({ activities, selectedActivity, onSelectActivity }: TripMapProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="h-96 w-full rounded-lg bg-gray-700 flex items-center justify-center text-gray-400">
        Generate an itinerary to see locations on the map
      </div>
    );
  }

  const center = selectedActivity?.coordinates || activities[0]?.coordinates || [0, 0];

  return (
    <MapContainer center={center} zoom={14} className="h-96 w-full rounded-lg">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      <MapController center={center} />
      
      {/* Activity markers */}
      {activities.map((activity, idx) => (
        <Marker
          key={`activity-${idx}`}
          position={activity.coordinates}
          icon={selectedActivity === activity ? selectedIcon : defaultIcon}
          eventHandlers={{
            click: () => onSelectActivity(activity),
          }}
        >
          <Popup>
            <div className="text-gray-900">
              <strong>{activity.place}</strong>
              <p className="text-sm">{activity.time}</p>
              <p className="text-sm">{activity.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Recommendation markers */}
      {selectedActivity?.recommendations?.map((rec, idx) => (
        <Marker
          key={`rec-${idx}`}
          position={rec.coordinates}
          icon={recommendationIcon}
        >
          <Popup>
            <div className="text-gray-900">
              <strong>{rec.name}</strong>
              <p className="text-sm text-blue-600">{rec.type}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}