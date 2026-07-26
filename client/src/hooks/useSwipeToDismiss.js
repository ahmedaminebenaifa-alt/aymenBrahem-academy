import { useState, useRef, useCallback } from 'react';

// Tracks a vertical drag on a bottom sheet: follows the finger while dragging,
// and calls onDismiss if released past a distance/velocity threshold —
// otherwise snaps back to resting position.
export function useSwipeToDismiss(onDismiss) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startTime = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);

  const DISMISS_DISTANCE = 100; // px dragged down before it counts as a dismiss
  const DISMISS_VELOCITY = 0.5; // px/ms — a fast flick dismisses even if short

  const onTouchStart = useCallback((e) => {
    const y = e.touches[0].clientY;
    startY.current = y;
    lastY.current = y;
    startTime.current = Date.now();
    lastTime.current = Date.now();
    setIsDragging(true);
  }, []);

  const onTouchMove = useCallback((e) => {
    const y = e.touches[0].clientY;
    const delta = y - startY.current;
    // Only allow dragging downward — resist upward drag entirely (sheet already fully open)
    if (delta > 0) {
      setDragY(delta);
      lastY.current = y;
      lastTime.current = Date.now();
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    const distance = dragY;
    const duration = Math.max(Date.now() - lastTime.current, 1);
    const totalDuration = Math.max(Date.now() - startTime.current, 1);
    const velocity = distance / totalDuration;

    setIsDragging(false);

    if (distance > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY) {
      onDismiss();
    }
    setDragY(0);
  }, [dragY, onDismiss]);

  return {
    dragY,
    isDragging,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
    style: {
      transform: `translateY(${dragY}px)`,
      transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)',
    },
  };
}