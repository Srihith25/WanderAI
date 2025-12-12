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

  CRITICAL REQUIREMENTS:
  1. TIMING ACCURACY: Research and verify the typical operating hours for each venue/attraction.
     - Museums: Usually 9 AM - 5 PM (closed Mondays)
     - Restaurants: Lunch 11:30 AM - 2:30 PM, Dinner 6 PM - 10 PM
     - Markets: Usually morning to afternoon (closed evenings)
     - Religious sites: May have prayer times or restricted hours
     - Parks: Usually dawn to dusk
  2. AVOID scheduling activities when venues are typically CLOSED
  3. Consider local customs (siesta times, prayer times, etc.)
  4. Schedule realistic travel times between locations
  5. Include meal times that align with local dining culture

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

  For each activity:
  - Verify the scheduled time matches the venue's typical operating hours
  - Include 3-5 nearby recommendations that are OPEN during that time period
  - Ensure recommendations are within 5-10 minutes walking distance
  - Make sure all coordinates are accurate for the actual locations
  - Consider the day of the week (some places closed on specific days)`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Plan my ${days}-day trip to ${destination}.

        IMPORTANT:
        - Only suggest activities during their actual operating hours
        - Don't recommend restaurants for breakfast time if they only serve lunch/dinner
        - Check typical museum/attraction closing days (many close on Mondays)
        - Ensure all recommendations match the time slot
        - Consider local meal times and customs` }
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