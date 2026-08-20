import { useEffect } from "react";
import { AppShell } from "./components/ui/AppShell";
import { EditorArea } from "./components/editor/EditorArea";
import { Sidebar } from "./components/editor/Sidebar";
import { RegionSelector } from "./components/editor/RegionSelector";
import { EditorProvider } from "./core/state/EditorContext";
import "./App.css";

function App() {
  useEffect(() => {
    // Prevent default drag and drop behavior on the window so the browser doesn't open the image
    const preventDefault = (e: Event) => e.preventDefault();
    window.addEventListener("dragover", preventDefault, false);
    window.addEventListener("drop", preventDefault, false);
    return () => {
      window.removeEventListener("dragover", preventDefault, false);
      window.removeEventListener("drop", preventDefault, false);
    };
  }, []);

  return (
    <EditorProvider>
      <AppShell>
        <div className="flex w-full h-full">
          <EditorArea />
          <Sidebar />
          <RegionSelector />
        </div>
      </AppShell>
    </EditorProvider>
  );
}

export default App;
