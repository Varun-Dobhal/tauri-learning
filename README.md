# 🦀 Tauri v2 Desktop Application

A **production-grade desktop application** built with **Tauri v2 + Rust + React**, focused on **real-world OS integration**, **background tasks**, and **secure auto-updates**.

This project was developed as a **hands-on learning journey**, not a tutorial clone.

---

## ✨ Key Features

- Custom **native title bar** (no OS decorations)
- File system access (Open / Save / Shortcuts)
- Clipboard integration (Copy / Paste)
- **Unsaved-changes protection** with close confirmation
- **System tray** (Show / Hide / Quit)
- **Real-time system monitor** (CPU, RAM, OS info)
- Background Rust tasks with event streaming
- Secure **state management in Rust**
- **Auto-update system** with GitHub releases

---

## 🧠 Core Concepts Learned

- Tauri v2 architecture & security model
- Rust backend ↔ React frontend communication
- `invoke()` vs event-based (`emit / listen`) updates
- Background threads & shared state (`Mutex`, `State`)
- OS-level APIs (window, tray, filesystem, clipboard)
- CI/CD release automation with GitHub Actions
- Signed auto-updates (production ready)

---

## 🛠 Tech Stack

- **Frontend:** React + Vite
- **Backend:** Rust (Tauri v2)
- **System APIs:** sysinfo
- **CI/CD:** GitHub Actions
- **Target OS:** Windows (desktop)

---

## 📂 Project Structure

src/ → React frontend
src-tauri/
├─ main.rs → App entry
├─ lib.rs → Plugins & commands
├─ state/ → Global Rust state
├─ monitor/ → Background system monitor
└─ setup/ → Tray & app setup

---

## 🚀 Highlights

- No polling from frontend — **Rust pushes updates**
- Proper close-handling without infinite loops
- Clean separation of concerns (modules)
- Uses **correct Tauri v2 APIs** (not v1 hacks)

---

## 📦 Auto Updates

- GitHub-based release system
- Signed updater metadata
- Automatic update prompt on app launch
- One tag → full desktop release

---

# ⚙️ Project Setup & Installation Guide

This guide explains how to **set up and run the Tauri v2 desktop application locally**.

---

## 📌 Prerequisites

Make sure the following tools are installed on your system:

### 1️⃣ Node.js (LTS)
Download and install from:  
https://nodejs.org/

Verify:
```bash
node -v
npm -v
```

Install Rust using rustup:

rustup install stable
rustup default stable


Verify:

rustc --version
cargo --version
Install the Tauri CLI globally:

cargo install tauri-cli


Verify:

tauri --version

📥 Clone the Repository
git clone https://github.com/<your-username>/tauri-learning.git
cd tauri-learning

📦 Install Frontend Dependencies
npm install


This installs:

React dependencies

Tauri JS bindings

Plugins (clipboard, fs, dialog, etc.)

🚀 Run in Development Mode
npm run tauri dev


This command will:

Start the Vite dev server

Launch the Tauri desktop window

Enable hot-reload for frontend & backend

🏗 Build Production Executable
npm run tauri build


Generated binaries will be available at:

src-tauri/target/release/bundle/


For Windows, this includes:

.exe installer

.msi installer

🔐 Notes

This project uses Tauri v2

Native OS permissions are controlled via capability files

Auto-update works only with GitHub Releases

Windows Defender may prompt on first run (normal for unsigned local builds)

🧹 Common Fixes
If build fails:
cargo clean
npm install
npm run tauri dev

If permissions error occurs:

Check:

src-tauri/capabilities/

---

## 🎯 Goal

To build a **real desktop-grade application** using **Rust & Tauri v2**,  
and strengthen skills relevant to **systems programming, security, and blockchain-based products**.

---

### ⚡ Built with Tauri v2

### 🦀 Powered by Rust

### 🔗 Built by a Rust & Blockchain Developer

👤 Author
Varun Dobhal
Rust & Blockchain Developer
