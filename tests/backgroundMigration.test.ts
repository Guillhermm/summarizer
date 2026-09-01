import { DEFAULT_MODELS, RETIRED_MODELS } from '../src/services/providers';

// chrome.runtime.onInstalled fires on fresh installs *and* on every update, so
// the handler has to fill gaps without discarding what the user configured.
const store: Record<string, unknown> = {};
let installedHandler: () => void;
const setSpy = jest.fn();

const loadBackground = async (initial: Record<string, unknown>) => {
  Object.keys(store).forEach((key) => delete store[key]);
  Object.assign(store, initial);
  setSpy.mockClear();
  jest.resetModules();

  global.chrome = {
    runtime: {
      onInstalled: {
        addListener: (handler: () => void) => {
          installedHandler = handler;
        },
      },
    },
    storage: {
      sync: {
        get: jest.fn((keys: string[], cb: (result: Record<string, unknown>) => void) => {
          const result: Record<string, unknown> = {};
          keys.forEach((k) => {
            if (store[k] !== undefined) result[k] = store[k];
          });
          cb(result);
        }),
        set: setSpy,
      },
    },
  } as unknown as typeof chrome;

  await import('../src/background');
  installedHandler();
};

describe('onInstalled defaults', () => {
  it('seeds provider and model defaults on a fresh install', async () => {
    await loadBackground({});

    expect(setSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'chrome-ai',
        deepseekModel: DEFAULT_MODELS.deepseek,
        openaiModel: DEFAULT_MODELS.openai,
      })
    );
  });

  it('does not overwrite a provider the user already chose', async () => {
    await loadBackground({
      provider: 'openai',
      openaiModel: 'gpt-4o',
      claudeModel: 'claude-sonnet-5',
      geminiModel: 'gemini-3.7-flash',
      deepseekModel: DEFAULT_MODELS.deepseek,
    });

    expect(setSpy).not.toHaveBeenCalled();
  });

  it('migrates a model the provider has retired', async () => {
    await loadBackground({
      provider: 'deepseek',
      openaiModel: 'gpt-4o',
      claudeModel: 'claude-sonnet-5',
      geminiModel: 'gemini-3.7-flash',
      deepseekModel: 'deepseek-chat',
    });

    expect(setSpy).toHaveBeenCalledWith({ deepseekModel: DEFAULT_MODELS.deepseek });
  });

  it('never lists a current default as retired', () => {
    Object.entries(RETIRED_MODELS).forEach(([provider, retired]) => {
      expect(retired).not.toContain(DEFAULT_MODELS[provider as keyof typeof DEFAULT_MODELS]);
    });
  });
});
