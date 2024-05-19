export const createHoverDiv = (text: string) => {
  const hoverDiv = document.createElement('div');
  hoverDiv.style.position = 'absolute';
  hoverDiv.style.border = '1px dotted #000';
  hoverDiv.style.padding = '4px';
  hoverDiv.textContent = text;
  hoverDiv.style.cursor = 'pointer';
  return hoverDiv;
};
