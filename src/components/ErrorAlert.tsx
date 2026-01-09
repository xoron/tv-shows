/**
 * Error alert component for displaying error messages
 * @param title - The error title/heading
 * @param message - The error message to display
 * @param variant - Optional variant style (default: 'default')
 * @returns An error alert element
 */
interface ErrorAlertProps {
  title: string;
  message: string;
  variant?: 'default' | 'inline';
}

export default function ErrorAlert({ title, message, variant = 'default' }: ErrorAlertProps) {
  if (variant === 'inline') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6" role="alert" aria-live="assertive">
        <p className="font-semibold">{title}</p>
        <p className="text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md" role="alert" aria-live="assertive">
        <h2 className="text-xl font-bold text-red-600 mb-2">{title}</h2>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
}

