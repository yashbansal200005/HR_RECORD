# Project cleanup — final commit

This commit centralizes cleanup for production deployment.

What was removed:
- Removed Netlify, Railway, and Vercel deployment config files and guides.
  - `netlify.toml`, `vercel.json`, `railway.json`, `RAILWAY_BACKEND_SETUP.md`, `start.sh` removed.

What remains:
- `backend/` — backend API (deployed to Render: https://hr-record.onrender.com)
- `frontend/` — React app (deployed to Vercel: https://hr-record.vercel.app/)
- `Dockerfile`, `.nvmrc` — kept for local/container consistency

Notes:
- Local `.env` files are ignored via `.gitignore`; keep secrets in Render/Vercel/Cloudflare environment variables.
- If you want to deploy to Cloudflare Pages instead of Vercel, update Cloudflare project settings and environment variables accordingly.

If anything else looks unusual, tell me and I will remove it.
