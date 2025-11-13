"use client";

import { useState } from "react";
import { assistants } from "@/data/assistants";
import type { NewChatPayload } from "@/types/chat";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: NewChatPayload) => void;
}

const createInitialForm = (): NewChatPayload => ({
  title: "",
  assistantId: assistants[0]?.id ?? "",
  voiceStyle: "",
  topic: "",
  instructions: "",
});

export default function NewChatModal({ isOpen, onClose, onCreate }: NewChatModalProps) {
  const [form, setForm] = useState<NewChatPayload>(() => createInitialForm());

  const handleChange = (field: keyof NewChatPayload) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.assistantId) {
      return;
    }
    onCreate(form);
    setForm(createInitialForm());
    onClose();
  };

  const handleClose = () => {
    setForm(createInitialForm());
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur sm:items-center sm:p-6">
      <div className="w-full max-w-lg animate-[slideUp_0.3s_ease-out] rounded-t-3xl border border-white/10 bg-[#0d1325] p-6 text-white shadow-2xl sm:animate-[fadeIn_0.3s_ease-out] sm:rounded-3xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold sm:text-xl">Create new chat</h2>
            <p className="mt-1 text-xs text-white/60 sm:text-sm">Configure your AI assistant.</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-white/20 p-2 text-white transition hover:border-white/40 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-white/80">
            Chat name
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
              placeholder="e.g. Morning Reflection"
              value={form.title}
              onChange={handleChange("title")}
            />
          </label>
          <label className="block text-sm font-semibold text-white/80">
            Assistant
            <select
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/40 focus:outline-none"
              value={form.assistantId}
              onChange={handleChange("assistantId")}
            >
              {assistants.map((assistant) => (
                <option key={assistant.id} value={assistant.id} className="bg-slate-900">
                  {assistant.name} — {assistant.voiceTag}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-white/80">
            Voice style
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
              placeholder="Calm, energetic, playful..."
              value={form.voiceStyle}
              onChange={handleChange("voiceStyle")}
            />
          </label>
          <label className="block text-sm font-semibold text-white/80">
            Topic / Intent
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
              placeholder="Creative brainstorm, confidence boost..."
              value={form.topic}
              onChange={handleChange("topic")}
            />
          </label>
          <label className="block text-sm font-semibold text-white/80">
            How should Mina talk?
            <textarea
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
              rows={3}
              placeholder="e.g. Ask thoughtful follow-up questions, keep responses short..."
              value={form.instructions}
              onChange={handleChange("instructions")}
            />
          </label>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded-full bg-white text-black py-3 font-semibold transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Start chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
