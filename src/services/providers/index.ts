import { ProviderId, ProviderConfig } from '../../types/providers';
import { callOpenAI } from './openai';
import { callClaude } from './claude';
import { callGemini } from './gemini';
import { callDeepSeek } from './deepseek';

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
      { id: 'gpt-4o-mini', label: 'GPT-4o mini' },
      { id: 'gpt-4o', label: 'GPT-4o' },
      { id: 'gpt-5.4-mini', label: 'GPT-5.4 mini' },
      { id: 'gpt-5.4', label: 'GPT-5.4' },
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
      { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
      { id: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
    ],
    needsApiKey: true,
    apiKeyLabel: 'Anthropic API Key',
    apiKeyPlaceholder: 'sk-ant-...',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    models: [
      { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
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
      { id: 'deepseek-chat', label: 'DeepSeek V3 (Chat)' },
      { id: 'deepseek-reasoner', label: 'DeepSeek R1 (Reasoner)' },
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

export const PROVIDER_CALLERS: Record<Exclude<ProviderId, 'chrome-ai'>, ProviderCallFn> = {
  openai: callOpenAI,
  claude: callClaude,
  gemini: callGemini,
  deepseek: callDeepSeek,
};

export const DEFAULT_MODELS: Record<Exclude<ProviderId, 'chrome-ai'>, string> = {
  openai: 'gpt-4o-mini',
  claude: 'claude-sonnet-4-6',
  gemini: 'gemini-2.5-flash',
  deepseek: 'deepseek-chat',
};
