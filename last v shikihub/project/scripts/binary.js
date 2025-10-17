/**
 * Binary Converter Module for ShikiHub Pro
 * Handles conversions between text, binary, hex and decimal
 */
const binary = {
  // Current active tab
  activeBinaryTab: 'text-bin',
  
  /**
   * Show binary converter tab
   */
  showBinaryTab(tabName) {
    // Hide all content
    document.querySelectorAll('.binary-content').forEach(tab => {
      tab.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.binary-tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show selected content
    const tabContent = document.getElementById(tabName);
    if (tabContent) {
      tabContent.style.display = 'block';
    }
    
    // Set active class on selected button
    const buttons = document.querySelectorAll('.binary-tab-btn');
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].getAttribute('onclick').includes(tabName)) {
        buttons[i].classList.add('active');
        break;
      }
    }
    
    this.activeBinaryTab = tabName;
  },
  
  // ============ Text ⟷ Binary ============
  /**
   * Clear text-binary converter fields
   */
  clearTextBin() {
    document.getElementById('textInput').value = '';
    document.getElementById('binOutput').value = '';
    document.querySelector('#textBinVisualization .bin-content').innerHTML = '';
  },
  
  /**
   * Convert text to binary
   */
  textToBinary() {
    const text = document.getElementById('textInput').value;
    
    if (!text) {
      ui.showAlert('Please enter text to convert');
      return;
    }
    
    // Convert each character to 8-bit binary
    const binary = text.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
    
    document.getElementById('binOutput').value = binary;
    
    // Update visualization
    this.updateTextBinaryVisualization(text, binary);
  },
  
  /**
   * Convert binary to text
   */
  binaryToText() {
    const binary = document.getElementById('binOutput').value.trim();
    
    if (!binary) {
      ui.showAlert('Please enter binary to convert');
      return;
    }
    
    try {
      // Split by spaces, then convert each 8-bit binary to a character
      const text = binary.split(' ').map(bin => {
        // Check if valid binary
        if (!/^[01]+$/.test(bin)) {
          throw new Error('Invalid binary input');
        }
        return String.fromCharCode(parseInt(bin, 2));
      }).join('');
      
      document.getElementById('textInput').value = text;
      
      // Update visualization
      this.updateTextBinaryVisualization(text, binary);
      
    } catch (error) {
      console.error("Binary to text conversion error:", error);
      ui.showAlert('Invalid binary format. Use 8-bit binary values separated by spaces.');
    }
  },
  
  /**
   * Update text-binary visualization
   */
  updateTextBinaryVisualization(text, binary) {
    const container = document.querySelector('#textBinVisualization .bin-content');
    
    if (!container) return;
    
    // Clear previous visualization
    container.innerHTML = '';
    
    // Create character-by-character visualization
    const characters = text.split('');
    const binValues = binary.split(' ');
    
    // Create table structure
    const table = document.createElement('table');
    table.className = 'bin-table';
    
    // Add header row
    const headerRow = document.createElement('tr');
    const charHeader = document.createElement('th');
    charHeader.textContent = 'Char';
    const asciiHeader = document.createElement('th');
    asciiHeader.textContent = 'ASCII';
    const binaryHeader = document.createElement('th');
    binaryHeader.textContent = 'Binary';
    
    headerRow.appendChild(charHeader);
    headerRow.appendChild(asciiHeader);
    headerRow.appendChild(binaryHeader);
    table.appendChild(headerRow);
    
    // Add data rows
    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];
      const ascii = char.charCodeAt(0);
      const bin = binValues[i] || '';
      
      const row = document.createElement('tr');
      
      const charCell = document.createElement('td');
      charCell.className = 'char-cell';
      charCell.textContent = char;
      
      const asciiCell = document.createElement('td');
      asciiCell.className = 'ascii-cell';
      asciiCell.textContent = ascii;
      
      const binaryCell = document.createElement('td');
      binaryCell.className = 'binary-cell';
      binaryCell.textContent = bin;
      
      row.appendChild(charCell);
      row.appendChild(asciiCell);
      row.appendChild(binaryCell);
      table.appendChild(row);
    }
    
    container.appendChild(table);
  },
  
  /**
   * Copy binary output to clipboard
   */
  copyBinOutput() {
    const output = document.getElementById('binOutput');
    if (output && output.value) {
      navigator.clipboard.writeText(output.value)
        .then(() => {
          ui.showAlert('Binary output copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy binary output:', err);
          ui.showAlert('Failed to copy. Please try manually.');
        });
    } else {
      ui.showAlert('Nothing to copy!');
    }
  },
  
  // ============ Hex ⟷ Binary ============
  /**
   * Clear hex-binary converter fields
   */
  clearHexBin() {
    document.getElementById('hexInput').value = '';
    document.getElementById('hexBinOutput').value = '';
    document.querySelector('#hexBinVisualization .bin-content').innerHTML = '';
  },
  
  /**
   * Convert hex to binary
   */
  hexToBinary() {
    const hex = document.getElementById('hexInput').value.trim();
    
    if (!hex) {
      ui.showAlert('Please enter hexadecimal to convert');
      return;
    }
    
    // Validate hex input
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      ui.showAlert('Invalid hexadecimal characters. Use 0-9 and A-F only.');
      return;
    }
    
    try {
      // Convert each hex digit to 4-bit binary
      const binary = hex.split('').map(digit => {
        return parseInt(digit, 16).toString(2).padStart(4, '0');
      }).join(' ');
      
      document.getElementById('hexBinOutput').value = binary;
      
      // Update visualization
      this.updateHexBinaryVisualization(hex, binary);
      
    } catch (error) {
      console.error("Hex to binary conversion error:", error);
      ui.showAlert('Error converting hexadecimal to binary.');
    }
  },
  
  /**
   * Convert binary to hex
   */
  binaryToHex() {
    const binary = document.getElementById('hexBinOutput').value.trim();
    
    if (!binary) {
      ui.showAlert('Please enter binary to convert');
      return;
    }
    
    try {
      // Remove spaces if present
      const cleanBinary = binary.replace(/\s+/g, '');
      
      // Validate binary
      if (!/^[01]+$/.test(cleanBinary)) {
        ui.showAlert('Invalid binary characters. Use 0 and 1 only.');
        return;
      }
      
      // Pad binary to multiple of 4
      const paddedBinary = cleanBinary.padStart(Math.ceil(cleanBinary.length / 4) * 4, '0');
      
      // Convert each 4 bits to a hex digit
      let hex = '';
      for (let i = 0; i < paddedBinary.length; i += 4) {
        const chunk = paddedBinary.substring(i, i + 4);
        hex += parseInt(chunk, 2).toString(16).toUpperCase();
      }
      
      document.getElementById('hexInput').value = hex;
      
      // Update visualization
      this.updateHexBinaryVisualization(hex, binary);
      
    } catch (error) {
      console.error("Binary to hex conversion error:", error);
      ui.showAlert('Error converting binary to hexadecimal.');
    }
  },
  
  /**
   * Update hex-binary visualization
   */
  updateHexBinaryVisualization(hex, binary) {
    const container = document.querySelector('#hexBinVisualization .bin-content');
    
    if (!container) return;
    
    // Clear previous visualization
    container.innerHTML = '';
    
    // Create row for visualization
    const row = document.createElement('div');
    row.className = 'vis-row';
    
    // Hex characters
    const hexDigits = hex.toUpperCase().split('');
    
    // Binary groups (4 bits per hex digit)
    const binaryGroups = binary.split(' ');
    
    // Create visualization elements
    for (let i = 0; i < hexDigits.length; i++) {
      const hexDigit = hexDigits[i];
      const binGroup = binaryGroups[i] || '';
      
      const hexElement = document.createElement('div');
      hexElement.className = 'hex-digit';
      hexElement.textContent = hexDigit;
      
      const binElement = document.createElement('div');
      binElement.className = 'bin-group';
      binElement.textContent = binGroup;
      
      row.appendChild(hexElement);
      row.appendChild(binElement);
    }
    
    container.appendChild(row);
  },
  
  /**
   * Copy hex-binary output to clipboard
   */
  copyHexBinOutput() {
    const output = document.getElementById('hexBinOutput');
    if (output && output.value) {
      navigator.clipboard.writeText(output.value)
        .then(() => {
          ui.showAlert('Hex-Binary output copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy hex-binary output:', err);
          ui.showAlert('Failed to copy. Please try manually.');
        });
    } else {
      ui.showAlert('Nothing to copy!');
    }
  },
  
  // ============ Decimal ⟷ Binary ============
  /**
   * Clear decimal-binary converter fields
   */
  clearDecBin() {
    document.getElementById('decimalInput').value = '';
    document.getElementById('decBinOutput').value = '';
    document.querySelector('#decBinVisualization .bin-content').innerHTML = '';
  },
  
  /**
   * Convert decimal to binary
   */
  decimalToBinary() {
    const decimal = document.getElementById('decimalInput').value.trim();
    
    if (!decimal) {
      ui.showAlert('Please enter a decimal number to convert');
      return;
    }
    
    // Validate decimal input
    if (!/^-?\d+$/.test(decimal)) {
      ui.showAlert('Invalid decimal number. Use digits only.');
      return;
    }
    
    try {
      // Convert decimal to binary
      const num = parseInt(decimal, 10);
      const binary = num.toString(2);
      
      document.getElementById('decBinOutput').value = binary;
      
      // Update visualization
      this.updateDecBinaryVisualization(num, binary);
      
    } catch (error) {
      console.error("Decimal to binary conversion error:", error);
      ui.showAlert('Error converting decimal to binary.');
    }
  },
  
  /**
   * Convert binary to decimal
   */
  binaryToDecimal() {
    const binary = document.getElementById('decBinOutput').value.trim();
    
    if (!binary) {
      ui.showAlert('Please enter binary to convert');
      return;
    }
    
    // Validate binary input
    if (!/^[01]+$/.test(binary)) {
      ui.showAlert('Invalid binary characters. Use 0 and 1 only.');
      return;
    }
    
    try {
      // Convert binary to decimal
      const decimal = parseInt(binary, 2);
      
      document.getElementById('decimalInput').value = decimal;
      
      // Update visualization
      this.updateDecBinaryVisualization(decimal, binary);
      
    } catch (error) {
      console.error("Binary to decimal conversion error:", error);
      ui.showAlert('Error converting binary to decimal.');
    }
  },
  
  /**
   * Update decimal-binary visualization
   */
  updateDecBinaryVisualization(decimal, binary) {
    const container = document.querySelector('#decBinVisualization .bin-content');
    
    if (!container) return;
    
    // Clear previous visualization
    container.innerHTML = '';
    
    // Create visualization
    const decElement = document.createElement('div');
    decElement.className = 'dec-value';
    decElement.textContent = `Decimal: ${decimal}`;
    
    const binElement = document.createElement('div');
    binElement.className = 'bin-value';
    binElement.textContent = `Binary: ${binary}`;
    
    container.appendChild(decElement);
    container.appendChild(binElement);
    
    // Create position values visualization
    const posElement = document.createElement('div');
    posElement.className = 'pos-values';
    
    const posTitleElement = document.createElement('div');
    posTitleElement.className = 'pos-title';
    posTitleElement.textContent = 'Position values:';
    
    posElement.appendChild(posTitleElement);
    
    // Calculate position values
    const digits = binary.split('').reverse();
    const posValues = [];
    
    for (let i = 0; i < digits.length; i++) {
      if (digits[i] === '1') {
        posValues.push(Math.pow(2, i));
      }
    }
    
    // Create visualization of position values
    const posValuesElement = document.createElement('div');
    posValuesElement.className = 'pos-values-list';
    
    if (posValues.length > 0) {
      posValuesElement.textContent = `${posValues.join(' + ')} = ${decimal}`;
    } else {
      posValuesElement.textContent = '0';
    }
    
    posElement.appendChild(posValuesElement);
    container.appendChild(posElement);
  },
  
  /**
   * Copy decimal-binary output to clipboard
   */
  copyDecBinOutput() {
    const output = document.getElementById('decBinOutput');
    if (output && output.value) {
      navigator.clipboard.writeText(output.value)
        .then(() => {
          ui.showAlert('Binary output copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy binary output:', err);
          ui.showAlert('Failed to copy. Please try manually.');
        });
    } else {
      ui.showAlert('Nothing to copy!');
    }
  }
};