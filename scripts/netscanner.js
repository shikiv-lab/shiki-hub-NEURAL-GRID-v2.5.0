/**
 * Network Scanner Module for ShikiHub Pro
 * Simulates network scanning and visualization
 */
const netscanner = {
  // Scanner state
  scanning: false,
  progress: 0,
  scanTimeout: null,
  
  // Scan data
  scanData: [],
  networkMap: null,
  networkContext: null,
  
  /**
   * Initialize network scanner
   */
  init() {
    this.networkMap = document.getElementById('networkMap');
    
    if (this.networkMap) {
      this.networkContext = this.networkMap.getContext('2d');
      this.initializeMap();
    }
  },
  
  /**
   * Initialize network map
   */
  initializeMap() {
    if (!this.networkContext) return;
    
    // Clear canvas
    this.networkContext.fillStyle = 'rgba(0, 0, 0, 0.9)';
    this.networkContext.fillRect(0, 0, this.networkMap.width, this.networkMap.height);
    
    // Draw grid
    this.networkContext.strokeStyle = 'rgba(0, 255, 255, 0.2)';
    this.networkContext.lineWidth = 0.5;
    
    // Vertical grid lines
    for (let x = 0; x < this.networkMap.width; x += 20) {
      this.networkContext.beginPath();
      this.networkContext.moveTo(x, 0);
      this.networkContext.lineTo(x, this.networkMap.height);
      this.networkContext.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y < this.networkMap.height; y += 20) {
      this.networkContext.beginPath();
      this.networkContext.moveTo(0, y);
      this.networkContext.lineTo(this.networkMap.width, y);
      this.networkContext.stroke();
    }
    
    // Draw default router in center
    this.drawNode(this.networkMap.width / 2, this.networkMap.height / 2, 'router');
  },
  
  /**
   * Draw network node on map
   */
  drawNode(x, y, type = 'device', highlight = false) {
    if (!this.networkContext) return;
    
    const colors = {
      router: '#0ff',
      device: '#f0f',
      server: '#0f0',
      vulnerable: '#f00'
    };
    
    const color = colors[type] || colors.device;
    
    // Draw node
    this.networkContext.fillStyle = color;
    this.networkContext.strokeStyle = highlight ? '#fff' : color;
    this.networkContext.lineWidth = highlight ? 2 : 1;
    
    // Different shapes for different types
    if (type === 'router') {
      // Router - diamond shape
      this.networkContext.beginPath();
      this.networkContext.moveTo(x, y - 8);
      this.networkContext.lineTo(x + 8, y);
      this.networkContext.lineTo(x, y + 8);
      this.networkContext.lineTo(x - 8, y);
      this.networkContext.closePath();
      this.networkContext.fill();
      this.networkContext.stroke();
    } else if (type === 'server') {
      // Server - rectangle
      this.networkContext.fillRect(x - 7, y - 9, 14, 18);
      this.networkContext.strokeRect(x - 7, y - 9, 14, 18);
    } else {
      // Device - circle
      this.networkContext.beginPath();
      this.networkContext.arc(x, y, 6, 0, Math.PI * 2);
      this.networkContext.fill();
      this.networkContext.stroke();
    }
    
    // Add glow effect if highlighted
    if (highlight) {
      this.networkContext.shadowColor = color;
      this.networkContext.shadowBlur = 15;
      this.networkContext.strokeStyle = color;
      this.networkContext.lineWidth = 1;
      
      if (type === 'router') {
        this.networkContext.beginPath();
        this.networkContext.moveTo(x, y - 10);
        this.networkContext.lineTo(x + 10, y);
        this.networkContext.lineTo(x, y + 10);
        this.networkContext.lineTo(x - 10, y);
        this.networkContext.closePath();
        this.networkContext.stroke();
      } else if (type === 'server') {
        this.networkContext.strokeRect(x - 9, y - 11, 18, 22);
      } else {
        this.networkContext.beginPath();
        this.networkContext.arc(x, y, 8, 0, Math.PI * 2);
        this.networkContext.stroke();
      }
      
      this.networkContext.shadowBlur = 0;
    }
  },
  
  /**
   * Draw connection between nodes
   */
  drawConnection(x1, y1, x2, y2, type = 'normal') {
    if (!this.networkContext) return;
    
    const colors = {
      normal: 'rgba(0, 255, 255, 0.4)',
      secure: 'rgba(0, 255, 0, 0.4)',
      vulnerable: 'rgba(255, 0, 0, 0.4)'
    };
    
    this.networkContext.strokeStyle = colors[type] || colors.normal;
    this.networkContext.lineWidth = 1;
    
    this.networkContext.beginPath();
    this.networkContext.moveTo(x1, y1);
    this.networkContext.lineTo(x2, y2);
    this.networkContext.stroke();
    
    // Add animated data packets for effect
    this.animateDataPacket(x1, y1, x2, y2, type);
  },
  
  /**
   * Animate data packet moving along a connection
   */
  animateDataPacket(x1, y1, x2, y2, type) {
    const colors = {
      normal: '#0ff',
      secure: '#0f0',
      vulnerable: '#f00'
    };
    
    const color = colors[type] || colors.normal;
    const context = this.networkContext;
    
    if (!context) return;
    
    // Packet speed
    const speed = 80; // milliseconds
    const steps = 20;
    let currentStep = 0;
    
    // Calculate step increments
    const dx = (x2 - x1) / steps;
    const dy = (y2 - y1) / steps;
    
    // Animate packet
    const animateStep = () => {
      if (currentStep >= steps) return;
      
      // Calculate current position
      const x = x1 + dx * currentStep;
      const y = y1 + dy * currentStep;
      
      // Draw packet
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, 2, 0, Math.PI * 2);
      context.fill();
      
      // Set up next step
      currentStep++;
      setTimeout(animateStep, speed / steps);
    };
    
    // Start animation
    animateStep();
  },
  
  /**
   * Clear scan data and UI
   */
  clearScan() {
    this.scanData = [];
    this.scanning = false;
    this.progress = 0;
    
    // Clear timeout if active
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
      this.scanTimeout = null;
    }
    
    // Reset UI
    document.getElementById('scanStatus').textContent = 'Ready';
    document.getElementById('scanProgressBar').style.width = '0%';
    document.getElementById('stopScanBtn').disabled = true;
    document.getElementById('scanOutput').innerHTML = '<div class="scan-waiting">Enter a target and press "Initiate Scan" to begin...</div>';
    
    // Reset network map
    this.initializeMap();
  },
  
  /**
   * Start network scan
   */
  startScan() {
    if (this.scanning) {
      ui.showAlert('A scan is already in progress');
      return;
    }
    
    const target = document.getElementById('scanTarget').value;
    
    if (!target) {
      ui.showAlert('Please enter a target IP or domain');
      return;
    }
    
    // Get selected scan options
    const scanPorts = document.getElementById('scanPorts').checked;
    const scanVulnerabilities = document.getElementById('scanVulnerabilities').checked;
    const scanServices = document.getElementById('scanServices').checked;
    
    // Update UI
    this.scanning = true;
    this.progress = 0;
    document.getElementById('scanStatus').textContent = 'Initializing scan...';
    document.getElementById('scanOutput').innerHTML = '';
    document.getElementById('stopScanBtn').disabled = false;
    document.getElementById('scanProgressBar').style.width = '0%';
    
    // Generate random scan data
    this.generateScanData(target, scanPorts, scanVulnerabilities, scanServices);
    
    // Start progress simulation
    this.updateScanProgress();
  },
  
  /**
   * Stop ongoing scan
   */
  stopScan() {
    if (!this.scanning) return;
    
    // Clear timeout if active
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
      this.scanTimeout = null;
    }
    
    // Update UI
    this.scanning = false;
    document.getElementById('scanStatus').textContent = 'Scan aborted';
    document.getElementById('stopScanBtn').disabled = true;
    
    // Add abort message to output
    const abortMsg = document.createElement('div');
    abortMsg.className = 'scan-item cmd-error';
    abortMsg.textContent = 'SCAN ABORTED BY USER';
    document.getElementById('scanOutput').appendChild(abortMsg);
  },
  
  /**
   * Update scan progress
   */
  updateScanProgress() {
    if (!this.scanning) return;
    
    // Increase progress
    this.progress += 1 + Math.random() * 2;
    
    if (this.progress >= 100) {
      this.progress = 100;
      this.scanning = false;
      document.getElementById('scanStatus').textContent = 'Scan complete';
      document.getElementById('stopScanBtn').disabled = true;
    } else {
      // Update status message based on progress
      if (this.progress < 20) {
        document.getElementById('scanStatus').textContent = 'Resolving host...';
      } else if (this.progress < 40) {
        document.getElementById('scanStatus').textContent = 'Scanning ports...';
      } else if (this.progress < 60) {
        document.getElementById('scanStatus').textContent = 'Identifying services...';
      } else if (this.progress < 80) {
        document.getElementById('scanStatus').textContent = 'Checking vulnerabilities...';
      } else {
        document.getElementById('scanStatus').textContent = 'Finalizing results...';
      }
      
      // Schedule next update
      this.scanTimeout = setTimeout(() => this.updateScanProgress(), 100 + Math.random() * 200);
    }
    
    // Update progress bar
    document.getElementById('scanProgressBar').style.width = `${this.progress}%`;
    
    // Display scan data as it's "discovered"
    this.displayScanData();
  },
  
  /**
   * Generate random scan data
   */
  generateScanData(target, includePorts, includeVulnerabilities, includeServices) {
    this.scanData = [];
    
    // Split target into segments for subnet simulation
    const ipSegments = target.split('.');
    const baseIP = ipSegments.slice(0, 3).join('.');
    
    // Generate random number of hosts
    const hostCount = 5 + Math.floor(Math.random() * 10);
    
    // Generate host data
    for (let i = 0; i < hostCount; i++) {
      const hostIP = i === 0 ? target : `${baseIP}.${1 + Math.floor(Math.random() * 254)}`;
      
      // Skip some hosts randomly to make it more realistic
      if (i !== 0 && Math.random() < 0.3) continue;
      
      const host = {
        ip: hostIP,
        type: i === 0 ? 'target' : this.getRandomHostType(),
        status: Math.random() < 0.8 ? 'up' : 'down',
        ports: [],
        vulnerabilities: []
      };
      
      // Only add data for hosts that are up
      if (host.status === 'up') {
        // Add ports if included
        if (includePorts) {
          const portCount = 2 + Math.floor(Math.random() * 8);
          const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 3389, 8080];
          
          for (let j = 0; j < portCount; j++) {
            // Either pick a common port or generate a random one
            const portNumber = Math.random() < 0.7 
              ? commonPorts[Math.floor(Math.random() * commonPorts.length)]
              : 1024 + Math.floor(Math.random() * 64511);
            
            const port = {
              number: portNumber,
              status: Math.random() < 0.9 ? 'open' : 'filtered',
              service: ''
            };
            
            // Add service if included
            if (includeServices && port.status === 'open') {
              port.service = this.getServiceForPort(portNumber);
            }
            
            host.ports.push(port);
          }
          
          // Sort ports by number
          host.ports.sort((a, b) => a.number - b.number);
        }
        
        // Add vulnerabilities if included
        if (includeVulnerabilities && Math.random() < 0.4) {
          const vulnCount = 1 + Math.floor(Math.random() * 3);
          
          for (let j = 0; j < vulnCount; j++) {
            host.vulnerabilities.push(this.getRandomVulnerability());
          }
        }
      }
      
      this.scanData.push(host);
    }
  },
  
  /**
   * Display scan data progressively
   */
  displayScanData() {
    const outputContainer = document.getElementById('scanOutput');
    const progressPercent = this.progress;
    
    // Clear the waiting message if present
    const waitingMsg = outputContainer.querySelector('.scan-waiting');
    if (waitingMsg) {
      outputContainer.removeChild(waitingMsg);
    }
    
    // Determine which data to show based on progress
    const dataToShow = Math.floor(this.scanData.length * (progressPercent / 100));
    
    // Update network map
    this.updateNetworkMap(dataToShow);
    
    // Display data for each host
    for (let i = 0; i < dataToShow; i++) {
      const host = this.scanData[i];
      
      // Skip if already displayed
      if (outputContainer.querySelector(`[data-ip="${host.ip}"]`)) {
        continue;
      }
      
      // Create host entry
      const hostEntry = document.createElement('div');
      hostEntry.className = 'scan-item';
      hostEntry.setAttribute('data-ip', host.ip);
      
      // Host header
      const hostHeader = document.createElement('div');
      hostHeader.className = 'scan-item-ip';
      hostHeader.textContent = `Host: ${host.ip} (${host.status === 'up' ? 'UP' : 'DOWN'})`;
      hostEntry.appendChild(hostHeader);
      
      // Skip rest if host is down
      if (host.status === 'down') {
        outputContainer.appendChild(hostEntry);
        continue;
      }
      
      // Port information
      if (host.ports && host.ports.length > 0) {
        const portInfo = document.createElement('div');
        portInfo.className = 'scan-item-ports';
        
        // Create port list
        const portList = document.createElement('ul');
        
        host.ports.forEach(port => {
          const portItem = document.createElement('li');
          portItem.innerHTML = `<span class="scan-item-port">${port.number}/tcp</span> ${port.status}`;
          
          if (port.service) {
            portItem.innerHTML += ` <span class="scan-item-service">${port.service}</span>`;
          }
          
          portList.appendChild(portItem);
        });
        
        portInfo.appendChild(portList);
        hostEntry.appendChild(portInfo);
      }
      
      // Vulnerability information
      if (host.vulnerabilities && host.vulnerabilities.length > 0) {
        const vulnInfo = document.createElement('div');
        vulnInfo.className = 'scan-item-vulns';
        vulnInfo.innerHTML = '<strong>Vulnerabilities:</strong>';
        
        // Create vulnerability list
        const vulnList = document.createElement('ul');
        
        host.vulnerabilities.forEach(vuln => {
          const vulnItem = document.createElement('li');
          vulnItem.className = 'scan-item-vuln';
          vulnItem.textContent = vuln;
          vulnList.appendChild(vulnItem);
        });
        
        vulnInfo.appendChild(vulnList);
        hostEntry.appendChild(vulnInfo);
      }
      
      outputContainer.appendChild(hostEntry);
    }
    
    // Scroll to bottom
    outputContainer.scrollTop = outputContainer.scrollHeight;
  },
  
  /**
   * Update network map with scan data
   */
  updateNetworkMap(dataCount) {
    if (!this.networkContext || !this.networkMap) return;
    
    // Reset map
    this.initializeMap();
    
    // Calculate center point
    const centerX = this.networkMap.width / 2;
    const centerY = this.networkMap.height / 2;
    
    // Draw hosts in a circle around the center
    const radius = Math.min(this.networkMap.width, this.networkMap.height) * 0.4;
    
    for (let i = 0; i < dataCount; i++) {
      const host = this.scanData[i];
      
      // Skip hosts that are down
      if (host.status === 'down') continue;
      
      // Calculate position
      const angle = (i / this.scanData.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Determine node type
      let nodeType = 'device';
      if (host.type === 'server') nodeType = 'server';
      if (host.type === 'router') nodeType = 'router';
      if (host.vulnerabilities && host.vulnerabilities.length > 0) nodeType = 'vulnerable';
      
      // Determine connection type
      let connectionType = 'normal';
      if (host.ports && host.ports.some(p => p.number === 443)) connectionType = 'secure';
      if (host.vulnerabilities && host.vulnerabilities.length > 0) connectionType = 'vulnerable';
      
      // Draw connection to center
      this.drawConnection(centerX, centerY, x, y, connectionType);
      
      // Draw node
      this.drawNode(x, y, nodeType, i === 0); // Highlight first node (target)
    }
  },
  
  /**
   * Get random host type
   */
  getRandomHostType() {
    const types = ['device', 'device', 'device', 'server', 'router'];
    return types[Math.floor(Math.random() * types.length)];
  },
  
  /**
   * Get service name for port
   */
  getServiceForPort(port) {
    const services = {
      21: 'ftp',
      22: 'ssh',
      23: 'telnet',
      25: 'smtp',
      53: 'domain',
      80: 'http',
      110: 'pop3',
      143: 'imap',
      443: 'https',
      3306: 'mysql',
      3389: 'ms-wbt-server',
      8080: 'http-proxy'
    };
    
    return services[port] || '?';
  },
  
  /**
   * Get random vulnerability
   */
  getRandomVulnerability() {
    const vulnerabilities = [
      'CVE-2021-44228 (Log4Shell)',
      'CVE-2014-0160 (Heartbleed)',
      'CVE-2017-7494 (SambaCry)',
      'CVE-2023-20593 (Zenbleed)',
      'CVE-2017-0144 (EternalBlue)',
      'CVE-2019-19781 (Citrix)',
      'CVE-2019-0708 (BlueKeep)',
      'Default credentials (admin/admin)',
      'Open SMTP relay',
      'SQL Injection vulnerability',
      'Outdated OpenSSL version',
      'Unpatched remote code execution'
    ];
    
    return vulnerabilities[Math.floor(Math.random() * vulnerabilities.length)];
  }
};

// Initialize network scanner when tab is shown
document.addEventListener('DOMContentLoaded', () => {
  // Setup observer for when scanner becomes visible
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.style.display === 'block' && mutation.target.id === 'netscan') {
        netscanner.init();
        observer.disconnect();
      }
    });
  });
  
  const scannerTab = document.getElementById('netscan');
  if (scannerTab) {
    observer.observe(scannerTab, { attributes: true, attributeFilter: ['style'] });
  }
});