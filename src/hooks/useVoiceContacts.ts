"use client";

import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "mina_voice_contacts";

export type VoiceContact = {
  id: string;
  name: string;
  gender: "male" | "female";
  voice: string;
};

export function useVoiceContacts() {
  const [contacts, setContacts] = useState<VoiceContact[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as VoiceContact[]) : [];
    } catch (error) {
      console.error("Failed to load contacts:", error);
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch (error) {
      console.error("Failed to persist contacts:", error);
    }
  }, [contacts]);

  const addContact = useCallback((contact: Omit<VoiceContact, "id">): VoiceContact => {
    const newContact: VoiceContact = { id: uuidv4(), ...contact };
    setContacts((prev) => [newContact, ...prev]);
    return newContact;
  }, []);

  const removeContact = useCallback((id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  }, []);

  return {
    contacts,
    addContact,
    removeContact,
  };
}
