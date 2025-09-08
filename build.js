const { build } = require('electron-builder');
const path = require('path');

const config = {
  appId: 'com.debiloides.fighters',
  productName: 'Debiloides Fighters',
  directories: {
    output: 'dist',
    app: '.'
  },
  files: [
    '**/*',
    '!dist/**/*',
    '!node_modules/**/*',
    '!build.js',
    '!README.md',
    '!.git/**/*',
    '!.gitignore',
    '!*.md'
  ],
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64', 'ia32']
      }
    ],
    icon: 'assets/icon.ico'
  },
  mac: {
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64']
      }
    ],
    icon: 'assets/icon.icns',
    category: 'public.app-category.games'
  },
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64']
      },
      {
        target: 'deb',
        arch: ['x64']
      }
    ],
    icon: 'assets/icon.png',
    category: 'Game'
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'Debiloides Fighters'
  },
  dmg: {
    contents: [
      {
        x: 130,
        y: 220
      },
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications'
      }
    ]
  }
};

async function buildApp() {
  try {
    console.log('Iniciando build do Debiloides Fighters...');
    
    await build({
      config,
      publish: 'never'
    });
    
    console.log('Build concluído com sucesso!');
    console.log('Os arquivos estão na pasta dist/');
    
  } catch (error) {
    console.error('Erro durante o build:', error);
    process.exit(1);
  }
}

// Executar build se este arquivo for chamado diretamente
if (require.main === module) {
  buildApp();
}

module.exports = { buildApp, config };