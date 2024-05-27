import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { summarizeText } from '../services/summaryService';
import { Button } from './Button';
import { Modal } from './Modal';
import '../styles/tailwind.css';

export const Summarizer = () => {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [summary, setSummary] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'DIV' ||
          target.tagName === 'P' ||
          target.tagName === 'SPAN') &&
        target.textContent &&
        // Min chars allowed (to be in options).
        target.textContent.length > 1000 &&
        // Min words allowed (to be in options).
        target.textContent.split(/\s+/).filter(Boolean).length > 200 &&
        // Prevents summarizer modal to also be hovered.
        document.getElementsByClassName('summarizer-modal').length === 0
      ) {
        setHoveredElement(target);
        target.classList.add('summarizer-hovered');
      }
    };

    const handleMouseOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains('summarizer-hovered')) {
        const rect = target.getBoundingClientRect();
        const isMouseInside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        if (!isMouseInside) {
          target.classList.remove('summarizer-hovered');
          setHoveredElement(null);
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  const fetchSummary = async (text: string) => {
    // Or get from user settings...
    const maxLength = 100;
    const summaryResult: string = await summarizeText(
      text,
      maxLength,
      'openai'
    );
    setSummary(summaryResult);
  };

  const handleSummarizerClick = () => {
    if (hoveredElement && hoveredElement.textContent) {
      fetchSummary(hoveredElement.textContent);
      setModalVisible(true);
    }
  };

  return (
    <>
      {hoveredElement &&
        ReactDOM.createPortal(
          <Button
            text="Summarizer"
            className="absolute centralize-absolute z-[9999]"
            onClick={() => {
              handleSummarizerClick();
            }}
          />,
          // Appends button to the hovered element.
          hoveredElement
        )}
      {modalVisible && summary && (
        <Modal
          summarizedText={summary}
          onClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
};
