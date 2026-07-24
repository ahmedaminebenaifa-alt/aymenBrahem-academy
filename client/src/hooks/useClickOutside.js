import { useEffect, useRef } from 'react';

export const useClickOutside = (handler) => {
  const domNode = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      if (domNode.current && !domNode.current.contains(event.target)) {
        handler();
      }
    };

    // Listen on 'click', not 'mousedown' — mousedown fires before the click
    // event on the target element, which would unmount dropdown content
    // (like search results) before its own onClick ever gets to run.
    document.addEventListener('click', maybeHandler);

    return () => {
      document.removeEventListener('click', maybeHandler);
    };
  }, [handler]);

  return domNode;
};