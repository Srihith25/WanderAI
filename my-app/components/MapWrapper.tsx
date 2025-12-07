'use client';
import dynamic from 'next/dynamic';

const TripMap = dynamic(() => import('./TripMap'), {
  ssr: false,
  loading: () => <div className="h-96 w-full rounded-lg bg-gray-100 animate-pulse" />
});

interface Activity {
  time: string;
  place: string;
  description: string;
  coordinates: [number, number];
}

export default function MapWrapper({ activities }: { activities: Activity[] }) {
  return <TripMap activities={activities} />;
}