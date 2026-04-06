export const callGemini = async (
  prompt: string,
  model: string,
  apiKey: string
): Promise<string | null> => {
  try {
    // Use header-based auth — safer than query param (not captured in logs or proxies).
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: 'You are a reading triage assistant. Respond only with valid JSON — no markdown, no explanation.',
            },
          ],
        },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) {
      console.error('[Triage] Gemini HTTP error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (error) {
    console.error('[Triage] Gemini error:', error);
    return null;
  }
};
