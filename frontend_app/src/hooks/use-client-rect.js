import { useRef, useMemo, useState, useEffect, useCallback, useLayoutEffect } from 'react';

// ----------------------------------------------------------------------

export function useClientRect(inputRef, eventType) {
  const initialRef = useRef(null);
  const elementRef = inputRef || initialRef;

  const [rect, setRect] = useState(undefined);
  const [scroll, setScroll] = useState(undefined);

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  const handleBoundingClientRect = useCallback(() => {
    if (elementRef.current) {
      const clientRect = elementRef.current.getBoundingClientRect();
      setRect(clientRect);
      setScroll({
        scrollWidth: elementRef.current.scrollWidth,
        scrollHeight: elementRef.current.scrollHeight,
      });
    }
  }, [elementRef]);

  useIsomorphicLayoutEffect(() => {
    handleBoundingClientRect();
  }, [handleBoundingClientRect]);

  useEffect(() => {
    if (eventType) {
      window.addEventListener(eventType, handleBoundingClientRect);
      return () => {
        window.removeEventListener(eventType, handleBoundingClientRect);
      };
    }

    window.addEventListener('resize', handleBoundingClientRect);
    return () => {
      window.removeEventListener('resize', handleBoundingClientRect);
    };
  }, [eventType, handleBoundingClientRect]);

  const memoizedRectValue = useMemo(() => rect, [rect]);
  const memoizedScrollValue = useMemo(() => scroll, [scroll]);

  return {
    elementRef,
    top: memoizedRectValue?.top ?? 0,
    right: memoizedRectValue?.right ?? 0,
    bottom: memoizedRectValue?.bottom ?? 0,
    left: memoizedRectValue?.left ?? 0,
    x: memoizedRectValue?.x ?? 0,
    y: memoizedRectValue?.y ?? 0,
    width: memoizedRectValue?.width ?? 0,
    height: memoizedRectValue?.height ?? 0,
    scrollWidth: memoizedScrollValue?.scrollWidth ?? 0,
    scrollHeight: memoizedScrollValue?.scrollHeight ?? 0,
  };
}
