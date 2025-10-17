/**
 * Cipher Module for ShikiHub Pro
 * Contains encryption/decryption algorithms and functions
 */
const ciphers = {
  /**
   * Clear fields for a cipher type
   */
  clearFields(cipherType, additionalFieldIds = []) {
    const inputField = document.getElementById(`input${cipherType}`);
    const outputField = document.getElementById(`output${cipherType}`);
    
    if (inputField) inputField.value = '';
    if (outputField) outputField.value = '';
    
    // Clear additional fields if provided
    additionalFieldIds.forEach(id => {
      const field = document.getElementById(id);
      if (field) field.value = '';
    });
    
    // Reset strength meter for AES
    if (cipherType === 'AES') security.updateStrength();
    
    // Clear QR code
    utils.clearQR(`qrcode${cipherType}`);
  },

  // ============ Caesar Cipher ============
  /**
   * Caesar cipher implementation
   */
  caesarCipher(text, shift = 3, encrypt = true) {
    // Only processes A-Z, a-z. Other characters are passed through
    if (!text) return '';
    
    if (!encrypt) {
      // For decryption, reverse the shift
      shift = (26 - shift) % 26;
    }
    
    return text.replace(/[a-zA-Z]/g, char => {
      const base = char.charCodeAt(0) < 97 ? 65 : 97; // 65 for A, 97 for a
      const offset = (char.charCodeAt(0) - base + shift) % 26;
      return String.fromCharCode(base + offset);
    });
  },
  
  /**
   * Encrypt using Caesar cipher
   */
  encryptCaesar() {
    const text = document.getElementById('inputCaesar').value;
    const shift = parseInt(document.getElementById('caesarShift').value, 10);
    
    if (!text) {
      ui.showAlert('Please enter text to encrypt');
      return;
    }
    
    const result = this.caesarCipher(text, shift, true);
    document.getElementById('outputCaesar').value = result;
    utils.generateQR('outputCaesar', 'qrcodeCaesar');
  },
  
  /**
   * Decrypt using Caesar cipher
   */
  decryptCaesar() {
    const text = document.getElementById('inputCaesar').value;
    const shift = parseInt(document.getElementById('caesarShift').value, 10);
    
    if (!text) {
      ui.showAlert('Please enter text to decrypt');
      return;
    }
    
    const result = this.caesarCipher(text, shift, false);
    document.getElementById('outputCaesar').value = result;
    utils.generateQR('outputCaesar', 'qrcodeCaesar');
  },

  // ============ AES Encryption ============
  /**
   * Encrypt using AES algorithm
   */
  encryptAES() {
    const text = document.getElementById('inputAES').value;
    const key = document.getElementById('aesKey').value;
    
    if (!text) {
      ui.showAlert('Please enter text to encrypt');
      return;
    }
    
    if (![16, 24, 32].includes(key.length)) {
      ui.showAlert('AES Key must be 16, 24, or 32 characters long!');
      return;
    }
    
    try {
      const encrypted = CryptoJS.AES.encrypt(text, key).toString();
      document.getElementById('outputAES').value = encrypted;
      utils.generateQR('outputAES', 'qrcodeAES');
    } catch (error) {
      console.error("AES Encryption Error:", error);
      ui.showAlert('AES Encryption Failed. Check console for details.');
    }
  },
  
  /**
   * Decrypt using AES algorithm
   */
  decryptAES() {
    const text = document.getElementById('inputAES').value;
    const key = document.getElementById('aesKey').value;
    
    if (!text) {
      ui.showAlert('Please enter text to decrypt');
      return;
    }
    
    if (![16, 24, 32].includes(key.length)) {
      ui.showAlert('AES Key must be 16, 24, or 32 characters long!');
      return;
    }
    
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(text, key);
      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedText && text) {
        ui.showAlert('AES Decryption Failed: Result is empty. Check key or ciphertext.');
        return;
      }
      
      document.getElementById('outputAES').value = decryptedText;
      utils.generateQR('outputAES', 'qrcodeAES');
    } catch (error) {
      console.error("AES Decryption Error:", error);
      ui.showAlert('AES Decryption Failed. Check key or ciphertext.');
    }
  },

  // ============ Vigenère Cipher ============
  /**
   * Vigenère cipher implementation
   */
  vigenereCipher(text, key, encrypt = true) {
    if (!text || !key) return '';
    
    // Sanitize key to only include alphabetic characters
    const sanitizedKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (!sanitizedKey.length) {
      ui.showAlert("Vigenère key must contain alphabetic characters!");
      return text;
    }
    
    let keyIndex = 0;
    
    return text.replace(/[a-zA-Z]/g, char => {
      const base = char.charCodeAt(0) < 97 ? 65 : 97; // 65 for A, 97 for a
      const keyShift = sanitizedKey.charCodeAt(keyIndex % sanitizedKey.length) - 65;
      
      let charCode = char.charCodeAt(0) - base;
      
      if (encrypt) {
        charCode = (charCode + keyShift) % 26;
      } else {
        charCode = (charCode - keyShift + 26) % 26;
      }
      
      keyIndex++;
      return String.fromCharCode(base + charCode);
    });
  },
  
  /**
   * Encrypt using Vigenère cipher
   */
  encryptVigenere() {
    const text = document.getElementById('inputVigenere').value;
    const key = document.getElementById('vigenereKey').value;
    
    if (!text) {
      ui.showAlert('Please enter text to encrypt');
      return;
    }
    
    if (!key) {
      ui.showAlert('Please enter a key for Vigenère cipher');
      return;
    }
    
    const result = this.vigenereCipher(text, key, true);
    document.getElementById('outputVigenere').value = result;
    utils.generateQR('outputVigenere', 'qrcodeVigenere');
  },
  
  /**
   * Decrypt using Vigenère cipher
   */
  decryptVigenere() {
    const text = document.getElementById('inputVigenere').value;
    const key = document.getElementById('vigenereKey').value;
    
    if (!text) {
      ui.showAlert('Please enter text to decrypt');
      return;
    }
    
    if (!key) {
      ui.showAlert('Please enter a key for Vigenère cipher');
      return;
    }
    
    const result = this.vigenereCipher(text, key, false);
    document.getElementById('outputVigenere').value = result;
    utils.generateQR('outputVigenere', 'qrcodeVigenere');
  },

  // ============ XOR Cipher ============
  /**
   * XOR cipher implementation
   */
  xorCipher(text, key) {
    if (!text) return '';
    
    const numKey = parseInt(key);
    
    if (isNaN(numKey) || numKey < 0 || numKey > 255) {
      ui.showAlert("XOR key must be a number between 0 and 255!");
      return text;
    }
    
    return Array.from(text).map(char =>
      String.fromCharCode(char.charCodeAt(0) ^ numKey)
    ).join('');
  },
  
  /**
   * Encrypt/Decrypt using XOR (symmetric)
   */
  encryptXOR() {
    const text = document.getElementById('inputXOR').value;
    const key = document.getElementById('xorKey').value;
    
    if (!text) {
      ui.showAlert('Please enter text to process');
      return;
    }
    
    const result = this.xorCipher(text, key);
    document.getElementById('outputXOR').value = result;
    utils.generateQR('outputXOR', 'qrcodeXOR');
  },

  // ============ Atbash Cipher ============
  /**
   * Atbash cipher implementation
   */
  atbashCipher(text) {
    if (!text) return '';
    
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
      let charCode = text.charCodeAt(i);
      
      if (charCode >= 65 && charCode <= 90) { // Uppercase A-Z
        result += String.fromCharCode(90 - (charCode - 65));
      } else if (charCode >= 97 && charCode <= 122) { // Lowercase a-z
        result += String.fromCharCode(122 - (charCode - 97));
      } else {
        result += text[i]; // Non-alphabetic characters remain unchanged
      }
    }
    
    return result;
  },
  
  /**
   * Process text with Atbash cipher
   */
  processAtbash() {
    const text = document.getElementById('inputAtbash').value;
    
    if (!text) {
      ui.showAlert('Please enter text to process');
      return;
    }
    
    const result = this.atbashCipher(text);
    document.getElementById('outputAtbash').value = result;
    utils.generateQR('outputAtbash', 'qrcodeAtbash');
  },

  // ============ Hashing ============
  /**
   * Generate cryptographic hash
   */
  generateHash() {
    const text = document.getElementById('inputHashing').value;
    const algo = document.getElementById('hashAlgo').value;
    
    if (!text) {
      ui.showAlert('Please enter text to hash');
      return;
    }
    
    let hash = '';
    
    try {
      switch (algo) {
        case 'MD5':
          hash = CryptoJS.MD5(text).toString();
          break;
        case 'SHA1':
          hash = CryptoJS.SHA1(text).toString();
          break;
        case 'SHA256':
          hash = CryptoJS.SHA256(text).toString();
          break;
        case 'SHA512':
          hash = CryptoJS.SHA512(text).toString();
          break;
        case 'RIPEMD160':
          hash = CryptoJS.RIPEMD160(text).toString();
          break;
        default:
          ui.showAlert('Invalid hashing algorithm selected.');
          return;
      }
      
      document.getElementById('outputHashing').value = hash;
      
      // Update hash visualization
      this.updateHashVisualization(hash);
      
      // Generate QR code
      utils.generateQR('outputHashing', 'qrcodeHashing');
      
    } catch (error) {
      console.error("Hashing error:", error);
      ui.showAlert('Error generating hash. See console.');
    }
  },
  
  /**
   * Update hash visualization
   */
  updateHashVisualization(hash) {
    const container = document.querySelector('.hash-visualization .vis-container');
    
    if (!container || !hash) return;
    
    // Clear previous visualization
    container.innerHTML = '';
    
    // Convert hash to array of byte values (0-255)
    const byteValues = [];
    for (let i = 0; i < hash.length; i += 2) {
      const byte = parseInt(hash.substr(i, 2), 16);
      byteValues.push(byte);
    }
    
    // Create visualization bars
    byteValues.forEach((value, index) => {
      // Normalize height (0-255 -> 5-100%)
      const height = 5 + (value / 255) * 95;
      
      // Create a bar for each byte
      const bar = document.createElement('div');
      bar.className = 'vis-bar';
      bar.style.height = `${height}%`;
      
      // Add slight delay for animation effect
      setTimeout(() => {
        container.appendChild(bar);
      }, index * 20);
    });
  }
};