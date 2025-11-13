import { NextRequest, NextResponse } from 'next/server';
import { createChatCompletion } from '@/server/services/openaiService';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { messages, instructions } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Messages are required.' }, { status: 400 });
  }

  try {
    const content = await createChatCompletion(messages, instructions);
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Chat completion error:', error);
    return NextResponse.json({ error: 'Failed to create chat completion.' }, { status: 500 });
  }
}
