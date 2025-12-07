'use client';
import dynamic from 'next/dynamic';

const TripMap = dynamic(() => import('./TripMap'), {
  ssr: false,
  loading: () => <div className="h-96 w-full rounded-lg bg-gray-700 animate-pulse" />
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
}

export default function MapWrapper({ activities, selectedActivity, onSelectActivity }: MapWrapperProps) {
  return (
    <TripMap
      activities={activities}
      selectedActivity={selectedActivity}
      onSelectActivity={onSelectActivity}
    />
  );
}