import { create } from "zustand";
import { generateId } from "@/lib/id";

export interface XpToast {
  id: string;
  amount: number;
  label: string;
}

interface XpToastState {
  toasts: XpToast[];
  push: (amount: number, label: string) => void;
  dismiss: (id: string) => void;
}

/** Ephemeral, not persisted — purely a queue for the "+XP" pop-up stack. */
export const useXpToastStore = create<XpToastState>()((set) => ({
  toasts: [],
  push: (amount, label) => {
    const toast: XpToast = { id: generateId(), amount, label };
    set((state) => ({ toasts: [...state.toasts, toast] }));
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
