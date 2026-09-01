import { ContentType, KnowledgeLevel, TriageResult, Verdict } from '../types/triage';
import { CloudProviderId, ProviderCallError, ProviderId } from '../types/providers';
import { PROVIDER_CALLERS, DEFAULT_MODELS } from './providers';
import { getChromeAITriage } from './chromeAIService';

const MAX_TRIAGE_CHARS = 12000;

const CONTENT_TYPES: ContentType[] = [
  'news',
  'opinion',
  'research',
  'tutorial',
  'marketing',
  'other',
];
const KNOWLEDGE_LEVELS: KnowledgeLevel[] = ['casual', 'technical', 'academic'];
const VERDICTS: Verdict[] = ['recommended', 'optional', 'skip'];

const buildPrompt = (text: string, language: string): string => {
  const truncated = text.length > MAX_TRIAGE_CHARS ? text.slice(0, MAX_TRIAGE_CHARS) + '...' : text;

  return `Analyze this article and return ONLY a JSON object with these exact fields:
{
  "argument": "One sentence stating the central claim or main point",
  "readingTime": "Estimated reading time like '~5 min'",
  "contentType": "news|opinion|research|tutorial|marketing|other",
  "knowledgeLevel": "casual|technical|academic",
  "verdict": "recommended|optional|skip",
  "verdictReason": "One sentence explaining the verdict honestly"
}

IMPORTANT: Write all text values in this language: ${language}

Article:
${truncated}`;
};

export const parseTriageResponse = (raw: string): Omit<TriageResult, 'poweredBy'> => {
  const cleaned = raw.replace(/```(?:json)?\n?/gi, '').trim();
  const parsed = JSON.parse(cleaned);

  if (!parsed.argument || !parsed.verdict) {
    throw new Error('Invalid triage response structure');
  }

  return {
    argument: String(parsed.argument),
    readingTime: String(parsed.readingTime ?? ''),
    contentType: CONTENT_TYPES.includes(parsed.contentType) ? parsed.contentType : 'other',
    knowledgeLevel: KNOWLEDGE_LEVELS.includes(parsed.knowledgeLevel)
      ? parsed.knowledgeLevel
      : 'casual',
    verdict: VERDICTS.includes(parsed.verdict) ? parsed.verdict : 'optional',
    verdictReason: String(parsed.verdictReason ?? ''),
  };
};

const PROVIDER_LABELS: Record<CloudProviderId, string> = {
  openai: 'OpenAI',
  claude: 'Claude',
  gemini: 'Gemini',
  deepseek: 'DeepSeek',
};

/**
 * Repeats what the provider said, then adds the step that usually clears it. A
 * bare "request failed" leaves the user with nothing to act on.
 */
const describeCallFailure = (
  provider: CloudProviderId,
  model: string,
  failure: ProviderCallError
): string => {
  const label = PROVIDER_LABELS[provider];
  const status = failure.status;
  const detail = failure.message ? ` ${failure.message}` : '';

  if (status === 401 || status === 403) {
    return `${label} rejected your API key (${status}).${detail} Update it in the extension options.`;
  }

  if (status === 402) {
    return `${label} says this account cannot be billed (402).${detail} Check your balance or billing with ${label}.`;
  }

  if (status === 404 || status === 400) {
    return `${label} rejected the request for model "${model}" (${status}).${detail} Open the extension options and re-check your API key: the model list refreshes from the provider, and picking a listed model usually fixes this.`;
  }

  if (status === 429) {
    return `${label} rate-limited this request (429).${detail} Wait a moment and try again.`;
  }

  if (status) {
    return `${label} returned an error (${status}).${detail}`;
  }

  return `${label} could not be reached.${detail} Check your connection and try again.`;
};

const getProviderSettings = (): Promise<{
  provider: ProviderId;
  model: string;
  apiKey: string;
  language: string;
}> =>
  new Promise((resolve) => {
    chrome.storage.sync.get(
      [
        'provider',
        'language',
        'openaiKey',
        'openaiModel',
        'claudeKey',
        'claudeModel',
        'geminiKey',
        'geminiModel',
        'deepseekKey',
        'deepseekModel',
      ],
      (result) => {
        const provider = (result.provider as ProviderId) || 'chrome-ai';
        const language = (result.language as string) || 'en-US';

        if (provider === 'chrome-ai') {
          return resolve({ provider, model: '', apiKey: '', language });
        }

        const model = result[`${provider}Model`] || DEFAULT_MODELS[provider as CloudProviderId];
        const apiKey = result[`${provider}Key`] || '';

        resolve({ provider, model, apiKey, language });
      }
    );
  });

export const triagePage = async (text: string): Promise<TriageResult> => {
  const { provider, model, apiKey, language } = await getProviderSettings();

  if (provider === 'chrome-ai') {
    return getChromeAITriage(text, language);
  }

  if (!apiKey) {
    throw new Error(`No API key set for ${provider}. Add one in the extension options.`);
  }

  const prompt = buildPrompt(text, language);
  const caller = PROVIDER_CALLERS[provider as CloudProviderId];
  const result = await caller(prompt, model, apiKey);

  if (!result.ok) {
    throw new Error(describeCallFailure(provider, model, result));
  }

  try {
    return { ...parseTriageResponse(result.text), poweredBy: provider };
  } catch {
    throw new Error(`${provider} returned an unexpected response. Try a different model.`);
  }
};
