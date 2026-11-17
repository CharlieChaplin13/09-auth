import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import type { CreateNote }from '@/types/note'


type NoteDraftStore = {
    draft: CreateNote;
    setDraft: (note: Partial<CreateNote>) => void;
    clearDraft: () => void;
}

const initialDraft: CreateNote = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>  
        set((state) => ({
          draft: { ...state.draft, ...note },
      })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
