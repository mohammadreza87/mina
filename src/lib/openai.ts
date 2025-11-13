/**
 * Convert speech to text via the secure API route.
 */
export async function speechToText(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.webm");

  const response = await fetch("/api/voice/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to transcribe audio");
  }

  const data = (await response.json()) as { text: string };
  return data.text;
}

/**
 * Convert text to speech by delegating to the server.
 */
export async function textToSpeech(
  text: string,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "alloy"
): Promise<Blob> {
  const response = await fetch("/api/voice/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to synthesize speech");
  }

  const buffer = await response.arrayBuffer();
  return new Blob([buffer], { type: "audio/mpeg" });
}

/**
 * Request a chat completion from the secure API route.
 */
export async function getChatCompletion(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  instructions?: string
): Promise<string> {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, instructions }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to get chat completion");
  }

  const data = (await response.json()) as { content: string };
  return data.content;
}
