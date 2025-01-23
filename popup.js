document.getElementById("save").addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const pass = document.getElementById("password").value.trim();
    if (name && pass=="u") {
      chrome.storage.local.set({ name }, () => {
        console.log("Name saved:", name);
        alert("Key saved successfully!");
      });
    } else {
      alert("Please enter a key and correct password");
    }
  });
  