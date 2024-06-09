import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/tailwind.css';

interface ModalProps {
  onClose: () => void;
  summarizedText: string;
}

export const Modal = ({ onClose, summarizedText }: ModalProps) => {
  return ReactDOM.createPortal(
    <div className="summarizer-modal tw-summarizer-fixed tw-summarizer-inset-0 tw-summarizer-flex tw-summarizer-items-center tw-summarizer-justify-center tw-summarizer-bg-black tw-summarizer-bg-opacity-10 tw-summarizer-z-[99999]">
      <div className="tw-summarizer-relative tw-summarizer-bg-white tw-summarizer-p-6 tw-summarizer-rounded-lg tw-summarizer-shadow-xl tw-summarizer-w-1/2 tw-summarizer-h-auto">
        <button
          className="tw-summarizer-absolute tw-summarizer-top-0 tw-summarizer-right-0 tw-summarizer-m-3 tw-summarizer-p-1 tw-summarizer-rounded-full"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="modal-body">
          <h1 className="tw-summarizer-text-xl tw-summarizer-font-bold tw-summarizer-mb-4">
            Summarizer
          </h1>
          <div className="tw-summarizer-p-4 tw-summarizer-border tw-summarizer-border-gray-300 tw-summarizer-rounded-lg">
            {summarizedText}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
