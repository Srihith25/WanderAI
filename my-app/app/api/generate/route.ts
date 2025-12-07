import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  const openai = new OpenAI({ apiKey });

  const { destination, days, preferences } = await request.json();

  const systemPrompt = `You are a travel planning expert. Generate a ${days}-day itinerary for ${destination}.
  User preferences: ${preferences || 'None specified'}

  Return ONLY valid JSON in this exact format:
  {
    "days": [
      {
        "day": 1,
        "activities": [
          {
            "time": "9:00 AM",
            "place": "Location Name",
            "description": "Brief description of the activity",
            "coordinates": [latitude, longitude],
            "recommendations": [
              {
                "name": "Nearby Restaurant Name",
                "type": "Restaurant",
                "coordinates": [latitude, longitude]
              },
              {
                "name": "Nearby Cafe",
                "type": "Cafe",
                "coordinates": [latitude, longitude]
              },
              {
                "name": "Nearby Attraction",
                "type": "Attraction",
                "coordinates": [latitude, longitude]
              }
            ]
          }
        ]
      }
    ]
  }

  For each activity, include 3-5 nearby recommendations such as restaurants, cafes, bars, clubs, museums, shops, or other points of interest within walking distance. Make sure all coordinates are accurate for the actual locations.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Plan my ${days}-day trip to ${destination}` }
      ],
      response_format: { type: "json_object" }
    });

    const itinerary = JSON.parse(response.choices[0].message.content || '{}');
    return NextResponse.json(itinerary);

  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate itinerary' },
      { status: 500 }
    );
  }
}