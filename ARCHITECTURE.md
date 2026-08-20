# ScreenX Architecture Overview

Welcome to the internal mechanics of ScreenX! 

ScreenX is built using the **Tauri Framework**. Tauri apps are composed of two distinct halves that talk to each other securely: a **Rust Backend** (for OS-level operations) and a **Web Frontend** (for the UI).

## 1. The Frontend (`desktop/src/`)
The UI is built with **React**, **TypeScript**, and **TailwindCSS**, bundled by **Vite**.

- **`EditorContext.tsx`**: This is the heart of the frontend state. It holds the image data (in base64 format), the styling configuration (glassmorphism settings, padding, shadows), and handles saving/copying the final canvas.
- **`AppShell.tsx`**: The main layout wrapper.
- **`Toolbar.tsx`**: Contains the "New Capture", "Copy", and "Save" buttons. It also listens for the `shortcut-triggered` event from the backend.
- **`Sidebar.tsx`**: Contains all the customization sliders (padding, macOS frames, text overlays, etc.).
- **`EditorArea.tsx`**: Renders the screenshot inside the customizable frame using DOM-to-Image logic (`html-to-image`) when saving/copying.

## 2. The Backend (`desktop/src-tauri/`)
The backend is written entirely in **Rust**. It handles things that web browsers usually cannot do.

- **`lib.rs` / `main.rs`**: The entry point for the application.
- **Global Shortcuts**: We use native Rust global shortcuts (via `tauri-plugin-global-shortcut`). When the user presses `Ctrl+Alt+M`, the Rust backend catches this OS-level event and emits a `shortcut-triggered` message to the React frontend.
- **System Tray**: We use `tauri-plugin-tray-icon` to register a background system tray icon.
- **Window Intercept**: When the user clicks the native "X" button to close the app, the Rust backend intercepts the `RunEvent::WindowEvent` and instead *minimizes* the app so that the global shortcut continues to work in the background!
- **Clipboard**: We use `tauri-plugin-clipboard-manager` to write raw byte arrays directly to the Windows system clipboard when the user clicks the "Copy" button in the frontend.

## 3. Communication Bridge
The frontend and backend communicate via **Tauri Events and Invokes**.

- **Frontend to Backend (Invokes)**: React calls `invoke('command_name')` to ask Rust to do something.
- **Backend to Frontend (Events)**: Rust calls `app.emit("event-name")` to send a message to React. React listens using `listen("event-name", callback)` from `@tauri-apps/api/event`.

If you are adding a feature that requires native OS access, you will need to write a Rust command in `src-tauri/src/lib.rs` and invoke it from `src/`. If it is purely visual, you only need to modify the files in `src/`!
