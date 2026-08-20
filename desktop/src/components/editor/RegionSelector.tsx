import { useState, useRef, useEffect } from 'react';
import { useEditor } from '../../core/state/EditorContext';

export function RegionSelector() {
  const { regionSelectImage, setRegionSelectImage, setScreenshotData } = useEditor();
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const closeSelector = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const appWindow = getCurrentWindow();
      await appWindow.setFullscreen(false);
    } catch (e) {
      console.error(e);
    }
    setRegionSelectImage(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSelector();
      }
    };
    if (regionSelectImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [regionSelectImage, setRegionSelectImage]);

  if (!regionSelectImage) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    if (!isDragging) return;
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Calculate crop dimensions
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    if (width < 10 || height < 10) {
      // Too small, ignore (probably just a click)
      closeSelector();
      return;
    }

    // Process the crop
    if (imgRef.current) {
      const img = imgRef.current;
      // Get intrinsic dimensions vs displayed dimensions
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;

      const canvas = document.createElement('canvas');
      canvas.width = width * scaleX;
      canvas.height = height * scaleY;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(
          img,
          x * scaleX, y * scaleY, width * scaleX, height * scaleY, // source coords
          0, 0, canvas.width, canvas.height // dest coords
        );
        const dataUrl = canvas.toDataURL('image/png');
        setScreenshotData(dataUrl);
      }
    }
    closeSelector();
  };

  const selectionStyle = {
    left: Math.min(startPos.x, currentPos.x),
    top: Math.min(startPos.y, currentPos.y),
    width: Math.abs(currentPos.x - startPos.x),
    height: Math.abs(currentPos.y - startPos.y),
  };

  return (
    <div 
      className="fixed inset-0 z-[100] cursor-crosshair select-none overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={containerRef}
    >
      <img 
        ref={imgRef}
        src={regionSelectImage} 
        alt="Screen Capture" 
        className="absolute inset-0 w-full h-full object-fill pointer-events-none"
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Cancel Badge */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[120] bg-black/60 backdrop-blur-md text-white text-xs font-medium px-4 py-2 rounded-full border border-white/10 shadow-xl pointer-events-none flex items-center gap-2">
        <span>Press</span>
        <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Esc</kbd>
        <span>to cancel</span>
      </div>

      {/* Magnifying Glass */}
      {!isDragging && mousePos.x >= 0 && (
        <div 
          className="fixed pointer-events-none rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-[110] overflow-hidden bg-black flex items-center justify-center"
          style={{
            width: 120,
            height: 120,
            left: mousePos.x - 60,
            top: mousePos.y - 60,
          }}
        >
          <img 
            src={regionSelectImage} 
            alt="Magnifier" 
            style={{
              position: 'absolute',
              width: '200vw',
              height: '200vh',
              left: -mousePos.x * 2 + 60,
              top: -mousePos.y * 2 + 60,
              maxWidth: 'none'
            }}
          />
          {/* Inner shadow */}
          <div className="absolute inset-0 border border-black/20 rounded-full" />
          {/* Crosshair lines */}
          <div className="absolute bg-[#007AFF]/70 w-full h-[1px]" />
          <div className="absolute bg-[#007AFF]/70 h-full w-[1px]" />
        </div>
      )}

      {isDragging && (
        <>
          <div 
            className="absolute border-2 border-[#007AFF] bg-transparent pointer-events-none z-[105]"
            style={selectionStyle}
          >
            {/* The bright part of the image inside the selection */}
            <div className="absolute inset-0 overflow-hidden">
              <img 
                src={regionSelectImage} 
                alt="Screen Capture Selection" 
                className="absolute pointer-events-none"
                style={{
                  width: '100vw',
                  height: '100vh',
                  left: -selectionStyle.left,
                  top: -selectionStyle.top,
                  maxWidth: 'none'
                }}
              />
            </div>
          </div>
          
          {/* Dimensions Tooltip */}
          <div 
            className="absolute bg-[#1A1A1A]/90 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-md shadow-lg pointer-events-none z-[120] border border-white/10"
            style={{
              left: selectionStyle.left + selectionStyle.width + 12,
              top: selectionStyle.top + selectionStyle.height + 12,
            }}
          >
            {Math.round(selectionStyle.width)} &times; {Math.round(selectionStyle.height)}
          </div>
        </>
      )}
    </div>
  );
}
