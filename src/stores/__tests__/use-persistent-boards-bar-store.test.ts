import { afterEach, describe, expect, it } from 'vitest';
import usePersistentBoardsBarStore from '../use-persistent-boards-bar-store';

const STORAGE_KEY = 'persistent-boards-bar-store';

describe('usePersistentBoardsBarStore', () => {
  afterEach(() => {
    usePersistentBoardsBarStore.setState({ persistentBoardsBar: false, traditionalBoardList: true, autoHideBoardsBar: false });
    localStorage.removeItem(STORAGE_KEY);
  });

  it('defaults to a static bar that uses the traditional board list without auto-hide', () => {
    const state = usePersistentBoardsBarStore.getState();
    expect(state.persistentBoardsBar).toBe(false);
    expect(state.traditionalBoardList).toBe(true);
    expect(state.autoHideBoardsBar).toBe(false);
  });

  it('persists the setting to localStorage', () => {
    usePersistentBoardsBarStore.getState().setPersistentBoardsBar(true);

    expect(usePersistentBoardsBarStore.getState().persistentBoardsBar).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"persistentBoardsBar":true');
  });

  it('persists the board list and auto-hide options', () => {
    usePersistentBoardsBarStore.getState().setTraditionalBoardList(false);
    usePersistentBoardsBarStore.getState().setAutoHideBoardsBar(true);

    expect(localStorage.getItem(STORAGE_KEY)).toContain('"traditionalBoardList":false');
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"autoHideBoardsBar":true');
  });
});
