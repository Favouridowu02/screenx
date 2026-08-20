import { useState, useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';

export function Titlebar() {
  const appWindow = getCurrentWindow();
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    let unlisten: () => void;
    
    appWindow.isMaximized().then(setIsMaximized);

    appWindow.onResized(async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    }).then(fn => {
      unlisten = fn;
    });

    return () => {
      if (unlisten) unlisten();
    };
  }, [appWindow]);

  return (
    <div className="h-10 bg-[#191919] flex items-center px-4 select-none">
      <div className="flex items-center gap-2 pointer-events-none">
        <img src="/src/assets/logo.png" alt="ScreenX Logo" className="w-4 h-4 object-contain" />
        <span className="text-[13px] text-gray-200 font-medium tracking-wide">ScreenX</span>
      </div>
      
      {/* Draggable empty space */}
      <div data-tauri-drag-region className="flex-1 h-full cursor-default"></div>

      <div className="flex gap-1">
        <button 
          onClick={() => appWindow.minimize()}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] transition-colors rounded-sm cursor-pointer" 
          title="Minimize"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" pointerEvents="none">
            <path d="M2 6H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button 
          onClick={() => appWindow.toggleMaximize()}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] transition-colors rounded-sm cursor-pointer" 
          title={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" pointerEvents="none">
              <rect x="2.5" y="4.5" width="5" height="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.5 4.5V2.5H9.5V7.5H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" pointerEvents="none">
              <rect x="2" y="2" width="8" height="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        <button 
          onClick={() => appWindow.close()}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 transition-colors rounded-sm cursor-pointer" 
          title="Close"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" pointerEvents="none">
            <path d="M11 1L1 11M1 1L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
