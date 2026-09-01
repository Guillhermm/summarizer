// Mock fetch globally before importing the provider modules.
const mockFetch = jest.fn();
global.fetch = mockFetch;

import { listOpenAIModels } from '../src/services/providers/openai';
import { listClaudeModels } from '../src/services/providers/claude';
import { listGeminiModels } from '../src/services/providers/gemini';
import { listDeepSeekModels } from '../src/services/providers/deepseek';
import { isChatModel } from '../src/services/providers/modelList';

const mockOk = (body: object) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);

const mockErr = (status: number) =>
  Promise.resolve({
    ok: false,
    status,
    text: () => Promise.resolve('error'),
  } as Response);

beforeEach(() => mockFetch.mockReset());

describe('isChatModel', () => {
  it('keeps chat-capable models', () => {
    expect(isChatModel('gpt-5.4-mini')).toBe(true);
    expect(isChatModel('deepseek-v4-flash')).toBe(true);
    expect(isChatModel('claude-opus-5')).toBe(true);
  });

  it('drops models that cannot answer a triage prompt', () => {
    expect(isChatModel('text-embedding-3-small')).toBe(false);
    expect(isChatModel('gpt-4o-realtime-preview')).toBe(false);
    expect(isChatModel('whisper-1')).toBe(false);
    expect(isChatModel('dall-e-3')).toBe(false);
    expect(isChatModel('models/gemini-2.5-flash-image')).toBe(false);
  });
});

describe('listOpenAIModels', () => {
  it('filters non-chat models and sorts newest first', async () => {
    mockFetch.mockReturnValueOnce(
      mockOk({
        data: [
          { id: 'gpt-4o-mini', created: 100 },
          { id: 'text-embedding-3-small', created: 500 },
          { id: 'gpt-5.4', created: 300 },
        ],
      })
    );

    const result = await listOpenAIModels('sk-test');

    expect(result).toEqual({
      ok: true,
      models: [
        { id: 'gpt-5.4', label: 'gpt-5.4' },
        { id: 'gpt-4o-mini', label: 'gpt-4o-mini' },
      ],
    });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/models',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer sk-test' }),
      })
    );
  });

  it('reports a rejected key as an auth failure', async () => {
    mockFetch.mockReturnValueOnce(mockErr(401));
    expect(await listOpenAIModels('sk-bad')).toEqual({ ok: false, reason: 'auth' });
  });

  it('reports a server fault as a network failure', async () => {
    mockFetch.mockReturnValueOnce(mockErr(500));
    expect(await listOpenAIModels('sk-test')).toEqual({ ok: false, reason: 'network' });
  });

  it('reports a thrown request as a network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    expect(await listOpenAIModels('sk-test')).toEqual({ ok: false, reason: 'network' });
  });
});

describe('listClaudeModels', () => {
  it('uses the display name and opts in to browser access', async () => {
    mockFetch.mockReturnValueOnce(
      mockOk({ data: [{ id: 'claude-opus-5', display_name: 'Claude Opus 5' }] })
    );

    const result = await listClaudeModels('sk-ant-test');

    expect(result).toEqual({
      ok: true,
      models: [{ id: 'claude-opus-5', label: 'Claude Opus 5' }],
    });

    const [, init] = mockFetch.mock.calls[0];
    expect((init as RequestInit).headers).toMatchObject({
      'x-api-key': 'sk-ant-test',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    });
  });

  it('falls back to the id when no display name is returned', async () => {
    mockFetch.mockReturnValueOnce(mockOk({ data: [{ id: 'claude-sonnet-5' }] }));
    const result = await listClaudeModels('sk-ant-test');
    expect(result).toEqual({
      ok: true,
      models: [{ id: 'claude-sonnet-5', label: 'claude-sonnet-5' }],
    });
  });
});

describe('listGeminiModels', () => {
  it('strips the models/ prefix and keeps only generateContent models', async () => {
    mockFetch.mockReturnValueOnce(
      mockOk({
        models: [
          {
            name: 'models/gemini-3.7-flash',
            displayName: 'Gemini 3.7 Flash',
            supportedGenerationMethods: ['generateContent'],
          },
          {
            name: 'models/text-embedding-004',
            displayName: 'Embedding 004',
            supportedGenerationMethods: ['embedContent'],
          },
        ],
      })
    );

    const result = await listGeminiModels('AIza-test');

    expect(result).toEqual({
      ok: true,
      models: [{ id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash' }],
    });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).not.toContain('AIza-test'); // key NOT in URL
    expect((init as RequestInit).headers).toMatchObject({ 'x-goog-api-key': 'AIza-test' });
  });

  it('treats Google 400 as a rejected key, not a network fault', async () => {
    mockFetch.mockReturnValueOnce(mockErr(400));
    expect(await listGeminiModels('AIza-bad')).toEqual({ ok: false, reason: 'auth' });
  });
});

describe('listDeepSeekModels', () => {
  it('reads the OpenAI-compatible catalog', async () => {
    mockFetch.mockReturnValueOnce(
      mockOk({ data: [{ id: 'deepseek-v4-flash' }, { id: 'deepseek-v4-pro' }] })
    );

    const result = await listDeepSeekModels('sk-test');

    expect(result).toEqual({
      ok: true,
      models: [
        { id: 'deepseek-v4-flash', label: 'deepseek-v4-flash' },
        { id: 'deepseek-v4-pro', label: 'deepseek-v4-pro' },
      ],
    });
    expect(mockFetch).toHaveBeenCalledWith('https://api.deepseek.com/models', expect.anything());
  });

  it('tolerates a response with no data array', async () => {
    mockFetch.mockReturnValueOnce(mockOk({}));
    expect(await listDeepSeekModels('sk-test')).toEqual({ ok: true, models: [] });
  });
});
