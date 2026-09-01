import { CloudProviderId, ModelListResult, ProviderConfig } from '../../types/providers';
import { callOpenAI, listOpenAIModels } from './openai';
import { callClaude, listClaudeModels } from './claude';
import { callGemini, listGeminiModels } from './gemini';
import { callDeepSeek, listDeepSeekModels } from './deepseek';

// The `models` lists below are fallbacks only. Once an API key is verified, the
// options page replaces them with whatever the provider's own catalog returns,
// so a model retired upstream stops being offered without an extension release.
export const PROVIDERS: ProviderConfig[] = [
  {
    id: 'chrome-ai',
    label: 'Chrome AI',
    models: [],
    needsApiKey: false,
  },
  {
    id: 'openai',
    label: 'OpenAI',
    models: [
      { id: 'gpt-5.4-mini', label: 'gpt-5.4-mini' },
      { id: 'gpt-5.4', label: 'gpt-5.4' },
      { id: 'gpt-4o-mini', label: 'gpt-4o-mini' },
      { id: 'gpt-4o', label: 'gpt-4o' },
    ],
    needsApiKey: true,
    apiKeyLabel: 'OpenAI API Key',
    apiKeyPlaceholder: 'sk-...',
  },
  {
    id: 'claude',
    label: 'Claude',
    models: [
      { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
      { id: 'claude-sonnet-5', label: 'Claude Sonnet 5' },
      { id: 'claude-opus-5', label: 'Claude Opus 5' },
    ],
    needsApiKey: true,
    apiKeyLabel: 'Anthropic API Key',
    apiKeyPlaceholder: 'sk-ant-...',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    models: [
      { id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash' },
      { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash' },
      { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash Lite' },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    ],
    needsApiKey: true,
    apiKeyLabel: 'Google AI API Key',
    apiKeyPlaceholder: 'AIza...',
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    models: [
      { id: 'deepseek-v4-flash', label: 'deepseek-v4-flash' },
      { id: 'deepseek-v4-pro', label: 'deepseek-v4-pro' },
    ],
    needsApiKey: true,
    apiKeyLabel: 'DeepSeek API Key',
    apiKeyPlaceholder: 'sk-...',
  },
];

export type ProviderCallFn = (
  prompt: string,
  model: string,
  apiKey: string
) => Promise<string | null>;

export type ProviderModelListFn = (apiKey: string) => Promise<ModelListResult>;

export const PROVIDER_CALLERS: Record<CloudProviderId, ProviderCallFn> = {
  openai: callOpenAI,
  claude: callClaude,
  gemini: callGemini,
  deepseek: callDeepSeek,
};

export const PROVIDER_MODEL_LISTERS: Record<CloudProviderId, ProviderModelListFn> = {
  openai: listOpenAIModels,
  claude: listClaudeModels,
  gemini: listGeminiModels,
  deepseek: listDeepSeekModels,
};

export const DEFAULT_MODELS: Record<CloudProviderId, string> = {
  openai: 'gpt-4o-mini',
  claude: 'claude-sonnet-5',
  gemini: 'gemini-3.7-flash',
  deepseek: 'deepseek-v4-flash',
};

// Model ids that shipped in earlier versions and are confirmed gone upstream.
// A stored selection matching one of these is migrated to the provider default
// on update, so a user who never reopens the options page stops seeing errors.
// Only add an id here once its removal is confirmed in the provider's docs; the
// options page already corrects any other stale selection against the live list.
export const RETIRED_MODELS: Record<CloudProviderId, string[]> = {
  openai: [],
  claude: [],
  gemini: [],
  deepseek: ['deepseek-chat', 'deepseek-reasoner'],
};
