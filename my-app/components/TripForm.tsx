'use client';
import React, { useState } from 'react';

interface TripFormProps {
  onGenerate: (data: any) => void;
}

export default function TripForm({ onGenerate }: TripFormProps) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, days, preferences: '' })
    });

    const data = await response.json();
    onGenerate(data);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow">
      <input
        type="text"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Where do you want to go?"
        className="w-full p-3 border rounded-lg"
        required
      />
      <select
        value={days}
        onChange={(e) => setDays(Number(e.target.value))}
        className="w-full p-3 border rounded-lg"
      >
        <option value={1}>1 day</option>
        <option value={2}>2 days</option>
        <option value={3}>3 days</option>
        <option value={5}>5 days</option>
        <option value={7}>7 days</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Itinerary'}
      </button>
    </form>
  );
}