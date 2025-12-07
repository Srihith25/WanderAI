import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { destination, days, preferences } = await request.json();

  const systemPrompt = `You are a travel planning expert. Generate a ${days}-day itinerary for ${destination}. 
  User preferences: ${preferences}
  
  Return ONLY valid JSON in this exact format:
  {
    "days": [
      {
        "day": 1,
        "activities": [
          {
            "time": "9:00 AM",
            "place": "Location Name",
            "description": "Brief description",
            "coordinates": [latitude, longitude]
          }
        ]
      }
    ]
  }`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Plan my trip to ${destination}` }
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