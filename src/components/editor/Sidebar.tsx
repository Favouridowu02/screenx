import { useRef } from 'react';
import { useEditor } from '../../core/state/EditorContext';

export function Sidebar() {
  const { logoUrl, setLogoUrl, customText, setCustomText, showMacFrame, setShowMacFrame, shadowIntensity, setShadowIntensity, canvasPadding, setCanvasPadding, logoPosition, setLogoPosition, textStyle, setTextStyle } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-[320px] flex flex-col px-8 py-8 relative border-l border-[#2C2C2C] bg-[#222222]">
      <div className="flex-1 flex flex-col w-full gap-8">
        <div>
          <p className="text-[12px] text-gray-300 text-center leading-relaxed">
            Press <strong className="text-white font-bold">Ctrl + Alt + M</strong> to start a screenshot
          </p>
        </div>

        {/* Window Styling */}
        <div className="w-full flex flex-col gap-5">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Window Styling</h3>
          
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-gray-200">macOS Frame</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={showMacFrame} onChange={(e) => setShowMacFrame(e.target.checked)} />
              <div className="w-9 h-5 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#007AFF]"></div>
            </label>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-gray-200">Padding</span>
              <span className="text-[11px] text-gray-400">{canvasPadding}px</span>
            </div>
            <input 
              type="range" 
              min="16" 
              max="128" 
              value={canvasPadding} 
              onChange={(e) => setCanvasPadding(Number(e.target.value))}
              className="w-full h-1 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#007AFF]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[13px] text-gray-200">Shadow</span>
            <div className="flex bg-[#333] rounded p-1 gap-1">
              {(['none', 'sm', 'lg', '2xl'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setShadowIntensity(size)}
                  className={`flex-1 text-[11px] py-1.5 rounded capitalize transition-colors ${shadowIntensity === size ? 'bg-[#595959] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-[#444]'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay Options */}
        <div className="w-full flex flex-col gap-4">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-2">Overlays</h3>
          
          <div className="w-full flex flex-col gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              onClick={handleUploadClick}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#333] hover:bg-[#444] rounded text-white transition-colors shadow-sm border border-transparent"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M16 16l-4-4-4 4M12 12v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-semibold text-sm">Upload Logo</span>
            </button>
            {logoUrl && (
              <div className="grid grid-cols-2 gap-1 bg-[#333] p-1 rounded mt-1">
                {(
                  [
                    { value: 'top-left', label: 'Top L' }, { value: 'top-right', label: 'Top R' },
                    { value: 'bottom-left', label: 'Bot L' }, { value: 'bottom-right', label: 'Bot R' }
                  ] as const
                ).map(pos => (
                  <button
                    key={pos.value}
                    onClick={() => setLogoPosition(pos.value)}
                    className={`text-[10px] py-1 rounded transition-colors ${logoPosition === pos.value ? 'bg-[#595959] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-[#444]'}`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full flex flex-col gap-2">
            <input 
              type="text" 
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Custom Text Overlay"
              className="w-full bg-[#333] text-white placeholder-gray-500 text-sm rounded px-3 py-3 border border-transparent focus:border-gray-500 focus:outline-none shadow-sm"
            />
            {customText && (
              <div className="flex bg-[#333] rounded p-1 gap-1">
                {(['glass', 'solid', 'hidden'] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => setTextStyle(style)}
                    className={`flex-1 text-[11px] py-1.5 rounded capitalize transition-colors ${textStyle === style ? 'bg-[#595959] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-[#444]'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6">
        <a href="https://github.com/favouridowu" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:text-blue-400 text-[11px] underline font-medium">
          Built by Favour Idowu
        </a>
      </div>
    </div>
  );
}
