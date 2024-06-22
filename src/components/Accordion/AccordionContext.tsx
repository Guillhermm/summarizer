import React, { createContext, useContext, useState } from 'react';

interface AccordionContextProps {
  isOpen: boolean;
  toggleOpen: () => void;
}

const AccordionContext = createContext<AccordionContextProps | undefined>(undefined);

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordionContext must be used within an AccordionProvider');
  }
  return context;
};

export const AccordionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AccordionContext.Provider value={{ isOpen, toggleOpen }}>{children}</AccordionContext.Provider>
  );
};
