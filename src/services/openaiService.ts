import axios from 'axios';
import { AIServiceResponse } from './types';

const getOpenAIApiKey = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['apiKey']).then((response) => {
      return resolve(response.apiKey);
    });
  });
};

export const getOpenAIResponse = async (params: {
  content: string;
  maxLength?: number;
  apiKey?: string;
}): Promise<AIServiceResponse> => {
  const { content, maxLength, apiKey } = params;
  const url = 'https://api.openai.com/v1/chat/completions';
  const key = apiKey ?? (await getOpenAIApiKey());
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${key}`,
  };

  const data = {
    model: 'gpt-3.5-turbo',
    max_tokens: maxLength,
    messages: [
      {
        role: 'user',
        content,
      },
    ],
  };

  try {
    const response = await axios.post(url, data, { headers });
    return {
      text: response.data.choices[0].message.content || '',
    };
  } catch (error) {
    console.error(error);
  }

  return {
    text: 'There was an error with the request. Please, check your API Key.',
    hasError: true,
  };
};
