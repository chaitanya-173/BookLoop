# 📚 BookLoop

**A location-based marketplace for buying, selling, and donating used books — with AI-powered semantic search.**

BookLoop connects students and readers within their community to exchange books at fair prices, discover listings near them, and find what they're looking for even when they don't know the exact title — powered by a real vector search pipeline, not just keyword matching.

---

## ✨ Live Demo

| Service | URL |
|---|---|
| 🌐 App | [https://bookloop-xyz.vercel.app](https://bookloop-xyz.vercel.app/) |
| ⚙️ Backend API | [https://bookloop-server.onrender.com](https://bookloop-server.onrender.com) |
| 🧠 AI / Semantic Search Service | [https://bookloop-ai-service.onrender.com](https://bookloop-ai-service.onrender.com) |

> **Note:** Backend and AI service run on Render's free tier — the first request after inactivity may take 30–50s to wake up (cold start).

---

## 🚀 Features

- 🔐 **Secure authentication** — JWT-based, httpOnly cookies, bcrypt password hashing
- 📖 **Listings** — create, edit, delete book listings with up to 5 images, category, condition, and price
- 🎁 **Sell or Donate** — flexible listing types for both paid sales and donations
- ❤️ **Wishlist** — save listings for later
- 📍 **Nearby books** — Haversine-formula-based distance calculation, sorted by proximity
- 🔎 **Semantic search** — meaning-based search powered by a vector embedding pipeline (see [Architecture](#-architecture)), so "magic school story" finds *Harry Potter* even without matching keywords
- 🔄 **Status tracking** — mark listings as sold/available
- 📱 **Fully responsive** — mobile, tablet, and desktop optimized

---

## 🏗️ Architecture

BookLoop runs as three independently deployed services:

```
┌──────────────┐        ┌──────────────────┐        ┌──────────────────────┐
│   React      │───────▶│  Node / Express    │───────▶│  MongoDB Atlas        │
│  (Vercel)    │        │  (Render)          │        │  (auth, listings, etc)│
└──────────────┘        └────────┬───────────┘        └──────────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐        ┌──────────────────────┐
                         │  FastAPI / Python  │───────▶│  Pinecone             │
                         │  (Render)          │        │  (vector index)       │
                         └──────────────────┘        └──────────────────────┘
```

- **Client** — React 19 + Vite, Tailwind CSS, Context API, Framer Motion
- **Server** — Node.js + Express, MongoDB (Mongoose), JWT auth, Multer for uploads
- **AI Service** — Python + FastAPI, calls Pinecone's integrated inference API to embed and search listings by meaning, decoupled from the main backend so the core marketplace works even if the AI service is briefly unavailable

This polyglot microservice split was a deliberate choice — semantic search is a genuinely separate concern from CRUD/auth, and keeping it isolated means it can fail independently without breaking core buy/sell functionality.

---

## 🛠️ Tech Stack

**Frontend:** React · Vite · Tailwind CSS · React Router · Context API · Framer Motion · Axios

**Backend:** Node.js · Express · MongoDB · Mongoose · JWT · bcrypt · Multer

**AI / Search:** Python · FastAPI · Pinecone (vector database, integrated embeddings)

**Infra:** MongoDB Atlas · Render · Vercel

---

## 📂 Project Structure

```
BookLoop/
├── client/          # React frontend
├── server/          # Node/Express backend (auth, listings, CRUD)
├── ai-service/       # FastAPI service for semantic search
└── DEPLOYMENT.md     # Full deployment guide
```

---

## ⚙️ Running Locally

Each service runs independently. You'll need **3 terminals**.

### Prerequisites
- Node.js 18+
- Python 3.11+
- A MongoDB Atlas connection string
- A Pinecone account + index (integrated embedding, e.g. `llama-text-embed-v2`)

### 1. Backend
```bash
cd server
npm install
cp .env.example .env   # fill in your values
npm run dev
```

### 2. AI Service
```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your Pinecone credentials
uvicorn main:app --reload --port 8000
```

### 3. Frontend
```bash
cd client
npm install
cp .env.example .env   # set VITE_API_URL to your local backend
npm run dev
```

Visit `http://localhost:5173`.

---

## ☁️ Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full step-by-step guide covering MongoDB Atlas, Render (backend + AI service), and Vercel (frontend) — including CORS and cookie configuration for cross-domain production deploys.

---

## 🗺️ Roadmap

- [ ] Migrate image storage from base64/MongoDB to Cloudinary/S3
- [ ] Book recommendation system (using the same embedding pipeline)
- [ ] In-app chat between buyer and seller
- [ ] Ratings and reviews

---

## 👤 Author

**Chaitanya Chaudhary**

- GitHub: [@chaitanya-173](https://github.com/chaitanya-173)
- LinkedIn: [chaitanya-chaudhary](https://linkedin.com/in/chaitanya-chaudhary-675343360)
- LeetCode: [Chaitanya_73](https://leetcode.com/Chaitanya_73)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
