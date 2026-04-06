export type ProviderId = 'chrome-ai' | 'openai' | 'claude' | 'gemini' | 'deepseek';

export interface ModelOption {
  id: string;
  label: string;
}

export interface ProviderConfig {
  id: ProviderId;
  label: string;
  models: ModelOption[];
  needsApiKey: boolean;
  apiKeyLabel?: string;
  apiKeyPlaceholder?: string;
}
