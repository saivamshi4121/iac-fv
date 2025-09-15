## Deploying

### Backend on Render
1. Push your repo to GitHub.
2. In Render, click New → Web Service → From repo.
3. Select this repo. Choose "Docker". Render will read `backend/Dockerfile`.
4. Set:
   - Name: iac-validator-backend
   - Region: Oregon (or nearest)
   - Plan: Free (or higher)
   - Health check path: `/healthz`
   - Env var `PORT=8080`
5. Deploy. After it’s live, note the URL, e.g. `https://iac-backend.onrender.com`.

### Frontend on Vercel
1. Import the repo into Vercel.
2. Framework: Next.js.
3. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL=https://iac-backend.onrender.com/api/validate`
4. Build & Output Settings: defaults are fine.
5. Deploy. After deploy, open the site and test.

### Test
Hit `/api/versions` on backend URL to verify tools are installed. Then open the Vercel site and run a validation.

