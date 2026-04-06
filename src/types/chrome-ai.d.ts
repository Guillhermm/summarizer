// ─── Summarizer API (stable, Chrome 138+) ────────────────────────────────────

type SummarizerAvailability = 'available' | 'downloadable' | 'unavailable';

interface SummarizerCreateOptions {
  type?: 'tl;dr' | 'key-points' | 'teaser' | 'headline';
  format?: 'plain-text' | 'markdown';
  length?: 'short' | 'medium' | 'long';
  monitor?: (monitor: EventTarget) => void;
  signal?: AbortSignal;
}

interface SummarizerInstance {
  summarize(text: string, options?: { context?: string; signal?: AbortSignal }): Promise<string>;
  destroy(): void;
  ready: Promise<void>;
}

interface SummarizerFactory {
  availability(): Promise<SummarizerAvailability>;
  create(options?: SummarizerCreateOptions): Promise<SummarizerInstance>;
}

// ─── Language Model / Prompt API (experimental) ───────────────────────────────

interface LanguageModelCapabilities {
  available: SummarizerAvailability;
}

interface LanguageModelCreateOptions {
  systemPrompt?: string;
  temperature?: number;
  topK?: number;
}

interface LanguageModelSession {
  prompt(input: string): Promise<string>;
  destroy(): void;
}

interface LanguageModelFactory {
  capabilities(): Promise<LanguageModelCapabilities>;
  create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
}

interface WindowAI {
  languageModel?: LanguageModelFactory;
}

// ─── Globals ──────────────────────────────────────────────────────────────────

declare global {
  // Stable global since Chrome 138 (not window.ai.summarizer).
  var Summarizer: SummarizerFactory | undefined;

  interface Window {
    ai?: WindowAI;
  }
}

export {};
