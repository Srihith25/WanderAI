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

  const { message, itinerary } = await request.json();

  const systemPrompt = `You are a helpful travel assistant. The user has planned a trip with the following itinerary:

${itinerary ? JSON.stringify(itinerary, null, 2) : 'No itinerary generated yet.'}

Help answer their questions about:
- The destinations and activities in their itinerary
- Local tips, customs, and etiquette
- Best times to visit places
- Transportation options
- Food recommendations
- Safety tips
- Packing suggestions
- Budget estimates
- Alternative activities

Be friendly, concise, and helpful. If the question is unrelated to travel, politely redirect the conversation.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 500
    });

    return NextResponse.json({
      response: response.choices[0].message.content
    });

  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    );
  }
}