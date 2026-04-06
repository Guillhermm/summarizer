chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    provider: 'openai',
    openaiModel: 'gpt-4o-mini',
    claudeModel: 'claude-sonnet-4-6',
    geminiModel: 'gemini-2.5-flash',
    deepseekModel: 'deepseek-chat',
  });
});
