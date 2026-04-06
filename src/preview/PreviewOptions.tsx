import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Form,
  FormOption,
  FormOptionsAdditional,
  FormOptionsMain,
  FormSubmit,
} from '../components/Form';
import { StylesWrapper } from '../components/StylesWrapper';
import { configs } from '../configs';
import '../styles/main.css';

const PreviewOptions = () => {
  const { options } = configs;
  const [apiKey, setApiKey] = useState<string>('');

  return (
    <div className="tw-summarizer-w-screen tw-summarizer-h-screen tw-summarizer-flex tw-summarizer-items-center tw-summarizer-justify-center tw-summarizer-bg-black tw-summarizer-bg-opacity-10">
      <div className="tw-summarizer-w-[400px] tw-summarizer-max-h-screen tw-summarizer-overflow-y-auto tw-summarizer-bg-white tw-summarizer-absolute tw-summarizer-rounded-lg tw-summarizer-shadow-xl">
        <div className="tw-summarizer-pt-4">
          <StylesWrapper>
            <Form>
              <FormOptionsMain>
                <FormOption {...options.apiKey} handleChange={setApiKey} value={apiKey} />
              </FormOptionsMain>
              <FormOptionsAdditional>{null}</FormOptionsAdditional>
              <FormSubmit />
            </Form>
          </StylesWrapper>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<PreviewOptions />);
}
