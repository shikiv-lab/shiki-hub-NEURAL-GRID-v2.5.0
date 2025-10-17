/**
 * Steganography Module for ShikiHub Pro
 * Handles text-based steganography techniques
 */
const steganography = {
  // Current active tab
  activeStegTab: 'text',
  
  /**
   * Show steganography tab
   */
  showStegTab(tabName) {
    // Hide all content
    document.querySelectorAll('.steg-content').forEach(tab => {
      tab.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.steg-tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show selected content
    const tabContent = document.getElementById(`steg-${tabName}`);
    if (tabContent) {
      tabContent.style.display = 'block';
    }
    
    // Set active class on selected button
    const buttons = document.querySelectorAll('.steg-tab-btn');
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].textContent.toLowerCase().includes(tabName)) {
        buttons[i].classList.add('active');
        break;
      }
    }
    
    this.activeStegTab = tabName;
  },
  
  /**
   * Clear steganography fields
   */
  clearSteg() {
    document.getElementById('stegCarrierText').value = '';
    document.getElementById('stegSecretMessage').value = '';
    document.getElementById('stegKey').value = '';
    document.getElementById('stegOutput').value = '';
  },
  
  /**
   * Clear zero-width steganography fields
   */
  clearZWS() {
    document.getElementById('zwsInput').value = '';
    document.getElementById('zwsCarrier').value = '';
    document.getElementById('zwsOutput').value = '';
  },
  
  /**
   * Hide message in carrier text
   */
  hideMessage() {
    const carrierText = document.getElementById('stegCarrierText').value;
    const secretMessage = document.getElementById('stegSecretMessage').value;
    const encryptionKey = document.getElementById('stegKey').value;
    
    if (!carrierText) {
      ui.showAlert('Please enter carrier text');
      return;
    }
    
    if (!secretMessage) {
      ui.showAlert('Please enter a secret message to hide');
      return;
    }
    
    let processedSecret = secretMessage;
    
    // Encrypt message if key provided
    if (encryptionKey) {
      try {
        processedSecret = CryptoJS.AES.encrypt(secretMessage, encryptionKey).toString();
      } catch (error) {
        console.error("Message encryption error:", error);
        ui.showAlert('Error encrypting message');
        return;
      }
    }
    
    // Convert secret message to binary
    const binaryMessage = this.textToBinary(processedSecret);
    
    // Hide binary message in carrier text
    const stegResult = this.hideDataInText(carrierText, binaryMessage);
    
    document.getElementById('stegOutput').value = stegResult;
  },
  
  /**
   * Extract hidden message from steganographic text
   */
  extractMessage() {
    const stegText = document.getElementById('stegCarrierText').value;
    const encryptionKey = document.getElementById('stegKey').value;
    
    if (!stegText) {
      ui.showAlert('Please enter steganographic text to extract message from');
      return;
    }
    
    try {
      // Extract binary message
      const binaryMessage = this.extractDataFromText(stegText);
      
      // Convert binary to text
      let extractedMessage = this.binaryToText(binaryMessage);
      
      // Try to decrypt if key provided
      if (encryptionKey && extractedMessage) {
        try {
          const decryptedBytes = CryptoJS.AES.decrypt(extractedMessage, encryptionKey);
          const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
          
          if (decryptedText) {
            extractedMessage = decryptedText;
          } else {
            ui.showAlert('Incorrect decryption key or not an encrypted message');
          }
        } catch (error) {
          console.error("Message decryption error:", error);
          ui.showAlert('Error decrypting message. Check the key or if message is encrypted.');
        }
      }
      
      document.getElementById('stegOutput').value = extractedMessage || 'No hidden message found';
      
    } catch (error) {
      console.error("Message extraction error:", error);
      ui.showAlert('Error extracting message');
    }
  },
  
  /**
   * Convert text to binary string
   */
  textToBinary(text) {
    return text.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
  },
  
  /**
   * Convert binary string to text
   */
  binaryToText(binary) {
    // Validate binary string
    if (!/^[01]+$/.test(binary)) {
      return '';
    }
    
    // Process 8 bits at a time
    let result = '';
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.substr(i, 8);
      if (byte.length === 8) {
        result += String.fromCharCode(parseInt(byte, 2));
      }
    }
    return result;
  },
  
  /**
   * Hide binary data in text by adding extra spaces
   */
  hideDataInText(text, binaryData) {
    // Add header to binary data
    const dataWithHeader = '1010101010' + binaryData + '0101010101';
    
    // Split text into lines, sentences, or words to inject data
    const textParts = text.split('. ').filter(part => part.trim().length > 0);
    
    if (textParts.length < dataWithHeader.length) {
      ui.showAlert('Carrier text too short for the message. Add more text or shorten your message.');
      return text;
    }
    
    let result = '';
    let dataIndex = 0;
    
    for (let i = 0; i < textParts.length; i++) {
      // If we have more data to hide
      if (dataIndex < dataWithHeader.length) {
        // Add variable spacing based on bit (1 = two spaces, 0 = one space)
        const bit = dataWithHeader[dataIndex];
        result += textParts[i] + (bit === '1' ? '.  ' : '. ');
        dataIndex++;
      } else {
        // No more data to hide, add normal spacing
        result += textParts[i] + '. ';
      }
    }
    
    return result.trim();
  },
  
  /**
   * Extract binary data from text with extra spaces
   */
  extractDataFromText(text) {
    // Split text by period and space
    const parts = text.split('.');
    
    // Analyze spaces after periods to extract bits
    let binaryData = '';
    
    for (let i = 0; i < parts.length - 1; i++) {
      // Count spaces after period
      const nextPart = parts[i + 1];
      const spacesCount = nextPart.length - nextPart.trimStart().length;
      
      // If there are two spaces, it's a 1, otherwise it's a 0
      binaryData += (spacesCount >= 2) ? '1' : '0';
    }
    
    // Find header and footer in binary data
    const headerPattern = '1010101010';
    const footerPattern = '0101010101';
    
    const headerIndex = binaryData.indexOf(headerPattern);
    const footerIndex = binaryData.indexOf(footerPattern, headerIndex + headerPattern.length);
    
    if (headerIndex !== -1 && footerIndex !== -1) {
      return binaryData.substring(headerIndex + headerPattern.length, footerIndex);
    }
    
    return '';
  },
  
  /**
   * Hide text using zero-width characters
   */
  hideZWS() {
    const input = document.getElementById('zwsInput').value;
    const carrier = document.getElementById('zwsCarrier').value;
    
    if (!input) {
      ui.showAlert('Please enter text to hide');
      return;
    }
    
    if (!carrier) {
      ui.showAlert('Please enter carrier text');
      return;
    }
    
    // Convert input to binary
    const binary = this.textToBinary(input);
    
    // Map binary to zero-width characters
    // Using zero-width space, zero-width non-joiner, and zero-width joiner
    const zws = {
      '0': '\u200B', // zero-width space
      '1': '\u200C', // zero-width non-joiner
      'S': '\u200D'  // zero-width joiner (Start/End marker)
    };
    
    // Create hidden message with start/end markers
    let hiddenBits = zws['S'];
    
    for (let i = 0; i < binary.length; i++) {
      hiddenBits += zws[binary[i]];
    }
    
    hiddenBits += zws['S'];
    
    // Insert hidden message at random position in carrier
    const position = Math.floor(Math.random() * carrier.length);
    const result = carrier.slice(0, position) + hiddenBits + carrier.slice(position);
    
    document.getElementById('zwsOutput').value = result;
  },
  
  /**
   * Extract text hidden with zero-width characters
   */
  extractZWS() {
    const text = document.getElementById('zwsInput').value;
    
    if (!text) {
      ui.showAlert('Please enter text to extract from');
      return;
    }
    
    // Map zero-width characters to binary
    const zws = {
      '\u200B': '0', // zero-width space
      '\u200C': '1', // zero-width non-joiner
      '\u200D': 'S'  // zero-width joiner (Start/End marker)
    };
    
    // Extract binary from zero-width characters
    let binary = '';
    let recording = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (char in zws) {
        if (zws[char] === 'S') {
          // Toggle recording when we hit a marker
          recording = !recording;
          continue;
        }
        
        if (recording) {
          binary += zws[char];
        }
      }
    }
    
    // Convert binary to text
    const result = this.binaryToText(binary) || 'No hidden message found';
    
    document.getElementById('zwsOutput').value = result;
  },
  
  /**
   * Copy steganography output to clipboard
   */
  copyStegOutput() {
    const output = document.getElementById('stegOutput');
    if (output && output.value) {
      navigator.clipboard.writeText(output.value)
        .then(() => {
          ui.showAlert('Steganography output copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy steganography output:', err);
          ui.showAlert('Failed to copy. Please try manually.');
        });
    } else {
      ui.showAlert('Nothing to copy!');
    }
  },
  
  /**
   * Copy zero-width steganography output
   */
  copyZWSOutput() {
    const output = document.getElementById('zwsOutput');
    if (output && output.value) {
      navigator.clipboard.writeText(output.value)
        .then(() => {
          ui.showAlert('ZWS output copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy ZWS output:', err);
          ui.showAlert('Failed to copy. Please try manually.');
        });
    } else {
      ui.showAlert('Nothing to copy!');
    }
  }
};