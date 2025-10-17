/**
 * Terminal Emulator Module for ShikiHub Pro
 * Handles terminal-like functionality and commands
 */
const terminal = {
  // Configuration
  COMMAND_HISTORY_SIZE: 50,
  
  // State
  commandHistory: [],
  historyIndex: -1,
  matrixActive: false,
  
  // DOM Elements
  terminalOutput: null,
  terminalInput: null,
  
  /**
   * Initialize terminal emulator
   */
  init() {
    this.terminalOutput = document.getElementById('terminalOutput');
    this.terminalInput = document.getElementById('terminalInput');
    
    // Set up event listeners
    if (this.terminalInput) {
      this.terminalInput.addEventListener('keydown', (e) => this.handleKeydown(e));
      this.terminalInput.addEventListener('input', () => utils.playKeySound());
    }
  },
  
  /**
   * Handle keydown events in terminal
   */
  handleKeydown(e) {
    // Enter key - process command
    if (e.key === 'Enter') {
      const command = this.terminalInput.value.trim();
      
      if (command) {
        this.processCommand(command);
        this.commandHistory.unshift(command);
        
        // Trim history to max size
        if (this.commandHistory.length > this.COMMAND_HISTORY_SIZE) {
          this.commandHistory.pop();
        }
      } else {
        // Empty command - just add a new prompt
        this.addNewPrompt();
      }
      
      this.historyIndex = -1;
      this.terminalInput.value = '';
    }
    
    // Up arrow - navigate command history
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      
      if (this.commandHistory.length > 0) {
        this.historyIndex = Math.min(this.historyIndex + 1, this.commandHistory.length - 1);
        this.terminalInput.value = this.commandHistory[this.historyIndex];
      }
    }
    
    // Down arrow - navigate command history
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.terminalInput.value = this.commandHistory[this.historyIndex];
      } else {
        this.historyIndex = -1;
        this.terminalInput.value = '';
      }
    }
    
    // Tab key - command completion (basic)
    else if (e.key === 'Tab') {
      e.preventDefault();
      
      const input = this.terminalInput.value.trim();
      if (input) {
        const commands = ['help', 'clear', 'echo', 'date', 'ls', 'pwd', 
                         'whoami', 'hack', 'matrix', 'exit'];
        
        // Find matching commands
        const matches = commands.filter(cmd => cmd.startsWith(input));
        
        if (matches.length === 1) {
          // One match - complete the command
          this.terminalInput.value = matches[0] + ' ';
        } else if (matches.length > 1) {
          // Multiple matches - show possibilities
          this.addOutput('<br>');
          this.addOutput(matches.join('  '));
          this.addNewPrompt();
        }
      }
    }
  },
  
  /**
   * Process terminal command
   */
  processCommand(command) {
    // Add command to output
    const promptSpan = document.querySelector('.terminal-prompt').cloneNode(true);
    promptSpan.querySelector('.terminal-cursor').remove();
    promptSpan.innerHTML += command;
    this.terminalOutput.insertBefore(promptSpan, document.querySelector('.terminal-prompt'));
    
    // Process command
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();
    
    // Command processor
    switch(cmd) {
      case 'help':
        this.showHelp();
        break;
        
      case 'clear':
        this.clearTerminal();
        break;
        
      case 'echo':
        this.echo(args.slice(1).join(' '));
        break;
        
      case 'date':
        this.showDate();
        break;
        
      case 'ls':
        this.listFiles();
        break;
        
      case 'pwd':
        this.showCurrentDirectory();
        break;
        
      case 'whoami':
        this.showUser();
        break;
        
      case 'hack':
        this.hackTarget(args[1]);
        break;
        
      case 'matrix':
        this.startMatrix();
        break;
        
      case 'exit':
        this.addOutput('Cannot exit terminal. System override in effect.');
        break;
        
      default:
        this.addOutput(`Command not found: ${cmd}. Type 'help' for available commands.`, 'cmd-error');
    }
    
    // Add new prompt
    this.addNewPrompt();
  },
  
  /**
   * Show available commands
   */
  showHelp() {
    this.addOutput('<br>ShikiHub Neural Terminal v2.5.0<br>');
    this.addOutput('Available commands:<br>');
    this.addOutput('  help          - Show this help message');
    this.addOutput('  clear         - Clear terminal screen');
    this.addOutput('  echo [text]   - Display text');
    this.addOutput('  date          - Show current date and time');
    this.addOutput('  ls            - List files in current directory');
    this.addOutput('  pwd           - Show current directory');
    this.addOutput('  whoami        - Show current user');
    this.addOutput('  hack [target] - Attempt to hack a target system');
    this.addOutput('  matrix        - Enter the Matrix');
    this.addOutput('  exit          - Exit terminal (restricted)');
  },
  
  /**
   * Clear terminal screen
   */
  clearTerminal() {
    // Remove all but the last element (current prompt)
    while (this.terminalOutput.childElementCount > 1) {
      this.terminalOutput.removeChild(this.terminalOutput.firstChild);
    }
  },
  
  /**
   * Echo text to terminal
   */
  echo(text) {
    if (text) {
      this.addOutput(text);
    } else {
      this.addOutput('');
    }
  },
  
  /**
   * Show current date and time
   */
  showDate() {
    const now = new Date();
    this.addOutput(now.toString(), 'cmd-info');
  },
  
  /**
   * List fake files
   */
  listFiles() {
    this.addOutput('<br>Directory listing:<br>');
    this.addOutput('drwxr-xr-x  2 root  root  4096 May 15 12:34 .', 'cmd-info');
    this.addOutput('drwxr-xr-x  8 root  root  4096 May 15 12:34 ..', 'cmd-info');
    this.addOutput('-rw-r--r--  1 root  root  2345 May 10 09:12 cipher.log', 'cmd-info');
    this.addOutput('-rw-r--r--  1 root  root  5432 May 12 15:30 access.dat', 'cmd-info');
    this.addOutput('-rwxr-xr-x  1 root  root  8765 May 13 11:20 decoder.bin', 'cmd-success');
    this.addOutput('-rw-------  1 root  root  1024 May 14 18:45 keys.enc', 'cmd-warning');
    this.addOutput('drwxr-xr-x  3 root  root  4096 May 15 10:15 secured', 'cmd-info');
  },
  
  /**
   * Show current directory
   */
  showCurrentDirectory() {
    this.addOutput('/root/shikihub/secured', 'cmd-info');
  },
  
  /**
   * Show current user
   */
  showUser() {
    this.addOutput('root', 'cmd-warning');
    this.addOutput('uid=0(root) gid=0(root) groups=0(root)');
  },
  
  /**
   * Simulate hacking a target
   */
  hackTarget(target) {
    if (!target) {
      this.addOutput('Hack target required', 'cmd-error');
      return;
    }
    
    this.addOutput(`<br>Initiating hack on ${target}...<br>`, 'cmd-warning');
    
    // Simulate a progressive hack attack
    setTimeout(() => this.addOutput('Scanning for open ports...'), 500);
    setTimeout(() => this.addOutput('Port scan complete. Found 3 open ports.', 'cmd-success'), 1500);
    setTimeout(() => this.addOutput('Probing for vulnerabilities on port 22...'), 2500);
    setTimeout(() => this.addOutput('Attempting SSH brute force...'), 3500);
    setTimeout(() => this.addOutput('SSH authentication failure.', 'cmd-error'), 4500);
    setTimeout(() => this.addOutput('Switching to port 80. Probing for web exploits...'), 5500);
    setTimeout(() => this.addOutput('Injection point found! Exploiting...', 'cmd-success'), 6500);
    setTimeout(() => this.addOutput('Establishing backdoor...'), 7500);
    setTimeout(() => {
      this.addOutput('ACCESS GRANTED', 'cmd-success');
      this.addOutput(`You now have control of ${target}`, 'cmd-success');
      this.addNewPrompt();
    }, 8500);
  },
  
  /**
   * Start Matrix effect
   */
  startMatrix() {
    if (this.matrixActive) {
      this.addOutput('Matrix is already running!', 'cmd-warning');
      return;
    }
    
    this.addOutput('<br>Entering the Matrix...<br>', 'cmd-success');
    
    // Create Matrix container
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-rain';
    this.terminalOutput.appendChild(matrixContainer);
    
    this.matrixActive = true;
    
    // Initialize matrix rain effect
    this.initMatrixRain(matrixContainer);
    
    // Allow exiting matrix with any key
    const exitListener = (e) => {
      matrixContainer.remove();
      this.matrixActive = false;
      
      // Show exit message
      this.addOutput('<br>Exited the Matrix<br>');
      this.addNewPrompt();
      
      // Remove event listener
      document.removeEventListener('keydown', exitListener);
    };
    
    document.addEventListener('keydown', exitListener);
  },
  
  /**
   * Initialize Matrix rain effect
   */
  initMatrixRain(container) {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // Determine number of columns based on width
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    
    // Create each column
    for (let i = 0; i < columns; i++) {
      const column = document.createElement('div');
      column.className = 'matrix-column';
      column.style.left = (i * fontSize) + 'px';
      column.style.animationDelay = Math.random() * 2 + 's';
      
      // Random speed for each column
      const speed = Math.random() * 100 + 50;
      column.style.animation = `matrixRain ${speed}ms linear infinite`;
      
      // Random starting position
      const yPos = Math.floor(Math.random() * -height);
      column.style.top = yPos + 'px';
      
      // Fill column with random characters
      const columnHeight = Math.floor(height / fontSize);
      
      for (let j = 0; j < columnHeight; j++) {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        
        // Random character
        char.textContent = String.fromCharCode(
          0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1)
        );
        
        // Random opacity
        char.style.opacity = j === 0 ? 1 : Math.random() * 0.8 + 0.2;
        
        // First character glows more
        if (j === 0) {
          char.style.color = '#fff';
          char.style.textShadow = '0 0 10px #fff, 0 0 20px #0f0';
        }
        
        column.appendChild(char);
      }
      
      container.appendChild(column);
    }
  },
  
  /**
   * Add output line to terminal
   */
  addOutput(text, className = '') {
    const line = document.createElement('div');
    line.className = 'terminal-line ' + className;
    line.innerHTML = text;
    
    // Insert before current prompt
    const currentPrompt = document.querySelector('.terminal-prompt');
    this.terminalOutput.insertBefore(line, currentPrompt);
    
    // Scroll to bottom
    this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
  },
  
  /**
   * Add new prompt to terminal
   */
  addNewPrompt() {
    // Remove existing prompt
    const currentPrompt = document.querySelector('.terminal-prompt');
    if (currentPrompt) {
      currentPrompt.remove();
    }
    
    // Create new prompt
    const prompt = document.createElement('div');
    prompt.className = 'terminal-prompt';
    prompt.innerHTML = '<span class="prompt-user">root@shikihub</span>:<span class="prompt-location">~</span>$ <span class="terminal-cursor"></span>';
    
    this.terminalOutput.appendChild(prompt);
    
    // Scroll to bottom
    this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
    
    // Focus input
    this.terminalInput.focus();
  }
};

// Initialize terminal when tab is shown
document.addEventListener('DOMContentLoaded', () => {
  // Setup observer for when terminal becomes visible
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.style.display === 'block' && mutation.target.id === 'terminal') {
        terminal.init();
        observer.disconnect();
      }
    });
  });
  
  const terminalTab = document.getElementById('terminal');
  if (terminalTab) {
    observer.observe(terminalTab, { attributes: true, attributeFilter: ['style'] });
  }
});