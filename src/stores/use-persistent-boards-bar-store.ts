import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PersistentBoardsBarState {
  persistentBoardsBar: boolean;
  setPersistentBoardsBar: (persistent: boolean) => void;
}

const usePersistentBoardsBarStore = create<PersistentBoardsBarState>()(
  persist(
    (set) => ({
      persistentBoardsBar: false,
      setPersistentBoardsBar: (persistent) => set({ persistentBoardsBar: persistent }),
    }),
    {
      name: 'persistent-boards-bar-store',
    },
  ),
);

export default usePersistentBoardsBarStore;
