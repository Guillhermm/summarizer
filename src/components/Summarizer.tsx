import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { summarizeText } from '../services/summaryService';
import { Button } from './Button';
import { Modal } from './Modal';
import { IconSummarizer } from './Icons/IconSummarizer';
import {
  MAX_SUMMARIZED_TEXT,
  MIN_TEXT_LENGTH_ALLOWED,
  MIN_TEXT_WORDS_ALLOWED,
} from '../utils/constants';
import '../styles/tailwind.css';

export const Summarizer = () => {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [summary, setSummary] = useState<string | undefined>(undefined);

  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [maxLength, setMaxLength] = useState<number>(MAX_SUMMARIZED_TEXT);
  const [minWords, setMinWords] = useState<number>(MIN_TEXT_WORDS_ALLOWED);
  const [minChars, setMinChars] = useState<number>(MIN_TEXT_LENGTH_ALLOWED);

  useEffect(() => {
    // Loads the initial state from storage.
    chrome.storage.sync
      .get(['isEnabled', 'maxLength', 'minWords', 'minChars'])
      .then((result) => {
        const { isEnabled, maxLength, minWords, minChars } = result;
        console.log('result', result);
        if (isEnabled) setIsEnabled(Boolean(isEnabled));
        if (maxLength) setMaxLength(Number(maxLength));
        if (minWords) setMinWords(Number(minWords));
        if (minChars) setMinChars(Number(minChars));
      });

    // Watches for any changes in options.
    chrome.storage.onChanged.addListener((changes, namespace) => {
      console.log('changes', changes);
      if (namespace === 'sync') {
        const { isEnabled, maxLength, minWords, minChars } = changes;

        if (isEnabled) setIsEnabled(Boolean(isEnabled.newValue));
        if (maxLength) setMaxLength(Number(maxLength.newValue));
        if (minWords) setMinWords(Number(minWords.newValue));
        if (minChars) setMinChars(Number(minChars.newValue));
      }
    });
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'DIV' ||
          target.tagName === 'P' ||
          target.tagName === 'SPAN') &&
        target.textContent &&
        // Min chars allowed (to be in options).
        target.textContent.length > minChars &&
        // Min words allowed (to be in options).
        target.textContent.split(/\s+/).filter(Boolean).length > minWords &&
        // Prevents summarizer modal to also be hovered.
        document.getElementsByClassName('summarizer-modal').length === 0
      ) {
        console.log('tag', target.tagName);
        console.log('text', target.textContent);
        console.log('length', target.textContent.length);
        console.log(
          'words',
          target.textContent.split(/\s+/).filter(Boolean).length
        );
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
    isEnabled && (
      <>
        {hoveredElement &&
          ReactDOM.createPortal(
            <Button
              className="absolute right-4 bottom-4 rounded-[50%] z-[9999] hover:scale-110 transition"
              onClick={() => {
                handleSummarizerClick();
              }}
            >
              <IconSummarizer className="w-6 h-6 text-white" />
            </Button>,
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
    )
  );
};
