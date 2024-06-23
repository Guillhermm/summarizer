import { getOpenAIResponse } from './openaiService';

export const summarizeText = async (
  text: string,
  maxLength: number,
  service: string
): Promise<string> => {
  // Better specifying max length within prompt than using max_tokens
  // since with max_tokens the response is sometimes getting cut.
  const content = `
    Summarize this text:\n\n${text}.
    The returned summarized text must be a full response, respecting the limits
    of max tokens equals to ${maxLength}.
  `;

  // Ideally, we should have a backend server in the middle layer to consume
  // AI APIs so we don't have to expose the key (prompt) of the functionality,
  // but this is okay for a free project.
  switch (service) {
    case 'openai':
      const response = await getOpenAIResponse({ content });

      if (response?.hasError) {
        return 'Text could not be summarized. Please, check your API Key.';
      }

      return response.text;
    default:
      throw new Error('Unsupported service');
  }
};
