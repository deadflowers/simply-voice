document.addEventListener('DOMContentLoaded', () => {
  // Handle options button click
  document.getElementById('options').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Handle tutorial button click
  document.getElementById('tutorial').addEventListener('click', () => {
    chrome.tabs.create({
      url: 'https://rkooyenga.github.io/simplyvoice/
    });
  });
});