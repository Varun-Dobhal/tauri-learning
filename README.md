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
