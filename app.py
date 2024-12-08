from flask import Flask, request, jsonify
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
import os
import pandas as pd

app = Flask(__name__)

# Load the model and vectorizer
MODEL_DIRECTORY = "Models"
url_classifier = joblib.load(os.path.join(MODEL_DIRECTORY, 'url_logistic_regression_classifier.pkl'))
tfid_vectorizer = joblib.load(os.path.join(MODEL_DIRECTORY, 'tfid_vectorizer.pkl'))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    url = data.get('url', None)
    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    # Preprocess and predict
    vectorized_url = tfid_vectorizer.transform([url])
    prediction = url_classifier.predict(vectorized_url)
    probability = url_classifier.predict_proba(vectorized_url)
    result = 'Malicious' if prediction[0] == 1 else 'Benign'

    # Notify admin if malicious
    if result == 'Malicious':
        notify_admin(url)

    return jsonify({'url': url, 'result': result, 'probability': probability.tolist()})


def notify_admin(malicious_url):
    # Example notification logic (e.g., send an email or push notification)
    print(f"ALERT! Malicious URL detected: {malicious_url}")
    # You can integrate email or other notification systems here


if __name__ == '__main__':
    app.run(debug=True, port=5000)
