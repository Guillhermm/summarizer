import { getExtensionVersion } from '../src/utils/version';

// The options footer shows this. Reading it from the manifest is what keeps the
// displayed version from drifting away from the one that was actually shipped.
describe('getExtensionVersion', () => {
  afterEach(() => {
    // @ts-expect-error resetting the global between cases
    delete global.chrome;
  });

  it('reads the version from the manifest', () => {
    global.chrome = {
      runtime: { getManifest: () => ({ version: '2.1.0' }) },
    } as unknown as typeof chrome;

    expect(getExtensionVersion()).toBe('2.1.0');
  });

  it('returns null outside the extension, where there is no manifest', () => {
    expect(getExtensionVersion()).toBeNull();
  });

  it('returns null when the runtime has no manifest to give', () => {
    global.chrome = { runtime: {} } as unknown as typeof chrome;
    expect(getExtensionVersion()).toBeNull();
  });
});
