import { ProviderId } from './providers';

export type ContentType = 'news' | 'opinion' | 'research' | 'tutorial' | 'marketing' | 'other';
export type KnowledgeLevel = 'casual' | 'technical' | 'academic';
export type Verdict = 'recommended' | 'optional' | 'skip';
export type TriageStatus = 'idle' | 'loading' | 'result' | 'error';
export type PoweredBy = ProviderId;

export interface TriageResult {
  argument: string;
  readingTime: string;
  contentType: ContentType;
  knowledgeLevel: KnowledgeLevel;
  verdict: Verdict;
  verdictReason: string;
  poweredBy: PoweredBy;
}
