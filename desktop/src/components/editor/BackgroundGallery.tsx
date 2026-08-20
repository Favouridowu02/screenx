import bg1 from '../../assets/background1.jpg';
import bg2 from '../../assets/background2.jpg';
import bg3 from '../../assets/background3.jpg';
import bg5 from '../../assets/background5.jpg';

const BACKGROUNDS = [
  'auto',
  bg1,
  bg2,
  bg3,
  bg5,
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop"
];

import { useRef } from 'react';
import { useEditor } from '../../core/state/EditorContext';

export function BackgroundGallery() {
  const { activeIndex, setActiveIndex, customBackgrounds, setCustomBackgrounds } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newBg = event.target.result as string;
          setCustomBackgrounds([...customBackgrounds, newBg]);
          setActiveIndex(BACKGROUNDS.length + customBackgrounds.length);
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const allBackgrounds = [...BACKGROUNDS, ...customBackgrounds];

  return (
    <div className="flex justify-center gap-4 mt-8 mb-4 flex-wrap max-w-4xl">
      {allBackgrounds.map((bg, idx) => (
        <button 
          key={idx} 
          onClick={() => setActiveIndex(idx)}
          className={`w-[84px] h-[84px] cursor-pointer overflow-hidden box-border transition-all duration-300 ease-out hover:scale-[1.05] active:scale-95 relative flex flex-col items-center justify-center bg-[#333] shrink-0 ${
            activeIndex === idx 
              ? 'border-[3px] border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
              : 'border-[3px] border-transparent opacity-80 hover:opacity-100 hover:border-gray-500'
          }`}
        >
          {bg === 'auto' ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
              <span className="text-white font-bold text-xs uppercase tracking-wider shadow-sm drop-shadow-md">Auto Blur</span>
            </div>
          ) : (
            <img src={bg} alt={`Background ${idx + 1}`} className="w-full h-full object-cover" />
          )}
        </button>
      ))}

      <button 
        onClick={handleUploadClick}
        title="Upload custom background"
        className="w-[84px] h-[84px] shrink-0 cursor-pointer overflow-hidden box-border transition-all duration-300 ease-out hover:scale-[1.05] active:scale-95 flex flex-col items-center justify-center bg-[#2A2A2A] border-[3px] border-dashed border-gray-600 hover:border-gray-400 hover:bg-[#333] text-gray-500 hover:text-white"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  );
}

export { BACKGROUNDS };
