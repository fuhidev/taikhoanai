// Background script for Chrome extension
console.log('AI Access Manager background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details);
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background:', message);
  
  switch (message.type) {
    case 'INJECT_COOKIES':
      handleCookieInjection(message.data, sender.tab?.id);
      break;
    case 'GET_USER_DATA':
      handleGetUserData(sendResponse);
      return true; // Keep the message channel open for async response
    default:
      console.log('Unknown message type:', message.type);
  }
});

async function handleCookieInjection(data: { website: string; cookies: string }, tabId?: number) {
  if (!tabId) return;
  
  try {
    const cookies = JSON.parse(data.cookies);
    const url = new URL(data.website);
    
    // Set cookies for the website
    for (const cookie of cookies) {
      await chrome.cookies.set({
        url: data.website,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain || url.hostname,
        path: cookie.path || '/',
        secure: cookie.secure || false,
        httpOnly: cookie.httpOnly || false,
        expirationDate: cookie.expirationDate,
      });
    }
    
    console.log('Cookies injected successfully for:', data.website);
    
    // Notify content script
    chrome.tabs.sendMessage(tabId, {
      type: 'COOKIES_INJECTED',
      success: true,
    });
  } catch (error) {
    console.error('Error injecting cookies:', error);
    
    if (tabId) {
      chrome.tabs.sendMessage(tabId, {
        type: 'COOKIES_INJECTED',
        success: false,
        error: error.message,
      });
    }
  }
}

async function handleGetUserData(sendResponse: (response: any) => void) {
  try {
    const result = await chrome.storage.local.get('userData');
    sendResponse({ success: true, userData: result.userData });
  } catch (error) {
    console.error('Error getting user data:', error);
    sendResponse({ success: false, error: error.message });
  }
}
