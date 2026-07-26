import { useRef, useState, useCallback } from 'react';

export function usePinchZoom() {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastDistance = useRef(null);
  const lastTouch = useRef(null);

  const getDistance = (touches) => {
    const [a, b] = touches;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      lastDistance.current = getDistance(e.touches);
    } else if (e.touches.length === 1 && scale > 1) {
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, [scale]);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && lastDistance.current) {
      e.preventDefault();
      const newDistance = getDistance(e.touches);
      const delta = newDistance / lastDistance.current;
      setScale((s) => Math.min(Math.max(s * delta, 1), 4));
      lastDistance.current = newDistance;
    } else if (e.touches.length === 1 && lastTouch.current && scale > 1) {
      e.preventDefault();
      const dx = e.touches[0].clientX - lastTouch.current.x;
      const dy = e.touches[0].clientY - lastTouch.current.y;
      setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, [scale]);

  const onTouchEnd = useCallback((e) => {
    if (e.touches.length < 2) lastDistance.current = null;
    if (e.touches.length < 1) lastTouch.current = null;
  }, []);

  const reset = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  return {
    scale,
    translate,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
    reset,
    style: {
      transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
      transformOrigin: 'center center',
      transition: lastDistance.current ? 'none' : 'transform 0.2s ease-out',
    },
  };
}