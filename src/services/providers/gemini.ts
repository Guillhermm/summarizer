import { ModelListResult, ModelOption } from '../../types/providers';
import { fetchModelList, isChatModel } from './modelList';

interface GeminiModel {
  name?: string;
  displayName?: string;
  supportedGenerationMethods?: string[];
}

interface GeminiModelsResponse {
  models?: GeminiModel[];
}

export const callGemini = async (
  prompt: string,
  model: string,
  apiKey: string
): Promise<string | null> => {
  try {
    // Use header-based auth — safer than query param (not captured in logs or proxies).
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: 'You are a reading triage assistant. Respond only with valid JSON — no markdown, no explanation.',
            },
          ],
        },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) {
      console.error('[Triage] Gemini HTTP error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (error) {
    console.error('[Triage] Gemini error:', error);
    return null;
  }
};

export const listGeminiModels = (apiKey: string): Promise<ModelListResult> =>
  fetchModelList({
    provider: 'Gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000',
    headers: { 'x-goog-api-key': apiKey },
    // Google answers a rejected key with 400, not 401.
    authStatuses: [400, 401, 403],
    parse: (data) => {
      const models = (data as GeminiModelsResponse).models ?? [];
      return models
        .filter(
          (model) =>
            model.name &&
            model.supportedGenerationMethods?.includes('generateContent') &&
            isChatModel(model.name)
        )
        .map((model): ModelOption => {
          // The catalog names models as `models/<id>`, the call endpoint wants `<id>`.
          const id = (model.name as string).replace(/^models\//, '');
          return { id, label: model.displayName || id };
        });
    },
  });
