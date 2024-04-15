// useHeader.ts
import { useState, useCallback } from 'react';

export const useHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, [setIsOpen]);

  return { isOpen, toggleOpen, setIsOpen };
};
