/**
 * Instagram-style Profile Page - Voice/Audio Focused
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'grid' | 'conversations' | 'saved'>('grid');
  const [showMenu, setShowMenu] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);

  // Mock data
  const username = user?.name || 'johndoe';
  const fullName = user?.name || 'John Doe';
  const bio = 'Voice creator | AI conversations\n🎙️ Talking with Mina daily\n🌐 Building with voice';
  const stats = {
    recordings: 42,
    followers: 1234,
    following: 567,
  };

  const highlights = [
    { id: 1, name: 'Daily', emoji: '☀️', color: 'from-yellow-500 to-orange-500' },
    { id: 2, name: 'Work', emoji: '💼', color: 'from-blue-500 to-cyan-500' },
    { id: 3, name: 'Ideas', emoji: '💡', color: 'from-purple-500 to-pink-500' },
    { id: 4, name: 'Fun', emoji: '🎉', color: 'from-green-500 to-teal-500' },
  ];

  // Voice recordings with different waveform patterns
  const recordings = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    duration: Math.floor(Math.random() * 180) + 30, // 30-210 seconds
    plays: Math.floor(Math.random() * 1000),
    likes: Math.floor(Math.random() * 100),
    waveformType: ['energetic', 'calm', 'conversation', 'speech'][Math.floor(Math.random() * 4)],
    color: ['from-blue-500 to-purple-500', 'from-green-500 to-teal-500', 'from-pink-500 to-orange-500', 'from-purple-500 to-blue-500'][Math.floor(Math.random() * 4)],
  }));

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateBars = (type: string) => {
    const count = 24;
    const bars = [];
    for (let i = 0; i < count; i++) {
      let height;
      switch (type) {
        case 'energetic':
          height = 20 + Math.random() * 80;
          break;
        case 'calm':
          height = 30 + Math.random() * 40;
          break;
        case 'conversation':
          height = i % 3 === 0 ? 50 + Math.random() * 50 : 20 + Math.random() * 30;
          break;
        case 'speech':
          height = Math.sin(i * 0.5) * 40 + 50;
          break;
        default:
          height = Math.random() * 100;
      }
      bars.push(height);
    }
    return bars;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black border-b border-white/10">
        <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </Link>
          <h1 className="text-base font-semibold">{username}</h1>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#262626] rounded-lg shadow-lg overflow-hidden">
                <button className="w-full px-4 py-3 text-left text-sm hover:bg-white/10">
                  Settings
                </button>
                <button className="w-full px-4 py-3 text-left text-sm hover:bg-white/10">
                  Archive
                </button>
                <button className="w-full px-4 py-3 text-left text-sm hover:bg-white/10">
                  Your Activity
                </button>
                <button className="w-full px-4 py-3 text-left text-sm hover:bg-white/10">
                  Saved
                </button>
                <div className="border-t border-white/10" />
                <button
                  onClick={() => logout()}
                  className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-white/10"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto">
        {/* Profile Header */}
        <div className="px-4 py-6">
          <div className="flex items-start gap-6 mb-6">
            {/* Profile Picture with Pulse Effect */}
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20 sm:w-28 sm:h-28">
                {/* Animated rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 animate-pulse opacity-75"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-ping opacity-20"></div>

                {/* Inner circle */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <span className="text-2xl sm:text-4xl font-semibold">
                      {fullName.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1">
              <div className="flex items-center justify-around mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-base sm:text-lg font-semibold">{stats.recordings}</span>
                  <span className="text-xs sm:text-sm text-white/60">recordings</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-base sm:text-lg font-semibold">{stats.followers}</span>
                  <span className="text-xs sm:text-sm text-white/60">followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-base sm:text-lg font-semibold">{stats.following}</span>
                  <span className="text-xs sm:text-sm text-white/60">following</span>
                </div>
              </div>
            </div>
          </div>

          {/* Name and Bio */}
          <div className="mb-4">
            <h2 className="text-sm font-semibold mb-1">{fullName}</h2>
            <p className="text-sm text-white/90 whitespace-pre-line">{bio}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-6">
            <button className="flex-1 py-2 px-4 bg-[#363636] rounded-lg text-sm font-semibold hover:bg-[#404040] transition-colors">
              Edit profile
            </button>
            <button className="flex-1 py-2 px-4 bg-[#363636] rounded-lg text-sm font-semibold hover:bg-[#404040] transition-colors">
              Share profile
            </button>
            <button className="p-2 bg-[#363636] rounded-lg hover:bg-[#404040] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </button>
          </div>

          {/* Voice Collections/Highlights */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* New Collection Button */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-xs text-white/60">New</span>
            </div>

            {highlights.map((highlight) => (
              <div key={highlight.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${highlight.color} p-[2px]`}>
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-2xl">
                    {highlight.emoji}
                  </div>
                </div>
                <span className="text-xs text-white/90">{highlight.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-white/10">
          <div className="flex">
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex-1 py-3 flex items-center justify-center gap-2 border-t ${
                activeTab === 'grid'
                  ? 'border-white text-white'
                  : 'border-transparent text-white/40'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
              </svg>
            </button>
            <button
              onClick={() => setActiveTab('conversations')}
              className={`flex-1 py-3 flex items-center justify-center gap-2 border-t ${
                activeTab === 'conversations'
                  ? 'border-white text-white'
                  : 'border-transparent text-white/40'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-3 flex items-center justify-center gap-2 border-t ${
                activeTab === 'saved'
                  ? 'border-white text-white'
                  : 'border-transparent text-white/40'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Voice Recordings Grid */}
        <div className="grid grid-cols-3 gap-[2px] pb-20">
          {activeTab === 'grid' && recordings.map((recording) => {
            const bars = generateBars(recording.waveformType);
            const isPlaying = playingId === recording.id;

            return (
              <button
                key={recording.id}
                onClick={() => setPlayingId(isPlaying ? null : recording.id)}
                className="relative aspect-square bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] hover:opacity-80 transition-opacity cursor-pointer group overflow-hidden"
              >
                {/* Waveform Visualization */}
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <div className="flex items-end justify-center gap-[2px] w-full h-full">
                    {bars.map((height, i) => (
                      <div
                        key={i}
                        className={`flex-1 bg-gradient-to-t ${recording.color} rounded-t-sm transition-all duration-300 ${
                          isPlaying ? 'animate-pulse' : ''
                        }`}
                        style={{
                          height: `${height}%`,
                          animationDelay: `${i * 50}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 rounded text-xs font-semibold backdrop-blur-sm">
                  {formatDuration(recording.duration)}
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {isPlaying ? (
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Stats Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>{recording.plays}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span>{recording.likes}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {activeTab === 'conversations' && (
            <div className="col-span-3 py-20 text-center text-white/40">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg">No Conversations Yet</p>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="col-span-3 py-20 text-center text-white/40">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p className="text-lg">No Saved Recordings</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 z-50">
        <div className="max-w-screen-lg mx-auto flex items-center justify-around px-4 py-3">
          <Link href="/">
            <button className="p-2">
              <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          </Link>
          <button className="p-2">
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2">
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button className="p-2">
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="p-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
