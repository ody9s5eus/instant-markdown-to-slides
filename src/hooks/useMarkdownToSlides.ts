import { useState, useEffect } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

export function useMarkdownToSlides(markdown: string) {
  const [slides, setSlides] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // We avoid setting state synchronously if possible, or accept it will cause re-render.
    // However, to fix the linter error, we can set isProcessing inside processSlides or use a ref.
    // Better yet, just start processing.

    const processSlides = async () => {
      if (isMounted) setIsProcessing(true);

      // Split by "---" on its own line
      // Regex matches "---" surrounded by newlines, or at start/end
      const rawSlides = markdown.split(/(?:\r?\n|^)---(?:\r?\n|$)/g);

      const processed = await Promise.all(
        rawSlides.map(async (slideContent) => {
          if (!slideContent.trim()) return '';

          try {
            const file = await unified()
              .use(remarkParse)
              .use(remarkRehype)
              .use(rehypeStringify)
              .process(slideContent);
            return String(file);
          } catch (err) {
            console.error('Error processing slide markdown:', err);
            return '<p class="text-red-500">Error rendering slide</p>';
          }
        })
      );

      if (isMounted) {
        setSlides(processed);
        setIsProcessing(false);
      }
    };

    processSlides();

    return () => {
      isMounted = false;
    };
  }, [markdown]);

  return { slides, isProcessing };
}
