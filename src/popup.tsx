import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Popup as PopupUI } from './components/Popup';
import { StylesWrapper } from './components/StylesWrapper';
import { triagePage } from './services/triageService';
import { getCachedTriage, setCachedTriage, clearCachedTriage } from './services/cacheService';
import { TriageResult, TriageStatus } from './types/triage';

const Popup = () => {
  const [status, setStatus] = useState<TriageStatus>('idle');
  const [result, setResult] = useState<TriageResult | null>(null);
  const [assessedAt, setAssessedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tabUrl, setTabUrl] = useState<string | null>(null);

  // On mount, check cache for the active tab before showing idle state.
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
      const url = tab?.url ?? null;
      setTabUrl(url);
      if (!url) return;

      const cached = await getCachedTriage(url);
      if (cached) {
        setResult(cached.result);
        setAssessedAt(cached.assessedAt);
        setStatus('result');
      }
    });
  }, []);

  const handleAssess = async (forceRefresh = false) => {
    setStatus('loading');
    setError(null);

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab?.id || !tab.url) {
        throw new Error('Could not identify the active tab.');
      }

      const url = tab.url;
      setTabUrl(url);

      // Return cached result unless explicitly refreshing.
      if (!forceRefresh) {
        const cached = await getCachedTriage(url);
        if (cached) {
          setResult(cached.result);
          setAssessedAt(cached.assessedAt);
          setStatus('result');
          return;
        }
      }

      let response: { text: string; title: string } | undefined;
      try {
        response = await chrome.tabs.sendMessage(tab.id, { action: 'extractText' });
      } catch {
        throw new Error(
          'Could not reach the page content. Try reloading the tab, then click Assess again.'
        );
      }

      if (!response?.text || response.text.trim().length < 200) {
        throw new Error(
          'Not enough article content found on this page. Try a page with a full article.'
        );
      }

      const triageResult = await triagePage(response.text);

      await setCachedTriage(url, triageResult);
      setResult(triageResult);
      setAssessedAt(Date.now());
      setStatus('result');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Try refreshing the page.'
      );
      setStatus('error');
    }
  };

  const handleReassess = () => handleAssess(true);

  const handleOpenOptions = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  };

  const handleReset = async () => {
    if (tabUrl) await clearCachedTriage(tabUrl);
    setStatus('idle');
    setResult(null);
    setAssessedAt(null);
    setError(null);
  };

  return (
    <PopupUI
      status={status}
      result={result}
      assessedAt={assessedAt}
      error={error}
      onAssess={() => handleAssess(false)}
      onReassess={handleReassess}
      onOpenOptions={handleOpenOptions}
      onReset={handleReset}
    />
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <StylesWrapper>
        <Popup />
      </StylesWrapper>
    </React.StrictMode>
  );
}
