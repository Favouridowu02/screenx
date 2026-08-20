<div align="center">
  <img src="desktop/public/favicon.png" width="128" alt="ScreenX Logo">
  <h1>ScreenX</h1>
  <p><strong>A blazing fast, unbloated, and beautiful screenshot utility for Windows.</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Platform: Windows](https://img.shields.io/badge/Platform-Windows-0078D6.svg)]()
  [![Built with Tauri](https://img.shields.io/badge/Built_with-Tauri-FFC131.svg)](https://tauri.app)
</div>

<br />

ScreenX is an open-source, minimalist alternative to standard screen clipping tools. Built on a native Rust engine with a React/Vite frontend, it is extremely lightweight and offers a premium Glassmorphism aesthetic.

## ✨ Features

- ⚡ **Native Rust Backend**: Low-level OS hooks for instant capture.
- ⌨️ **Global Shortcut**: Press `Ctrl + Alt + M` to trigger a capture anytime, even when minimized!
- 🎨 **Glassmorphism UI**: Beautiful, customizable overlay frames and shadows.
- 📋 **Instant Clipboard**: Copy your final captures directly to your clipboard in one click.
- 👻 **Background Daemon**: Minimizes to your System Tray to stay out of your way.

## 🚀 Installation (Ready to use!)

You don't need to compile anything. Pre-built binaries are generated automatically.

1. Go to the [Releases](../../releases) tab on this GitHub repository.
2. Download the latest `ScreenX_1.0.0_x64-setup.exe`.
3. Run the installer.
4. ScreenX will launch and sit quietly in your System Tray!

## 💻 Development Setup

If you want to contribute or build from source:

### Prerequisites
- [Node.js](https://nodejs.org)
- [Rust](https://rustup.rs/)

### Running Locally
```bash
git clone https://github.com/favouridowu/screenx.git
cd screenx/desktop
npm install
npm run tauri dev
```

## 🤝 Contributing
Contributions are always welcome! Feel free to open an issue or submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
