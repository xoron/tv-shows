/**
 * Loading spinner component with accessibility support
 * @param ariaLabel - The accessible label for the loading spinner
 * @returns A loading spinner element
 */
interface LoadingSpinnerProps {
  ariaLabel: string;
}

export default function LoadingSpinner({ ariaLabel }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        role="status"
        aria-label={ariaLabel}
        aria-busy="true"
      >
        <span className="sr-only">{ariaLabel}</span>
      </div>
    </div>
  );
}

