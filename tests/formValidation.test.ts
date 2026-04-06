import { validateApiKey, validateEmptyField } from '../src/utils/formValidation';

describe('validateApiKey', () => {
  describe('OpenAI', () => {
    it('accepts a valid key', () => {
      const result = validateApiKey('sk-' + 'a'.repeat(48), 'openai');
      expect(result.error).toBe(false);
    });

    it('rejects a key with wrong prefix', () => {
      const result = validateApiKey('pk-' + 'a'.repeat(48), 'openai');
      expect(result.error).toBe(true);
    });

    it('rejects a key that is too short', () => {
      const result = validateApiKey('sk-short', 'openai');
      expect(result.error).toBe(true);
    });
  });

  describe('Claude', () => {
    it('accepts a valid key', () => {
      const result = validateApiKey('sk-ant-' + 'a'.repeat(50), 'claude');
      expect(result.error).toBe(false);
    });

    it('rejects an OpenAI key for Claude', () => {
      const result = validateApiKey('sk-' + 'a'.repeat(48), 'claude');
      expect(result.error).toBe(true);
    });
  });

  describe('Gemini', () => {
    it('accepts a valid key', () => {
      const result = validateApiKey('AIza' + 'a'.repeat(35), 'gemini');
      expect(result.error).toBe(false);
    });

    it('rejects a key with wrong prefix', () => {
      const result = validateApiKey('sk-' + 'a'.repeat(35), 'gemini');
      expect(result.error).toBe(true);
    });
  });

  describe('DeepSeek', () => {
    it('accepts a valid key', () => {
      const result = validateApiKey('sk-' + 'a'.repeat(40), 'deepseek');
      expect(result.error).toBe(false);
    });
  });

  describe('chrome-ai', () => {
    it('always passes (no key needed)', () => {
      const result = validateApiKey('', 'chrome-ai');
      expect(result.error).toBe(false);
    });
  });

  it('returns no error for an empty value (key is optional)', () => {
    const result = validateApiKey('', 'openai');
    expect(result.error).toBe(false);
    expect(result.message).toBeUndefined();
  });
});

describe('validateEmptyField', () => {
  it('returns no error for a non-empty value', () => {
    expect(validateEmptyField('something').error).toBe(false);
  });

  it('returns an error for an empty value', () => {
    expect(validateEmptyField('').error).toBe(true);
  });
});
