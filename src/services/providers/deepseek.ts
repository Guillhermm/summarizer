import { ModelListResult, ModelOption, ProviderCallResult } from '../../types/providers';
import { fetchModelList, isChatModel } from './modelList';
import { networkFailure, readProviderError } from './errors';

interface DeepSeekModel {
  id: string;
}

interface DeepSeekModelsResponse {
  data?: DeepSeekModel[];
}

// DeepSeek uses an OpenAI-compatible API.
export const callDeepSeek = async (
  prompt: string,
  model: string,
  apiKey: string
): Promise<ProviderCallResult> => {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a reading triage assistant. Respond only with valid JSON — no markdown, no explanation.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('[Triage] DeepSeek HTTP error:', response.status, body);
      return { ok: false, ...readProviderError(response.status, body) };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    return text ? { ok: true, text } : { ok: false, message: 'the response contained no text' };
  } catch (error) {
    console.error('[Triage] DeepSeek error:', error);
    return { ok: false, ...networkFailure(error) };
  }
};

export const listDeepSeekModels = (apiKey: string): Promise<ModelListResult> =>
  fetchModelList({
    provider: 'DeepSeek',
    url: 'https://api.deepseek.com/models',
    headers: { Authorization: `Bearer ${apiKey}` },
    parse: (data) => {
      const models = (data as DeepSeekModelsResponse).data ?? [];
      return models
        .filter((model) => model.id && isChatModel(model.id))
        .map((model): ModelOption => ({ id: model.id, label: model.id }));
    },
  });
