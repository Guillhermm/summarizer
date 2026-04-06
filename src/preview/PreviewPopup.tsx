import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Popup as PopupUI } from '../components/Popup';
import { StylesWrapper } from '../components/StylesWrapper';
import { TriageResult, TriageStatus } from '../types/triage';
import '../styles/main.css';

const mockResult: TriageResult = {
  argument:
    'The author argues that on-device AI in browsers will fundamentally shift how people interact with web content.',
  readingTime: '~6 min',
  contentType: 'opinion',
  knowledgeLevel: 'technical',
  verdict: 'recommended',
  verdictReason: 'Concise, well-supported argument relevant to anyone building for the web.',
  poweredBy: 'chrome-ai',
};

const PreviewPopup = () => {
  const [status, setStatus] = useState<TriageStatus>('idle');
  const [result, setResult] = useState<TriageResult | null>(null);

  const handleAssess = () => {
    setStatus('loading');
    setTimeout(() => {
      setResult(mockResult);
      setStatus('result');
    }, 1500);
  };

  return (
    <div className="tw-summarizer-w-screen tw-summarizer-h-screen tw-summarizer-flex tw-summarizer-items-center tw-summarizer-justify-center tw-summarizer-bg-black tw-summarizer-bg-opacity-10">
      <div className="tw-summarizer-bg-white tw-summarizer-absolute tw-summarizer-rounded-lg tw-summarizer-shadow-xl tw-summarizer-overflow-hidden">
        <StylesWrapper>
          <PopupUI
            status={status}
            result={result}
            assessedAt={Date.now() - 7200000}
            error={null}
            onAssess={handleAssess}
            onReassess={handleAssess}
            onOpenOptions={() => undefined}
            onReset={() => {
              setStatus('idle');
              setResult(null);
            }}
          />
        </StylesWrapper>
      </div>
    </div>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<PreviewPopup />);
}
