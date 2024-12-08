chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Send the active tab's URL to the Flask API
        fetch('http://127.0.0.1:5000/predict', { // Ensure Flask is running on this URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: tab.url })
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'Malicious') {
                // Display a browser notification
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icon48.png',
                    title: 'Malicious URL Detected!',
                    message: `The URL "${tab.url}" is flagged as malicious.`,
                    priority: 2
                });
            }
        })
        .catch(error => console.error('Error:', error));
    }
});
