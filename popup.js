document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleUnderline');
    toggleButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: "toggleUnderline" });
    });
  });