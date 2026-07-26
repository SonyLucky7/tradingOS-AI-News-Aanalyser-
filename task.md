# Production Deployment & Build Checklist

- `[/]` 1. Vercel Serverless Proxy
  - `[ ]` 1.1 Create `api/yahoo.js` serverless function
  - `[ ]` 1.2 Update `vercel.json` rewrite rules to allow `/api` routes
- `[ ]` 2. Desktop Application Build
  - `[ ]` 2.1 Run `npm run electron:build` to generate the `.exe` installer
  - `[ ]` 2.2 Verify installer creation in `dist-desktop`
- `[x]` 3. Local Storage Persistence (Completed)
  - `[x]` 3.1 Save selected chart, module, watchlist, and chat history to `localStorage`
