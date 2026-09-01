import { ModelListResult, ModelOption } from '../../types/providers';
import { fetchModelList, isChatModel } from './modelList';

interface OpenAIModel {
  id: string;
  created?: number;
}

interface OpenAIModelsResponse {
  data?: OpenAIModel[];
}

export const callOpenAI = async (
  prompt: string,
  model: string,
  apiKey: string
): Promise<string | null> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
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
      console.error('[Triage] OpenAI HTTP error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (error) {
    console.error('[Triage] OpenAI error:', error);
    return null;
  }
};

// OpenAI returns one flat catalog with no display names, so the id is the label.
export const listOpenAIModels = (apiKey: string): Promise<ModelListResult> =>
  fetchModelList({
    provider: 'OpenAI',
    url: 'https://api.openai.com/v1/models',
    headers: { Authorization: `Bearer ${apiKey}` },
    parse: (data) => {
      const models = (data as OpenAIModelsResponse).data ?? [];
      return models
        .filter((model) => model.id && isChatModel(model.id))
        .sort((a, b) => (b.created ?? 0) - (a.created ?? 0))
        .map((model): ModelOption => ({ id: model.id, label: model.id }));
    },
  });
