import { useState, useRef, useEffect } from 'react';
import { CaptureMode } from '../../types';
import { useCapture } from '../../hooks/useCapture';
import { useClipboard } from '../../hooks/useClipboard';
import { useSave } from '../../hooks/useSave';
import saveIconUrl from '../../assets/save.png';

export function Toolbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<CaptureMode>('Rectangle');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Consume our extracted, maintainable hooks
  const { isCapturing, handleNewCapture } = useCapture(selectedMode);
  const { handleCopy } = useClipboard();
  const { handleSave } = useSave();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="h-[52px] bg-[#1E1E1E] flex justify-between items-center px-4 border-b border-[#2C2C2C]">
      <div className="flex items-center gap-6">
        <button 
          onClick={handleNewCapture}
          disabled={isCapturing}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A2A2A] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm text-gray-200 transition-colors shadow-sm ml-2"
        >
          <span className="text-gray-400 text-lg leading-none font-light">{isCapturing ? '...' : '+'}</span>
          <span className="font-medium">{isCapturing ? 'Capturing' : 'New'}</span>
        </button>
        
        {/* Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors p-1"
          >
            {/* Active Icon */}
            {selectedMode === 'Rectangle' ? (
              <svg width="18" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="1" width="14" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 5V2.5A1.5 1.5 0 012.5 1H5M11 1h2.5A1.5 1.5 0 0115 2.5V5M15 11v2.5a1.5 1.5 0 01-1.5 1.5H11M5 15H2.5A1.5 1.5 0 011 13.5V11" />
              </svg>
            )}
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70 mt-0.5">
              <path d="M1 1l3 3 3-3" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-36 bg-[#1A1A1A] border border-[#2F2F2F] rounded-md shadow-2xl py-1 z-50">
              <button 
                onClick={() => { setSelectedMode('Rectangle'); setIsDropdownOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-1.5 hover:bg-[#282828] text-gray-200 text-[13px] transition-colors relative"
              >
                {selectedMode === 'Rectangle' && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3 bg-[#FF453A] rounded-r-sm" />
                )}
                <svg width="14" height="12" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="ml-1 text-gray-300">
                  <rect x="1" y="1" width="14" height="12" rx="1" />
                </svg>
                Rectangle
              </button>
              
              <button 
                onClick={() => { setSelectedMode('Full screen'); setIsDropdownOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-1.5 hover:bg-[#282828] text-gray-200 text-[13px] transition-colors relative"
              >
                {selectedMode === 'Full screen' && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3 bg-[#FF453A] rounded-r-sm" />
                )}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="ml-1 text-gray-300">
                  <path d="M1 5V2.5A1.5 1.5 0 012.5 1H5M11 1h2.5A1.5 1.5 0 0115 2.5V5M15 11v2.5a1.5 1.5 0 01-1.5 1.5H11M5 15H2.5A1.5 1.5 0 011 13.5V11" />
                </svg>
                Full screen
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button id="copy-btn" onClick={handleCopy} className="p-1 hover:bg-[#2D2D2D] rounded-sm transition-colors opacity-90 hover:opacity-100 flex items-center justify-center min-w-[26px]" title="Copy to Clipboard">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
        <button onClick={handleSave} className="p-1 hover:bg-[#2D2D2D] rounded-sm transition-colors opacity-90 hover:opacity-100" title="Save File">
          <img src={saveIconUrl} alt="Save" className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}
