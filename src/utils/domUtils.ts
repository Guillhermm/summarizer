/**
 * Gets the processed CSS from the document head, given a selector.
 * If allowed, also removes the original source.
 */
export const getProcessedCSS = (selectors: string, removeSource = false): string => {
  let cssText = '';

  // Fetches the processed CSS from the document head with the custom attribute.
  const styleElements = Array.from(document.head.querySelectorAll(selectors));

  for (const styleElement of styleElements) {
    cssText += styleElement.textContent;
    if (removeSource) {
      // Removes the style element from head.
      document.head.removeChild(styleElement);
    }
  }

  return cssText;
};
