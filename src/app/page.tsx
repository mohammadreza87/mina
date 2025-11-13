/**
 * 🍎 Mina Home Page
 * Voice assistant with tap & hold to speak
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { GlassModal, GlassInput, GlassButton } from '@/components/glass/GlassComponents';
import { useVoiceContacts, type VoiceContact } from '@/hooks/useVoiceContacts';
import { textToSpeech } from '@/lib/openai';

type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

const VOICE_OPTIONS: Record<'male' | 'female', { id: OpenAIVoice; name: string; description: string }[]> = {
  male: [
    { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
    { id: 'echo', name: 'Echo', description: 'Deep and resonant' },
    { id: 'fable', name: 'Fable', description: 'Warm and expressive' },
  ],
  female: [
    { id: 'nova', name: 'Nova', description: 'Bright and energetic' },
    { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle' },
    { id: 'onyx', name: 'Onyx', description: 'Rich and smooth' },
  ],
};

export default function HomePage() {
  const { contacts, addContact } = useVoiceContacts();
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssistantId, setSelectedAssistantId] = useState<string | null>(null);
  const selectedAssistant = useMemo<VoiceContact | null>(() => {
    if (selectedAssistantId) {
      return contacts.find((contact) => contact.id === selectedAssistantId) ?? null;
    }
    return contacts[0] ?? null;
  }, [contacts, selectedAssistantId]);

  // Form state
  const [formName, setFormName] = useState('');
  const [formGender, setFormGender] = useState<'male' | 'female'>('female');
  const [formVoice, setFormVoice] = useState<OpenAIVoice>('nova');
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleMouseDown = () => {
    setIsRecording(true);
    console.log('Started recording...');
  };

  const handleMouseUp = () => {
    setIsRecording(false);
    console.log('Stopped recording...');
  };

  const handleOpenModal = () => {
    setFormName('');
    setFormGender('female');
    setFormVoice('nova');
    setIsModalOpen(true);
  };

  const handleSaveAssistant = () => {
    if (!formName.trim()) return;
    const created = addContact({
      name: formName.trim(),
      gender: formGender,
      voice: formVoice,
    });
    setIsModalOpen(false);
    if (created) {
      setSelectedAssistantId(created.id);
    }
  };

  const handleTestVoice = async (voiceId: OpenAIVoice) => {
    setIsPlaying(true);
    try {
      const blob = await textToSpeech(
        `Hi, I'm the ${voiceId} voice. Let's create something amazing together.`,
        voiceId
      );
      const audioUrl = URL.createObjectURL(blob);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return audioUrl;
      });
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        setPreviewUrl(null);
      };
    } catch (error) {
      console.error('Error testing voice:', error);
      setIsPlaying(false);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      {/* Decorative background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute -top-20 -left-20 w-72 h-72 md:w-96 md:h-96 bg-accent-blue/20 rounded-full blur-3xl"
          style={{ animation: 'float-gentle 8s ease-in-out infinite' }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-72 h-72 md:w-96 md:h-96 bg-accent-purple/20 rounded-full blur-3xl"
          style={{ animation: 'float-gentle 8s ease-in-out infinite 2s' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Left Sidebar - Assistants List */}
        <div className="fixed left-0 top-0 bottom-0 w-20 sm:w-24 z-30 flex flex-col items-center py-6 gap-4 pointer-events-auto">
          {/* Add Button */}
          <button
            onClick={handleOpenModal}
            className="
              w-14 h-14 sm:w-16 sm:h-16 rounded-full
              bg-gradient-to-br from-accent-green/80 to-accent-teal/80
              backdrop-blur-xl backdrop-saturate-180
              border-2 border-white/30
              shadow-xl shadow-accent-green/30
              flex items-center justify-center
              transition-all duration-200 ease-apple
              hover:scale-110 hover:shadow-2xl hover:shadow-accent-green/50
              active:scale-95
            "
          >
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Assistants List */}
          <div className="flex-1 overflow-y-auto space-y-3 w-full px-3">
            {contacts.map((assistant) => (
              <button
                key={assistant.id}
                onClick={() => setSelectedAssistantId(assistant.id)}
                className={`
                  w-14 h-14 sm:w-16 sm:h-16 rounded-full
                  flex items-center justify-center
                  transition-all duration-200 ease-apple
                  ${
                    selectedAssistant?.id === assistant.id
                      ? 'bg-gradient-to-br from-accent-blue to-accent-purple shadow-lg scale-105 border-2 border-white/30'
                      : 'bg-glass-regular backdrop-blur-xl backdrop-saturate-180 border border-white/10 hover:scale-105 hover:border-white/20'
                  }
                `}
              >
                <span className="text-lg sm:text-xl font-semibold text-white">
                  {assistant.name.charAt(0).toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-8 pb-4 ml-20 sm:ml-24">
          <h1 className="text-center text-3xl sm:text-4xl font-semibold text-white/95 tracking-tight">
            {selectedAssistant?.name || 'Mina'}
          </h1>
          <p className="text-center text-sm text-white/60 mt-1">
            Your AI voice assistant
          </p>
        </div>

        {/* Center Content - Mic Button */}
        <div className="flex-1 flex items-center justify-center px-6 pb-32 ml-20 sm:ml-24">
          <div className="flex flex-col items-center">
            {/* Big Mic Button */}
            <button
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              className={`
                relative w-40 h-40 sm:w-48 sm:h-48 rounded-full
                bg-gradient-to-b from-accent-blue to-[#0051D5]
                shadow-2xl shadow-accent-blue/40
                transition-all duration-200 ease-apple
                ${isRecording 
                  ? 'scale-110 shadow-accent-blue/60' 
                  : 'hover:scale-105 active:scale-95'
                }
              `}
            >
              {/* Pulse animation when recording */}
              {isRecording && (
                <>
                  <div className="absolute inset-0 rounded-full bg-accent-blue/30 animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-accent-blue/20 animate-pulse" />
                </>
              )}

              {/* Mic Icon */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
            </button>

            {/* Instruction Text */}
            <p className="mt-8 text-center text-base sm:text-lg font-medium text-white/80">
              {isRecording ? 'Listening...' : 'Tap & hold to speak'}
            </p>

            {/* Status indicator */}
            {isRecording && (
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm text-white/60">Recording</span>
              </div>
            )}
          </div>
        </div>

        {/* Add Assistant Modal */}
        <GlassModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Assistant"
          size="md"
        >
          <div className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Assistant Name
              </label>
              <GlassInput
                type="text"
                placeholder="e.g., Sarah, Alex, Emma"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm text-white/70 mb-3">
                Gender
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setFormGender('male');
                    setFormVoice('alloy');
                  }}
                  className={`
                    flex-1 py-3 px-4 rounded-lg
                    transition-all duration-200 ease-apple
                    ${
                      formGender === 'male'
                        ? 'bg-accent-blue text-white shadow-md'
                        : 'bg-glass-thin text-white/70 hover:bg-glass-regular'
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-semibold">Male</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setFormGender('female');
                    setFormVoice('nova');
                  }}
                  className={`
                    flex-1 py-3 px-4 rounded-lg
                    transition-all duration-200 ease-apple
                    ${
                      formGender === 'female'
                        ? 'bg-accent-purple text-white shadow-md'
                        : 'bg-glass-thin text-white/70 hover:bg-glass-regular'
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-semibold">Female</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="block text-sm text-white/70 mb-3">
                Choose Voice
              </label>
              <div className="space-y-2">
                {VOICE_OPTIONS[formGender].map((voice) => (
                  <div
                    key={voice.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setFormVoice(voice.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setFormVoice(voice.id);
                      }
                    }}
                    className={`
                      w-full p-3 rounded-lg
                      flex items-center justify-between
                      transition-all duration-200 ease-apple
                      cursor-pointer
                      ${
                        formVoice === voice.id
                          ? 'bg-glass-regular border-2 border-accent-blue'
                          : 'bg-glass-thin border border-white/10 hover:bg-glass-regular'
                      }
                    `}
                  >
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-white/90">{voice.name}</div>
                      <div className="text-xs text-white/60">{voice.description}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestVoice(voice.id);
                      }}
                      disabled={isPlaying}
                      className="ml-3 p-2 rounded-full bg-glass-thin hover:bg-glass-regular transition-all"
                    >
                      {isPlaying ? (
                        <svg className="w-5 h-5 text-white/70 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <GlassButton
                variant="glass"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </GlassButton>
              <GlassButton
                variant="filled"
                color="blue"
                onClick={handleSaveAssistant}
                disabled={!formName.trim()}
                className="flex-1"
              >
                Save Assistant
              </GlassButton>
            </div>
          </div>
        </GlassModal>

        {/* Bottom Navigation - Instagram Style */}
        <div className="flex-shrink-0 fixed bottom-0 left-0 right-0 z-20">
          <div className="mx-auto max-w-lg">
            <div
              className="
                mx-4 mb-6 rounded-2xl
                bg-glass-regular backdrop-blur-xl backdrop-saturate-180
                border border-white/15
                shadow-2xl
              "
            >
              <div className="flex items-center justify-around px-6 py-4">
                {/* Home Tab */}
                <button
                  onClick={() => setActiveTab('home')}
                  className="flex flex-col items-center gap-1 transition-all duration-200"
                >
                  <svg
                    className={`w-7 h-7 transition-colors ${
                      activeTab === 'home' ? 'text-white' : 'text-white/40'
                    }`}
                    fill={activeTab === 'home' ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={activeTab === 'home' ? 0 : 2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span
                    className={`text-xs font-medium ${
                      activeTab === 'home' ? 'text-white' : 'text-white/40'
                    }`}
                  >
                    Home
                  </span>
                </button>

                {/* Profile Tab */}
                <Link href="/profile">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="flex flex-col items-center gap-1 transition-all duration-200"
                  >
                    <svg
                      className={`w-7 h-7 transition-colors ${
                        activeTab === 'profile' ? 'text-white' : 'text-white/40'
                      }`}
                      fill={activeTab === 'profile' ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth={activeTab === 'profile' ? 0 : 2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span
                      className={`text-xs font-medium ${
                        activeTab === 'profile' ? 'text-white' : 'text-white/40'
                      }`}
                    >
                      Profile
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
