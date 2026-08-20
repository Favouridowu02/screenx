import { createContext, useContext, useState, useRef, ReactNode, RefObject } from 'react';
import { ShadowIntensity, LogoPosition, TextStyle } from '../../types';

/**
 * The core global state for the ScreenX Editor.
 */
interface EditorContextType {
  /** The local blob URL for the uploaded custom logo overlay. */
  logoUrl: string | null;
  /** Sets the logo URL state. */
  setLogoUrl: (url: string | null) => void;
  
  /** The text string displayed in the custom text overlay. */
  customText: string;
  /** Sets the custom text string. */
  setCustomText: (text: string) => void;
  
  /** The currently active background index. */
  activeIndex: number;
  /** Sets the active background index. */
  setActiveIndex: (index: number) => void;
  
  /** The base64 data string of the fully captured screenshot, ready to be framed. */
  screenshotData: string | null;
  /** Sets the base64 screenshot data. */
  setScreenshotData: (data: string | null) => void;
  
  /** The base64 data string used when the user selects a partial region of the screen. */
  regionSelectImage: string | null;
  /** Sets the region select image base64 data. */
  setRegionSelectImage: (data: string | null) => void;
  
  /** Determines if the macOS-style window traffic lights are visible on the frame. */
  showMacFrame: boolean;
  /** Toggles the macOS frame visibility. */
  setShowMacFrame: (show: boolean) => void;
  
  /** The intensity of the drop shadow rendered behind the screenshot window. */
  shadowIntensity: ShadowIntensity;
  /** Sets the shadow intensity preset. */
  setShadowIntensity: (intensity: ShadowIntensity) => void;
  
  /** The padding in pixels between the edge of the background and the screenshot frame. */
  canvasPadding: number;
  /** Sets the canvas padding (e.g., 64px). */
  setCanvasPadding: (padding: number) => void;
  
  /** The corner where the custom logo overlay is anchored. */
  logoPosition: LogoPosition;
  /** Sets the logo anchor position. */
  setLogoPosition: (pos: LogoPosition) => void;
  
  /** The aesthetic style of the custom text overlay. */
  textStyle: TextStyle;
  /** Sets the text overlay aesthetic style. */
  setTextStyle: (style: TextStyle) => void;
  
  /** A list of local blob URLs for user-uploaded custom backgrounds. */
  customBackgrounds: string[];
  /** Sets the array of custom backgrounds. */
  setCustomBackgrounds: (backgrounds: string[]) => void;
  
  /** A React ref pointing to the outer canvas DOM element used for exporting images. */
  canvasRef: RefObject<HTMLDivElement | null>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

/**
 * Provides the global editor state to the React component tree.
 * Should wrap the main App component.
 */
export function EditorProvider({ children }: { children: ReactNode }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [regionSelectImage, setRegionSelectImage] = useState<string | null>(null);
  const [showMacFrame, setShowMacFrame] = useState(true);
  const [shadowIntensity, setShadowIntensity] = useState<ShadowIntensity>("2xl");
  const [canvasPadding, setCanvasPadding] = useState(64);
  const [logoPosition, setLogoPosition] = useState<LogoPosition>("bottom-right");
  const [textStyle, setTextStyle] = useState<TextStyle>("glass");
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

/**
 * A custom hook to access the Editor context safely.
 * @throws {Error} If called outside of an EditorProvider boundary.
 * @returns {EditorContextType} The Editor global state and setters.
 */
export function useEditor(): EditorContextType {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
