import { NextRequest, NextResponse } from 'next/server';
import { synthesizeSpeechToBuffer } from '@/server/services/openaiService';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { text, voice } = await request.json();

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
  }

  try {
    const audioBuffer = await synthesizeSpeechToBuffer(text, voice);
    return new NextResponse(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Speech synthesis error:', error);
    return NextResponse.json({ error: 'Failed to synthesize speech.' }, { status: 500 });
  }
}
