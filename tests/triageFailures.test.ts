const mockFetch = jest.fn();
global.fetch = mockFetch;

const store: Record<string, unknown> = {};

global.chrome = {
  storage: {
    sync: {
      get: jest.fn((keys: string[], cb: (result: Record<string, unknown>) => void) => {
        const result: Record<string, unknown> = {};
        keys.forEach((k) => {
          if (store[k] !== undefined) result[k] = store[k];
        });
        cb(result);
      }),
    },
  },
} as unknown as typeof chrome;

import { triagePage } from '../src/services/triageService';

const seed = (data: Record<string, unknown>) => {
  Object.keys(store).forEach((key) => delete store[key]);
  Object.assign(store, data);
};

const mockErrBody = (status: number, body: object) =>
  Promise.resolve({
    ok: false,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);

beforeEach(() => {
  mockFetch.mockReset();
  seed({
    provider: 'deepseek',
    deepseekKey: 'sk-' + 'a'.repeat(40),
    deepseekModel: 'deepseek-v4-flash',
  });
});

// The popup shows exactly the message thrown here, so it has to name a cause.
describe('triagePage failure messages', () => {
  it('names an exhausted balance', async () => {
    mockFetch.mockReturnValueOnce(mockErrBody(402, { error: { message: 'Insufficient Balance' } }));
    await expect(triagePage('a'.repeat(300))).rejects.toThrow(
      /DeepSeek says this account cannot be billed \(402\)\. Insufficient Balance/
    );
  });

  it('names a rejected key', async () => {
    mockFetch.mockReturnValueOnce(mockErrBody(401, { error: { message: 'Authentication Fails' } }));
    await expect(triagePage('a'.repeat(300))).rejects.toThrow(
      /DeepSeek rejected your API key \(401\)\. Authentication Fails/
    );
  });

  it('names the offending model when the request is rejected', async () => {
    mockFetch.mockReturnValueOnce(mockErrBody(400, { error: { message: 'Model Not Exist' } }));
    await expect(triagePage('a'.repeat(300))).rejects.toThrow(
      /rejected the request for model "deepseek-v4-flash" \(400\)\. Model Not Exist/
    );
  });

  it('names a rate limit', async () => {
    mockFetch.mockReturnValueOnce(mockErrBody(429, { error: { message: 'Rate limit reached' } }));
    await expect(triagePage('a'.repeat(300))).rejects.toThrow(/rate-limited this request \(429\)/);
  });

  it('reports an unreachable provider without inventing a status', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));
    await expect(triagePage('a'.repeat(300))).rejects.toThrow(
      /DeepSeek could not be reached\. Failed to fetch/
    );
  });

  it('still asks for a key when none is stored', async () => {
    seed({ provider: 'deepseek', deepseekKey: '', deepseekModel: 'deepseek-v4-flash' });
    await expect(triagePage('a'.repeat(300))).rejects.toThrow(/No API key set for deepseek/);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
