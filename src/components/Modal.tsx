import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/tailwind.css';

interface ModalProps {
  onClose: () => void;
  summarizedText: string;
}

export const Modal = ({ onClose, summarizedText }: ModalProps) => {
  return ReactDOM.createPortal(
    <div className="summarizer-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-[99999]">
      <div className="relative bg-white p-6 rounded-lg shadow-xl w-1/2 h-auto">
        <button className="absolute top-0 right-0 m-3 p-1 rounded-full" onClick={onClose}>
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
          <h1 className="text-xl font-bold mb-4">Summarizer</h1>
          <div className="p-4 border border-gray-300 rounded-lg">{summarizedText}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};
