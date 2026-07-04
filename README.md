# ChatAi

ChatAi is a full-stack chat application with a React frontend and an Express/MongoDB backend.

## Repository structure

- `backend/` - Node.js backend API and socket logic.
- `fronted/` - Vite-powered React frontend.
- `.gitignore` - ignores local environment files so secrets are not committed.

## Setup

1. Install dependencies:
   - `npm install` (optional, for root scripts)
   - `cd backend && npm install`
   - `cd fronted && npm install`

2. Create a local environment file for the backend.
   - macOS/Linux: `cp backend/.env.example backend/.env`
   - Windows: `copy backend\.env.example backend\.env`

3. Fill in the required values in `backend/.env`.

4. Start the backend:
   - `cd backend && npm run dev`
   - or from the repo root: `npm run start --prefix backend`

5. Start the frontend:
   - `cd fronted && npm run dev`

## Backend environment variables

Copy `backend/.env.example` to `backend/.env` and add your secret values.

Required variables:

- `MONGO_URI`
- `TOKEN_SECRET`
- `ARCJET_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`

Optional variables:

- `PORT` (default: `6000`)
- `NODE_ENV` (example: `development` or `production`)

## Notes

- The project already ignores `.env` files via `.gitignore`, so your local secrets should not be committed.
- Only commit `backend/.env.example` as a template, not `backend/.env`.

## GitHub Commit

Before committing, confirm that `backend/.env` is not staged.

```bash
git status
```

If `backend/.env` appears, remove it from staging:

```bash
git rm --cached backend/.env
```
