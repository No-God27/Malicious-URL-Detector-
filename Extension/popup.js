document.getElementById('check-url').addEventListener('click', () => {
    const url = document.getElementById('url').value;

    // Send the URL to the Flask API
    fetch('http://127.0.0.1:5000/predict', { // Ensure Flask is running on this URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    })
    .then(response => response.json())
    .then(data => {
        const result = data.result === 'Malicious' ? 'Malicious URL' : 'Benign URL';
        document.getElementById('result').innerText = `Result: ${result}`;
    })
    .catch(error => {
        document.getElementById('result').innerText = 'Error checking URL';
        console.error('Error:', error);
    });
});
