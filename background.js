let isUnderlineActive = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleUnderline") {
    isUnderlineActive = !isUnderlineActive;
    toggleUnderline(isUnderlineActive);
  }
  else{
    isUnderlineActive = !isUnderlineActive;
    toggleUnderline(isUnderlineActive);
  }
}); 

function toggleUnderline(enable) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTabId = tabs[0].id;
    if (enable) {
        chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            function: underlineText,
          });
    } else {
        chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            function: removeUnderlineText,
          });
    }
  });
}


function underlineText() {
  function setUnderline() {
    const textNodes = [];

    function findTextNodes(node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
        textNodes.push(node);
      } else {
        for (let child of node.childNodes) {
          findTextNodes(child);
        }
      }
    }

    findTextNodes(document.body);

    textNodes.forEach((textNode) => {
        let parent = textNode.parentNode
       if (parent && parent.style.textDecoration !== 'underline red') {
          let span = document.createElement('span');
          span.style.textDecoration = 'underline red';
          textNode.parentNode.insertBefore(span, textNode);
          span.appendChild(textNode);
      }
    });
  }

  setUnderline()
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
              setUnderline();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

function removeUnderlineText() {
    function removeUnderlines() {
        const elements = document.querySelectorAll('span[style="text-decoration: underline red;"]');
        elements.forEach(element => {
          if (element.firstChild) {
            element.parentNode.insertBefore(element.firstChild, element);
          }
           element.remove();
        });
      }
        removeUnderlines()
        
        const observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                  removeUnderlines();
                }
            }
        });
    
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

}