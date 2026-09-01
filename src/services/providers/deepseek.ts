import { ModelListResult, ModelOption } from '../../types/providers';
import { fetchModelList, isChatModel } from './modelList';

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
): Promise<string | null> => {
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
      console.error('[Triage] DeepSeek HTTP error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (error) {
    console.error('[Triage] DeepSeek error:', error);
    return null;
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
