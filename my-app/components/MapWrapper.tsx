'use client';
import dynamic from 'next/dynamic';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Map } from 'leaflet';

const TripMap = dynamic(() => import('./TripMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
  ),
});

interface Activity {
  time: string;
  place: string;
  description: string;
  coordinates: [number, number];
  recommendations?: {
    name: string;
    type: string;
    coordinates: [number, number];
  }[];
}

interface MapWrapperProps {
  activities: Activity[];
  selectedActivity: Activity | null;
  onSelectActivity: (activity: Activity) => void;
  onDownloadItinerary?: () => void;
}

export default function MapWrapper({
  activities,
  selectedActivity,
  onSelectActivity,
  onDownloadItinerary,
}: MapWrapperProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const tripMapRef = useRef<{ getMap: () => Map | null }>(null);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const downloadMap = async () => {
    const mapDiv = mapContainerRef.current;
    if (!mapDiv) return;

    try {
      const canvas = await html2canvas(mapDiv, { useCORS: true });
      const link = document.createElement('a');
      link.download = 'trip-map.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to download map:', error);
      alert('Failed to download map. Please try again.');
    }
  };

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-[1000] h-full w-full'
    : 'relative w-full h-96';

  return (
    <>
      <div className="fixed top-4 right-4 z-[1100] flex gap-2">
        <button
          onClick={downloadMap}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg"
        >
          📷 Download Map
        </button>
        <button
          onClick={toggleFullscreen}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-lg"
        >
          {isFullscreen ? '✕ Exit Fullscreen' : '⛶ Fullscreen'}
        </button>
        {onDownloadItinerary && (
          <button
            onClick={onDownloadItinerary}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg"
          >
            ⬇️ Download Itinerary
          </button>
        )}
      </div>

      <div ref={mapContainerRef} className={containerClass}>
        <TripMap
          ref={tripMapRef}
          activities={activities}
          selectedActivity={selectedActivity}
          onSelectActivity={onSelectActivity}
          isFullscreen={isFullscreen}
          className="h-full w-full"
        />
      </div>
    </>
  );
}
