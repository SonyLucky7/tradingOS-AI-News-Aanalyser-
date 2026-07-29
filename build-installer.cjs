const electronInstaller = require('electron-winstaller');
const path = require('path');

async function build() {
  try {
    console.log('Building Windows Installer with electron-winstaller...');
    await electronInstaller.createWindowsInstaller({
      appDirectory: path.join(__dirname, 'dist-desktop', 'TradeOS-AI-win32-x64'),
      outputDirectory: path.join(__dirname, 'dist-desktop', 'installer'),
      authors: 'SonyLucky7',
      exe: 'TradeOS-AI.exe',
      version: '1.0.0',
      description: 'TradeOS AI Desktop Application',
      title: 'TradeOS AI',
      setupExe: 'TradeOS-AI-Setup-v1.0.0.exe',
      noMsi: true
    });
    console.log('Installer built successfully in dist-desktop/installer');
  } catch (e) {
    console.error(`Build failed: ${e.message}`);
    process.exit(1);
  }
}

build();
