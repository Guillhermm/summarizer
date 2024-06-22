import React from 'react';
import { IconSummarizer } from './Icons';
import { configs } from '../configs';

export interface PopupProps {
  isEnabled?: boolean;
  handleOptionsClick?: () => void;
  handleToggleChange?: () => void;
}

export const Popup = ({
  isEnabled = false,
  handleOptionsClick,
  handleToggleChange,
}: PopupProps) => (
  <div className="tw-summarizer-grid tw-summarizer-grid-cols-1 tw-summarizer-divide-y tw-summarizer-divide-gray-200 tw-summarizer-w-64">
    <div className="tw-summarizer-px-4 tw-summarizer-py-2">
      <h1 className="tw-summarizer-text-lg tw-summarizer-font-bold tw-summarizer-flex tw-summarizer-items-center tw-summarizer-gap-2">
        <IconSummarizer className="tw-summarizer-w-6 tw-summarizer-h-6" />
        {configs.popup.name}
      </h1>
    </div>
    <div className="tw-summarizer-px-4 tw-summarizer-py-2">
      <label
        htmlFor="enableToggle"
        className="tw-summarizer-flex tw-summarizer-items-center tw-summarizer-gap-2 tw-summarizer-cursor-pointer"
      >
        <div className="tw-summarizer-relative">
          <input
            type="checkbox"
            id="enableToggle"
            className="tw-summarizer-sr-only"
            checked={isEnabled}
            onChange={handleToggleChange}
          />
          <div
            className={`tw-summarizer-block tw-summarizer-w-10 tw-summarizer-h-6 tw-summarizer-rounded-full ${isEnabled ? 'tw-summarizer-bg-blue-500' : 'tw-summarizer-bg-gray-600'}`}
          />
          <div
            className={`summarizer-toggle-dot tw-summarizer-absolute tw-summarizer-left-1 tw-summarizer-top-1 tw-summarizer-bg-white tw-summarizer-w-4 tw-summarizer-h-4 tw-summarizer-rounded-full tw-summarizer-transition ${
              isEnabled ? 'tw-summarizer-transform tw-summarizer-translate-x-full' : ''
            }`}
          />
        </div>
        <div className="tw-summarizer-text-base tw-summarizer-text-gray-700">
          {configs.popup.toggle.label}
        </div>
      </label>
    </div>
    <a
      className="tw-summarizer-px-4 tw-summarizer-py-2 tw-summarizer-text-base tw-summarizer-text-gray-700 tw-summarizer-cursor-pointer hover:tw-summarizer-bg-gray-100"
      onClick={handleOptionsClick}
    >
      {configs.popup.action.label}
    </a>
  </div>
);
