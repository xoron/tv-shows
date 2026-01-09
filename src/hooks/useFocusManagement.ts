import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to manage focus on route changes and dynamic content updates
 * Focuses the main content area when the route changes
 * @param enabled - Whether focus management is enabled (default: true)
 */
export function useFocusManagement(enabled: boolean = true) {
  const location = useLocation();
  const mainContentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Find main content element
    mainContentRef.current = document.getElementById('main-content');

    // Focus main content on route change
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, [location.pathname, enabled]);

  return { mainContentRef };
}

/**
 * Hook to focus a specific element when content loads
 * @param elementRef - Ref to the element to focus
 * @param condition - Condition to check before focusing
 */
export function useFocusOnLoad<T extends HTMLElement>(
  elementRef: React.RefObject<T>,
  condition: boolean = true
) {
  useEffect(() => {
    if (condition && elementRef.current) {
      // Small delay to ensure content is rendered
      const timeoutId = setTimeout(() => {
        elementRef.current?.focus();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [condition, elementRef]);
}

