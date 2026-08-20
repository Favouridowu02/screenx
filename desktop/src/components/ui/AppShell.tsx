import { Titlebar } from './Titlebar';
import { Toolbar } from './Toolbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#222222] text-white">
      <Titlebar />
      <Toolbar />
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
}
