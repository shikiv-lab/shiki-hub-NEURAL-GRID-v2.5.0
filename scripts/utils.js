/**
 * Utility Module for ShikiHub Pro
 * Contains helper functions used across the application
 */
const utils = {
  // Configuration
  AUDIO_ENABLED: false, // Set to true to enable sound effects
  
  // Audio elements
  clickSound: null,
  keySound: null,
  alertSound: null,
  
  /**
   * Initialize utilities
   */
  init() {
    // Create audio elements if enabled
    if (this.AUDIO_ENABLED) {
      this.createAudioElements();
    }
  },
  
  /**
   * Create audio elements for sound effects
   */
  createAudioElements() {
    this.clickSound = new Audio();
    this.clickSound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADkwC1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA5OouQCsAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    
    this.keySound = new Audio();
    this.keySound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADkwC1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA5MA5SwAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    
    this.alertSound = new Audio();
    this.alertSound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADkwC1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA5OA5i4AAAAAAAAAAAAAAAAAAAAT//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
  },
  
  /**
   * Play click sound effect
   */
  playClickSound() {
    if (this.AUDIO_ENABLED && this.clickSound) {
      this.clickSound.currentTime = 0;
      this.clickSound.play().catch(e => {
        // Suppress autoplay errors
        console.debug('Audio playback prevented:', e);
      });
    }
  },
  
  /**
   * Play key press sound
   */
  playKeySound() {
    if (this.AUDIO_ENABLED && this.keySound) {
      this.keySound.currentTime = 0;
      this.keySound.play().catch(e => {
        // Suppress autoplay errors
        console.debug('Audio playback prevented:', e);
      });
    }
  },
  
  /**
   * Play alert sound
   */
  playAlertSound() {
    if (this.AUDIO_ENABLED && this.alertSound) {
      this.alertSound.currentTime = 0;
      this.alertSound.play().catch(e => {
        // Suppress autoplay errors
        console.debug('Audio playback prevented:', e);
      });
    }
  },
  
  /**
   * Copy output text to clipboard
   */
  copyOutput(cipherType) {
    const output = document.getElementById(`output${cipherType}`);
    if (output && output.value) {
      navigator.clipboard.writeText(output.value)
        .then(() => {
          ui.showAlert(`${cipherType} output copied to clipboard!`);
          this.playAlertSound();
        })
        .catch(err => {
          console.error(`Failed to copy ${cipherType} output:`, err);
          ui.showAlert('Failed to copy. Please try manually.');
        });
    } else {
      ui.showAlert('Nothing to copy!');
    }
  },
  
  /**
   * Generate QR Code from text
   */
  generateQR(outputElementId, qrContainerId) {
    const text = document.getElementById(outputElementId).value;
    const container = document.getElementById(qrContainerId);
    
    if (!container) return;
    
    // Clear previous QR code
    container.innerHTML = '';
    
    if (text) {
      try {
        // Create QR code with improved styling
        new QRCode(container, {
          text: text,
          width: 150,
          height: 150,
          colorDark: getComputedStyle(document.documentElement).getPropertyValue('--neon-blue').trim() || "#0ff",
          colorLight: "rgba(0,0,0,0.8)",
          correctLevel: QRCode.CorrectLevel.H, // Higher error correction
          quietZone: 15, // Add some margin
          quietZoneColor: "rgba(0,0,0,0)"
        });
        
        // Add a glitch effect to the QR code
        setTimeout(() => {
          const qrImg = container.querySelector('img');
          if (qrImg) {
            qrImg.classList.add('qr-glitch');
          }
        }, 100);
      } catch (e) {
        console.error("QR Code generation error:", e);
        container.innerHTML = '<div class="qr-error">Error generating QR</div>';
      }
    }
  },
  
  /**
   * Clear QR Code container
   */
  clearQR(qrContainerId) {
    const container = document.getElementById(qrContainerId);
    if (container) container.innerHTML = '';
  },
  
  /**
   * Generate random string of specified length
   */
  generateRandomString(length, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?') {
    let result = '';
    const charactersLength = charset.length;
    
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
  },
  
  /**
   * Get random character from string
   */
  getRandomChar(charset) {
    return charset[Math.floor(Math.random() * charset.length)];
  }
};

// Initialize utilities
document.addEventListener('DOMContentLoaded', () => {
  utils.init();
});