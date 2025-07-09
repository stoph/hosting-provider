chrome.runtime.onInstalled.addListener(() => {
  console.log('WordPress Hosting Checker installed');
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkHosting') {
    checkHostingProvider(request.url)
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Required for async response
  }
});

async function checkHostingProvider(url) {
  try {
    // Parse the URL to get the base domain
    const urlObj = new URL(url);
    
    // Check if the URL scheme is http or https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Only HTTP and HTTPS URLs are supported');
    }
    
    const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
    
    // Make the request to the hosting provider endpoint
    const response = await fetch(`${baseUrl}/.well-known/hosting-provider`);
    if (!response.ok) {
      throw new Error('Hosting provider endpoint not found');
    }
    const text = await response.text();
    return {
      isWPVIP: text.trim() === 'wpvip.com',
      provider: text.trim()
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to check hosting provider');
  }
} 