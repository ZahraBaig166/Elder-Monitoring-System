import pandas as pd
import joblib
from sqlalchemy import create_engine

# Database connection
DATABASE_URL = "postgresql+psycopg2://postgres:laiba@localhost:5432/ElderlyMonitoring"
engine = create_engine(DATABASE_URL)

def predict_anomaly(data) -> dict:
    """
    Combine passed wearable data with latest video data from DB,
    and predict anomaly using Isolation Forest.
    """
    try:
        # Extract patient_id from the incoming wearable metrics
        patient_id = data.patient_id

        # Convert wearable metrics (already from frontend) to DataFrame
        wearable_df = pd.DataFrame([{
            "value": data.value,
            "steps": data.steps,
            "calories": data.calories,
            "distance": data.distance,
            "sleep_stage": data.sleep_stage
        }])

        # Fetch latest video data (emotion and activity) from DB
        video_query = f"""
            SELECT emotion, activity
            FROM patient_activities
            WHERE patient_id = {patient_id}
            ORDER BY timestamp DESC
            LIMIT 1;
        """
        video_df = pd.read_sql(video_query, engine)

        if video_df.empty:
            return {"anomaly": False, "message": "No video activity data available."}

        # Combine wearable + video data
        wearable_df['emotion'] = video_df.iloc[0]['emotion']
        wearable_df['activity'] = video_df.iloc[0]['activity']

        # Encode categorical features
        wearable_df['emotion'] = wearable_df['emotion'].astype('category').cat.codes
        wearable_df['activity'] = wearable_df['activity'].astype('category').cat.codes

        # Load pre-trained model for this patient
        model_path = f"anomaly_api/models/patient_{patient_id}_anomaly_model.pkl"
        model = joblib.load(model_path)

        # Define feature columns
        features = ["value", "steps", "calories", "distance", "sleep_stage", "emotion", "activity"]
        X = wearable_df[features]

        # Run prediction
        prediction = model.predict(X)[0]

        return {
            "anomaly": bool(prediction == -1),
            "raw_output": int(prediction),
            "details": "Anomaly detected" if prediction == -1 else "Normal behavior"
        }

    except Exception as e:
        print("Error during anomaly detection:", e)
        return {"anomaly": False, "error": str(e)}
    
def fetch_patient_routine(patient_id: int) -> dict:
    """
    Fetches wearable + video data for patient for last 24 hours
    """
    try:
        # Fetch wearable data
        wearable_query = f"""
            SELECT time, steps, sleep_stage
            FROM health_metrics
            WHERE patient_id = {patient_id}
            AND time >= NOW() - INTERVAL '1 day'
            ORDER BY time ASC;
        """
        wearable_df = pd.read_sql(wearable_query, engine)

        # Fetch video data
        video_query = f"""
            SELECT timestamp AS time, activity, emotion
            FROM patient_activities
            WHERE patient_id = {patient_id}
            AND timestamp >= NOW() - INTERVAL '1 day'
            ORDER BY timestamp ASC;
        """
        video_df = pd.read_sql(video_query, engine)

        # Merge wearable + video data
        routine_df = pd.merge_asof(
            wearable_df.sort_values('time'),
            video_df.sort_values('time'),
            on='time',
            direction='nearest',
            tolerance=pd.Timedelta(minutes=10)
        )

        routine_df.fillna(method='ffill', inplace=True)

        # Format as list of dicts
        return {"routine": routine_df.to_dict(orient='records')}

    except Exception as e:
        print("Error fetching routine:", e)
        return {"routine": [], "error": str(e)}
