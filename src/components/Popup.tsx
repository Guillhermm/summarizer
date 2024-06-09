import React from 'react';
import { IconSummarizer } from './Icons/IconSummarizer';
import { configs } from '../configs';
import '../styles/tailwind.css';

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
  <div className="grid grid-cols-1 divide-y divide-gray-200 w-64">
    <div className="px-4 py-2">
      <h1 className="text-lg font-bold flex items-center gap-2">
        <IconSummarizer className="w-6 h-6" />
        {configs.popup.name}
      </h1>
    </div>
    <div className="px-4 py-2">
      <label htmlFor="enableToggle" className="flex items-center gap-2 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id="enableToggle"
            className="sr-only"
            checked={isEnabled}
            onChange={handleToggleChange}
          />
          <div
            className={`block w-10 h-6 rounded-full ${isEnabled ? 'bg-blue-500' : 'bg-gray-600'}`}
          />
          <div
            className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
              isEnabled ? 'transform translate-x-full' : ''
            }`}
          />
        </div>
        <div className="text-base text-gray-700">{configs.popup.toggle.label}</div>
      </label>
    </div>
    <a
      className="px-4 py-2 text-base text-gray-700 cursor-pointer hover:bg-gray-100"
      onClick={handleOptionsClick}
    >
      {configs.popup.action.label}
    </a>
  </div>
);
