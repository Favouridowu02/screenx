import { createContext, useContext, useState, useRef, ReactNode, RefObject } from 'react';

interface EditorContextType {
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
  customText: string;
  setCustomText: (text: string) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  screenshotData: string | null;
  setScreenshotData: (data: string | null) => void;
  regionSelectImage: string | null;
  setRegionSelectImage: (data: string | null) => void;
  showMacFrame: boolean;
  setShowMacFrame: (show: boolean) => void;
  shadowIntensity: string;
  setShadowIntensity: (intensity: string) => void;
  canvasPadding: number;
  setCanvasPadding: (padding: number) => void;
  logoPosition: string;
  setLogoPosition: (pos: string) => void;
  textStyle: string;
  setTextStyle: (style: string) => void;
  customBackgrounds: string[];
  setCustomBackgrounds: (backgrounds: string[]) => void;
  canvasRef: RefObject<HTMLDivElement | null>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const [activeIndex, setActiveIndex] = useState(0); // Start with 0 (Auto Blur)
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [regionSelectImage, setRegionSelectImage] = useState<string | null>(null);
  const [showMacFrame, setShowMacFrame] = useState(true);
  const [shadowIntensity, setShadowIntensity] = useState("2xl");
  const [canvasPadding, setCanvasPadding] = useState(64);
  const [logoPosition, setLogoPosition] = useState("bottom-right");
  const [textStyle, setTextStyle] = useState("glass");
  const [customBackgrounds, setCustomBackgrounds] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <EditorContext.Provider value={{ 
      logoUrl, setLogoUrl, 
      customText, setCustomText, 
      activeIndex, setActiveIndex,
      screenshotData, setScreenshotData,
      regionSelectImage, setRegionSelectImage,
      showMacFrame, setShowMacFrame,
      shadowIntensity, setShadowIntensity,
      canvasPadding, setCanvasPadding,
      logoPosition, setLogoPosition,
      textStyle, setTextStyle,
      customBackgrounds, setCustomBackgrounds,
      canvasRef
    }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
