# Instalação - Debiloides Fighters

## 📥 Baixando o Jogo

### Opção 1: Versão Desktop (Recomendado)

1. Acesse a [página de releases](https://github.com/PedroM2626/Primeiro-jogo-javascript-/releases)
2. Baixe a versão para seu sistema operacional:
   - **Windows**: `Debiloides-Fighters-Setup.exe`
   - **macOS**: `Debiloides-Fighters.dmg`
   - **Linux**: `Debiloides-Fighters.AppImage`

### Opção 2: Executar no Navegador

1. Baixe o arquivo ZIP do código-fonte
2. Extraia para uma pasta de sua preferência
3. Abra o arquivo `index.html` em seu navegador

## 🖥️ Instalação por Sistema Operacional

### Windows

1. Baixe o arquivo `Debiloides-Fighters-Setup.exe`
2. Execute o instalador
3. Siga as instruções na tela
4. O jogo será instalado em `C:\Program Files\Debiloides Fighters`
5. Use o atalho na área de trabalho ou menu iniciar

### macOS

1. Baixe o arquivo `Debiloides-Fighters.dmg`
2. Abra o arquivo DMG
3. Arraste o aplicativo para a pasta `Aplicativos`
4. Abra o jogo pelo Launchpad ou pasta Aplicativos

**Nota**: Se aparecer "O aplicativo não pode ser aberto", execute:
```bash
sudo xattr -r -d com.apple.quarantine "/Applications/Debiloides Fighters.app"
```

### Linux

#### AppImage (Recomendado)
1. Baixe o arquivo `Debiloides-Fighters.AppImage`
2. Torne o arquivo executável:
   ```bash
   chmod +x Debiloides-Fighters.AppImage
   ```
3. Execute o arquivo

#### DEB (Ubuntu/Debian)
1. Baixe o arquivo `.deb`
2. Instale com:
   ```bash
   sudo dpkg -i debiloides-fighters_*.deb
   sudo apt-get install -f  # Se houver dependências faltando
   ```

## 🚀 Executando o Jogo

### Desktop
- **Windows**: Use o atalho na área de trabalho ou menu iniciar
- **macOS**: Abra pelo Launchpad
- **Linux**: Execute o AppImage ou use o menu de aplicativos

### Navegador
1. Extraia os arquivos para uma pasta
2. Clique duas vezes em `index.html`
3. Ou use um servidor local:
   ```bash
   # Com Python
   python -m http.server 8000
   # Acesse http://localhost:8000
   ```

## 🔧 Requisitos do Sistema

### Versão Desktop
- **Windows**: Windows 10 ou superior (64-bit)
- **macOS**: macOS 10.12 ou superior
- **Linux**: Ubuntu 16.04 ou superior, ou distribuições compatíveis

### Versão Navegador
- Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- JavaScript habilitado
- Web Audio API suportada

## 📱 Suporte Mobile

O jogo foi otimizado para desktop, mas pode funcionar em tablets com teclado externo.

## 🆘 Solução de Problemas

### "O aplicativo não abre"
- **Windows**: Execute como administrador
- **macOS**: Verifique as permissões nas Preferências do Sistema > Segurança e Privacidade
- **Linux**: Verifique se tem permissões de execução

### "Áudio não funciona"
- Verifique se os alto-falantes estão conectados
- Verifique o volume do sistema
- No Linux, instale pacotes de áudio:
  ```bash
  sudo apt-get install libasound2
  ```

### "Jogo muito lento"
- Feche outros aplicativos
- Verifique se há atualizações disponíveis
- No navegador, tente usar o Chrome ou Firefox

### Erro "Cannot find module"
- Se executando do código-fonte, execute:
  ```bash
  npm install
  npm start
  ```

## 🔄 Atualização

### Versão Desktop
- O aplicativo verifica atualizações automaticamente
- Ou baixe a nova versão do site oficial

### Versão Navegador
- Recarregue a página (F5)
- Limpe o cache do navegador se necessário

## 📞 Suporte

Se encontrar problemas:
1. Verifique esta página de instalação
2. Consulte o README.md para informações adicionais
3. Abra uma issue no [GitHub](https://github.com/PedroM2626/Primeiro-jogo-javascript-/issues)

## 🎯 Dicas de Uso

- **Desktop**: Use F11 para tela cheia
- **Controles**: Os controles podem ser personalizados no código-fonte
- **Performance**: Feche outros aplicativos para melhor performance
- **Salvamento**: O jogo não possui sistema de salvamento (jogo rápido)