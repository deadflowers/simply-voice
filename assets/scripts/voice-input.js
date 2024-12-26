const VoiceInput = (function() {
  class VoiceInputHandler {
    constructor() {
      this.speechHandler = new SpeechHandler();
      this.activeInput = null;
      this.isListening = false;
      this.setupMessageListener();
    }

    setupMessageListener() {
      chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'toggleVoice') {
          this.toggleGlobalVoiceInput();
        }
      });
    }

    setupInput(input) {
      if (input.dataset.svSetup) return;
      
      const micButton = UIElements.createMicButton();
      const wrapper = UIElements.createInputWrapper();
      
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
  }

  return VoiceInputHandler;
})();