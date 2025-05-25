// Content script for AI platforms
console.log(
 "AI Access Manager content script loaded on:",
 window.location.href
);

// Check if user has access to this website
checkUserAccess();

async function checkUserAccess() {
 try {
  // Get user data from background script
  const response = await new Promise((resolve) => {
   chrome.runtime.sendMessage({ type: "GET_USER_DATA" }, resolve);
  });

  if (response.success && response.userData) {
   const userData = response.userData;
   const currentDomain = window.location.hostname;

   // Find matching product access for this domain
   const matchingAccess = userData.productAccess.find((access: any) => {
    try {
     const accessDomain = new URL(access.website).hostname;
     return accessDomain === currentDomain;
    } catch {
     return false;
    }
   });

   if (matchingAccess) {
    // Check if access is still valid
    const endDate = new Date(matchingAccess.endDate);
    const now = new Date();

    if (endDate > now) {
     console.log("User has valid access to this website");
     injectCookies(matchingAccess);
    } else {
     console.log("User access has expired for this website");
     showAccessExpiredNotification();
    }
   } else {
    console.log("User does not have access to this website");
    showNoAccessNotification();
   }
  } else {
   console.log("User not logged in");
  }
 } catch (error) {
  console.error("Error checking user access:", error);
 }
}

function injectCookies(access: any) {
 try {
  // Request background script to inject cookies
  chrome.runtime.sendMessage({
   type: "INJECT_COOKIES",
   data: {
    website: access.website,
    cookies: access.cookies,
   },
  });
 } catch (error) {
  console.error("Error requesting cookie injection:", error);
 }
}

function showAccessExpiredNotification() {
 showNotification("Quyền truy cập đã hết hạn", "error");
}

function showNoAccessNotification() {
 showNotification("Bạn chưa có quyền truy cập website này", "warning");
}

function showNotification(
 message: string,
 type: "success" | "error" | "warning"
) {
 // Create notification element
 const notification = document.createElement("div");
 notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;

 // Set colors based on type
 switch (type) {
  case "success":
   notification.style.backgroundColor = "rgba(76, 175, 80, 0.9)";
   break;
  case "error":
   notification.style.backgroundColor = "rgba(244, 67, 54, 0.9)";
   break;
  case "warning":
   notification.style.backgroundColor = "rgba(255, 152, 0, 0.9)";
   break;
 }

 notification.textContent = message;

 // Add animation keyframes
 if (!document.querySelector("#ai-access-keyframes")) {
  const style = document.createElement("style");
  style.id = "ai-access-keyframes";
  style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
  document.head.appendChild(style);
 }

 document.body.appendChild(notification);

 // Auto remove after 5 seconds
 setTimeout(() => {
  if (notification.parentNode) {
   notification.style.animation = "slideIn 0.3s ease-out reverse";
   setTimeout(() => {
    notification.remove();
   }, 300);
  }
 }, 5000);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
 switch (message.type) {
  case "COOKIES_INJECTED":
   if (message.success) {
    console.log("Cookies injected successfully");
    showNotification("Đã tự động đăng nhập!", "success");
    // Refresh page to apply cookies
    setTimeout(() => {
     window.location.reload();
    }, 1000);
   } else {
    console.error("Failed to inject cookies:", message.error);
    showNotification("Lỗi khi đăng nhập tự động", "error");
   }
   break;
 }
});
