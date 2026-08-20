# Contributing to ScreenX

First off, thank you for considering contributing to ScreenX! We want to make it as easy as possible to contribute changes that help our community capture beautiful screenshots.

## 🚀 Getting Started

ScreenX uses a **Tauri** architecture, meaning it is composed of a **Rust backend** and a **React + Vite frontend**.

### Prerequisites
To build ScreenX locally, you need:
1. [Node.js](https://nodejs.org/en/) (v18 or higher)
2. [Rust](https://rustup.rs/) (Stable)
3. Windows 10/11 (Since ScreenX relies on native Windows APIs for screen capture and shortcuts).

### Running Locally
1. **Fork and Clone** the repository to your local machine.
2. Open a terminal in the root directory.
3. Install the frontend dependencies:
   ```bash
   npm install
   ```
4. Start the development server. This will launch both the React frontend (Vite) and compile the Rust backend:
   ```bash
   npm run tauri dev
   ```

## 📐 Architecture Overview
Not sure where to find the code? Check out our [Architecture Guide](ARCHITECTURE.md) to understand how the React frontend communicates with the Rust backend.

## 💻 Making Changes

### Code Style
- **Frontend**: We use Prettier for code formatting. Please ensure your React/TypeScript code is clean and follows modern hooks patterns.
- **Backend**: We use standard Rust conventions. Please run `cargo fmt` inside the `src-tauri` directory before committing.

### Submitting a Pull Request
1. Create a new branch from `main` (e.g., `feature/awesome-new-tool` or `fix/crash-on-launch`).
2. Make your changes and test them locally.
3. If you changed the UI, please include **Screenshots** in your Pull Request description!
4. Submit the PR using our built-in Pull Request template.

## 🐛 Reporting Bugs
If you found a bug, please use the **Bug Report** issue template on GitHub. Be sure to include your Windows version and any error logs from your terminal!

## 📜 Code of Conduct
By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

Thank you for making ScreenX better!
