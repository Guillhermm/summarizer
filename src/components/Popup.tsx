import React from 'react';
import { TriageResult, TriageStatus, ContentType, KnowledgeLevel, Verdict } from '../types/triage';
import { IconSummarizer } from './Icons/IconSummarizer';
import { IconSettings } from './Icons/IconSettings';

export interface PopupProps {
  status: TriageStatus;
  result: TriageResult | null;
  assessedAt: number | null;
  error: string | null;
  onAssess: () => void;
  onReassess: () => void;
  onOpenOptions: () => void;
  onReset: () => void;
}

const verdictConfig: Record<Verdict, { label: string; icon: string; classes: string }> = {
  recommended: {
    label: 'Worth reading',
    icon: '✓',
    classes:
      'tw-summarizer-bg-emerald-50 tw-summarizer-border-emerald-200 tw-summarizer-text-emerald-800',
  },
  optional: {
    label: 'Optional',
    icon: '◐',
    classes:
      'tw-summarizer-bg-amber-50 tw-summarizer-border-amber-200 tw-summarizer-text-amber-800',
  },
  skip: {
    label: 'Skip it',
    icon: '✕',
    classes: 'tw-summarizer-bg-rose-50 tw-summarizer-border-rose-200 tw-summarizer-text-rose-800',
  },
};

const contentTypeClasses: Record<ContentType, string> = {
  news: 'tw-summarizer-bg-blue-100 tw-summarizer-text-blue-700',
  opinion: 'tw-summarizer-bg-purple-100 tw-summarizer-text-purple-700',
  research: 'tw-summarizer-bg-indigo-100 tw-summarizer-text-indigo-700',
  tutorial: 'tw-summarizer-bg-teal-100 tw-summarizer-text-teal-700',
  marketing: 'tw-summarizer-bg-orange-100 tw-summarizer-text-orange-700',
  other: 'tw-summarizer-bg-gray-100 tw-summarizer-text-gray-500',
};

const knowledgeLevelClasses: Record<KnowledgeLevel, string> = {
  casual: 'tw-summarizer-bg-green-100 tw-summarizer-text-green-700',
  technical: 'tw-summarizer-bg-sky-100 tw-summarizer-text-sky-700',
  academic: 'tw-summarizer-bg-violet-100 tw-summarizer-text-violet-700',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Chip = ({ label, classes }: { label: string; classes: string }) => (
  <span
    className={`tw-summarizer-inline-flex tw-summarizer-items-center tw-summarizer-px-2.5 tw-summarizer-py-1 tw-summarizer-rounded-full tw-summarizer-text-xs tw-summarizer-font-medium ${classes}`}
  >
    {label}
  </span>
);

const IdleState = ({ onAssess }: { onAssess: () => void }) => (
  <div className="tw-summarizer-py-4 tw-summarizer-space-y-4">
    <p className="tw-summarizer-text-sm tw-summarizer-text-gray-400 tw-summarizer-leading-relaxed">
      Get a quick read on any article before you commit your time.
    </p>
    <button
      onClick={onAssess}
      className="tw-summarizer-p-2 tw-summarizer-uppercase tw-summarizer-w-full tw-summarizer-bg-indigo-500 hover:tw-summarizer-bg-indigo-600 tw-summarizer-text-white tw-summarizer-text-sm tw-summarizer-font-bold tw-summarizer-rounded-lg tw-summarizer-transition-colors tw-summarizer-flex tw-summarizer-items-center tw-summarizer-justify-center tw-summarizer-gap-2 tw-summarizer-cursor-pointer"
    >
      Assess this page
      <span aria-hidden>→</span>
    </button>
  </div>
);

const LoadingState = () => (
  <div className="tw-summarizer-py-4 tw-summarizer-space-y-3 tw-summarizer-animate-pulse">
    <div className="tw-summarizer-h-3 tw-summarizer-bg-gray-200 tw-summarizer-rounded-full tw-summarizer-w-full" />
    <div className="tw-summarizer-h-3 tw-summarizer-bg-gray-200 tw-summarizer-rounded-full tw-summarizer-w-4/5" />
    <div className="tw-summarizer-h-3 tw-summarizer-bg-gray-200 tw-summarizer-rounded-full tw-summarizer-w-3/5" />
    <div className="tw-summarizer-flex tw-summarizer-gap-2 tw-summarizer-pt-1">
      <div className="tw-summarizer-h-6 tw-summarizer-bg-gray-200 tw-summarizer-rounded-full tw-summarizer-w-14" />
      <div className="tw-summarizer-h-6 tw-summarizer-bg-gray-200 tw-summarizer-rounded-full tw-summarizer-w-20" />
      <div className="tw-summarizer-h-6 tw-summarizer-bg-gray-200 tw-summarizer-rounded-full tw-summarizer-w-16" />
    </div>
    <div className="tw-summarizer-h-16 tw-summarizer-bg-gray-200 tw-summarizer-rounded-xl tw-summarizer-w-full" />
    <div className="tw-summarizer-h-2.5 tw-summarizer-bg-gray-100 tw-summarizer-rounded-full tw-summarizer-w-24 tw-summarizer-mx-auto" />
  </div>
);

const PROVIDER_LABELS: Record<string, string> = {
  'chrome-ai': 'Chrome AI',
  openai: 'OpenAI',
  claude: 'Anthropic Claude',
  gemini: 'Google Gemini',
  deepseek: 'DeepSeek',
};

const formatTimeAgo = (ts: number): string => {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ResultState = ({
  result,
  assessedAt,
  onReassess,
}: {
  result: TriageResult;
  assessedAt: number | null;
  onReassess: () => void;
}) => {
  const verdict = verdictConfig[result.verdict];
  const providerLabel = PROVIDER_LABELS[result.poweredBy] ?? result.poweredBy;

  return (
    <div className="tw-summarizer-py-4 tw-summarizer-space-y-3">
      <p className="tw-summarizer-text-sm tw-summarizer-text-gray-700 tw-summarizer-leading-relaxed">
        &ldquo;{result.argument}&rdquo;
      </p>

      <div className="tw-summarizer-flex tw-summarizer-flex-wrap tw-summarizer-gap-1.5">
        <Chip
          label={result.readingTime}
          classes="tw-summarizer-bg-gray-100 tw-summarizer-text-gray-500"
        />
        <Chip
          label={capitalize(result.contentType)}
          classes={contentTypeClasses[result.contentType]}
        />
        <Chip
          label={capitalize(result.knowledgeLevel)}
          classes={knowledgeLevelClasses[result.knowledgeLevel]}
        />
      </div>

      <div
        className={`tw-summarizer-p-3 tw-summarizer-rounded-xl tw-summarizer-border ${verdict.classes}`}
      >
        <div className="tw-summarizer-flex tw-summarizer-items-center tw-summarizer-gap-1.5 tw-summarizer-text-sm tw-summarizer-font-semibold tw-summarizer-mb-1">
          <span aria-hidden>{verdict.icon}</span>
          <span>{verdict.label}</span>
        </div>
        <p className="tw-summarizer-text-xs tw-summarizer-leading-relaxed tw-summarizer-opacity-75">
          {result.verdictReason}
        </p>
      </div>

      <div className="tw-summarizer-flex tw-summarizer-items-center tw-summarizer-justify-center tw-summarizer-gap-1.5">
        <p className="tw-summarizer-text-xs tw-summarizer-text-gray-300">
          {assessedAt
            ? `${formatTimeAgo(assessedAt)} via ${providerLabel}`
            : `via ${providerLabel}`}
        </p>
        <span className="tw-summarizer-text-gray-200" aria-hidden>
          ·
        </span>
        <button
          onClick={onReassess}
          className="tw-summarizer-text-xs tw-summarizer-text-indigo-400 hover:tw-summarizer-text-indigo-600 tw-summarizer-transition-colors tw-summarizer-cursor-pointer"
        >
          Reassess
        </button>
      </div>
    </div>
  );
};

const ErrorState = ({ error, onRetry }: { error: string | null; onRetry: () => void }) => (
  <div className="tw-summarizer-py-4 tw-summarizer-space-y-3">
    <p className="tw-summarizer-text-sm tw-summarizer-text-gray-500 tw-summarizer-leading-relaxed">
      {error}
    </p>
    <button
      onClick={onRetry}
      className="tw-summarizer-text-xs tw-summarizer-text-indigo-500 hover:tw-summarizer-text-indigo-700 tw-summarizer-transition-colors tw-summarizer-cursor-pointer"
    >
      Try again
    </button>
  </div>
);

export const Popup = ({
  status,
  result,
  assessedAt,
  error,
  onAssess,
  onReassess,
  onOpenOptions,
  onReset,
}: PopupProps) => (
  <div className="tw-summarizer-w-80 tw-summarizer-bg-white tw-summarizer-font-sans">
    <div className="tw-summarizer-flex tw-summarizer-items-center tw-summarizer-justify-between tw-summarizer-px-4 tw-summarizer-py-3 tw-summarizer-border-b tw-summarizer-border-gray-200">
      <div className="tw-summarizer-flex tw-summarizer-items-center tw-summarizer-gap-2">
        <IconSummarizer className="tw-summarizer-w-4 tw-summarizer-h-4 tw-summarizer-text-indigo-500" />
        <span className="tw-summarizer-text-sm tw-summarizer-font-semibold tw-summarizer-text-gray-900">
          Summarizer
        </span>
      </div>
      <div className="tw-summarizer-flex tw-summarizer-items-center tw-summarizer-gap-3">
        {status === 'result' && (
          <button
            onClick={onReset}
            className="tw-summarizer-text-xs tw-summarizer-text-gray-400 hover:tw-summarizer-text-gray-600 tw-summarizer-transition-colors tw-summarizer-cursor-pointer"
          >
            Reset
          </button>
        )}
        <button
          onClick={onOpenOptions}
          className="tw-summarizer-text-gray-400 hover:tw-summarizer-text-gray-600 tw-summarizer-transition-colors tw-summarizer-cursor-pointer"
          title="Settings"
        >
          <IconSettings className="tw-summarizer-w-4 tw-summarizer-h-4" />
        </button>
      </div>
    </div>

    <div className="tw-summarizer-px-4">
      {status === 'idle' && <IdleState onAssess={onAssess} />}
      {status === 'loading' && <LoadingState />}
      {status === 'result' && result && (
        <ResultState result={result} assessedAt={assessedAt} onReassess={onReassess} />
      )}
      {status === 'error' && <ErrorState error={error} onRetry={onAssess} />}
    </div>
  </div>
);
