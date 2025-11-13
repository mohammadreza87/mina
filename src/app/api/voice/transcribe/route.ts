import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudioBuffer } from '@/server/services/openaiService';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('audio');

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Audio file is required under the "audio" field.' },
      { status: 400 }
    );
  }

  try {
    const text = await transcribeAudioBuffer(
      await file.arrayBuffer(),
      file.name || 'audio.webm',
      file.type || 'audio/webm'
    );

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: 'Failed to transcribe audio.' }, { status: 500 });
  }
}
