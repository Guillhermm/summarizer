import React from 'react';
import ReactDOM from 'react-dom';
import { IconClose } from './Icons';
import { StylesWrapper } from './StylesWrapper';
import { configs } from '../configs';

interface ModalProps {
  onClose: () => void;
  summarizedText: string;
}

export const Modal = ({ onClose, summarizedText }: ModalProps) => {
  return ReactDOM.createPortal(
    <StylesWrapper>
      <div id="summarizer-modal" className="tw-summarizer-fixed tw-summarizer-inset-0 tw-summarizer-flex tw-summarizer-items-center tw-summarizer-justify-center tw-summarizer-bg-black tw-summarizer-bg-opacity-10 tw-summarizer-z-[99999]">
        <div className="tw-summarizer-relative tw-summarizer-bg-white tw-summarizer-p-6 tw-summarizer-rounded-lg tw-summarizer-shadow-xl tw-summarizer-w-1/2 tw-summarizer-h-auto">
          <button
            className="!tw-summarizer-leading-none !tw-summarizer-m-3 !tw-summarizer-p-1 tw-summarizer-absolute tw-summarizer-top-0 tw-summarizer-right-0 tw-summarizer-rounded-full tw-summarizer-cursor-pointer"
            onClick={onClose}
          >
            <IconClose className="tw-summarizer-h-6 tw-summarizer-w-6" />
          </button>
          <div id="summarizer-modal-body">
            <div className="tw-summarizer-text-xl tw-summarizer-font-bold tw-summarizer-mb-4">
              {configs.modal.name}
            </div>
            <div className="tw-summarizer-p-4 tw-summarizer-border tw-summarizer-border-gray-300 tw-summarizer-rounded-lg">
              {summarizedText}
            </div>
          </div>
        </div>
      </div>
    </StylesWrapper>,
    document.body
  );
};
