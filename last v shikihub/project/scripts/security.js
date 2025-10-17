/**
 * Security Module for ShikiHub Pro
 * Handles password generation and strength assessment
 */
const security = {
  /**
   * Generate secure random password
   */
  generatePassword() {
    // Valid AES key lengths (16, 24, 32 characters)
    const lengths = [16, 24, 32];
    const length = lengths[Math.floor(Math.random() * lengths.length)];
    
    // Character sets for secure password
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    
    let password = '';
    
    // Ensure at least one character from each set for stronger passwords
    password += utils.getRandomChar(charset.uppercase);
    password += utils.getRandomChar(charset.lowercase);
    password += utils.getRandomChar(charset.numbers);
    password += utils.getRandomChar(charset.symbols);
    
    // Fill the rest with random characters from all sets
    const allChars = Object.values(charset).join('');
    for (let i = password.length; i < length; i++) {
      password += utils.getRandomChar(allChars);
    }
    
    // Shuffle the password to make character positions random
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    // Update field with generated password
    const aesKeyField = document.getElementById('aesKey');
    aesKeyField.value = password;
    aesKeyField.type = "text"; // Temporarily show password
    
    // Copy to clipboard
    navigator.clipboard.writeText(password)
      .then(() => {
        ui.showAlert(`Generated ${length}-char key (Copied & shown temporarily)`, 3000);
      })
      .catch(() => {
        ui.showAlert(`Generated ${length}-char key (Manual copy needed)`, 3000);
      });
    
    // Revert to password type after a delay
    setTimeout(() => { 
      aesKeyField.type = "password";
    }, 4000);
    
    // Update strength meter
    this.updateStrength();
  },
  
  /**
   * Update password strength meter
   */
  updateStrength() {
    const key = document.getElementById('aesKey').value;
    let score = 0;
    
    // No key = no strength
    if (!key) {
      document.querySelectorAll('.strength-bar').forEach(bar => {
        bar.classList.remove('active');
      });
      return;
    }
    
    // Length based score
    if (key.length >= 8) score++;
    if (key.length >= 12) score++;
    if (key.length >= 16) score++;
    
    // Character type based score
    if (/[A-Z]/.test(key)) score++;
    if (/[a-z]/.test(key)) score++;
    if (/[0-9]/.test(key)) score++;
    if (/[\W_]/.test(key)) score++; // \W for non-alphanumeric, _ for underscore
    
    // Determine strength level (1-4)
    let strengthLevel = 0;
    if (score <= 2) strengthLevel = 1;        // Weak
    else if (score <= 4) strengthLevel = 2;   // Medium
    else if (score <= 6) strengthLevel = 3;   // Strong
    else strengthLevel = 4;                   // Very Strong
    
    // Adjust for AES specific lengths
    if (key.length === 16 && score >= 5) strengthLevel = 3;
    if ((key.length === 24 || key.length === 32) && score >= 6) strengthLevel = 4;
    
    // Update strength bar
    document.querySelectorAll('.strength-bar').forEach((bar, index) => {
      bar.classList.toggle('active', index < strengthLevel);
    });
    
    // Show strength label
    let strengthText = '';
    switch(strengthLevel) {
      case 1: strengthText = 'Weak'; break;
      case 2: strengthText = 'Medium'; break;
      case 3: strengthText = 'Strong'; break;
      case 4: strengthText = 'Very Strong'; break;
      default: strengthText = '';
    }
    
    // If we have a strength label element, update it
    const strengthLabel = document.getElementById('strengthLabel');
    if (strengthLabel) {
      strengthLabel.textContent = strengthText;
    }
  },
  
  /**
   * Analyze password for common patterns and weaknesses
   */
  analyzePassword(password) {
    if (!password) return [];
    
    const warnings = [];
    
    // Check for common patterns
    if (/^123/.test(password)) {
      warnings.push('Contains sequential numbers');
    }
    
    if (/abcd|qwerty|asdf/i.test(password)) {
      warnings.push('Contains keyboard pattern');
    }
    
    if (/password|admin|user/i.test(password)) {
      warnings.push('Contains common word');
    }
    
    // Calculate entropy
    const charset = /\d/.test(password) + /[a-z]/.test(password) + 
                   /[A-Z]/.test(password) + /\W/.test(password);
    const charsetSize = charset * 26; // Approximate charset size
    const entropy = Math.log2(Math.pow(charsetSize, password.length));
    
    if (entropy < 40) {
      warnings.push('Low entropy (easily brute-forced)');
    }
    
    return warnings;
  }
};