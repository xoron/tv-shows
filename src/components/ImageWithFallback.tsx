import { useState } from 'react';

/**
 * Image component with fallback support for error handling
 * @param src - The image source URL (can be null)
 * @param alt - The alt text for the image
 * @param fallback - The fallback image URL to use if src is null or fails to load
 * @param className - Additional CSS classes to apply
 * @returns An image element with fallback support
 */
interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  fallback: string;
  className?: string;
}

export default function ImageWithFallback({ src, alt, fallback, className = '' }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
}

