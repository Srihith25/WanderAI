'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface TripMapProps {
  activities: any[];
  selectedActivity: any;
  onSelectActivity: (a: any) => void;
  isFullscreen: boolean;
  className?: string;
}

const TripMap = forwardRef(({ activities, selectedActivity, onSelectActivity, className }: TripMapProps, ref) => {
  const defaultPosition: [number, number] =
    activities.length > 0 ? activities[0].coordinates : [40.7128, -74.0060];

  const map = useMap();

  useImperativeHandle(ref, () => ({
    getMap: () => map,
  }));

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom
        className={className}
      >
        <TileLayer
          attribution="&copy; Stadia Maps"
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png?api_key=YOUR_API_KEY"
        />

        {activities.map((activity, idx) => (
          <Marker
            key={idx}
            position={activity.coordinates}
          >
            <Popup>{activity.place}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
});

TripMap.displayName = 'TripMap';
export default TripMap;
