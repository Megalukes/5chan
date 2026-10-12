import { afterEach, describe, expect, it } from 'vitest';
import usePersistentBoardsBarStore from '../use-persistent-boards-bar-store';

const STORAGE_KEY = 'persistent-boards-bar-store';

describe('usePersistentBoardsBarStore', () => {
  afterEach(() => {
    usePersistentBoardsBarStore.getState().setPersistentBoardsBar(false);
    localStorage.removeItem(STORAGE_KEY);
  });

  it('defaults persistentBoardsBar to false', () => {
    expect(usePersistentBoardsBarStore.getState().persistentBoardsBar).toBe(false);
  });

  it('persists the setting to localStorage', () => {
    usePersistentBoardsBarStore.getState().setPersistentBoardsBar(true);

    expect(usePersistentBoardsBarStore.getState().persistentBoardsBar).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"persistentBoardsBar":true');
  });
});
