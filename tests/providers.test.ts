// Mock fetch globally before importing the provider modules.
const mockFetch = jest.fn();
global.fetch = mockFetch;

import { callOpenAI } from '../src/services/providers/openai';
import { callClaude } from '../src/services/providers/claude';
import { callGemini } from '../src/services/providers/gemini';
import { callDeepSeek } from '../src/services/providers/deepseek';

const mockOk = (body: object) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);

const mockErrBody = (status: number, body: object) =>
  Promise.resolve({
    ok: false,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);

beforeEach(() => mockFetch.mockReset());

describe('callOpenAI', () => {
  it('returns content on success', async () => {
    mockFetch.mockReturnValueOnce(
      mockOk({ choices: [{ message: { content: '{"verdict":"recommended"}' } }] })
    );
    const result = await callOpenAI('prompt', 'gpt-4o-mini', 'sk-test');
    expect(result).toEqual({ ok: true, text: '{"verdict":"recommended"}' });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer sk-test' }),
      })
    );
  });

  it('keeps the status and the provider message on HTTP error', async () => {
    mockFetch.mockReturnValueOnce(mockErrBody(401, { error: { message: 'Incorrect API key' } }));
    const result = await callOpenAI('prompt', 'gpt-4o-mini', 'bad-key');
    expect(result).toEqual({ ok: false, status: 401, message: 'Incorrect API key' });
  });

  it('reports a network failure with no status', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await callOpenAI('prompt', 'gpt-4o-mini', 'sk-test');
    expect(result).toEqual({ ok: false, message: 'Network error' });
  });
});

describe('callClaude', () => {
  it('returns content on success', async () => {
    mockFetch.mockReturnValueOnce(mockOk({ content: [{ text: '{"verdict":"skip"}' }] }));
    const result = await callClaude('prompt', 'claude-sonnet-5', 'sk-ant-test');
    expect(result).toEqual({ ok: true, text: '{"verdict":"skip"}' });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-api-key': 'sk-ant-test',
          // Without this header Anthropic rejects the browser origin outright.
          'anthropic-dangerous-direct-browser-access': 'true',
        }),
      })
    );
  });

  it('keeps the status and the provider message on HTTP error', async () => {
    mockFetch.mockReturnValueOnce(mockErrBody(403, { error: { message: 'permission denied' } }));
    const result = await callClaude('prompt', 'claude-sonnet-5', 'bad-key');
    expect(result).toEqual({ ok: false, status: 403, message: 'permission denied' });
  });
});

describe('callGemini', () => {
  it('uses x-goog-api-key header (not query param)', async () => {
    mockFetch.mockReturnValueOnce(
      mockOk({ candidates: [{ content: { parts: [{ text: '{"verdict":"optional"}' }] } }] })
    );
    await callGemini('prompt', 'gemini-3.7-flash', 'AIza-test');
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).not.toContain('AIza-test'); // key NOT in URL
    expect((init as RequestInit).headers).toMatchObject({ 'x-goog-api-key': 'AIza-test' });
  });

  it('keeps the status and the provider message on HTTP error', async () => {
    mockFetch.mockReturnValueOnce(mockErrBody(400, { error: { message: 'API key not valid' } }));
    const result = await callGemini('prompt', 'gemini-3.7-flash', 'bad-key');
    expect(result).toEqual({ ok: false, status: 400, message: 'API key not valid' });
  });
});

describe('callDeepSeek', () => {
  it('calls the correct endpoint', async () => {
    mockFetch.mockReturnValueOnce(
      mockOk({ choices: [{ message: { content: '{"verdict":"recommended"}' } }] })
    );
    await callDeepSeek('prompt', 'deepseek-v4-flash', 'sk-test');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.deepseek.com/chat/completions',
      expect.anything()
    );
  });

  it('reports a network failure with no status', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await callDeepSeek('prompt', 'deepseek-v4-flash', 'sk-test');
    expect(result).toEqual({ ok: false, message: 'Network error' });
  });

  // The shape DeepSeek returns for a key with no credit left.
  it('surfaces an insufficient balance', async () => {
    mockFetch.mockReturnValueOnce(
      mockErrBody(402, { error: { message: 'Insufficient Balance', type: 'unknown_error' } })
    );
    const result = await callDeepSeek('prompt', 'deepseek-v4-flash', 'sk-test');
    expect(result).toEqual({ ok: false, status: 402, message: 'Insufficient Balance' });
  });

  it('falls back to the raw body when the error is not JSON', async () => {
    mockFetch.mockReturnValueOnce(
      Promise.resolve({
        ok: false,
        status: 502,
        text: () => Promise.resolve('Bad Gateway'),
      } as Response)
    );
    const result = await callDeepSeek('prompt', 'deepseek-v4-flash', 'sk-test');
    expect(result).toEqual({ ok: false, status: 502, message: 'Bad Gateway' });
  });
});
