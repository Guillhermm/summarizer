export const callOpenAI = async (
  prompt: string,
  model: string,
  apiKey: string
): Promise<string | null> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a reading triage assistant. Respond only with valid JSON — no markdown, no explanation.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error('[Triage] OpenAI HTTP error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (error) {
    console.error('[Triage] OpenAI error:', error);
    return null;
  }
};
