import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Form, FormOption, FormOptionsMain, FormSelect, FormSubmit } from './components/Form';
import { StylesWrapper } from './components/StylesWrapper';
import { PROVIDERS } from './services/providers';
import { ProviderId } from './types/providers';
import { sanitize } from './utils/sanitize';
import { validateApiKey } from './utils/formValidation';

// Per-provider state stored as flat keys in chrome.storage.sync.
type ProviderKeys = {
  openaiKey: string;
  openaiModel: string;
  claudeKey: string;
  claudeModel: string;
  geminiKey: string;
  geminiModel: string;
  deepseekKey: string;
  deepseekModel: string;
};

const DEFAULT_KEYS: ProviderKeys = {
  openaiKey: '',
  openaiModel: 'gpt-4o-mini',
  claudeKey: '',
  claudeModel: 'claude-sonnet-4-6',
  geminiKey: '',
  geminiModel: 'gemini-2.5-flash',
  deepseekKey: '',
  deepseekModel: 'deepseek-chat',
};

const ProviderTab = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`tw-summarizer-px-3 tw-summarizer-py-1.5 tw-summarizer-text-sm tw-summarizer-rounded-md tw-summarizer-font-medium tw-summarizer-transition-colors tw-summarizer-cursor-pointer ${
      active
        ? 'tw-summarizer-bg-indigo-500 tw-summarizer-text-white'
        : 'tw-summarizer-text-gray-500 hover:tw-summarizer-text-gray-700 hover:tw-summarizer-bg-gray-100'
    }`}
  >
    {label}
  </button>
);

const ChromeAIInfo = () => (
  <div className="tw-summarizer-text-sm tw-summarizer-text-gray-500 tw-summarizer-space-y-2 tw-summarizer-leading-relaxed">
    <p>
      Chrome AI runs the Gemini Nano model fully on-device — no API key, no data sent externally.
    </p>
    <p className="tw-summarizer-font-medium tw-summarizer-text-gray-700">Requirements</p>
    <ul className="tw-summarizer-list-disc tw-summarizer-pl-4 tw-summarizer-space-y-1">
      <li>Chrome 138 or later</li>
      <li>22 GB free storage · 16 GB RAM (or GPU with 4 GB+ VRAM)</li>
      <li>
        Enable{' '}
        <span className="tw-summarizer-font-mono tw-summarizer-text-xs tw-summarizer-bg-gray-100 tw-summarizer-px-1 tw-summarizer-rounded">
          Optimization Guide On Device Model
        </span>{' '}
        in{' '}
        <span className="tw-summarizer-font-mono tw-summarizer-text-xs tw-summarizer-bg-gray-100 tw-summarizer-px-1 tw-summarizer-rounded">
          chrome://flags
        </span>
      </li>
    </ul>
    <p className="tw-summarizer-text-xs tw-summarizer-text-gray-400">
      Chrome AI provides a key-points summary. For full triage (verdict, content type, knowledge
      level), use a cloud provider.
    </p>
  </div>
);

const LANGUAGES = [
  { id: 'en-US', label: 'English (US)' },
  { id: 'en-GB', label: 'English (UK)' },
  { id: 'pt-BR', label: 'Portuguese (Brazil)' },
  { id: 'pt-PT', label: 'Portuguese (Portugal)' },
  { id: 'es-ES', label: 'Spanish (Spain)' },
  { id: 'es-MX', label: 'Spanish (Mexico)' },
  { id: 'fr-FR', label: 'French' },
  { id: 'de-DE', label: 'German' },
  { id: 'it-IT', label: 'Italian' },
  { id: 'ja-JP', label: 'Japanese' },
  { id: 'zh-CN', label: 'Chinese (Simplified)' },
  { id: 'ko-KR', label: 'Korean' },
];

const Options = () => {
  const [provider, setProvider] = useState<ProviderId>('openai');
  const [language, setLanguage] = useState<string>('en-US');
  const [keys, setKeys] = useState<ProviderKeys>(DEFAULT_KEYS);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(
      ['provider', 'language', ...Object.keys(DEFAULT_KEYS)],
      (result) => {
        setProvider((result.provider as ProviderId) || 'openai');
        setLanguage((result.language as string) || 'en-US');
        setKeys({
          openaiKey: result.openaiKey || '',
          openaiModel: result.openaiModel || DEFAULT_KEYS.openaiModel,
          claudeKey: result.claudeKey || '',
          claudeModel: result.claudeModel || DEFAULT_KEYS.claudeModel,
          geminiKey: result.geminiKey || '',
          geminiModel: result.geminiModel || DEFAULT_KEYS.geminiModel,
          deepseekKey: result.deepseekKey || '',
          deepseekModel: result.deepseekModel || DEFAULT_KEYS.deepseekModel,
        });
      }
    );
  }, []);

  const activeProvider = PROVIDERS.find((p) => p.id === provider)!;
  const apiKey = provider !== 'chrome-ai' ? keys[`${provider}Key` as keyof ProviderKeys] as string : '';
  const model = provider !== 'chrome-ai' ? keys[`${provider}Model` as keyof ProviderKeys] as string : '';

  const handleApiKeyChange = (value: string) => {
    const sanitized = sanitize(value);
    setKeys((prev) => ({ ...prev, [`${provider}Key`]: sanitized }));
    const result = validateApiKey(sanitized, provider);
    setApiKeyError(result.error ? result.message || null : null);
  };

  const handleModelChange = (value: string) => {
    setKeys((prev) => ({ ...prev, [`${provider}Model`]: value }));
  };

  const handleSave = () => {
    chrome.storage.sync.set({ provider, language, ...keys }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <Form>
      <FormOptionsMain>
        <div className="tw-summarizer-space-y-4">
          <div>
            <p className="tw-summarizer-text-sm tw-summarizer-font-semibold tw-summarizer-text-gray-700 tw-summarizer-mb-2">
              AI Provider
            </p>
            <div className="tw-summarizer-flex tw-summarizer-flex-wrap tw-summarizer-gap-1.5 tw-summarizer-p-1 tw-summarizer-bg-gray-100 tw-summarizer-rounded-lg">
              {PROVIDERS.map((p) => (
                <ProviderTab
                  key={p.id}
                  label={p.label}
                  active={provider === p.id}
                  onClick={() => {
                    setProvider(p.id);
                    setApiKeyError(null);
                  }}
                />
              ))}
            </div>
          </div>

          <FormSelect
            label="Response Language"
            value={language}
            options={LANGUAGES}
            onChange={setLanguage}
            text="The triage result will be written in this language."
          />

          {provider === 'chrome-ai' ? (
            <ChromeAIInfo />
          ) : (
            <div className="tw-summarizer-space-y-3">
              <FormOption
                label={activeProvider.apiKeyLabel || 'API Key'}
                placeholder={activeProvider.apiKeyPlaceholder || ''}
                type="password"
                value={apiKey}
                handleChange={handleApiKeyChange}
              />
              {apiKeyError && (
                <p className="tw-summarizer-text-xs tw-summarizer-text-red-500">{apiKeyError}</p>
              )}
              {activeProvider.models.length > 0 && (
                <FormSelect
                  label="Model"
                  value={model}
                  options={activeProvider.models}
                  onChange={handleModelChange}
                />
              )}
            </div>
          )}
        </div>
      </FormOptionsMain>

      <div className="!tw-summarizer-px-4 tw-summarizer-pb-4 tw-summarizer-flex tw-summarizer-items-center tw-summarizer-justify-between">
        <FormSubmit saveSettings={handleSave} />
        {saved && (
          <span className="tw-summarizer-text-sm tw-summarizer-text-emerald-600 tw-summarizer-font-medium">
            Saved ✓
          </span>
        )}
      </div>
    </Form>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <StylesWrapper>
        <Options />
      </StylesWrapper>
    </React.StrictMode>
  );
}
