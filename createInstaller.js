import electronInstaller from 'electron-winstaller';
import path from 'path';

async function buildInstaller() {
  try {
    console.log('Creating professional Windows Installer (Setup.exe)...');
    
    await electronInstaller.createWindowsInstaller({
      appDirectory: path.join(process.cwd(), 'dist-desktop', 'TradeOS-AI-win32-x64'),
      outputDirectory: path.join(process.cwd(), 'dist-desktop', 'installer'),
      authors: 'TradeOS AI',
      exe: 'TradeOS-AI.exe',
      setupExe: 'TradeOS_AI_Setup_1.0.0.exe',
      noMsi: true,
      loadingGif: path.join(process.cwd(), 'splash.gif'),
      description: 'TradeOS AI - Institutional Trading Intelligence OS'
    });
    
    console.log('Successfully created installer at: dist-desktop/installer/TradeOS_AI_Setup_1.0.0.exe');
  } catch (e) {
    console.error(`Installer creation failed: ${e.message}`);
  }
}

buildInstaller();
