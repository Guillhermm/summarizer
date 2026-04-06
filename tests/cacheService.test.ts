import { getCachedTriage, setCachedTriage, clearCachedTriage } from '../src/services/cacheService';
import { TriageResult } from '../src/types/triage';

// Mock chrome.storage.local
const store: Record<string, unknown> = {};

global.chrome = {
  storage: {
    local: {
      get: jest.fn((keys: string[], cb: (result: Record<string, unknown>) => void) => {
        const result: Record<string, unknown> = {};
        keys.forEach((k) => {
          if (store[k] !== undefined) result[k] = store[k];
        });
        cb(result);
      }),
      set: jest.fn((data: Record<string, unknown>, cb?: () => void) => {
        Object.assign(store, data);
        cb?.();
      }),
      remove: jest.fn((key: string, cb?: () => void) => {
        delete store[key];
        cb?.();
      }),
    },
  },
} as unknown as typeof chrome;

const mockResult: TriageResult = {
  argument: 'Test argument',
  readingTime: '~3 min',
  contentType: 'news',
  knowledgeLevel: 'casual',
  verdict: 'recommended',
  verdictReason: 'Good stuff',
  poweredBy: 'openai',
};

const URL = 'https://example.com/article';

beforeEach(() => {
  Object.keys(store).forEach((k) => delete store[k]);
  jest.clearAllMocks();
});

describe('setCachedTriage + getCachedTriage', () => {
  it('stores and retrieves a result for a URL', async () => {
    await setCachedTriage(URL, mockResult);
    const cached = await getCachedTriage(URL);
    expect(cached).not.toBeNull();
    expect(cached!.result.verdict).toBe('recommended');
    expect(cached!.assessedAt).toBeGreaterThan(0);
  });

  it('returns null when nothing is cached', async () => {
    const cached = await getCachedTriage('https://example.com/not-cached');
    expect(cached).toBeNull();
  });

  it('strips URL fragment before keying', async () => {
    await setCachedTriage('https://example.com/article#section-2', mockResult);
    const cached = await getCachedTriage('https://example.com/article');
    expect(cached).not.toBeNull();
  });

  it('strips trailing slash before keying', async () => {
    await setCachedTriage('https://example.com/article/', mockResult);
    const cached = await getCachedTriage('https://example.com/article');
    expect(cached).not.toBeNull();
  });

  it('returns null for an expired entry', async () => {
    const EIGHT_DAYS_MS = 8 * 24 * 60 * 60 * 1000;
    const expiredEntry = { result: mockResult, assessedAt: Date.now() - EIGHT_DAYS_MS };
    const key = 'triage_cache_https://example.com/article';
    store[key] = expiredEntry;

    const cached = await getCachedTriage(URL);
    expect(cached).toBeNull();
  });
});

describe('clearCachedTriage', () => {
  it('removes the cached entry', async () => {
    await setCachedTriage(URL, mockResult);
    await clearCachedTriage(URL);
    const cached = await getCachedTriage(URL);
    expect(cached).toBeNull();
  });
});
