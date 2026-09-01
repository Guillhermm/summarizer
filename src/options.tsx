import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Form, FormOption, FormOptionsMain, FormSelect, FormSubmit } from './components/Form';
import { StylesWrapper } from './components/StylesWrapper';
import { configs } from './configs';
import { DEFAULT_MODELS, PROVIDERS, PROVIDER_MODEL_LISTERS } from './services/providers';
import { CloudProviderId, ModelOption, ProviderId } from './types/providers';
import { sanitize } from './utils/sanitize';
import { validateApiKey } from './utils/formValidation';

const CLOUD_PROVIDERS = Object.keys(DEFAULT_MODELS) as CloudProviderId[];

// Per-provider state stored as flat keys in chrome.storage.sync.
type ProviderKeys = Record<string, string>;

const keyField = (provider: CloudProviderId) => `${provider}Key`;
const modelField = (provider: CloudProviderId) => `${provider}Model`;

const DEFAULT_KEYS: ProviderKeys = CLOUD_PROVIDERS.reduce<ProviderKeys>(
  (acc, provider) => ({
    ...acc,
    [keyField(provider)]: '',
    [modelField(provider)]: DEFAULT_MODELS[provider],
  }),
  {}
);

// Result of checking a key against the provider's model listing endpoint.
type KeyStatus = 'idle' | 'checking' | 'valid' | 'invalid' | 'unreachable';

const KEY_STATUS_MESSAGES: Record<Exclude<KeyStatus, 'idle'>, string> = {
  checking: configs.form.validation.apiChecking,
  valid: configs.form.validation.apiValid,
  invalid: configs.form.validation.apiInvalid,
  unreachable: configs.form.validation.apiUnreachable,
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
    className={`tw-summarizer-px-2 tw-summarizer-py-1.5 tw-summarizer-text-sm tw-summarizer-rounded-md tw-summarizer-font-medium tw-summarizer-transition-colors tw-summarizer-cursor-pointer tw-summarizer-border ${
      active
        ? 'tw-summarizer-bg-indigo-500 tw-summarizer-text-white tw-summarizer-border-indigo-600 tw-summarizer-shadow-sm'
        : 'tw-summarizer-bg-white tw-summarizer-text-gray-600 tw-summarizer-border-gray-300 hover:tw-summarizer-border-indigo-300 hover:tw-summarizer-text-indigo-600'
    }`}
  >
    {label}
  </button>
);

const ChromeAIInfo = () => (
  <div className="tw-summarizer-text-sm tw-summarizer-space-y-3 tw-summarizer-leading-relaxed">
    <div className="tw-summarizer-bg-amber-50 tw-summarizer-border tw-summarizer-border-amber-200 tw-summarizer-rounded-lg tw-summarizer-p-3 tw-summarizer-text-amber-800 tw-summarizer-text-xs">
      <strong>Manual setup required.</strong> Chrome AI does not work out of the box — your machine
      must meet specific requirements and you must enable a flag in Chrome.
    </div>
    <div>
      <p className="tw-summarizer-font-medium tw-summarizer-text-gray-700 tw-summarizer-mb-1">
        Requirements
      </p>
      <ul className="tw-summarizer-list-disc tw-summarizer-pl-4 tw-summarizer-space-y-1 tw-summarizer-text-gray-500">
        <li>Chrome 138 or later on desktop (not supported on mobile)</li>
        <li>At least 22 GB free storage on the volume with your Chrome profile</li>
        <li>16 GB RAM, or a GPU with 4 GB+ VRAM</li>
        <li>Unmetered network connection for initial model download (~1.7 GB)</li>
      </ul>
    </div>
    <div>
      <p className="tw-summarizer-font-medium tw-summarizer-text-gray-700 tw-summarizer-mb-1">
        How to enable
      </p>
      <ol className="tw-summarizer-list-decimal tw-summarizer-pl-4 tw-summarizer-space-y-1 tw-summarizer-text-gray-500">
        <li>
          Open{' '}
          <span className="tw-summarizer-font-mono tw-summarizer-text-xs tw-summarizer-bg-gray-100 tw-summarizer-px-1 tw-summarizer-rounded">
            chrome://flags
          </span>
        </li>
        <li>
          Search for{' '}
          <span className="tw-summarizer-font-mono tw-summarizer-text-xs tw-summarizer-bg-gray-100 tw-summarizer-px-1 tw-summarizer-rounded">
            Optimization Guide On Device Model
          </span>{' '}
          and set it to <strong>Enabled</strong>
        </li>
        <li>Restart Chrome, then wait for the model to download automatically</li>
      </ol>
    </div>
    <p className="tw-summarizer-text-xs tw-summarizer-text-gray-400">
      Note: Chrome AI returns a key-points summary rather than a full structured triage. For
      verdict, content type, and knowledge level classification, configure a cloud provider below as
      your primary.
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

export const Options = () => {
  const [provider, setProvider] = useState<ProviderId>('chrome-ai');
  const [language, setLanguage] = useState<string>('en-US');
  const [keys, setKeys] = useState<ProviderKeys>(DEFAULT_KEYS);
  const [keyStatus, setKeyStatus] = useState<KeyStatus>('idle');
  const [liveModels, setLiveModels] = useState<Partial<Record<CloudProviderId, ModelOption[]>>>({});
  const [saved, setSaved] = useState(false);

  // A listing that resolves after the user switched tabs must not overwrite the
  // state of the provider now on screen.
  const activeProviderRef = useRef<ProviderId>('chrome-ai');

  const selectProvider = (next: ProviderId) => {
    activeProviderRef.current = next;
    setProvider(next);
    setKeyStatus('idle');
  };

  /**
   * Asks the provider for its model catalog. The call is authenticated, so it
   * doubles as key verification. `announce` is off for background refreshes so
   * the page only reports a result the user asked for.
   */
  const loadModels = async (target: CloudProviderId, key: string, announce: boolean) => {
    if (!key) {
      if (announce) setKeyStatus('idle');
      return;
    }

    if (validateApiKey(key, target).error) {
      if (announce) setKeyStatus('invalid');
      return;
    }

    if (announce) setKeyStatus('checking');

    const result = await PROVIDER_MODEL_LISTERS[target](key);

    if (activeProviderRef.current !== target) return;

    if (!result.ok) {
      if (announce) setKeyStatus(result.reason === 'auth' ? 'invalid' : 'unreachable');
      return;
    }

    setLiveModels((prev) => ({ ...prev, [target]: result.models }));

    // Drop a stored selection the provider no longer offers.
    setKeys((prev) => {
      const current = prev[modelField(target)];
      if (result.models.length === 0 || result.models.some((m) => m.id === current)) return prev;
      return { ...prev, [modelField(target)]: result.models[0].id };
    });

    if (announce) setKeyStatus('valid');
  };

  useEffect(() => {
    chrome.storage.sync.get(['provider', 'language', ...Object.keys(DEFAULT_KEYS)], (result) => {
      const storedProvider = (result.provider as ProviderId) || 'chrome-ai';
      const storedKeys = CLOUD_PROVIDERS.reduce<ProviderKeys>(
        (acc, id) => ({
          ...acc,
          [keyField(id)]: result[keyField(id)] || '',
          [modelField(id)]: result[modelField(id)] || DEFAULT_KEYS[modelField(id)],
        }),
        {}
      );

      activeProviderRef.current = storedProvider;
      setProvider(storedProvider);
      setLanguage((result.language as string) || 'en-US');
      setKeys(storedKeys);

      if (storedProvider !== 'chrome-ai') {
        loadModels(storedProvider, storedKeys[keyField(storedProvider)], false);
      }
    });
    // Runs once on mount; loadModels only reads state through setState updaters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeProvider = PROVIDERS.find((p) => p.id === provider)!;
  const cloudProvider = provider !== 'chrome-ai' ? (provider as CloudProviderId) : null;
  const apiKey = cloudProvider ? keys[keyField(cloudProvider)] : '';
  const model = cloudProvider ? keys[modelField(cloudProvider)] : '';

  // Live catalog when we have one, the bundled fallback until then. The stored
  // selection is always present so the select never disagrees with the state.
  const modelOptions: ModelOption[] = (() => {
    if (!cloudProvider) return [];
    const options = liveModels[cloudProvider] ?? activeProvider.models;
    return model && !options.some((option) => option.id === model)
      ? [{ id: model, label: model }, ...options]
      : options;
  })();

  const handleApiKeyChange = (value: string) => {
    if (!cloudProvider) return;
    const sanitized = sanitize(value);
    setKeys((prev) => ({ ...prev, [keyField(cloudProvider)]: sanitized }));
    setKeyStatus('idle');
  };

  const handleApiKeyBlur = (value: string) => {
    if (!cloudProvider) return;
    loadModels(cloudProvider, sanitize(value), true);
  };

  const handleModelChange = (value: string) => {
    if (!cloudProvider) return;
    setKeys((prev) => ({ ...prev, [modelField(cloudProvider)]: value }));
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
            <div className="tw-summarizer-flex tw-summarizer-flex-wrap tw-summarizer-gap-1.5">
              {PROVIDERS.map((p) => (
                <ProviderTab
                  key={p.id}
                  label={p.label}
                  active={provider === p.id}
                  onClick={() => {
                    selectProvider(p.id);
                    if (p.id !== 'chrome-ai' && !liveModels[p.id as CloudProviderId]) {
                      loadModels(
                        p.id as CloudProviderId,
                        keys[keyField(p.id as CloudProviderId)],
                        false
                      );
                    }
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
            text="The triage result text will be written in this language. Labels like content type and verdict remain in English regardless. Results are cached per page. As consequence, if you change language and want a fresh assessment, use the Reassess button in the popup."
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
                onBlur={handleApiKeyBlur}
              />
              {keyStatus !== 'idle' && (
                <p
                  className={`tw-summarizer-text-xs ${
                    keyStatus === 'valid'
                      ? 'tw-summarizer-text-green-700'
                      : keyStatus === 'checking'
                        ? 'tw-summarizer-text-gray-500'
                        : 'tw-summarizer-text-red-500'
                  }`}
                >
                  {KEY_STATUS_MESSAGES[keyStatus]}
                </p>
              )}
              {modelOptions.length > 0 && (
                <FormSelect
                  label="Model"
                  value={model}
                  options={modelOptions}
                  onChange={handleModelChange}
                />
              )}
            </div>
          )}
        </div>
      </FormOptionsMain>

      <div className="tw-summarizer-border-gray-200 tw-summarizer-px-4 tw-summarizer-py-4 tw-summarizer-flex tw-summarizer-items-center tw-summarizer-justify-between">
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
