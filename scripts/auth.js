/**
 * Authentication Module for ShikiHub Pro
 */
const auth = {
  // Configuration
  ACCESS_CODE: "shiki", // The password to access the main content

  // DOM Elements
  passwordPromptContainer: null,
  passwordInput: null,
  passwordError: null,
  mainContent: null,

  /**
   * Initialize authentication system
   */
  init() {
    this.passwordPromptContainer = document.getElementById('password-prompt-container');
    this.passwordInput = document.getElementById('password-input');
    this.passwordError = document.getElementById('password-error');
    this.mainContent = document.getElementById('main-content');

    // Add keypress listener for "Enter" on password field
    if (this.passwordInput) {
      this.passwordInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          this.submitPassword();
        }
      });
    }
  },

  /**
   * Submit and verify password
   */
  submitPassword() {
    if (this.passwordInput.value === this.ACCESS_CODE) {
      // Add glitch effect during transition
      document.body.classList.add('auth-success');
      
      // Add a slight delay for effect
      setTimeout(() => {
        this.passwordPromptContainer.style.display = 'none';
        this.mainContent.style.display = 'block';
        document.body.classList.remove('auth-success');
        
        // Initialize rest of page
        ui.initPage();
      }, 300);
    } else {
      this.passwordError.style.display = 'block';
      this.passwordInput.value = '';
      this.passwordInput.focus();
      
      // Add shake animation to the input on error
      this.passwordInput.style.animation = 'shake 0.5s';
      setTimeout(() => this.passwordInput.style.animation = '', 500);
    }
  }
};

// Initialize authentication on DOM load
document.addEventListener('DOMContentLoaded', () => {
  auth.init();
});