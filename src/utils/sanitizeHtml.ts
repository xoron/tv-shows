import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses DOMPurify to remove potentially dangerous HTML elements and attributes
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) {
    return '';
  }

  return DOMPurify.sanitize(html, {
    // Allow common HTML tags used in content
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'b', 'i', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    // Allow href attribute for links
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    // Add rel="noopener noreferrer" to links for security
    ADD_ATTR: ['target'],
  });
}

