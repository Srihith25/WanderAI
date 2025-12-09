'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface TripMapProps {
  activities: { coordinates: [number, number]; place: string }[];
  className?: string;
}

const TripMap = forwardRef<{ getMap: () => LeafletMap | null }, TripMapProps>(
  ({ activities, className }: TripMapProps, ref) => {
    const defaultPosition: [number, number] =
      activities.length > 0 ? activities[0].coordinates : [40.7128, -74.0060];

    const mapRef = useRef<LeafletMap | null>(null);

    useImperativeHandle(ref, () => ({
      getMap: () => mapRef.current,
    }));

    return (
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={className}
        ref={(map) => {
          // Store the map instance in the ref
          if (map) mapRef.current = map;
        }}
      >
        <TileLayer
          attribution="&copy; Stadia Maps"
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png?api_key=YOUR_API_KEY"
        />

        {activities.map((activity, idx) => (
          <Marker key={idx} position={activity.coordinates}>
            <Popup>{activity.place}</Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  }
);

TripMap.displayName = 'TripMap';
export default TripMap;
