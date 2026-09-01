import { CloudProviderId } from './types/providers';
import { DEFAULT_MODELS, RETIRED_MODELS } from './services/providers';

const CLOUD_PROVIDERS = Object.keys(DEFAULT_MODELS) as CloudProviderId[];

const modelKey = (provider: CloudProviderId) => `${provider}Model`;

/**
 * Fill in defaults without overwriting anything the user has chosen, and replace
 * any stored model the provider has since retired.
 */
chrome.runtime.onInstalled.addListener(() => {
  const keys = ['provider', ...CLOUD_PROVIDERS.map(modelKey)];

  chrome.storage.sync.get(keys, (stored) => {
    const updates: Record<string, string> = {};

    if (!stored.provider) {
      updates.provider = 'chrome-ai';
    }

    CLOUD_PROVIDERS.forEach((provider) => {
      const current = stored[modelKey(provider)] as string | undefined;

      if (!current || RETIRED_MODELS[provider].includes(current)) {
        updates[modelKey(provider)] = DEFAULT_MODELS[provider];
      }
    });

    if (Object.keys(updates).length > 0) {
      chrome.storage.sync.set(updates);
    }
  });
});
