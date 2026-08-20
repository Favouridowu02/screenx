import { toPng, toJpeg } from 'html-to-image';
import { useEditor } from '../core/state/EditorContext';

/**
 * A custom hook to handle saving the rendered screenshot frame to the native file system.
 * 
 * @returns {Object} An object containing the handleSave function.
 */
export function useSave() {
  const { canvasRef } = useEditor();

  const handleSave = async () => {
    if (!canvasRef.current) return;
    try {
      const { save } = await import('@tauri-apps/plugin-dialog');
      
      // Native Save Dialog
      const filePath = await save({
        filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg'] }],
        defaultPath: 'ScreenX-Capture.png'
      });
      
      if (!filePath) return; // User cancelled the dialog
      
      const isJpeg = filePath.toLowerCase().endsWith('.jpg') || filePath.toLowerCase().endsWith('.jpeg');
      
      // Render the DOM element to base64
      const dataUrl = isJpeg 
        ? await toJpeg(canvasRef.current, { cacheBust: true, pixelRatio: 2, quality: 0.95 })
        : await toPng(canvasRef.current, { cacheBust: true, pixelRatio: 2 });
      
      const { writeFile } = await import('@tauri-apps/plugin-fs');
      
      // Convert base64 to bytes
      const base64Data = dataUrl.split(',')[1];
      const binaryString = window.atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Write directly to disk using Tauri
      await writeFile(filePath, bytes);
      
    } catch (e) {
      console.error(e);
      alert('Failed to save: ' + String(e));
    }
  };

  return { handleSave };
}
