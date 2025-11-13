"use client";

import Image from "next/image";
import type { ChatDTO } from "@/presentation/hooks/features/useChats";
import AssistantAvatar from "@/components/AssistantAvatar";
import { assistants } from "@/data/assistants";
import { useAuth } from "@/contexts/AuthContext";

interface ChatSidebarProps {
  chats: ChatDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onClose?: () => void;
}

const getAssistantById = (id: string) => assistants.find((assistant) => assistant.id === id);

export default function ChatSidebar({ chats, selectedId, onSelect, onNewChat, onClose }: ChatSidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-full w-full max-w-xs flex-col border-r border-white/10 bg-[#0a0f1f] text-white lg:max-w-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div>
          <p className="text-lg font-semibold">Mina Chats</p>
          <p className="text-sm text-white/60">{chats.length} active</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewChat}
            className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            New
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/20 p-2 text-white transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50 lg:hidden"
              aria-label="Close sidebar"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="border-b border-white/5 px-6 py-4">
        <input
          type="search"
          placeholder="Search chats"
          className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const assistant = getAssistantById(chat.assistantId);
          const isActive = chat.id === selectedId;
          return (
            <button
              type="button"
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={`flex w-full items-center gap-4 border-b border-white/5 px-6 py-4 text-left transition hover:bg-white/5 focus:outline-none ${
                isActive ? "bg-white/10" : ""
              }`}
            >
              {assistant ? (
                <AssistantAvatar name={assistant.name} color={assistant.avatarColor} size="sm" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white">
                  {chat.title.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{chat.title}</p>
                  <span className="text-xs text-white/50">
                    {new Date(chat.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="text-xs uppercase tracking-wide text-white/60">
                  {chat.voiceStyle || assistant?.voiceTag}
                </p>
                <p className="mt-1 truncate text-xs text-white/50">{chat.topic}</p>
              </div>
            </button>
          );
        })}
        {chats.length === 0 && (
          <p className="px-6 py-8 text-sm text-white/60">Create your first chat to get started.</p>
        )}
      </div>

      {/* User Profile Section */}
      <div className="border-t border-white/10 p-4">
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
            type="button"
            onClick={logout}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:border-white/40 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            title="Sign out"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
