"use client";

import { useRef, useEffect, useState } from "react";
import type { ChatSession, Message } from "@/types/chat";
import type { Assistant } from "@/types/assistant";
import { assistants } from "@/data/assistants";
import AssistantAvatar from "@/components/AssistantAvatar";
import { gsap, withGsapContext } from "@/lib/gsapClient";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";

interface ChatMessagesProps {
  chat: ChatSession;
  onSendMessage: (content: string, type: "text" | "voice", audioUrl?: string) => void;
  onToggleSettings: () => void;
}

export default function ChatMessages({ chat, onSendMessage, onToggleSettings }: ChatMessagesProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    isRecording,
    duration,
    isProcessing,
    startRecording,
    stopRecording,
    transcribeAudio,
    reset: resetRecording,
  } = useVoiceRecording();

  const assistant = assistants.find((a) => a.id === chat.assistantId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  useEffect(() => {
    if (messagesContainerRef.current && chat.messages.length > 0) {
      const ctx = withGsapContext(messagesContainerRef.current, () => {
        const lastMessage = messagesContainerRef.current?.lastElementChild;
        if (lastMessage) {
          gsap.fromTo(
            lastMessage,
            { opacity: 0, y: 20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
          );
        }
      });
      return () => ctx?.revert();
    }
  }, [chat.messages.length]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue, "text");
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceRecord = async () => {
    if (isRecording) {
      // Stop recording and transcribe
      try {
        const { audioBlob, audioUrl: recordedUrl } = await stopRecording();
        const transcription = await transcribeAudio(audioBlob);

        // Send the transcribed message
        onSendMessage(transcription, "voice", recordedUrl);
        resetRecording();
      } catch (error) {
        console.error("Voice recording error:", error);
      }
    } else {
      // Start recording
      await startRecording();
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-[#050b18]">
      {/* Chat Header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-[#080f22]/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          {assistant && (
            <>
              <AssistantAvatar name={assistant.name} color={assistant.avatarColor} size="sm" />
              <div>
                <h2 className="text-sm font-semibold text-white sm:text-base">{chat.title}</h2>
                <p className="text-xs text-white/60">{assistant.voiceTag}</p>
              </div>
            </>
          )}
        </div>
        <button
          onClick={onToggleSettings}
          className="rounded-lg border border-white/20 p-2 text-white transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Toggle settings"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6" ref={messagesContainerRef}>
        {chat.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            {assistant && <AssistantAvatar name={assistant.name} color={assistant.avatarColor} size="lg" isActive />}
            <div>
              <p className="text-lg font-semibold text-white">{assistant?.mood}</p>
              <p className="mt-2 text-sm text-white/60">Send a message or use voice to start chatting</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} assistant={assistant} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-[#080f22]/90 p-4 backdrop-blur">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none sm:text-base"
            />
          </div>
          <button
            onClick={handleVoiceRecord}
            disabled={isProcessing}
            className={`relative flex items-center gap-2 rounded-xl border p-3 transition focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50 ${
              isRecording
                ? "animate-pulse border-red-500 bg-red-500/20 text-red-500"
                : "border-white/20 text-white hover:bg-white/5"
            }`}
            aria-label={isRecording ? `Stop recording (${duration.toFixed(1)}s)` : "Start voice recording"}
          >
            {isProcessing ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isRecording ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                )}
              </svg>
            )}
            {isRecording && (
              <span className="text-xs font-medium tabular-nums">{duration.toFixed(1)}s</span>
            )}
          </button>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 p-3 text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, assistant }: { message: Message; assistant?: Assistant }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && assistant && (
        <div className="flex-shrink-0">
          <AssistantAvatar name={assistant.name} color={assistant.avatarColor} size="sm" />
        </div>
      )}
      <div
        className={`group relative max-w-[70%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
            : "border border-white/10 bg-white/5 text-white"
        }`}
      >
        {message.type === "voice" && message.audioUrl ? (
          <div className="flex items-center gap-3">
            <button className="rounded-full bg-white/20 p-2 transition hover:bg-white/30">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="h-1 rounded-full bg-white/30">
                <div className="h-1 w-1/3 rounded-full bg-white" />
              </div>
            </div>
            <span className="text-xs opacity-70">{message.duration}s</span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed sm:text-base">{message.content}</p>
        )}
        <p className={`mt-1 text-xs ${isUser ? "text-white/70" : "text-white/50"}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
