# Production Deployment & Build Plan

## Goal
Prepare TradeOS AI for **Live Website Deployment (Vercel)** and generate the **Live Desktop Application Installer (.exe)** for distribution.

## Background
Currently, the proxy we set up for Yahoo Finance only works in your local `npm run dev` environment (via Vite) or inside the Electron Desktop app. If you push this code to a live website (like Vercel), the Vite proxy won't exist in production, which will cause XAUUSD and Forex to break on the web version. 

We need to build a true Serverless Proxy for the live website, and then package the final `.exe` for the desktop.

## Proposed Changes

### 1. Live Website Compatibility (Vercel Serverless Function)
We will create a serverless backend natively on Vercel so the live website can bypass Yahoo's CORS limits without relying on unstable free proxies.

#### [NEW] `api/yahoo.js`
- Create a Vercel Serverless Function that intercepts `/api/yahoo` requests.
- It will securely fetch data from `query2.finance.yahoo.com` on the backend and return it to the live website with `Access-Control-Allow-Origin: *` headers.

#### [MODIFY] `vercel.json`
- Update the rewrite rules so that `/api/*` traffic goes to the serverless function, while all other traffic goes to the React `index.html` file.

### 2. Live Desktop Application Build
We will compile the final production `.exe` installer that includes the Seamless Auto-Updater we built earlier.

#### [EXECUTE] `npm run electron:build`
- Run the `electron-builder` pipeline to compile the React code and package the Electron app into a professional Setup Wizard.
- This will generate `TradeOS AI Setup 1.0.0.exe` in the `dist-desktop` folder.

## Open Questions
> [!IMPORTANT]
> The `electron-builder` build process will take about 1-2 minutes to compile everything into a `.exe`. Is your Vercel account currently linked to your GitHub repository so that it auto-deploys when I push these changes?

## Verification Plan
1. **Desktop:** Verify the `.exe` installer is generated successfully without build errors.
2. **Website:** Push the Vercel serverless function to GitHub and verify that the `/api/yahoo` endpoint is correctly configured.
