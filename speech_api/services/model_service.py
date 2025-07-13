import joblib
from speech_api.config import MODEL_PATH, ENCODER_PATH
import numpy as np

model = joblib.load(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)

def predict_label(acoustic_features, linguistic_features):
    features = np.hstack((acoustic_features, linguistic_features)).reshape(1, -1)
    prediction = model.predict(features)
    return label_encoder.inverse_transform(prediction)[0]
