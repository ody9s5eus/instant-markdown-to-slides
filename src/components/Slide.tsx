import React, { useEffect, useRef } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';

interface SlideProps {
  content: string;
  theme?: string;
  className?: string;
}

// Singleton highlighter to avoid reloading on every slide render
let highlighter: Highlighter | null = null;

export const Slide: React.FC<SlideProps> = ({ content, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const highlight = async () => {
      if (!highlighter) {
        highlighter = await createHighlighter({
          themes: ['github-light', 'github-dark', 'dracula'],
          langs: ['javascript', 'typescript', 'html', 'css', 'json', 'bash', 'markdown', 'tsx', 'jsx', 'python', 'java'],
        });
      }

      if (containerRef.current && highlighter) {
        const blocks = containerRef.current.querySelectorAll('pre code');
        blocks.forEach((block) => {
          // If already highlighted, skip (shiki replaces the innerHTML, so we check if parent is pre.shiki)
          if (block.parentElement?.classList.contains('shiki')) return;

          const langClass = Array.from(block.classList).find(c => c.startsWith('language-'));
          const lang = langClass ? langClass.replace('language-', '') : 'text';
          const code = block.textContent || '';

          try {
             const html = highlighter!.codeToHtml(code, {
               lang,
               theme: 'github-dark' // Could map this to the global theme prop
             });
             // Replace the <pre><code>...</code></pre> with the Shiki output
             if (block.parentElement && block.parentElement.tagName === 'PRE') {
                block.parentElement.outerHTML = html;
             }
          } catch (e) {
            console.warn('Failed to highlight code block', e);
          }
        });
      }
    };

    highlight();
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={`prose prose-xl max-w-none h-full w-full flex flex-col justify-center p-12 overflow-hidden ${className}`}
      style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <style>{`
        h1, h2, h3, h4, h5, h6 { color: var(--heading-color) !important; font-family: var(--font-heading) !important; }
        a { color: var(--accent-color) !important; }
        pre { background-color: var(--code-bg) !important; border-radius: 0.5rem; }
        img { margin-left: auto; margin-right: auto; max-height: 60vh; object-fit: contain; }
      `}</style>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="w-full"
      />
    </div>
  );
};
