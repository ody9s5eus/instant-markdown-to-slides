import React from 'react';
import { Slide } from './Slide';

interface PrintViewProps {
  slides: string[];
  theme: string;
}

export const PrintView: React.FC<PrintViewProps> = ({ slides, theme }) => {
  return (
    <div className="print-container hidden" data-theme={theme}>
      {slides.map((slide, index) => (
        <div key={index} className="print-page w-screen h-screen overflow-hidden break-after-page">
           <div className="w-full h-full relative bg-white">
               <Slide content={slide} className="print-slide-content" />
               <div className="absolute bottom-4 right-8 text-xs opacity-50 text-gray-400">
                 {index + 1}
               </div>
           </div>
        </div>
      ))}
    </div>
  );
};
