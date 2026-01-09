import Spinner from '@atlaskit/spinner';
import { Box, xcss } from '@atlaskit/primitives';

/**
 * Loading spinner component with accessibility support
 * @param ariaLabel - The accessible label for the loading spinner
 * @returns A loading spinner element
 */
interface LoadingSpinnerProps {
  ariaLabel: string;
}

const containerStyles = xcss({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default function LoadingSpinner({ ariaLabel }: LoadingSpinnerProps) {
  return (
    <Box xcss={containerStyles}>
      <div role="status" aria-label={ariaLabel} aria-busy="true">
        <Spinner size="large" label={ariaLabel} />
      </div>
    </Box>
  );
}

