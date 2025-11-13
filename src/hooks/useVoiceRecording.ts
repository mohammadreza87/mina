"use client";

import { useState, useRef, useCallback } from "react";
import { speechToText } from "@/lib/openai";

export interface VoiceRecordingState {
  isRecording: boolean;
  duration: number;
  audioUrl: string | null;
  isProcessing: boolean;
  error: string | null;
}

export function useVoiceRecording() {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    duration: 0,
    audioUrl: null,
    isProcessing: false,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      startTimeRef.current = Date.now();

      // Update duration every 100ms
      durationIntervalRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          duration: (Date.now() - startTimeRef.current) / 1000,
        }));
      }, 100);

      setState((prev) => ({
        ...prev,
        isRecording: true,
        duration: 0,
        error: null,
      }));
    } catch (error) {
      console.error("Failed to start recording:", error);
      setState((prev) => ({
        ...prev,
        error: "Failed to access microphone. Please check permissions.",
      }));
    }
  }, []);

  const stopRecording = useCallback((): Promise<{ audioBlob: Blob; audioUrl: string; duration: number }> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error("No active recording"));
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = (Date.now() - startTimeRef.current) / 1000;

        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }

        // Stop all tracks
        mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());

        setState((prev) => ({
          ...prev,
          isRecording: false,
          audioUrl,
          duration,
        }));

        resolve({ audioBlob, audioUrl, duration });
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    setState((prev) => ({ ...prev, isProcessing: true, error: null }));

    try {
      const text = await speechToText(audioBlob);
      setState((prev) => ({ ...prev, isProcessing: false }));
      return text;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to transcribe audio";
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      setState({
        isRecording: false,
        duration: 0,
        audioUrl: null,
        isProcessing: false,
        error: null,
      });
    }
  }, [state.isRecording]);

  const reset = useCallback(() => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }
    setState({
      isRecording: false,
      duration: 0,
      audioUrl: null,
      isProcessing: false,
      error: null,
    });
  }, [state.audioUrl]);

  return {
    ...state,
    startRecording,
    stopRecording,
    transcribeAudio,
    cancelRecording,
    reset,
  };
}
