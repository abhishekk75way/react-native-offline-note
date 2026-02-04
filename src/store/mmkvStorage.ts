import type { Storage } from 'redux-persist';
import storageMMKV from './mmkv';

export const mmkvStorage: Storage = {
  setItem: (key, value) => {
    storageMMKV.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storageMMKV.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key) => {
    storageMMKV.remove(key);
    return Promise.resolve();
  },
};