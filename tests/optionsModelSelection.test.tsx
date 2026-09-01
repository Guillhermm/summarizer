import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

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
      set: jest.fn((data: Record<string, unknown>, cb?: () => void) => {
        Object.assign(store, data);
        cb?.();
      }),
    },
  },
} as unknown as typeof chrome;

import { Options } from '../src/options';

const VALID_DEEPSEEK_KEY = 'sk-' + 'a'.repeat(40);

const mockCatalog = (ids: string[]) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: ids.map((id) => ({ id })) }),
    text: () => Promise.resolve(''),
  } as Response);

const seed = (data: Record<string, unknown>) => {
  Object.keys(store).forEach((key) => delete store[key]);
  Object.assign(store, data);
};

const enterKey = (value: string) => {
  const input = screen.getByPlaceholderText('sk-...');
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input, { target: { value } });
};

beforeEach(() => {
  mockFetch.mockReset();
  (chrome.storage.sync.set as jest.Mock).mockClear();
});

describe('options model selection', () => {
  it('lists the models returned for a verified key', async () => {
    seed({ provider: 'deepseek', deepseekKey: '', deepseekModel: 'deepseek-v4-flash' });
    mockFetch.mockReturnValueOnce(mockCatalog(['deepseek-v4-flash', 'deepseek-v4-pro']));

    render(<Options />);
    await screen.findByPlaceholderText('sk-...');
    enterKey(VALID_DEEPSEEK_KEY);

    expect(await screen.findByText('API Key has been validated')).toBeInTheDocument();
    expect(await screen.findByRole('option', { name: 'deepseek-v4-pro' })).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith('https://api.deepseek.com/models', expect.anything());
  });

  it('reports a key the provider rejects', async () => {
    seed({ provider: 'deepseek', deepseekKey: '', deepseekModel: 'deepseek-v4-flash' });
    mockFetch.mockReturnValueOnce(
      Promise.resolve({ ok: false, status: 401, text: () => Promise.resolve('') } as Response)
    );

    render(<Options />);
    await screen.findByPlaceholderText('sk-...');
    enterKey(VALID_DEEPSEEK_KEY);

    expect(await screen.findByText('API Key is invalid')).toBeInTheDocument();
  });

  it('reports a provider it could not reach', async () => {
    seed({ provider: 'deepseek', deepseekKey: '', deepseekModel: 'deepseek-v4-flash' });
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Options />);
    await screen.findByPlaceholderText('sk-...');
    enterKey(VALID_DEEPSEEK_KEY);

    expect(await screen.findByText(/Could not reach the provider/)).toBeInTheDocument();
  });

  it('rejects a malformed key without calling the provider', async () => {
    seed({ provider: 'deepseek', deepseekKey: '', deepseekModel: 'deepseek-v4-flash' });

    render(<Options />);
    await screen.findByPlaceholderText('sk-...');
    enterKey('not-a-key');

    expect(await screen.findByText('API Key is invalid')).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('replaces a stored model the provider no longer offers', async () => {
    // The exact case that broke DeepSeek: a model id retired upstream.
    seed({ provider: 'deepseek', deepseekKey: VALID_DEEPSEEK_KEY, deepseekModel: 'deepseek-chat' });
    mockFetch.mockReturnValueOnce(mockCatalog(['deepseek-v4-flash', 'deepseek-v4-pro']));

    render(<Options />);

    const select = await screen.findByLabelText<HTMLSelectElement>('Model');
    await waitFor(() => expect(select.value).toBe('deepseek-v4-flash'));

    // Persisted without waiting for Save: until storage is updated the popup
    // keeps calling the retired model and keeps failing.
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({ deepseekModel: 'deepseek-v4-flash' });
    expect(store.deepseekModel).toBe('deepseek-v4-flash');
  });

  it('keeps a stored model the provider still offers', async () => {
    seed({
      provider: 'deepseek',
      deepseekKey: VALID_DEEPSEEK_KEY,
      deepseekModel: 'deepseek-v4-pro',
    });
    mockFetch.mockReturnValueOnce(mockCatalog(['deepseek-v4-flash', 'deepseek-v4-pro']));

    render(<Options />);

    const select = await screen.findByLabelText<HTMLSelectElement>('Model');
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(select.value).toBe('deepseek-v4-pro');
  });

  it('does not call any provider when Chrome AI is selected', async () => {
    seed({ provider: 'chrome-ai' });

    render(<Options />);

    await screen.findByText(/Manual setup required/);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
