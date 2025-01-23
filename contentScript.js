// contentScript.js
(() => {
    const title = document.title;
  
    const metaDescription = document.querySelector("meta[name='description']")?.getAttribute("content") || "null";
  
    // Send the title and description back to the background script
    chrome.runtime.sendMessage({
      title,
      description: metaDescription
    });
  })();
  