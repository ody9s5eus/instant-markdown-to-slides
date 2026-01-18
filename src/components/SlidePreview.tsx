import React, { useState, useEffect, useCallback } from 'react';
import { Slide } from './Slide';
import { ChevronLeft, ChevronRight, Printer } from 'lucide-react';

interface SlidePreviewProps {
  slides: string[];
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  onPrint: () => void;
}

export const SlidePreview: React.FC<SlidePreviewProps> = ({
  slides,
  currentTheme,
  onThemeChange,
  onPrint
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index if slides array shrinks
  if (currentIndex >= slides.length && slides.length > 0) {
    setCurrentIndex(slides.length - 1);
  }

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, slides.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only listen if not focused in textarea (which is in another component,
      // but strictly speaking we should check if activeElement is an input)
      if (document.activeElement?.tagName === 'TEXTAREA' ||
          document.activeElement?.getAttribute('contenteditable') === 'true') {
        return;
      }

      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (slides.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500">
        Start typing markdown...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative bg-gray-200">
      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
        <select
          value={currentTheme}
          onChange={(e) => onThemeChange(e.target.value)}
          className="bg-transparent text-sm font-medium border-none outline-none cursor-pointer"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="professional">Professional</option>
          <option value="creative">Creative</option>
        </select>
        <div className="w-px h-4 bg-gray-300 my-auto"></div>
        <button onClick={onPrint} className="p-1 hover:bg-gray-100 rounded" title="Print to PDF">
            <Printer size={16} />
        </button>
      </div>

      {/* Slide Viewport */}
      <div
        className="flex-1 flex items-center justify-center p-8 overflow-hidden"
        data-theme={currentTheme} // Apply CSS variable scope here
      >
         <div className="aspect-video w-full max-h-full bg-white shadow-2xl rounded-lg overflow-hidden relative">
            <Slide content={slides[currentIndex]} />

            {/* Slide Counter */}
            <div className="absolute bottom-4 right-4 text-xs opacity-50 select-none pointer-events-none" style={{ color: 'var(--text-color)' }}>
                {currentIndex + 1} / {slides.length}
            </div>
         </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-md z-10">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-medium min-w-[3rem] text-center">
          {currentIndex + 1} / {slides.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentIndex === slides.length - 1}
          className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
