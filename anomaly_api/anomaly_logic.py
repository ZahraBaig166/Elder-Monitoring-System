import pandas as pd
import joblib
from sqlalchemy import create_engine

# Database connection
DATABASE_URL = "postgresql+psycopg2://postgres:laiba@localhost:5432/ElderlyMonitoring"
engine = create_engine(DATABASE_URL)

def predict_anomaly(patient_id: int) -> dict:
    """
    Load latest wearable + video data for the patient,
    combine it, and predict anomaly using Isolation Forest.
    """
    try:
        # Fetch latest wearable row
        wearable_query = f"""
            SELECT value, steps, calories, distance, sleep_stage
            FROM health_metrics
            WHERE patient_id = {patient_id}
            ORDER BY time DESC
            LIMIT 1;
        """
        wearable_df = pd.read_sql(wearable_query, engine)

        # Fetch latest video row
        video_query = f"""
            SELECT emotion, activity
            FROM patient_activities
            WHERE patient_id = {patient_id}
            ORDER BY timestamp DESC
            LIMIT 1;
        """
        video_df = pd.read_sql(video_query, engine)

        if wearable_df.empty or video_df.empty:
            return {"anomaly": False, "message": "Not enough data yet."}

        # Combine wearable + video data
        latest_data = wearable_df.assign(
            emotion=video_df.iloc[0]['emotion'],
            activity=video_df.iloc[0]['activity']
        )

        # Encode categorical features
        latest_data['emotion'] = latest_data['emotion'].astype('category').cat.codes
        latest_data['activity'] = latest_data['activity'].astype('category').cat.codes

        # Load pre-trained model
        model_path = f"models/patient_{patient_id}_anomaly_model.pkl"
        model = joblib.load(model_path)

        # Features used for prediction
        features = ["value", "steps", "calories", "distance", "sleep_stage", "emotion", "activity"]
        X = latest_data[features]

        # Predict anomaly (-1 = anomaly, 1 = normal)
        prediction = model.predict(X)[0]
        return {
            "anomaly": prediction == -1,
            "details": "Anomaly detected" if prediction == -1 else "Normal behavior"
        }

    except Exception as e:
        print("Error during anomaly detection:", e)
        return {"anomaly": False, "error": str(e)}