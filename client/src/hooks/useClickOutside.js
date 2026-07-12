import { useEffect, useRef } from 'react';

export const useClickOutside = (handler) => {
  const domNode = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      // If the click is outside the referenced element, trigger the handler
      if (domNode.current && !domNode.current.contains(event.target)) {
        handler();
      }
    };

    // Listen for mousedown events
    document.addEventListener('mousedown', maybeHandler);
    
    // Cleanup function to remove the listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', maybeHandler);
    };
  }, [handler]);

  return domNode;
};