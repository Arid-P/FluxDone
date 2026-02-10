# FluxDone 🚀

FluxDone is a high-fidelity, premium task management application inspired by TickTick. It is designed with a **Local-First** philosophy, focusing on fluid performance, minimalist aesthetics, and robust data integrity.

## 🏗 Project Architecture

The project follows a decoupled **Flask + HTML/CSS/JS** architecture to ensure pixel-perfect UI control while maintaining a powerful Python backend.

- **Backend:** Flask (Python) with SQLAlchemy 2.0 (Async) for high-performance data handling.
- **Frontend:** Modern HTML5, CSS3 (custom TickTick-style themes), and Vanilla JavaScript.
- **Database:** SQLite with a UUID-based schema to support future multi-device synchronization.

## 📂 File Structure

```text
FluxDone/
├── backend/            # Python Logic & Database
│   ├── db/             # SQLite storage (fluxdone.db)
│   ├── models/         # SQLAlchemy 2.0 Table Schemas
│   ├── sync/           # JSON Backup & Import Service
│   └── utils/          # Logging and helper functions
├── static/             # Frontend Assets
│   ├── css/            # TickTick-style styling (Priority bars, etc.)
│   └── js/             # UI Interactions & API calls
├── templates/          # HTML Layouts
├── app.py              # Flask Entry Point
└── config/             # Environment & App Settings
