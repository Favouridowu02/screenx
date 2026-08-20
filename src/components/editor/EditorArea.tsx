import { useState } from 'react';
import { BackgroundGallery, BACKGROUNDS } from './BackgroundGallery';
import { useEditor } from '../../core/state/EditorContext';

export function EditorArea() {
  const { logoUrl, customText, activeIndex, screenshotData, setScreenshotData, canvasRef, showMacFrame, shadowIntensity, canvasPadding, logoPosition, textStyle, customBackgrounds } = useEditor();
  const allBackgrounds = [...BACKGROUNDS, ...customBackgrounds];
  const activeBg = allBackgrounds[activeIndex];
  const [isDragging, setIsDragging] = useState(false);

  const getLogoPositionClass = (pos: string) => {
    switch (pos) {
      case 'top-left': return 'top-6 left-6';
      case 'top-right': return 'top-6 right-6';
      case 'bottom-left': return 'bottom-6 left-6';
      case 'bottom-right': return 'bottom-6 right-6';
      default: return 'bottom-6 right-6';
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setScreenshotData(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col p-8 items-center bg-[#222222] overflow-y-auto relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Main Canvas Area */}
      <div 
        ref={canvasRef}
        className="relative flex flex-col items-center justify-center overflow-hidden min-w-[300px]"
        style={{ padding: `${canvasPadding}px` }}
      >
        {/* Canvas Background Image */}
        {activeBg === 'auto' ? (
          screenshotData ? (
            <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-gray-900">
              <img 
                src={screenshotData} 
                alt="Auto Blur Background" 
                className="w-full h-full object-cover blur-[80px] scale-125 opacity-80"
              />
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20"></div>
          )
        ) : (
          <img 
            src={activeBg} 
            alt="Canvas Background" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Mock macOS Window */}
        <div 
          key={screenshotData || 'empty'}
          className={`relative z-10 flex flex-col bg-[#D1D1D1] overflow-hidden transition-shadow duration-200 animate-pop-in border border-black/10 ${showMacFrame ? 'rounded-lg' : ''} ${
            { 'none': 'shadow-none', 'sm': 'shadow-sm', 'lg': 'shadow-lg', '2xl': 'shadow-2xl' }[shadowIntensity]
          }`}
        >
          {/* Window Header */}
          {showMacFrame && (
            <div className="h-7 bg-[#EAEAEA] flex items-center px-3 gap-1.5 border-b border-gray-300">
              <div className="w-[10px] h-[10px] rounded-full bg-[#FF5F56]"></div>
              <div className="w-[10px] h-[10px] rounded-full bg-[#FFBD2E]"></div>
              <div className="w-[10px] h-[10px] rounded-full bg-[#27C93F]"></div>
            </div>
          )}
          {/* Window Body */}
          <div className="bg-[#D1D1D1] overflow-hidden flex items-center justify-center">
            {screenshotData ? (
              <img src={screenshotData} alt="Captured Screen" className="block w-auto h-auto max-w-full max-h-[60vh] object-contain" />
            ) : (
              <div className="w-[600px] h-[400px] max-w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-400/60 rounded-xl m-4 bg-gray-200/50">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 font-medium text-sm text-center px-6">
                  Drag & drop an image here<br/>
                  <span className="text-gray-400 font-normal">or click 'New' to capture</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lower Overlay / Controls */}
        {customText && textStyle !== 'hidden' && (
          <div className="relative z-20 mt-6 w-full max-w-[600px] flex justify-between items-center gap-4">
             <div className={`flex-1 h-[42px] rounded-md flex items-center justify-center px-4 overflow-hidden transition-all ${
               textStyle === 'glass' ? 'bg-white/5 backdrop-blur-sm border border-white/30 shadow' : 'bg-[#111] border border-gray-700 shadow-lg'
             }`}>
                 <span className="text-white font-medium text-sm truncate text-center w-full">{customText}</span>
             </div>
          </div>
        )}

        {/* Uploaded Logo Watermark */}
        {logoUrl && (
          <img 
            src={logoUrl} 
            alt="Uploaded Logo" 
            className={`absolute ${getLogoPositionClass(logoPosition)} h-8 max-w-[100px] object-contain z-30 drop-shadow-md transition-all duration-300 ease-in-out`}
          />
        )}
      </div>

      <div className="flex-1" />

      {/* Gallery Thumbnails */}
      <BackgroundGallery />

      {/* Drag Overlay */}
      {isDragging && (
        <div 
          className="absolute inset-0 z-50 bg-[#007AFF]/10 backdrop-blur-sm border-4 border-[#007AFF] border-dashed flex items-center justify-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="bg-[#1E1E1E] px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center border border-gray-700 pointer-events-none">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#007AFF] mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <h2 className="text-xl font-semibold text-white">Drop image to load</h2>
          </div>
        </div>
      )}
    </div>
  );
}
