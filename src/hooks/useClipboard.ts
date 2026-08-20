import { toCanvas } from 'html-to-image';
import { useEditor } from '../core/state/EditorContext';

/**
 * A custom hook to handle copying the rendered screenshot frame to the native OS clipboard.
 * 
 * @returns {Object} An object containing the handleCopy function.
 */
export function useClipboard() {
  const { canvasRef } = useEditor();

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      const { writeImage } = await import('@tauri-apps/plugin-clipboard-manager');
      const { Image } = await import('@tauri-apps/api/image');
      
      // 1. Generate canvas directly
      const canvas = await toCanvas(canvasRef.current, { cacheBust: true, pixelRatio: 2 });
      
      // 2. Extract RGBA pixel data
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Failed to get canvas context");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // 3. Convert Uint8ClampedArray to Uint8Array
      const rgba = new Uint8Array(imageData.data.buffer);
      
      // 4. Construct a Tauri Image struct and write it
      const image = await Image.new(rgba, canvas.width, canvas.height);
      await writeImage(image);
      
      // Provide visual feedback without breaking the flow
      const copyBtn = document.getElementById('copy-btn');
      if (copyBtn) {
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="text-green-400 text-xs font-medium px-1">Copied!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
        }, 2000);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to copy: ' + String(e));
    }
  };

  return { handleCopy };
}
