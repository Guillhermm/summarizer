import { ProviderCallError } from '../../types/providers';

const MAX_MESSAGE_CHARS = 300;

/**
 * OpenAI, DeepSeek, Anthropic and Google all nest a human-readable reason under
 * `error.message`. Falls back to the raw body so nothing is lost when one of
 * them answers with something else.
 */
export const readProviderError = (status: number, body: string): ProviderCallError => {
  let message = body;

  try {
    const parsed = JSON.parse(body);
    message = parsed?.error?.message ?? parsed?.message ?? body;
  } catch {
    // Not JSON: the raw body is the best we have.
  }

  const trimmed = String(message ?? '').trim();

  return {
    status,
    message:
      trimmed.length > MAX_MESSAGE_CHARS ? `${trimmed.slice(0, MAX_MESSAGE_CHARS)}...` : trimmed,
  };
};

export const networkFailure = (error: unknown): ProviderCallError => ({
  message: error instanceof Error ? error.message : 'the request could not be sent',
});
