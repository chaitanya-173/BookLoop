# BookLoop — Deployment Guide

BookLoop has 3 parts that deploy separately:

| Part        | What it is                          | Where to deploy      |
|-------------|--------------------------------------|-----------------------|
| `client/`   | React + Vite frontend                | Vercel                |
| `server/`   | Node/Express backend (auth, CRUD)    | Render                |
| `ai-service/` | Python FastAPI (semantic search)   | Render (2nd service)  |

Database: MongoDB Atlas (free M0 cluster) — you're likely already using this locally.
Vector search: Pinecone (free tier).

---

## 1. MongoDB Atlas

If not already done:
1. Create a free cluster at https://cloud.mongodb.com
2. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) — required since Render's IPs aren't static on the free tier.
3. Copy your connection string — this is your `MONGO_URI`.

## 2. Deploy the AI service (Python/FastAPI) — do this first

1. Push your code to GitHub (the whole `BookLoop` repo, including `ai-service/`).
2. Go to https://render.com → **New Web Service** → connect your repo.
3. Root directory: `ai-service`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Environment variables (Render dashboard → Environment):
   ```
   PINECONE_API_KEY=your_pinecone_key
   PINECONE_INDEX=bookloop-listings
   ```
7. Deploy. Once live, copy the service URL (e.g. `https://bookloop-ai.onrender.com`) — you'll need it for the next step.

**Note:** Render's free tier spins down after inactivity — the first request after idle time can take 30-60s to wake up. Fine for a demo/resume project; mention this if asked in an interview.

## 3. Deploy the backend (Node/Express)

1. On Render → **New Web Service** → same repo.
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Environment variables:
   ```
   PORT=10000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=some_long_random_secret
   NODE_ENV=production
   CLIENT_URL=https://your-frontend.vercel.app
   AI_SERVICE_URL=https://bookloop-ai.onrender.com
   ```
   (Update `CLIENT_URL` after step 4 once you have your real Vercel URL — you can have multiple, comma-separated, e.g. for local testing too: `http://localhost:5173,https://your-frontend.vercel.app`)
6. Deploy. Copy the backend URL (e.g. `https://bookloop-server.onrender.com`).

## 4. Deploy the frontend (Vercel)

1. Go to https://vercel.com → **New Project** → import your repo.
2. Root directory: `client`
3. Framework preset: Vite (should auto-detect)
4. Environment variable:
   ```
   VITE_API_URL=https://bookloop-server.onrender.com
   ```
5. Deploy. Vercel will give you a URL like `https://bookloop.vercel.app`.
6. **Go back to your Render backend** and update `CLIENT_URL` to this real Vercel URL, then redeploy the backend so CORS + cookies work correctly.

## 5. Test the full flow

- Sign up / log in on the deployed frontend
- Create a listing with images
- Search for it using **normal search**, then toggle **Smart Search** and search using different words with the same meaning — it should still find it (this proves the Pinecone semantic search pipeline works end-to-end)

## Common issues

- **Login works locally but not on the deployed site:** almost always a cookie issue. Confirm `NODE_ENV=production` is set on Render, and that `CLIENT_URL` on the backend exactly matches your Vercel URL (no trailing slash).
- **CORS error in browser console:** double-check `CLIENT_URL` on the backend matches the frontend URL exactly.
- **Smart Search returns nothing:** check the AI service logs on Render — if `PINECONE_API_KEY`/`PINECONE_INDEX` are wrong you'll see it in the logs immediately now (we added proper error logging).
- **First request after idle is slow:** normal on Render's free tier (cold start). Not a bug.
