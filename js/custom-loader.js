document.addEventListener('DOMContentLoaded', () => {
  const mainDiv = document.getElementById('main');

  if (mainDiv) {
    const observer = new MutationObserver((mutationsList, observer) => {
      for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Check if it's an element
              const scripts = node.querySelectorAll('script[data-exec-on-load]');
              scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                if (oldScript.src) {
                  newScript.src = oldScript.src;
                } else {
                  newScript.innerHTML = oldScript.innerHTML;
                }
                document.head.appendChild(newScript).parentNode.removeChild(newScript);
              });
            }
          });
        }
      }
    });

    observer.observe(mainDiv, { childList: true, subtree: true });
  }
});
