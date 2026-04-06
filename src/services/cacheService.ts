import { TriageResult } from '../types/triage';

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const CACHE_PREFIX = 'triage_cache_';

interface CacheEntry {
  result: TriageResult;
  assessedAt: number;
}

const urlToKey = (url: string): string => {
  // Strip fragment and trailing slash for stable keying.
  try {
    const u = new URL(url);
    u.hash = '';
    return CACHE_PREFIX + u.toString().replace(/\/$/, '');
  } catch {
    return CACHE_PREFIX + url;
  }
};

export const getCachedTriage = (url: string): Promise<CacheEntry | null> =>
  new Promise((resolve) => {
    const key = urlToKey(url);
    chrome.storage.local.get([key], (result) => {
      const entry = result[key] as CacheEntry | undefined;
      if (!entry) return resolve(null);
      if (Date.now() - entry.assessedAt > CACHE_TTL_MS) {
        chrome.storage.local.remove(key);
        return resolve(null);
      }
      resolve(entry);
    });
  });

export const setCachedTriage = (url: string, result: TriageResult): Promise<void> =>
  new Promise((resolve) => {
    const key = urlToKey(url);
    const entry: CacheEntry = { result, assessedAt: Date.now() };
    chrome.storage.local.set({ [key]: entry }, resolve);
  });

export const clearCachedTriage = (url: string): Promise<void> =>
  new Promise((resolve) => {
    chrome.storage.local.remove(urlToKey(url), resolve);
  });
