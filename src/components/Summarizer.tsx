import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from './Button';
import { IconSummarizer } from './Icons';
import { Modal } from './Modal';
import { StylesWrapper } from './StylesWrapper';
import { summarizeText } from '../services/summaryService';
import {
  MAX_SUMMARIZED_TEXT,
  MIN_TEXT_LENGTH_ALLOWED,
  MIN_TEXT_WORDS_ALLOWED,
} from '../utils/constants';

export interface SummarizerProps {
  isEnabled?: boolean;
  maxLength?: number;
  minChars?: number;
  minWords?: number;
}

export const Summarizer = ({
  isEnabled = false,
  maxLength = MAX_SUMMARIZED_TEXT,
  minChars = MIN_TEXT_LENGTH_ALLOWED,
  minWords = MIN_TEXT_WORDS_ALLOWED,
}: SummarizerProps) => {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [summary, setSummary] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isEnabled) {
      hoveredElement?.classList.remove('summarizer-hovered');
      setHoveredElement(null);
      return;
    }

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'DIV' || target.tagName === 'P' || target.tagName === 'SPAN') &&
        target.textContent &&
        // Min chars allowed (to be in options).
        target.textContent.length > minChars &&
        // Min words allowed (to be in options).
        target.textContent.split(/\s+/).filter(Boolean).length > minWords &&
        // Prevents summarizer modal to also be hovered.
        !document.getElementById('summarizer-modal')
      ) {
        console.log('tag', target.tagName);
        console.log('text', target.textContent);
        console.log('length', target.textContent.length);
        console.log('words', target.textContent.split(/\s+/).filter(Boolean).length);
        console.log('min lenght allowed', minChars);
        console.log('min words allowed', minWords);
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
  }, [isEnabled]);

  const fetchSummary = async (text: string) => {
    const summaryResult: string = await summarizeText(text, maxLength, 'openai');
    setSummary(summaryResult);
  };

  const handleSummarizerClick = () => {
    if (hoveredElement && hoveredElement.textContent) {
      fetchSummary(hoveredElement.textContent);
      setModalVisible(true);
    }
  };

  return (
    isEnabled && (
      <>
        {hoveredElement &&
          ReactDOM.createPortal(
            <StylesWrapper>
              <Button
                className="!tw-summarizer-leading-none !tw-summarizer-rounded-[50%] tw-summarizer-absolute tw-summarizer-right-4 tw-summarizer-bottom-4 tw-summarizer-z-[9999] tw-summarizer-transition hover:tw-summarizer-scale-110"
                onClick={() => {
                  handleSummarizerClick();
                }}
              >
                <IconSummarizer className="tw-summarizer-w-6 tw-summarizer-h-6 tw-summarizer-text-white" />
              </Button>
            </StylesWrapper>,
            // Appends button to the hovered element.
            hoveredElement
          )}
        {modalVisible && summary && (
          <Modal summarizedText={summary} onClose={() => setModalVisible(false)} />
        )}
      </>
    )
  );
};
