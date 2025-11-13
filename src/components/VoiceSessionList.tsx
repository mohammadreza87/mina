"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import type { ChatDTO } from "@/presentation/hooks/features/useChats";
import { assistants } from "@/data/assistants";
import AssistantAvatar from "@/components/AssistantAvatar";
import { gsap, withGsapContext } from "@/lib/gsapClient";
import { useAuth } from "@/contexts/AuthContext";
import type { VoiceContact } from "@/hooks/useVoiceContacts";

interface VoiceSessionListProps {
  sessions: ChatDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewSession: () => void;
  contacts: VoiceContact[];
}

export default function VoiceSessionList({ sessions, selectedId, onSelect, onNewSession, contacts }: VoiceSessionListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!listRef.current) return;
    const ctx = withGsapContext(listRef.current, () => {
      const items = listRef.current?.querySelectorAll(".session-item");
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );
      }
    });
    return () => ctx?.revert();
  }, [sessions.length]);

  return (
    <div className="flex h-screen w-full max-w-sm flex-col border-r border-white/10 bg-[#0a0f1f]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h1 className="text-xl font-semibold text-white">Mina</h1>
        <button
          onClick={onNewSession}
          className="rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          New Call
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-white/5 px-4 py-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            placeholder="Search"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
          />
        </div>
      </div>

      {/* Session List */}
      <div ref={listRef} className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
            <div className="rounded-full bg-white/5 p-6">
              <svg className="h-12 w-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">No voice calls yet</p>
              <p className="mt-1 text-sm text-white/60">Start a new call with an AI assistant</p>
            </div>
          </div>
        ) : (
          sessions.map((session) => {
            const assistant = assistants.find((a) => a.id === session.assistantId);
            const isActive = session.id === selectedId;

            return (
              <button
                key={session.id}
                onClick={() => onSelect(session.id)}
                className={`session-item flex w-full items-center gap-4 border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/5 ${
                  isActive ? "bg-white/10" : ""
                }`}
              >
                {assistant && (
                  <>
                    <AssistantAvatar
                      name={assistant.name}
                      color={assistant.avatarColor}
                      size="sm"
                      isActive={isActive}
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="truncate font-semibold text-white">{session.title}</p>
                        <span className="text-xs text-white/50">
                          {new Date(session.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="truncate text-sm text-white/60">{assistant.voiceTag}</p>
                    </div>
                  </>
                )}
              </button>
            );
          })
        )}
      </div>

        {contacts.length > 0 && (
          <div className="border-t border-white/10 px-4 py-3">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">Contacts</h2>
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                >
                  <p className="text-base font-semibold text-white">{contact.name}</p>
                  <p className="text-xs uppercase tracking-wide text-white/50">
                    {contact.gender === "male" ? "Male" : "Female"} • Voice: {contact.voice}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* User Profile */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "User avatar"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border-2 border-white/20 object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold text-white">{user?.name || "User"}</p>
              <p className="truncate text-xs text-white/60">{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:border-white/40 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50"
            title="Sign out"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
