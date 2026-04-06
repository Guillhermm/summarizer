export const callClaude = async (
  prompt: string,
  model: string,
  apiKey: string
): Promise<string | null> => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system:
          'You are a reading triage assistant. Respond only with valid JSON — no markdown, no explanation.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error('[Triage] Claude HTTP error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.content?.[0]?.text ?? null;
  } catch (error) {
    console.error('[Triage] Claude error:', error);
    return null;
  }
};
