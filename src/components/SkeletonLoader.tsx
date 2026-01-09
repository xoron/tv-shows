import { Box, xcss } from '@atlaskit/primitives';

/**
 * Skeleton loader component for better perceived performance
 * Provides visual placeholders while content is loading
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

const skeletonStyles = xcss({
  backgroundColor: 'color.background.neutral',
  borderRadius: 'border.radius.100',
  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
});

const cardSkeletonStyles = xcss({
  backgroundColor: 'color.background.neutral',
  borderRadius: 'border.radius.200',
  padding: 'space.200',
  minHeight: '200px',
});

const textSkeletonStyles = xcss({
  backgroundColor: 'color.background.neutral',
  borderRadius: 'border.radius.050',
  height: '1em',
  marginBottom: 'space.100',
});

const imageSkeletonStyles = xcss({
  backgroundColor: 'color.background.neutral',
  borderRadius: 'border.radius.100',
  width: '100%',
  aspectRatio: '3/4',
});

export default function SkeletonLoader({
  variant = 'text',
  className = '',
  width,
  height,
}: SkeletonLoaderProps) {
  const baseStyles = {
    ...(width && { width }),
    ...(height && { height }),
  };

  switch (variant) {
    case 'card':
      return (
        <Box
          xcss={cardSkeletonStyles}
          className={className}
          style={baseStyles}
          aria-label="Loading content"
          role="status"
        >
          <Box xcss={xcss({ ...imageSkeletonStyles, marginBottom: 'space.200' })} />
          <Box xcss={textSkeletonStyles} width="80%" />
          <Box xcss={textSkeletonStyles} width="60%" />
        </Box>
      );
    case 'episode-card':
      return (
        <Box
          xcss={cardSkeletonStyles}
          className={className}
          style={baseStyles}
          aria-label="Loading content"
          role="status"
        >
          <Box xcss={xcss({ ...imageSkeletonStyles, marginBottom: 'space.200' })} />
          <Box xcss={xcss({ ...textSkeletonStyles, marginBottom: 'space.100' })} width="40%" />
          <Box xcss={textSkeletonStyles} width="90%" />
          <Box xcss={textSkeletonStyles} width="70%" />
        </Box>
      );
    case 'show-details':
      return (
        <Box
          xcss={xcss({
            display: 'flex',
            flexDirection: 'column',
            gap: 'space.400',
            padding: 'space.400',
          })}
          className={className}
          aria-label="Loading content"
          role="status"
        >
          <Box
            xcss={xcss({
              display: 'flex',
              flexDirection: 'row',
              gap: 'space.400',
            })}
          >
            <Box xcss={imageSkeletonStyles} width="33%" />
            <Box xcss={xcss({ flex: 1 })}>
              <Box xcss={xcss({ ...textSkeletonStyles, marginBottom: 'space.200' })} width="60%" height="2em" />
              <Box xcss={xcss({ ...textSkeletonStyles, marginBottom: 'space.100' })} width="100%" />
              <Box xcss={xcss({ ...textSkeletonStyles, marginBottom: 'space.100' })} width="100%" />
              <Box xcss={textSkeletonStyles} width="80%" />
            </Box>
          </Box>
        </Box>
      );
    case 'image':
      return (
        <Box
          xcss={imageSkeletonStyles}
          className={className}
          style={baseStyles}
          aria-label="Loading image"
          role="status"
        />
      );
    case 'text':
    default:
      return (
        <Box
          xcss={textSkeletonStyles}
          className={className}
          style={baseStyles}
          aria-label="Loading content"
          role="status"
        />
      );
  }
}

