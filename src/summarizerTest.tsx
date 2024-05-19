import React from 'react';
import { createRoot } from 'react-dom/client';
import { Summarizer } from './summarizer';
import './styles/tailwind.css';

const originalTexts: string[] = [
  `
    WHETHER we listen with aloof amusement to the dreamlike
    mumbo jumbo of some red-eyed witch doctor of the Congo, or
    read with cultivated rapture thin translations from the sonnets of
    the mystic Lao-tse; now and again crack the hard nutshell of an
    argument of Aquinas, or catch suddenly the shining meaning of
    a bizarre Eskimo fairy tale: it will be always the one, shape-shifting
    yet marvelously constant story that we find, together with a chal-
    lengingly persistent suggestion of more remaining to be experi­
    enced than will ever be known or told.
  `,
  `
    Throughout the inhabited world, in all times and under every
    circumstance, the myths of man have flourished; and they have
    been the living inspiration of whatever else may have appeared
    out of the activities of the human body and mind. It would not
    be too much to say that myth is the secret opening through
    which the inexhaustible energies of the cosmos pour into human
    cultural manifestation. Religions, philosophies, arts, the social
    forms of primitive and historic man, prime discoveries in science
    and technology, the very dreams that blister sleep, boil up from
    the basic, magic ring of myth.
  `,
];

export const SummarizerTest = () => (
  <>
    <div className="m-8 p-4">
      {originalTexts.map((text, id) => (
        <div key={id}>{text}</div>
      ))}
    </div>
    <Summarizer />
  </>
);

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<SummarizerTest />);
}
