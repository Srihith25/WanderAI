'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { forwardRef, useImperativeHandle } from 'react';
import L, { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface Activity {
  time: string;
  place: string;
  description: string;
  coordinates: [number, number];
  recommendations?: any[];
}

export interface TripMapProps {
  activities: Activity[];
  selectedActivity: Activity | null;
  onSelectActivity: (activity: Activity) => void;
  isFullscreen: boolean;
  className?: string;
}

export interface TripMapRef {
  getMap: () => LeafletMap | null;
}

const TripMap = forwardRef<TripMapRef, TripMapProps>(
  ({ activities, selectedActivity, onSelectActivity, className }, ref) => {
    const defaultPosition: [number, number] =
      activities.length > 0 ? activities[0].coordinates : [40.7128, -74.0060];

    let mapInstance: LeafletMap | null = null;

    useImperativeHandle(ref, () => ({
      getMap: () => mapInstance,
    }));

    return (
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom
        className={className}
        ref={(map) => {
          if (map) mapInstance = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {activities.map((activity, idx) => (
          <Marker
            key={idx}
            position={activity.coordinates}
            eventHandlers={{
              click: () => onSelectActivity(activity),
            }}
          >
            <Popup>{activity.place}</Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  }
);

TripMap.displayName = 'TripMap';
export default TripMap;
