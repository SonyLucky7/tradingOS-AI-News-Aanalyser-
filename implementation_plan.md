# Live Paper Trading & Seamless Auto-Updater Implementation Plan

## Goal
Build a real-time Paper Trading engine directly into the Live Terminal, and implement a seamless "OTA" (Over-The-Air) update mechanism so the app can automatically update itself from GitHub without ever needing to run a wizard.

## Proposed Changes

### 1. Live Paper Trading Engine
We will create a live version of the trading engine that hooks into the live WebSocket/Yahoo feeds instead of historical candles.

#### [NEW] `src/services/liveTradingEngine.ts`
- Implement `LiveTradingEngine` class.
- Manage virtual balance, positions, and live PnL calculation.
- Save and load account state from `localStorage` so balances persist across restarts.

#### [MODIFY] `src/components/modules/TerminalModule.tsx`
- Add a new "Chart Trader" UI panel (similar to the Replay one) that appears when Paper Trading is active.
- Hook up Buy/Sell buttons to the `LiveTradingEngine`.
- Update PnL continuously based on the incoming `price` from `unifiedLiveData`.

### 2. Seamless Auto-Updater
We will use `electron-updater` to handle silent downloads and one-click restarts.

#### [MODIFY] `package.json`
- Install `electron-updater`.
- Configure `build.publish` to point to your GitHub repository so it knows where to look for updates.

#### [MODIFY] `electron/main.cjs`
- Import `autoUpdater` from `electron-updater`.
- Call `autoUpdater.checkForUpdatesAndNotify()` when the app launches.
- Listen for the `update-downloaded` event.
- Expose an IPC channel to the frontend so React knows an update is ready.
- Add an IPC listener for `quitAndInstall` so React can trigger the seamless restart.

#### [NEW] `src/components/UpdatePopup.tsx`
- A sleek, floating UI component that appears when an update is ready.
- Contains a "Update and Restart" button that triggers the IPC call.

## Open Questions
> [!NOTE] 
> Do you want the Live Paper Trading starting balance to be $10,000 (USD) by default, or would you prefer a different currency/amount like ₹1,000,000 (INR)?

## Verification Plan
1. **Trading:** Open the Terminal, buy 1 unit of XAUUSD, and watch the PnL fluctuate in real-time with the live ticker. Restart the app and verify the position is still open.
2. **Updater:** Simulate an update event in the main process to verify the popup appears and correctly triggers a restart.
