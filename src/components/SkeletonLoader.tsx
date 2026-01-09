import { CSSProperties } from 'react';

/**
 * Skeleton loader component for better perceived performance
 * Provides visual placeholders while content is loading
 * Uses Tailwind CSS for styling
 * @param variant - The variant of skeleton loader (card, text, image, etc.)
 * @param className - Additional CSS classes to apply
 * @returns A skeleton loader element
 */
interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'image' | 'episode-card' | 'show-details';
  className?: string;
  width?: string;
  height?: string;
}

const baseSkeletonClasses = 'bg-gray-200 rounded animate-pulse';

export default function SkeletonLoader({
  variant = 'text',
  className = '',
  width,
  height,
}: SkeletonLoaderProps) {
  const baseStyles: CSSProperties = {
    ...(width && { width }),
    ...(height && { height }),
  };

  switch (variant) {
    case 'card':
      return (
        <div
          className={`${baseSkeletonClasses} rounded-lg p-4 min-h-[200px] ${className}`}
          style={baseStyles}
          aria-label="Loading content"
          role="status"
        >
          <div className={`${baseSkeletonClasses} w-full aspect-[3/4] mb-4`} />
          <div className={`${baseSkeletonClasses} h-4 mb-2 w-4/5`} />
          <div className={`${baseSkeletonClasses} h-4 w-3/5`} />
        </div>
      );
    case 'episode-card':
      return (
        <div
          className={`${baseSkeletonClasses} rounded-lg p-4 min-h-[200px] ${className}`}
          style={baseStyles}
          aria-label="Loading content"
          role="status"
        >
          <div className={`${baseSkeletonClasses} w-full aspect-[3/4] mb-4`} />
          <div className={`${baseSkeletonClasses} h-4 mb-2 w-2/5`} />
          <div className={`${baseSkeletonClasses} h-4 mb-2 w-[90%]`} />
          <div className={`${baseSkeletonClasses} h-4 w-[70%]`} />
        </div>
      );
    case 'show-details':
      return (
        <div
          className={`flex flex-col gap-4 p-4 ${className}`}
          aria-label="Loading content"
          role="status"
        >
          <div className="flex flex-row gap-4">
            <div className={`${baseSkeletonClasses} w-1/3 aspect-[3/4]`} />
            <div className="flex-1">
              <div className={`${baseSkeletonClasses} h-8 mb-4 w-3/5`} />
              <div className={`${baseSkeletonClasses} h-4 mb-2 w-full`} />
              <div className={`${baseSkeletonClasses} h-4 mb-2 w-full`} />
              <div className={`${baseSkeletonClasses} h-4 w-4/5`} />
            </div>
          </div>
        </div>
      );
    case 'image':
      return (
        <div
          className={`${baseSkeletonClasses} rounded w-full aspect-[3/4] ${className}`}
          style={baseStyles}
          aria-label="Loading image"
          role="status"
        />
      );
    case 'text':
    default:
      return (
        <div
          className={`${baseSkeletonClasses} rounded-sm h-4 mb-2 ${className}`}
          style={baseStyles}
          aria-label="Loading content"
          role="status"
        />
      );
  }
}

