import { useState, useRef, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useEditor } from '../core/state/EditorContext';
import { CaptureMode } from '../types';

/**
 * A custom hook to handle screen capture logic using the Tauri Rust backend.
 * It coordinates the hiding and showing of the application window to prevent
 * the application itself from appearing in the screenshot.
 *
 * @param selectedMode - The current capture mode (Rectangle or Full screen)
 * @returns {Object} An object containing the isCapturing state and the handleNewCapture function.
 */
export function useCapture(selectedMode: CaptureMode) {
  const [isCapturing, setIsCapturing] = useState(false);
  const { setScreenshotData, setRegionSelectImage } = useEditor();
  const handleNewCaptureRef = useRef<(() => Promise<void>) | undefined>(undefined);

  const handleNewCapture = async () => {
    try {
      setIsCapturing(true);
      
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const appWindow = getCurrentWindow();
      
      // Hide the app so it's not in the screenshot
      await appWindow.hide();
      
      // Wait for the window to hide completely
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const base64Data = await invoke<string>('capture_screen');
      
      if (selectedMode === 'Rectangle') {
        // Show and go fullscreen for region selection
        await appWindow.unminimize();
        await appWindow.show();
        await appWindow.setFocus();
        await appWindow.setFullscreen(true);
        setRegionSelectImage(base64Data);
      } else {
        // Just show
        await appWindow.unminimize();
        await appWindow.show();
        await appWindow.setFocus();
        setScreenshotData(base64Data);
      }
    } catch (error) {
      console.error('Failed to capture screen:', error);
      alert('Failed to capture screen: ' + String(error));
      
      // Attempt to show window again if it failed
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const appWindow = getCurrentWindow();
        await appWindow.unminimize();
        await appWindow.show();
      } catch (e) {}
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    handleNewCaptureRef.current = handleNewCapture;
  }, [handleNewCapture]);

  // Listen for the OS-level global shortcut triggered from Rust
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    
    const setupListener = async () => {
      try {
        const { listen } = await import('@tauri-apps/api/event');
        unlisten = await listen('shortcut-triggered', () => {
          if (handleNewCaptureRef.current) {
            handleNewCaptureRef.current();
          }
        });
      } catch (e) {
        console.error("Failed to setup shortcut listener", e);
      }
    };
    
    setupListener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  return { isCapturing, handleNewCapture };
}
