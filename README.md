# 🏚️ Mobile Mystery House Dashboard

An internal analytics and reporting dashboard for **Mobile Mystery House**, an educational mobile game that teaches **digital accessibility principles** through interactive, screen reader–based puzzles.

---

## 📘 Overview

The **Mobile Mystery House Dashboard** provides real-time insights into gameplay, learning outcomes, and accessibility engagement. It helps internal teams evaluate puzzle difficulty, player improvement, and device performance — while exploring AI-assisted reporting.

This dashboard is not open source and is intended for internal use only.

---

## 🎮 About Mobile Mystery House

**Mobile Mystery House** is a story-driven game where each “room” teaches a new accessibility concept — from headings and ARIA labels to landmarks and form structure — within a haunted house setting. Players use a screen reader to navigate, solve puzzles, and learn accessible design.

Key gameplay elements include:

* Accessible puzzle interactions and VoiceOver support
* Progress and time tracking per puzzle
* Post-game feedback collection
* LocalStorage-based session tracking

---

## 📊 Dashboard Features

### Core Analytics

* **Puzzle Completion Overview** — Bar chart + data table of completions per puzzle
* **Attempt Analysis** — Average completion time by attempt number
* **Drop-off Funnel** — Started vs. completed puzzle counts
* **First Try Success** — Measures accessibility learning curve
* **Improvement Score** — Compares first vs. last attempt durations
* **Device Comparison** — Average duration and completions by device type

### AI-Powered Enhancements (Exploratory)

Based on internal prototypes:

* 🧠 **“Ask the Dashboard”** — Natural language queries for analytics
* 💬 **Feedback Sentiment Analysis** — Auto-tag user feedback
* 📈 **Weekly AI Summaries** — GPT-generated KPI highlights
* 🔮 **What-If Scenarios** — Predict outcomes from trend adjustments
* 🎯 **Adaptive Learning Tips** — Personalized coaching suggestions

---

## ⚙️ Tech Stack

| Layer              | Technology                                   |
| ------------------ | -------------------------------------------- |
| **Frontend**       | Next.js (App Router), Tailwind CSS, Recharts |
| **Backend**        | Flask API                                    |
| **Database**       | PostgreSQL (Render)                          |
| **Hosting**        | Vercel (frontend) / Render (backend)         |
| **State Storage**  | LocalStorage                                 |
| **AI Integration** | ChatGPT (for summaries and insights)         |

---

## 🧩 API Endpoints

### Analytics

* `GET /api/analytics` — Overall game stats
* `GET /api/analytics/time-by-attempt`
* `GET /api/analytics/dropoff`
* `GET /api/analytics/completion-funnel`
* `GET /api/analytics/first-try-success`
* `GET /api/analytics/improvement-score`
* `GET /api/analytics/device-comparison`

### Logging & Feedback

* `POST /api/log` — Logs puzzle interactions
* `POST /api/feedback` — Submits survey responses

(See full endpoint reference in `analytics_api_doc.md`)

---

## 🧱 Code Structure

```
/app
 ├─ /components
 │   ├─ dashboard/
 │   │   └─ CompletionChart.tsx
 │   └─ ui/
 ├─ /api/
 │   ├─ route.ts (Flask-integrated API)
 └─ ...
```

Example component:
`CompletionChart.tsx` dynamically fetches puzzle data, renders a Recharts bar chart, and generates an AI summary via `/api/generate-summary/overview`.

---

## 🔒 Internal Use Only

This application is part of the **Mobile Accessibility Training initiative**.
It is not open source, and redistribution or public hosting is not permitted.
