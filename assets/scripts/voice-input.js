window.VoiceInputHandler = class VoiceInputHandler {
  constructor() {
    this.speechHandler = new window.SpeechHandler();
    this.activeInput = null;
    this.isListening = false;
    this.setupMessageListener();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'toggleVoice') {
        this.toggleGlobalVoiceInput();
        sendResponse({ success: true });
        return true;
      }
    });
  }

  toggleGlobalVoiceInput() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  startListening() {
    if (!this.activeInput) return;
    
    this.isListening = true;
    this.speechHandler.start(
      // Handle interim results
      (interimText) => {
        if (this.activeInput) {
          const cursorPosition = this.activeInput.selectionStart;
          const currentValue = this.activeInput.value;
          const beforeCursor = currentValue.substring(0, cursorPosition);
          const afterCursor = currentValue.substring(cursorPosition);
          this.activeInput.value = beforeCursor + interimText + afterCursor;
        }
      },
      // Handle final results
      (finalText) => {
        if (this.activeInput) {
          const cursorPosition = this.activeInput.selectionStart;
          const currentValue = this.activeInput.value;
          const beforeCursor = currentValue.substring(0, cursorPosition);
          const afterCursor = currentValue.substring(cursorPosition);
          this.activeInput.value = beforeCursor + finalText + afterCursor;
          // Move cursor to end of inserted text
          this.activeInput.selectionStart = this.activeInput.selectionEnd = 
            cursorPosition + finalText.length;
        }
      }
    );
  }

  stopListening() {
    this.isListening = false;
    this.speechHandler.stop();
  }

  setupInput(input) {
    if (input.dataset.svSetup) return;
    
    const micButton = window.UIElements.createMicButton();
    const wrapper = window.UIElements.createInputWrapper();
    
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    wrapper.appendChild(micButton);
    
    input.dataset.svSetup = 'true';
    
    micButton.addEventListener('click', () => this.toggleVoiceInput(input, micButton));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isListening) {
        this.stopListening();
      }
    });
  }

  toggleVoiceInput(input, micButton) {
    if (this.activeInput === input && this.isListening) {
      this.stopListening();
      micButton.classList.remove('active');
    } else {
      if (this.isListening) {
        this.stopListening();
      }
      this.activeInput = input;
      this.startListening();
      micButton.classList.add('active');
    }
  }
};