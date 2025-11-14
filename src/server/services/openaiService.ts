import { Buffer, File } from 'node:buffer';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function transcribeAudioBuffer(
  buffer: ArrayBuffer,
  filename: string,
  mimeType: string
): Promise<string> {
  if (!openai) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const file = new File([Buffer.from(buffer)], filename || 'audio.webm', {
    type: mimeType || 'audio/webm',
  });

  const transcription = await openai.audio.transcriptions.create({
    file: file as any,
    model: 'whisper-1',
  });

  return transcription.text;
}

export async function synthesizeSpeechToBuffer(
  text: string,
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'alloy'
): Promise<Buffer> {
  if (!openai) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice,
    input: text,
  });

  return Buffer.from(await response.arrayBuffer());
}

export async function createChatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  instructions?: string
): Promise<string> {
  if (!openai) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const systemMessage = instructions
    ? ({ role: 'system' as const, content: instructions })
    : undefined;

  const payload = systemMessage ? [systemMessage, ...messages] : messages;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: payload,
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content || 'No response generated.';
}
