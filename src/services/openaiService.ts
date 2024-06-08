import axios from 'axios';

const getOpenAIApiKey = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['apiKey']).then((response) => {
      return resolve(response.apiKey);
    });
  });
};

export const getOpenAIResponse = async (content: string, maxLength?: number): Promise<string> => {
  const url = 'https://api.openai.com/v1/chat/completions';
  const key = await getOpenAIApiKey();
  console.log('key', key);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${key}`,
  };

  const data = {
    model: 'gpt-3.5-turbo',
    max_tokens: maxLength ?? undefined,
    messages: [
      {
        role: 'user',
        content,
      },
    ],
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.choices[0].message.content || '';
  } catch (error) {
    console.error(error);
  }

  return `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
  `;
};
