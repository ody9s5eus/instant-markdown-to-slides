import { useState, useCallback } from 'react';
import { MarkdownEditor } from './components/MarkdownEditor';
import { SlidePreview } from './components/SlidePreview';
import { PrintView } from './components/PrintView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import { useMarkdownToSlides } from './hooks/useMarkdownToSlides';

const DEFAULT_MARKDOWN = `# Welcome to Slide Creator

---

## What is this?

A **real-time** markdown to slide converter.

- Write markdown on the left
- See slides on the right
- Print to PDF when done!

---

## Features

1. **Split-pane editing**
2. *Theming support*
3. Code highlighting:

\`\`\`javascript
console.log('Hello World');
\`\`\`

---

## Image Support

Drag and drop images to the editor!
`;

function App() {
  const [markdown, setMarkdown] = useLocalStorage('slide-content', DEFAULT_MARKDOWN);
  const [theme, setTheme] = useState('light');

  const debouncedMarkdown = useDebounce(markdown, 300);
  const { slides } = useMarkdownToSlides(debouncedMarkdown);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <>
      <div className="app-layout flex h-screen w-screen overflow-hidden">
        {/* Editor Pane */}
        <div className="w-1/2 h-full border-r border-gray-200 flex flex-col">
           <div className="bg-gray-50 px-4 py-2 border-b text-sm font-medium text-gray-500">
             Markdown Editor
           </div>
           <MarkdownEditor
             value={markdown}
             onChange={setMarkdown}
             className="flex-1"
           />
        </div>

        {/* Preview Pane */}
        <div className="w-1/2 h-full">
           <SlidePreview
             slides={slides}
             currentTheme={theme}
             onThemeChange={setTheme}
             onPrint={handlePrint}
           />
        </div>
      </div>

      {/* Hidden Print View */}
      <PrintView slides={slides} theme={theme} />
    </>
  );
}

export default App;
