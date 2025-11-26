# AI Doc Platform 🧠📄

*A full-stack AI-assisted document authoring & generation platform.*

This project implements the assignment **“AI-Assisted Document Authoring and Generation Platform”**. It provides an end-to-end flow where authenticated users can:

> **Login → Configure → Generate → Refine → Export** :contentReference[oaicite:0]{index=0}  

Using a combination of **FastAPI + React**, the app lets users create AI-powered Word/PPT documents, refine content section-by-section, and export the final outputs as `.docx` / `.pptx` files.

---

## 1. Features vs Assignment Requirements

### ✅ Functional Flow

- **User Authentication (JWT)**
  - Secure **register** and **login** using FastAPI & JWT.
  - Protected routes for all project/document operations.

- **Project Dashboard**
  - Each user sees **only their projects**.
  - Create a new project with:
    - Project name
    - Main topic/prompt
    - Document type: `docx` or `pptx`

- **Document Configuration (Scaffolding)** :contentReference[oaicite:1]{index=1}  
  - User chooses:
    - **Document type**: Word (`.docx`) or PowerPoint (`.pptx`)
    - **Main topic** (e.g. *“Market analysis of the EV industry in 2025”*)
  - Current implementation:
    - Automatically scaffolds 3 sections:
      - *Introduction*
      - *Main Content*
      - *Conclusion*
    - (These sections are created for both Word and PowerPoint projects.)
    - This can be extended to full add/remove/reorder in future work.

- **AI-Powered Initial Content Generation** :contentReference[oaicite:2]{index=2}  
  - After configuration and project creation:
    - Backend loop creates each section.
    - For each section, it calls `LLMService.generate_section(main_topic, section_title)`.
    - The generated text is stored in the database as `section.content`.
  - This satisfies *section-by-section AI generation*.

- **Interactive Refinement per Section** :contentReference[oaicite:3]{index=3}  
  For each section/slide:

  - **Refinement Prompt**
    - A textbox where the user can type a custom instruction:
      - e.g., *“Make this more formal”*, *“Summarize to 100 words”*, *“Convert to bullet points”*.
    - Frontend calls `POST /sections/{section_id}/refine` with `{ prompt: "..." }`.
    - Backend:
      - Uses `LLMService.refine_text(...)` to generate a refined version.
      - Saves a `Refinement` record (old + new text, prompt).
      - Updates `section.content` to the latest version.

  - **Feedback Buttons**
    - 👍 / 👎 buttons call `POST /sections/{section_id}/feedback` with `{ is_like: true/false }`.
    - Backend can increment `likes`/`dislikes` counters per section (if present on the model).

  - **Comment Box**
    - Post comments per section via `POST /sections/{section_id}/comments`.
    - List comments via `GET /sections/{section_id}/comments`.
    - Comments are persisted in the database and shown in the UI.

- **Document Export** :contentReference[oaicite:4]{index=4}  
  - Export the final, refined content as:
    - **Word**: `GET /export/docx/{project_id}` (uses `python-docx`)
    - **PowerPoint**: `GET /export/pptx/{project_id}` (uses `python-pptx`)
  - Backend:
    - Fetches the latest sections for the project from DB.
    - Assembles them into a properly formatted `.docx` or `.pptx`.
    - Returns the file as a downloadable response.
  - Frontend has **Download DOCX** / **Download PPTX** buttons.

- **Data Persistence** :contentReference[oaicite:5]{index=5}  
  Each project stores:
  - Document configuration
  - Generated content
  - Refinement history
  - Feedback & comments

- **Bonus (Partial)**
  - The architecture supports an optional **AI-Suggest Outline** endpoint in the future.
  - Currently, automatic outline is fixed to three sections, but can be extended to generate headers/titles via the same `LLMService`.

---

## 2. Tech Stack

**Backend**

- Python 3.x
- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite (can be swapped for PostgreSQL easily)
- python-docx
- python-pptx
- passlib (password hashing)
- python-jose (JWT)
- pydantic / pydantic-settings (config)

**Frontend**

- React (Create React App)
- React Router
- Axios (custom `axiosClient` for authenticated calls)
- Modern, simple CSS-in-JS style objects

---

## 3. Architecture Overview

### High-Level Flow

```text
[ React Frontend ]  <-->  [ FastAPI Backend ]  <-->  [ SQLite DB ]
                                       |
                                       +--> [ LLMService (stub / real LLM) ]
                                       |
                                       +--> [ DOCX / PPTX generators ]
