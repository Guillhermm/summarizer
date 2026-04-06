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

const mockErr = (status = 401) =>
  Promise.resolve({
    ok: false,
    status,
    text: () => Promise.resolve('Unauthorized'),
  } as Response);

beforeEach(() => mockFetch.mockReset());

describe('callOpenAI', () => {
  it('returns content on success', async () => {
    mockFetch.mockReturnValueOnce(
      mockOk({ choices: [{ message: { content: '{"verdict":"recommended"}' } }] })
    );
    const result = await callOpenAI('prompt', 'gpt-4o-mini', 'sk-test');
    expect(result).toBe('{"verdict":"recommended"}');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer sk-test' }),
      })
    );
  });

  it('returns null on HTTP error', async () => {
    mockFetch.mockReturnValueOnce(mockErr(401));
    const result = await callOpenAI('prompt', 'gpt-4o-mini', 'bad-key');
    expect(result).toBeNull();
  });

  it('returns null on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await callOpenAI('prompt', 'gpt-4o-mini', 'sk-test');
    expect(result).toBeNull();
  });
});

describe('callClaude', () => {
  it('returns content on success', async () => {
    mockFetch.mockReturnValueOnce(
      mockOk({ content: [{ text: '{"verdict":"skip"}' }] })
    );
    const result = await callClaude('prompt', 'claude-sonnet-4-6', 'sk-ant-test');
    expect(result).toBe('{"verdict":"skip"}');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-api-key': 'sk-ant-test' }),
      })
    );
  });

  it('returns null on HTTP error', async () => {
    mockFetch.mockReturnValueOnce(mockErr(403));
    const result = await callClaude('prompt', 'claude-sonnet-4-6', 'bad-key');
    expect(result).toBeNull();
  });
});

describe('callGemini', () => {
  it('uses x-goog-api-key header (not query param)', async () => {
    mockFetch.mockReturnValueOnce(
      mockOk({ candidates: [{ content: { parts: [{ text: '{"verdict":"optional"}' }] } }] })
    );
    await callGemini('prompt', 'gemini-2.5-flash', 'AIza-test');
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).not.toContain('AIza-test'); // key NOT in URL
    expect((init as RequestInit).headers).toMatchObject({ 'x-goog-api-key': 'AIza-test' });
  });

  it('returns null on HTTP error', async () => {
    mockFetch.mockReturnValueOnce(mockErr(400));
    const result = await callGemini('prompt', 'gemini-2.5-flash', 'bad-key');
    expect(result).toBeNull();
  });
});

describe('callDeepSeek', () => {
  it('calls the correct endpoint', async () => {
    mockFetch.mockReturnValueOnce(
      mockOk({ choices: [{ message: { content: '{"verdict":"recommended"}' } }] })
    );
    await callDeepSeek('prompt', 'deepseek-chat', 'sk-test');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.deepseek.com/chat/completions',
      expect.anything()
    );
  });

  it('returns null on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await callDeepSeek('prompt', 'deepseek-chat', 'sk-test');
    expect(result).toBeNull();
  });
});
