document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');
  const loadingDiv = statusDiv.querySelector('.loading');
  const resultDiv = statusDiv.querySelector('.result');

  try {
    // Show loading state
    loadingDiv.style.display = 'block';
    resultDiv.style.display = 'none';
    
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to background script
    chrome.runtime.sendMessage(
      { action: 'checkHosting', url: tab.url },
      (response) => {
        loadingDiv.style.display = 'none';
        resultDiv.style.display = 'block';
        
        if (response.success) {          
          resultDiv.innerHTML = `
            <div class="info">
              <p>${response.result.provider || 'Unknown'}</p>
            </div>
          `;
        } else {
          resultDiv.innerHTML = `
            <div class="error">
              <p>${response.error}</p>
            </div>
          `;
        }
      }
    );
  } catch (error) {
    loadingDiv.style.display = 'none';
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <div class="error">
        <p>${error.message}</p>
      </div>
    `;
  }
}); 