"use client";

import { useEffect, useMemo, useState } from "react";
import VoiceSessionList from "@/components/VoiceSessionList";
import VoiceBrowser from "@/components/VoiceBrowser";
import NewChatModal from "@/components/NewChatModal";
import { useChats, type CreateChatInput } from "@/presentation/hooks/features/useChats";
import { useVoiceContacts } from "@/hooks/useVoiceContacts";
import { GlassButton, GlassInput, GlassModal } from "@/components/glass/GlassComponents";
import { textToSpeech } from "@/lib/openai";

type OpenAIVoice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

export default function ChatWorkspace() {
  // Use new architecture hook
  const { chats, createChat } = useChats();
  const { contacts, addContact } = useVoiceContacts();

  // Local state for selected chat
  const [selectedId, setSelectedId] = useState<string | null>(() => chats[0]?.id ?? null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [contactForm, setContactForm] = useState<{
    name: string;
    gender: "male" | "female";
    voice: OpenAIVoice;
  }>({
    name: "",
    gender: "female" as "male" | "female",
    voice: "alloy",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const voiceOptions = useMemo(
    () => [
      { label: "Alloy", value: "alloy" as OpenAIVoice },
      { label: "Echo", value: "echo" as OpenAIVoice },
      { label: "Fable", value: "fable" as OpenAIVoice },
      { label: "Onyx", value: "onyx" as OpenAIVoice },
      { label: "Nova", value: "nova" as OpenAIVoice },
      { label: "Shimmer", value: "shimmer" as OpenAIVoice },
    ],
    []
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Update selected chat when chats change (e.g., first chat created)
  useState(() => {
    if (!selectedId && chats.length > 0) {
      setSelectedId(chats[0].id);
    }
  });

  const handleSelectSession = (id: string) => {
    setSelectedId(id);
    setSidebarOpen(false);
  };

  const handleStartCall = () => {
    // Open modal pre-filled with the selected assistant
    setModalOpen(true);
    // TODO: Pre-select the assistant in the modal
  };

  const handleCreateChat = (payload: { title: string; assistantId: string; voiceStyle: string; topic: string; instructions: string }) => {
    const input: CreateChatInput = {
      assistantId: payload.assistantId,
      title: payload.title || "New Chat",
      voiceStyle: payload.voiceStyle || "Friendly",
      topic: payload.topic || "General",
      instructions: payload.instructions,
    };

    createChat(input, {
      onSuccess: (newChat) => {
        setSelectedId(newChat.id);
      },
    });
  };

  const resetContactForm = () => {
    setContactForm({
      name: "",
      gender: "female",
    voice: "alloy",
  });
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  const handleSaveContact = () => {
    if (!contactForm.name.trim()) return;
    addContact({
      name: contactForm.name.trim(),
      gender: contactForm.gender,
      voice: contactForm.voice,
    });
    setContactModalOpen(false);
    resetContactForm();
  };

  const handlePreviewVoice = async () => {
    setIsPreviewing(true);
    try {
      const blob = await textToSpeech(
        "Hello, I'm your new AI voice. Let's create something amazing together!",
        contactForm.voice
      );
      const url = URL.createObjectURL(blob);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      const audio = new Audio(url);
      await audio.play();
    } catch (error) {
      console.error("Voice preview failed:", error);
    } finally {
      setIsPreviewing(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full bg-[#050a17] text-white">
      {/* Mobile overlay backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Voice Sessions */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:z-0 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <VoiceSessionList
          sessions={chats}
          selectedId={selectedId}
          onSelect={handleSelectSession}
          onNewSession={() => setModalOpen(true)}
          contacts={contacts}
        />
      </div>

      {/* Mobile header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#080f22]/90 px-4 py-3 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg border border-white/20 p-2 text-white transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Open menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Mina</h1>
        <div className="w-10" /> {/* Spacer for center alignment */}
      </div>

      {/* Right Side - Voice Browser */}
      <VoiceBrowser onStartCall={handleStartCall} />

      {/* New Session Modal */}
      <NewChatModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreateChat} />

      {/* Floating Contact Button */}
      <button
        onClick={() => setContactModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-2xl font-bold text-white shadow-lg shadow-purple-500/40 transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
        aria-label="Add voice contact"
      >
        +
      </button>

      {/* Contact Modal */}
      <GlassModal isOpen={isContactModalOpen} onClose={() => { setContactModalOpen(false); resetContactForm(); }} title="Add Voice Contact" size="md">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-white/80">Name</label>
            <GlassInput
              placeholder="e.g. Creative Coach"
              value={contactForm.name}
              onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white/80">Gender</label>
            <div className="mt-2 flex gap-3">
              {(["female", "male"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setContactForm((prev) => ({ ...prev, gender: value }))}
                  className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    contactForm.gender === value
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-white/10 text-white/60 hover:border-white/30"
                  }`}
                >
                  {value === "female" ? "Female" : "Male"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-white/80">Voice</label>
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/30 focus:outline-none"
              value={contactForm.voice}
              onChange={(e) => setContactForm((prev) => ({ ...prev, voice: e.target.value as OpenAIVoice }))}
            >
              {voiceOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#050a17] text-white">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <GlassButton variant="glass" onClick={handlePreviewVoice} disabled={isPreviewing}>
              {isPreviewing ? "Previewing..." : "Preview Voice"}
            </GlassButton>
            {previewUrl && (
              <audio src={previewUrl} controls className="flex-1 rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-white" />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <GlassButton variant="glass" onClick={() => { setContactModalOpen(false); resetContactForm(); }}>
              Cancel
            </GlassButton>
            <GlassButton onClick={handleSaveContact} disabled={!contactForm.name.trim()}>
              Save
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
