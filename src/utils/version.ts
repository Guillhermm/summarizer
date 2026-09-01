/**
 * The manifest is the single source of the version number. Hardcoding it in the
 * UI too means one of the two is wrong after every release.
 *
 * Returns null outside the extension (the dev-server preview pages), where there
 * is no manifest to read.
 */
export const getExtensionVersion = (): string | null => {
  try {
    return chrome?.runtime?.getManifest?.().version ?? null;
  } catch {
    return null;
  }
};
