import { useEffect } from 'react';

/**
 * Custom hook to automatically scroll to top when component mounts
 * @param {Object} options - Configuration options
 * @param {string} options.behavior - Scroll behavior ('smooth', 'instant', 'auto')
 * @param {number} options.top - Top position to scroll to (default: 0)
 * @param {number} options.left - Left position to scroll to (default: 0)
 * @param {Array} options.dependencies - Dependencies array for useEffect
 */
export function useScrollToTop(options = {}) {
  const {
    behavior = 'smooth',
    top = 0,
    left = 0,
    dependencies = []
  } = options;

  useEffect(() => {
    window.scrollTo({
      top,
      left,
      behavior
    });
  }, dependencies);
}

export default useScrollToTop;
