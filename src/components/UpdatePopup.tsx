import React, { useEffect, useState } from 'react';
import { DownloadCloud, RefreshCw, X } from 'lucide-react';

export const UpdatePopup: React.FC = () => {
  const [updateStatus, setUpdateStatus] = useState<'IDLE' | 'AVAILABLE' | 'DOWNLOADED'>('IDLE');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only works in Electron environment
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      const api = (window as any).electronAPI;

      api.onUpdateAvailable(() => {
        setUpdateStatus('AVAILABLE');
        setVisible(true);
      });

      api.onUpdateDownloaded(() => {
        setUpdateStatus('DOWNLOADED');
        setVisible(true);
      });
    }
  }, []);

  if (!visible || updateStatus === 'IDLE') return null;

  const handleRestart = () => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.quitAndInstall();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] glass-panel bg-dark-900 border border-trade-cyan/40 p-4 rounded-xl shadow-2xl shadow-trade-cyan/10 flex flex-col gap-3 w-80 animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 text-trade-cyan font-bold">
          {updateStatus === 'AVAILABLE' ? (
            <DownloadCloud className="w-5 h-5 animate-pulse" />
          ) : (
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
          )}
          <span>Update {updateStatus === 'AVAILABLE' ? 'Downloading...' : 'Ready'}</span>
        </div>
        <button onClick={() => setVisible(false)} className="text-slate-500 hover:text-white transition">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-300">
        {updateStatus === 'AVAILABLE' 
          ? 'A new version of TradeOS AI is downloading in the background. You can continue trading.'
          : 'The update has been downloaded. Restart the application to apply the new features instantly.'}
      </p>

      {updateStatus === 'DOWNLOADED' && (
        <button
          onClick={handleRestart}
          className="mt-1 w-full bg-trade-cyan text-black font-bold py-2 rounded shadow-lg hover:bg-cyan-400 transition"
        >
          Restart & Update Now
        </button>
      )}
    </div>
  );
};
