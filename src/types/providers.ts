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

/**
 * A failed provider call keeps the provider's own words. Without them the popup
 * can only say "it failed", which hides the cases the user can actually act on:
 * an exhausted balance, a retired model, a rate limit.
 */
export interface ProviderCallError {
  status?: number;
  message?: string;
}

export type ProviderCallResult = { ok: true; text: string } | ({ ok: false } & ProviderCallError);

export interface ProviderConfig {
  id: ProviderId;
  label: string;
  /** Fallback list, used only until the provider's live list is fetched. */
  models: ModelOption[];
  needsApiKey: boolean;
  apiKeyLabel?: string;
  apiKeyPlaceholder?: string;
}
