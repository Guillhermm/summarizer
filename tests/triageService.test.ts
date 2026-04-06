import { parseTriageResponse } from '../src/services/triageService';

describe('parseTriageResponse', () => {
  const valid = {
    argument: 'The author argues that remote work increases productivity.',
    readingTime: '~4 min',
    contentType: 'opinion',
    knowledgeLevel: 'casual',
    verdict: 'recommended',
    verdictReason: 'Clear thesis with solid supporting data.',
  };

  it('parses a valid JSON response', () => {
    const result = parseTriageResponse(JSON.stringify(valid));
    expect(result.argument).toBe(valid.argument);
    expect(result.readingTime).toBe('~4 min');
    expect(result.contentType).toBe('opinion');
    expect(result.knowledgeLevel).toBe('casual');
    expect(result.verdict).toBe('recommended');
    expect(result.verdictReason).toBe(valid.verdictReason);
  });

  it('strips markdown code fences before parsing', () => {
    const wrapped = '```json\n' + JSON.stringify(valid) + '\n```';
    const result = parseTriageResponse(wrapped);
    expect(result.verdict).toBe('recommended');
  });

  it('falls back to "other" for unknown contentType', () => {
    const result = parseTriageResponse(JSON.stringify({ ...valid, contentType: 'podcast' }));
    expect(result.contentType).toBe('other');
  });

  it('falls back to "casual" for unknown knowledgeLevel', () => {
    const result = parseTriageResponse(JSON.stringify({ ...valid, knowledgeLevel: 'expert' }));
    expect(result.knowledgeLevel).toBe('casual');
  });

  it('falls back to "optional" for unknown verdict', () => {
    const result = parseTriageResponse(JSON.stringify({ ...valid, verdict: 'maybe' }));
    expect(result.verdict).toBe('optional');
  });

  it('throws on missing argument field', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { argument, ...noArgument } = valid;
    expect(() => parseTriageResponse(JSON.stringify(noArgument))).toThrow();
  });

  it('throws on missing verdict field', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { verdict, ...noVerdict } = valid;
    expect(() => parseTriageResponse(JSON.stringify(noVerdict))).toThrow();
  });

  it('throws on invalid JSON', () => {
    expect(() => parseTriageResponse('not json at all')).toThrow();
  });
});
