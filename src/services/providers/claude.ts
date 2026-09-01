import { ModelListResult, ModelOption, ProviderCallResult } from '../../types/providers';
import { fetchModelList } from './modelList';
import { networkFailure, readProviderError } from './errors';

interface ClaudeModel {
  id: string;
  display_name?: string;
}

interface ClaudeModelsResponse {
  data?: ClaudeModel[];
}

// Anthropic rejects browser-origin requests unless this header opts in.
const BROWSER_HEADERS = {
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
};

export const callClaude = async (
  prompt: string,
  model: string,
  apiKey: string
): Promise<ProviderCallResult> => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        ...BROWSER_HEADERS,
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system:
          'You are a reading triage assistant. Respond only with valid JSON — no markdown, no explanation.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('[Triage] Claude HTTP error:', response.status, body);
      return { ok: false, ...readProviderError(response.status, body) };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;

    return text ? { ok: true, text } : { ok: false, message: 'the response contained no text' };
  } catch (error) {
    console.error('[Triage] Claude error:', error);
    return { ok: false, ...networkFailure(error) };
  }
};

// Anthropic returns the newest models first and supplies a display name.
export const listClaudeModels = (apiKey: string): Promise<ModelListResult> =>
  fetchModelList({
    provider: 'Claude',
    url: 'https://api.anthropic.com/v1/models?limit=1000',
    headers: { 'x-api-key': apiKey, ...BROWSER_HEADERS },
    parse: (data) => {
      const models = (data as ClaudeModelsResponse).data ?? [];
      return models
        .filter((model) => model.id)
        .map((model): ModelOption => ({ id: model.id, label: model.display_name || model.id }));
    },
  });
