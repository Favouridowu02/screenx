import { toPng } from 'html-to-image';
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
      
      const dataUrl = await toPng(canvasRef.current, { cacheBust: true, pixelRatio: 2 });
      const base64Data = dataUrl.split(',')[1];
      const binaryString = window.atob(base64Data);
      
      // Convert base64 to byte array required by Tauri clipboard plugin
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      await writeImage(bytes);
      
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
