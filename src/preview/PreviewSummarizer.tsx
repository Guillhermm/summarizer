import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Popup as PopupUI } from '../components/Popup';
import { StylesWrapper } from '../components/StylesWrapper';
import { TriageResult, TriageStatus } from '../types/triage';
import '../styles/main.css';

const mockResult: TriageResult = {
  argument:
    'The myths of humanity share a single underlying structure that transcends culture, pointing to universal patterns in the human psyche.',
  readingTime: '~14 min',
  contentType: 'research',
  knowledgeLevel: 'academic',
  verdict: 'optional',
  verdictReason: 'Rich and rewarding, but dense — best saved for when you have time to focus.',
  poweredBy: 'chrome-ai',
};

const PreviewSummarizer = () => {
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
  root.render(<PreviewSummarizer />);
}
