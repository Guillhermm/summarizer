export type ProviderId = 'chrome-ai' | 'openai' | 'claude' | 'gemini' | 'deepseek';

export type CloudProviderId = Exclude<ProviderId, 'chrome-ai'>;

export interface ModelOption {
  id: string;
  label: string;
}

/**
 * Why a model listing failed. `auth` means the provider rejected the key, which
 * is what lets the options page report an invalid key without a second request.
 */
export type ModelListFailure = 'auth' | 'network';

export type ModelListResult =
  | { ok: true; models: ModelOption[] }
  | { ok: false; reason: ModelListFailure };

export interface ProviderConfig {
  id: ProviderId;
  label: string;
  /** Fallback list, used only until the provider's live list is fetched. */
  models: ModelOption[];
  needsApiKey: boolean;
  apiKeyLabel?: string;
  apiKeyPlaceholder?: string;
}
