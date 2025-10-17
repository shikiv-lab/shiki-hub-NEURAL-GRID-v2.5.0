/**
 * UI Module for ShikiHub Pro
 * Handles general user interface interactions and effects
 */
const ui = {
  // DOM Elements
  cyberClock: null,
  customAlertBox: null,
  activeTab: null,
  
  /**
   * Initialize page UI after successful authentication
   */
  initPage() {
    this.cyberClock = document.getElementById('cyber-clock');
    this.customAlertBox = document.getElementById('custom-alert');
    
    // Initialize Particles.js
    this.initParticles();
    
    // Initialize Clock
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    
    // Set default tab (Caesar)
    const firstTabButton = document.querySelector('.cipher-tabs .tab-btn');
    if (firstTabButton) {
      const tabName = firstTabButton.getAttribute('onclick').match(/'([^']+)'/)[1];
      this.showTab(tabName, firstTabButton);
    }
    
    // Initialize Random Status Updates
    this.initRandomStatuses();
    
    // Setup Caesar Cipher Shift Value Display
    const shiftSlider = document.getElementById('caesarShift');
    const shiftValue = document.getElementById('caesarShiftValue');
    if (shiftSlider && shiftValue) {
      shiftSlider.addEventListener('input', () => {
        shiftValue.textContent = shiftSlider.value;
      });
    }
  },
  
  /**
   * Initialize particle.js background
   */
  initParticles() {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        particles: {
          number: { value: 100, density: { enable: true, value_area: 800 } },
          color: { value: ['#0ff', '#f0f', '#0f0'] },
          shape: { 
            type: ['circle', 'triangle', 'edge'], 
            stroke: {width: 0, color: '#000'}
          },
          opacity: { 
            value: 0.6, 
            random: true, 
            anim: {enable: true, speed: 0.5, opacity_min: 0.1, sync: false} 
          },
          size: { 
            value: 3, 
            random: true, 
            anim: {enable: true, speed: 2, size_min: 0.5, sync: false} 
          },
          line_linked: { 
            enable: true, 
            distance: 150, 
            color: "#0ff", 
            opacity: 0.2, 
            width: 1
          },
          move: { 
            enable: true, 
            speed: 1.5, 
            direction: "none", 
            random: true, 
            straight: false, 
            out_mode: "out", 
            bounce: false
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: "push"}
          },
          modes: {
            grab: {distance: 140, line_opacity: 0.5},
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 }
          }
        },
        retina_detect: true
      });
    }
  },
  
  /**
   * Update digital clock display
   */
  updateClock() {
    if (!this.cyberClock) return;
    
    const now = new Date();
    this.cyberClock.textContent =
      `${now.getHours().toString().padStart(2, '0')}:` +
      `${now.getMinutes().toString().padStart(2, '0')}:` +
      `${now.getSeconds().toString().padStart(2, '0')}`;
  },
  
  /**
   * Initialize random status updates
   */
  initRandomStatuses() {
    const statusElements = {
      'sys-status': ['ONLINE', 'OPTIMAL', 'SECURE'],
      'sec-level': ['ALPHA', 'BETA', 'GAMMA', 'DELTA'],
      'net-status': ['SECURE', 'ENCRYPTED', 'PROTECTED'],
    };
    
    // Update status randomly
    const updateStatus = () => {
      for (const [id, options] of Object.entries(statusElements)) {
        const element = document.getElementById(id);
        if (element && Math.random() < 0.2) { // 20% chance to update each status
          const newStatus = options[Math.floor(Math.random() * options.length)];
          
          // Add glitch effect during change
          element.classList.add('status-change');
          setTimeout(() => {
            element.textContent = newStatus;
            element.classList.remove('status-change');
          }, 300);
        }
      }
    };
    
    // Update every 5-15 seconds
    setInterval(updateStatus, 5000 + Math.random() * 10000);
  },
  
  /**
   * Display tabs and set active state
   */
  showTab(tabName, clickedButton) {
    // Hide all tabs
    document.querySelectorAll('.cyber-box').forEach(tab => {
      tab.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active', 'glitch-active');
    });
    
    // Show the selected tab
    const activeTab = document.getElementById(tabName);
    if (activeTab) {
      activeTab.style.display = 'block';
      
      // Smooth entrance animation
      activeTab.style.animation = 'none';
      activeTab.offsetHeight; // Trigger reflow
      activeTab.style.animation = 'fadeInBox 0.7s ease-out forwards';
    }
    
    // Set active state on button
    if (clickedButton) {
      clickedButton.classList.add('active', 'glitch-active');
      
      // Play audio feedback if enabled
      utils.playClickSound();
    }
    
    this.activeTab = tabName;
  },
  
  /**
   * Show custom alert notification
   */
  showAlert(message, duration = 3000) {
    if (!this.customAlertBox) return;
    
    this.customAlertBox.textContent = message;
    this.customAlertBox.style.display = 'block';
    
    // Reset any existing animation
    this.customAlertBox.style.animation = 'none';
    this.customAlertBox.offsetHeight; // Trigger reflow
    this.customAlertBox.style.animation = 'alertSlideIn 0.3s forwards';
    
    // Hide after duration
    setTimeout(() => {
      this.customAlertBox.style.animation = 'alertSlideIn 0.3s reverse forwards';
      setTimeout(() => {
        this.customAlertBox.style.display = 'none';
      }, 300);
    }, duration);
  }
};