'use client';
import { useState } from 'react';
import TripForm from '@/components/TripForm';
import MapWrapper from '@/components/MapWrapper';
import ChatBot from '@/components/ChatBot';

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
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleGenerate = (data: Itinerary) => {
    setItinerary(data);
    setSelectedDay(0);
    setSelectedActivity(null);
  };

  const currentActivities = itinerary?.days?.[selectedDay]?.activities || [];

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          🌍 AI Travel Planner
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side: Form and Itinerary */}
          <div className="space-y-6">
            <TripForm onGenerate={handleGenerate} />

            {itinerary && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-white">Your Itinerary</h2>

                {/* Day selector tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {itinerary.days.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedDay(idx);
                        setSelectedActivity(null);
                      }}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedDay === idx
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      }`}
                    >
                      Day {day.day}
                    </button>
                  ))}
                </div>

                {/* Activities list */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {currentActivities.map((activity, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedActivity(activity)}
                      className={`border-l-4 pl-4 py-3 cursor-pointer rounded-r-lg transition-colors ${
                        selectedActivity === activity
                          ? 'border-blue-500 bg-gray-700'
                          : 'border-gray-600 hover:bg-gray-700/50'
                      }`}
                    >
                      <p className="text-sm text-blue-400">{activity.time}</p>
                      <p className="font-medium text-white">{activity.place}</p>
                      <p className="text-gray-400 text-sm">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right side: Map and Recommendations */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-white">Map</h2>
              <MapWrapper
                activities={currentActivities}
                selectedActivity={selectedActivity}
                onSelectActivity={setSelectedActivity}
              />
            </div>

            {/* Recommendations */}
            {selectedActivity?.recommendations && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Nearby: {selectedActivity.place}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {selectedActivity.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <p className="font-medium text-white">{rec.name}</p>
                      <p className="text-sm text-blue-400">{rec.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-50"
        >
          {showChat ? '✕' : '💬'}
        </button>

        {/* Chat Panel */}
        {showChat && (
          <ChatBot
            itinerary={itinerary}
            onClose={() => setShowChat(false)}
          />
        )}
      </div>
    </main>
  );
}