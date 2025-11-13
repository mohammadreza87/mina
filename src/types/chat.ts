export interface ChatSession {
  id: string;
  title: string;
  assistantId: string;
  voiceStyle: string;
  topic: string;
  instructions: string;
  createdAt: string;
  lastMessage: string;
  messages: Message[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  type: "text" | "voice";
  audioUrl?: string;
  duration?: number; // in seconds for voice messages
}

export interface NewChatPayload {
  title: string;
  assistantId: string;
  voiceStyle: string;
  topic: string;
  instructions: string;
}

export interface VoiceRecording {
  blob: Blob;
  url: string;
  duration: number;
}
