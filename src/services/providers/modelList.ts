import { ModelListResult, ModelOption } from '../../types/providers';

export interface ModelListRequest {
  /** Provider label, used only to prefix console diagnostics. */
  provider: string;
  url: string;
  headers: Record<string, string>;
  parse: (data: unknown) => ModelOption[];
  /** Statuses that mean "the key was rejected" rather than "the call failed". */
  authStatuses?: number[];
}

const DEFAULT_AUTH_STATUSES = [401, 403];

/**
 * Shared GET-and-parse for the providers' model listing endpoints. A successful
 * call doubles as key verification: every one of these endpoints authenticates.
 */
export const fetchModelList = async ({
  provider,
  url,
  headers,
  parse,
  authStatuses = DEFAULT_AUTH_STATUSES,
}: ModelListRequest): Promise<ModelListResult> => {
  try {
    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      console.error(`[Triage] ${provider} model list HTTP error:`, response.status);
      return { ok: false, reason: authStatuses.includes(response.status) ? 'auth' : 'network' };
    }

    return { ok: true, models: parse(await response.json()) };
  } catch (error) {
    console.error(`[Triage] ${provider} model list error:`, error);
    return { ok: false, reason: 'network' };
  }
};

// Providers that expose one flat catalog also return embedding, audio and image
// models, none of which can answer a triage prompt.
const NON_CHAT_MARKERS = [
  'embed',
  'tts',
  'whisper',
  'audio',
  'realtime',
  'transcribe',
  'moderation',
  'dall-e',
  'image',
  'sora',
  'rerank',
  'guard',
];

export const isChatModel = (id: string): boolean => {
  const lower = id.toLowerCase();
  return !NON_CHAT_MARKERS.some((marker) => lower.includes(marker));
};
