document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings
  chrome.storage.sync.get(
    {
      spellCheck: true,
      grammarCheck: true,
      recordAudio: false,
      silenceTimeout: 6
    },
    (items) => {
      document.getElementById('spellCheck').checked = items.spellCheck;
      document.getElementById('grammarCheck').checked = items.grammarCheck;
      document.getElementById('recordAudio').checked = items.recordAudio;
      document.getElementById('silenceTimeout').value = items.silenceTimeout;
    }
  );

  // Save settings
  document.getElementById('save').addEventListener('click', () => {
    const settings = {
      spellCheck: document.getElementById('spellCheck').checked,
      grammarCheck: document.getElementById('grammarCheck').checked,
      recordAudio: document.getElementById('recordAudio').checked,
      silenceTimeout: parseInt(document.getElementById('silenceTimeout').value, 10)
    };

    chrome.storage.sync.set(settings, () => {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = 'Settings saved!';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    });
  });

  // Reset to defaults
  document.getElementById('reset').addEventListener('click', () => {
    const defaults = {
      spellCheck: true,
      grammarCheck: true,
      recordAudio: false,
      silenceTimeout: 6
    };

    chrome.storage.sync.set(defaults, () => {
      document.getElementById('spellCheck').checked = defaults.spellCheck;
      document.getElementById('grammarCheck').checked = defaults.grammarCheck;
      document.getElementById('recordAudio').checked = defaults.recordAudio;
      document.getElementById('silenceTimeout').value = defaults.silenceTimeout;
      
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = 'Settings reset to defaults!';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    });
  });
});