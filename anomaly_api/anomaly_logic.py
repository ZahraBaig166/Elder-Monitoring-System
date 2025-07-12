import pandas as pd
import joblib
from sqlalchemy import create_engine
from pydantic import BaseModel
from fastapi import FastAPI, Request

# Database connection
DATABASE_URL = "postgresql+psycopg2://postgres:laiba@localhost:5432/ElderlyMonitoring"
engine = create_engine(DATABASE_URL)
app= FastAPI()

class Metrics(BaseModel):
    patient_id: int
    value: float
    steps: int
    calories: float
    distance: float
    sleep_stage: int
    emotion: str
    activity: str

@app.post("/anomaly/anomaly-detection")
async def predict_anomaly(metrics: Metrics):
    print (f"RUNNING THE ANOMALY MODEL")
    try:
        # Convert metrics to DataFrame
        data = pd.DataFrame([metrics.dict()])

        # Encode categorical features
        data['emotion'] = data['emotion'].astype('category').cat.codes
        data['activity'] = data['activity'].astype('category').cat.codes

        # Load model
        model_path = f"anomaly_api/models/patient_{metrics.patient_id}_anomaly_model.pkl"
        model = joblib.load(model_path)

        # Features for prediction
        features = [
                'value', 'steps', 'calories', 'distance', 'sleep_stage',
                'emotion','activity'
            ]
        X = data[features]

        prediction = model.predict(X)[0]

        return {
            "anomaly": bool(prediction == -1),
            "raw_output": int(prediction),
            "details": "Anomaly detected" if prediction == -1 else "Normal behavior"
        }

    except Exception as e:
        print("Error in anomaly detection:", e)
        return {"anomaly": False, "error": str(e)}
