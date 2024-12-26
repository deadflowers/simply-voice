(function() {
  // Initialize voice input functionality
  const voiceInput = new window.VoiceInputHandler();

  // Setup for existing inputs
  document.querySelectorAll('input[type="text"], input[type="search"], textarea')
    .forEach(input => voiceInput.setupInput(input));

  // Watch for new inputs
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          node.querySelectorAll('input[type="text"], input[type="search"], textarea')
            .forEach(input => voiceInput.setupInput(input));
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();