import { useEffect } from 'react';

// Sets document title + meta description for the current page, resets on unmount.
// No react-helmet-async dependency — this is enough for Googlebot, which executes JS.
export function useDocumentMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    let metaTag = document.querySelector('meta[name="description"]');
    const prevDescription = metaTag?.getAttribute('content');

    if (description) {
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'description');
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', description);
    }

    return () => {
      document.title = prevTitle;
      if (metaTag && prevDescription !== undefined) {
        metaTag.setAttribute('content', prevDescription);
      }
    };
  }, [title, description]);
}