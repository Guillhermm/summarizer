import { ModelListResult, ModelOption, ProviderCallResult } from '../../types/providers';
import { fetchModelList, isChatModel } from './modelList';
import { networkFailure, readProviderError } from './errors';

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
): Promise<ProviderCallResult> => {
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
      const body = await response.text();
      console.error('[Triage] Gemini HTTP error:', response.status, body);
      return { ok: false, ...readProviderError(response.status, body) };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return text ? { ok: true, text } : { ok: false, message: 'the response contained no text' };
  } catch (error) {
    console.error('[Triage] Gemini error:', error);
    return { ok: false, ...networkFailure(error) };
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
