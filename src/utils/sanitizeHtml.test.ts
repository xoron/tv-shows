import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from './sanitizeHtml';

describe('sanitizeHtml', () => {
  it('should return empty string for null input', () => {
    expect(sanitizeHtml(null)).toBe('');
  });

  it('should return empty string for undefined input', () => {
    expect(sanitizeHtml(undefined)).toBe('');
  });

  it('should return empty string for empty string input', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  it('should sanitize safe HTML content', () => {
    const html = '<p>This is a safe paragraph</p>';
    const result = sanitizeHtml(html);
    expect(result).toContain('<p>This is a safe paragraph</p>');
  });

  it('should remove script tags', () => {
    const html = '<p>Safe content</p><script>alert("XSS")</script>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should remove event handlers', () => {
    const html = '<p onclick="alert(\'XSS\')">Click me</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('onclick');
    expect(result).toContain('<p>Click me</p>');
  });

  it('should remove javascript: URLs', () => {
    const html = '<a href="javascript:alert(\'XSS\')">Link</a>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('javascript:');
  });

  it('should allow safe links', () => {
    const html = '<a href="https://example.com">Safe link</a>';
    const result = sanitizeHtml(html);
    expect(result).toContain('<a href="https://example.com">Safe link</a>');
  });

  it('should preserve allowed HTML tags', () => {
    const html = '<p>Paragraph</p><strong>Bold</strong><em>Italic</em><ul><li>Item</li></ul>';
    const result = sanitizeHtml(html);
    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
    expect(result).toContain('<em>');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>');
  });

  it('should remove dangerous tags', () => {
    const html = '<p>Safe</p><iframe src="evil.com"></iframe>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('<iframe>');
    expect(result).toContain('<p>Safe</p>');
  });

  it('should handle complex HTML with mixed safe and unsafe content', () => {
    const html = '<p>Safe paragraph</p><script>alert("XSS")</script><p>Another safe paragraph</p>';
    const result = sanitizeHtml(html);
    expect(result).toContain('<p>Safe paragraph</p>');
    expect(result).toContain('<p>Another safe paragraph</p>');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should preserve formatting tags', () => {
    const html = '<p>Text with <strong>bold</strong> and <em>italic</em></p>';
    const result = sanitizeHtml(html);
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<em>italic</em>');
  });

  it('should handle headings', () => {
    const html = '<h1>Heading 1</h1><h2>Heading 2</h2>';
    const result = sanitizeHtml(html);
    expect(result).toContain('<h1>Heading 1</h1>');
    expect(result).toContain('<h2>Heading 2</h2>');
  });
});

