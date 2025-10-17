/**
 * Main Entry Point for ShikiHub Pro
 * Initializes all components and modules
 */
document.addEventListener('DOMContentLoaded', () => {
  // Import required library for QR code generation
  const importQRCode = () => {
    if (typeof QRCode === 'undefined') {
      const script = document.createElement('script');
      script.src = './scripts/qrcode.min.js';
      document.head.appendChild(script);
      
      return new Promise((resolve) => {
        script.onload = resolve;
      });
    } else {
      return Promise.resolve();
    }
  };
  
  // Import CryptoJS if needed
  const importCryptoJS = () => {
    if (typeof CryptoJS === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
      document.head.appendChild(script);
      
      return new Promise((resolve) => {
        script.onload = resolve;
      });
    } else {
      return Promise.resolve();
    }
  };
  
  // Import Particles.js if needed
  const importParticlesJS = () => {
    if (typeof particlesJS === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
      document.head.appendChild(script);
      
      return new Promise((resolve) => {
        script.onload = resolve;
      });
    } else {
      return Promise.resolve();
    }
  };
  
  // Ensure all libraries are loaded before initializing
  Promise.all([
    importQRCode(),
    importCryptoJS(),
    importParticlesJS()
  ]).then(() => {
    console.log('ShikiHub Pro - All dependencies loaded');
    
    // Initialize modules (auth is self-initializing)
    
    // Setup Caesar shift slider interaction
    const caesarShift = document.getElementById('caesarShift');
    const caesarShiftValue = document.getElementById('caesarShiftValue');
    
    if (caesarShift && caesarShiftValue) {
      caesarShift.addEventListener('input', () => {
        caesarShiftValue.textContent = caesarShift.value;
      });
    }
    
    // Add animation when clicking buttons
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('mousedown', () => {
        button.classList.add('button-active');
      });
      
      button.addEventListener('mouseup', () => {
        setTimeout(() => {
          button.classList.remove('button-active');
        }, 200);
      });
      
      button.addEventListener('mouseleave', () => {
        button.classList.remove('button-active');
      });
    });
    
    // Setup custom event listeners for input fields
    const inputFields = document.querySelectorAll('input, textarea');
    
    inputFields.forEach(field => {
      // Add glow effect on focus
      field.addEventListener('focus', () => {
        field.classList.add('input-active');
      });
      
      field.addEventListener('blur', () => {
        field.classList.remove('input-active');
      });
      
      // Play key sound on typing
      field.addEventListener('input', () => {
        utils.playKeySound();
      });
    });
    
    // Add title update effect
    const mainTitle = document.querySelector('.main-title-glitch');
    if (mainTitle) {
      const titles = [
        'ShikiHub Pro',
        'Neural Grid',
        'CipherMatrix',
        'Quantum Access'
      ];
      
      let titleIndex = 0;
      
      setInterval(() => {
        if (Math.random() < 0.3) { // Only change occasionally
          titleIndex = (titleIndex + 1) % titles.length;
          
          // Add glitch animation during change
          mainTitle.classList.add('title-change');
          mainTitle.setAttribute('data-text', titles[titleIndex]);
          
          setTimeout(() => {
            mainTitle.textContent = titles[titleIndex];
            mainTitle.classList.remove('title-change');
          }, 500);
        }
      }, 10000); // Check every 10 seconds
    }
  });
});