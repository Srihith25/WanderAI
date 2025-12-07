'use client';
import { useState } from 'react';
import TripForm from '@/components/TripForm';
import MapWrapper from '@/components/MapWrapper';

interface Activity {
  time: string;
  place: string;
  description: string;
  coordinates: [number, number];
}

interface Day {
  day: number;
  activities: Activity[];
}

interface Itinerary {
  days: Day[];
}

export default function Home() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);

  const handleGenerate = (data: Itinerary) => {
    setItinerary(data);
    setSelectedDay(0);
  };

  const currentActivities = itinerary?.days?.[selectedDay]?.activities || [];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">AI Travel Planner</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <TripForm onGenerate={handleGenerate} />
            
            {itinerary && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Your Itinerary</h2>
                
                <div className="flex gap-2 mb-4">
                  {itinerary.days.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDay(idx)}
                      className={`px-4 py-2 rounded-lg ${
                        selectedDay === idx
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Day {day.day}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-4">
                  {currentActivities.map((activity, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="text-sm text-gray-500">{activity.time}</p>
                      <p className="font-medium">{activity.place}</p>
                      <p className="text-gray-600 text-sm">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Map</h2>
            <MapWrapper activities={currentActivities} />
          </div>
        </div>
      </div>
    </main>
  );
}