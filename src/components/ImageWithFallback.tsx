import { useState, useEffect } from 'react';

/**
 * Image component with fallback support, loading state, and lazy loading
 * Uses native lazy loading with loading="lazy" for optimal performance
 * @param src - The image source URL (can be null)
 * @param alt - The alt text for the image
 * @param fallback - The fallback image URL to use if src is null or fails to load
 * @param className - Additional CSS classes to apply
 * @returns An image element with fallback support and loading state
 */
interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  fallback: string;
  className?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  fallback,
  className = '',
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(!!src);

  // Reset state when src changes
  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setHasError(false);
      setIsLoading(true);
    } else {
      setImgSrc(fallback);
      setIsLoading(false);
    }
  }, [src, fallback]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    if (!hasError && imgSrc !== fallback) {
      setHasError(true);
      setImgSrc(fallback);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-0"
          aria-hidden="true"
          role="presentation"
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          position: 'relative',
          zIndex: 1,
        }}
      />
    </div>
  );
}
