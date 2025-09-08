const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'dev';

let mainWindow;

function createWindow() {
  // Criar janela do browser
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarStyle: 'default',
    show: false // Não mostrar até estar pronto
  });

  // Carregar o jogo
  mainWindow.loadFile('index.html');

  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Configurar menu
  createMenu();

  // Eventos da janela
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevenir abertura de novas janelas
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function createMenu() {
  const template = [
    {
      label: 'Jogo',
      submenu: [
        {
          label: 'Novo Jogo',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.executeJavaScript('window.location.reload();');
          }
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Controles',
      submenu: [
        {
          label: 'Teclado',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              alert('Controles:\\n\\n' +
                'Jogador 1:\\n' +
                'WASD - Movimento\\n' +
                'F - Soco\\n' +
                'G - Chute\\n' +
                'H - Magia\\n\\n' +
                'Jogador 2:\\n' +
                'Setas - Movimento\\n' +
                'K - Soco\\n' +
                'L - Chute\\n' +
                '; - Magia'
              );
            `);
          }
        }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre',
          click: () => {
            shell.openExternal('https://github.com/PedroM2626/Primeiro-jogo-javascript-');
          }
        }
      ]
    }
  ];

  // Menu para macOS
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Eventos do app
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Prevenir múltiplas instâncias
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Segurança - prevenir execução de código externo
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});