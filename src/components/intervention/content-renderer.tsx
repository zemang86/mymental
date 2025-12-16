'use client';

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils/cn';

interface ContentRendererProps {
  content: string;
  className?: string;
  maxLength?: number;
}

/**
 * Sanitize and clean up raw KB content for better display
 */
function sanitizeContent(content: string): string {
  let cleaned = content;

  // Remove copyright notices and metadata
  cleaned = cleaned.replace(/HAK CIPTA TERPELIHARA.*?(?=\n|$)/gi, '');
  cleaned = cleaned.replace(/©\s*\d{4}.*?(?=\n|$)/gi, '');
  cleaned = cleaned.replace(/BUKU AKTIVITI DIBANGUNKAN OLEH:.*?(?=\n|$)/gi, '');

  // Remove table of contents style lines (dotted lines with page numbers)
  cleaned = cleaned.replace(/\.{3,}\s*\d+/g, '');
  cleaned = cleaned.replace(/…+\s*\d+/g, '');

  // Remove standalone page numbers
  cleaned = cleaned.replace(/^\s*\d+\s*$/gm, '');

  // Remove MODUL/MODULE headers that look like document titles
  cleaned = cleaned.replace(/^\d+\s*MODUL:.*$/gm, '');

  // Clean up "Isi Kandungan" (Table of Contents) sections
  cleaned = cleaned.replace(/^Isi Kandungan\s*$/gm, '');

  // Remove BAHAGIAN section numbers that look like TOC entries
  cleaned = cleaned.replace(/^\d+\s*BAHAGIAN\s+[A-Z]:.*$/gm, (match) => {
    // Keep if it's a real section header (no page number at end)
    if (/\d+\s*$/.test(match)) return '';
    return match;
  });

  // Remove lines that are just numbers (page refs)
  cleaned = cleaned.replace(/^\d+(\.\d+)*\s*(Kuiz|Pertanyaan\?|Modul)?\s*$/gm, '');

  // Clean up excessive whitespace
  cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n');
  cleaned = cleaned.replace(/^\s+/gm, (match) => match.length > 2 ? '  ' : match);

  // Remove lines that look like TOC entries (text followed by dots and numbers)
  cleaned = cleaned.replace(/^.*?\.{5,}.*?\d+\s*$/gm, '');

  // Trim and clean
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Renders markdown content with wellness-styled typography
 */
export function ContentRenderer({ content, className, maxLength }: ContentRendererProps) {
  const sanitized = sanitizeContent(content);
  const displayContent = maxLength && sanitized.length > maxLength
    ? sanitized.slice(0, maxLength) + '...'
    : sanitized;

  return (
    <div className={cn('content-renderer', className)}>
      <ReactMarkdown
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4 mt-6 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-3 mt-5 first:mt-0 pb-2 border-b border-sage-200 dark:border-sage-800">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2 mt-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium text-neutral-700 dark:text-neutral-300 mb-2 mt-3">
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              {children}
            </p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="space-y-2 mb-4 ml-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 mb-4 ml-1 list-decimal list-inside">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-400 dark:bg-sage-500 mt-2.5 flex-shrink-0" />
              <span className="flex-1">{children}</span>
            </li>
          ),

          // Emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-neutral-900 dark:text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-neutral-600 dark:text-neutral-400">
              {children}
            </em>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-sage-300 dark:border-sage-600 pl-4 py-2 my-4 bg-sage-50 dark:bg-sage-900/20 rounded-r-lg">
              <div className="text-neutral-600 dark:text-neutral-400 italic">
                {children}
              </div>
            </blockquote>
          ),

          // Code
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm font-mono text-neutral-800 dark:text-neutral-200">
              {children}
            </code>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-6 border-t border-warm-200 dark:border-neutral-700" />
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 underline underline-offset-2"
            >
              {children}
            </a>
          ),
        }}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Compact content preview for cards
 */
export function ContentPreview({ content, maxLength = 150 }: { content: string; maxLength?: number }) {
  const sanitized = sanitizeContent(content);
  // Get first meaningful paragraph
  const paragraphs = sanitized.split(/\n\n+/).filter(p => p.trim().length > 20);
  const preview = paragraphs[0] || sanitized;
  const truncated = preview.length > maxLength ? preview.slice(0, maxLength) + '...' : preview;

  return (
    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
      {truncated.replace(/[#*_`]/g, '')}
    </p>
  );
}
