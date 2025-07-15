import pandas as pd
import joblib
from sqlalchemy import create_engine

DATABASE_URL = "postgresql+psycopg2://postgres:laiba@localhost:5432/ElderlyMonitoring"
engine = create_engine(DATABASE_URL)

def predict_anomaly(data) -> dict:
    """
    Combine passed wearable data with latest video data from DB,
    and predict anomaly using Isolation Forest.
    """
    try:
        patient_id = data.patient_id

        wearable_df = pd.DataFrame([{
            "value": data.value,
            "steps": data.steps,
            "calories": data.calories,
            "distance": data.distance,
            "sleep_stage": data.sleep_stage
        }])

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

        wearable_df['emotion'] = video_df.iloc[0]['emotion']
        wearable_df['activity'] = video_df.iloc[0]['activity']

        wearable_df['emotion'] = wearable_df['emotion'].astype('category').cat.codes
        wearable_df['activity'] = wearable_df['activity'].astype('category').cat.codes

        model_path = f"anomaly_api/models/patient_{patient_id}_anomaly_model.pkl"
        model = joblib.load(model_path)

        features = ["value", "steps", "calories", "distance", "sleep_stage", "emotion", "activity"]
        X = wearable_df[features]

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
    Aggregates wearable data into 2-hour intervals and attaches video rows.
    """
    try:
        time_query = f"""
            SELECT MIN(time) AS start_time
            FROM health_metrics
            WHERE patient_id = {patient_id};
        """
        result = pd.read_sql(time_query, engine)
        start_time = result['start_time'].iloc[0]

        if pd.isna(start_time):
            return {"routine": [], "error": "No wearable data for this patient."}

        start_time = pd.to_datetime(start_time)
        end_time = start_time + pd.Timedelta(hours=24)

        wearable_query = f"""
            SELECT time, value AS value, sleep_stage
            FROM health_metrics
            WHERE patient_id = {patient_id}
            AND time >= '{start_time}'
            AND time < '{end_time}'
            ORDER BY time ASC;
        """
        wearable_df = pd.read_sql(wearable_query, engine)

        if wearable_df.empty:
            return {"routine": [], "error": "No wearable data found for patient in this period."}

        video_query = f"""
            SELECT activity, emotion
            FROM patient_activities
            WHERE patient_id = {patient_id}
            LIMIT {len(wearable_df)};
        """
        video_df = pd.read_sql(video_query, engine)

        if video_df.empty:
            video_df = pd.DataFrame({
                "activity": ["No Data"] * len(wearable_df),
                "emotion": ["No Data"] * len(wearable_df)
            })

        while len(video_df) < len(wearable_df):
            video_df = pd.concat([video_df, video_df], ignore_index=True)
        video_df = video_df.iloc[:len(wearable_df)]


        combined_df = pd.concat([
            wearable_df.reset_index(drop=True),
            video_df.reset_index(drop=True)
        ], axis=1)

        combined_df['time_interval'] = combined_df['time'].dt.floor('2h')

        grouped = combined_df.groupby('time_interval').agg({
            'activity': lambda x: x.mode()[0] if not x.mode().empty else "No Data",
            'emotion': lambda x: x.mode()[0] if not x.mode().empty else "No Data",
            'sleep_stage': lambda x: x.mode()[0] if not x.mode().empty else 0,
            'value': lambda x: x.mode()[0] if not x.mode().empty else 0
        }).reset_index()

        grouped['time_interval'] = grouped['time_interval'].apply(
            lambda t: f"{t.strftime('%H:%M')}–{(t + pd.Timedelta(hours=2)).strftime('%H:%M')}"
        )

        sleep_stage_map = {0: "Awake", 1: "Light Sleep", 2: "Deep Sleep"}
        grouped['sleep_stage'] = grouped['sleep_stage'].map(sleep_stage_map).fillna("No Data")

        return {"routine": grouped.to_dict(orient='records')}

    except Exception as e:
        print("Error fetching routine:", e)
        return {"routine": [], "error": str(e)}


def get_sleep_pattern(patient_id: int) -> dict:
    """
    Fetch aggregated sleep stage data for the patient over 24 hours.
    Returns 24 data points (1 per hour), using priority: Deep Sleep > Light Sleep > Awake.
    """
    try:
        time_query = f"""
            SELECT MIN(time) AS start_time
            FROM health_metrics
            WHERE patient_id = {patient_id};
        """
        result = pd.read_sql(time_query, engine)
        start_time = result['start_time'].iloc[0]

        if pd.isna(start_time):
            return {"sleep_pattern": [], "error": "No sleep data for this patient."}

        start_time = pd.to_datetime(start_time)
        end_time = start_time + pd.Timedelta(hours=24)

        sleep_query = f"""
            SELECT time, sleep_stage
            FROM health_metrics
            WHERE patient_id = {patient_id}
            AND time >= '{start_time}'
            AND time < '{end_time}'
            ORDER BY time ASC;
        """
        sleep_df = pd.read_sql(sleep_query, engine)

        if sleep_df.empty:
            return {"sleep_pattern": [], "error": "No sleep data found."}

        stage_map = {0: "Awake", 1: "Light Sleep", 2: "Deep Sleep"}
        sleep_df['sleep_stage_label'] = sleep_df['sleep_stage'].map(stage_map)

        sleep_df['time'] = pd.to_datetime(sleep_df['time'])
        sleep_df.set_index('time', inplace=True)

        def priority_stage(series):
            if "Deep Sleep" in series.values:
                return "Deep Sleep"
            elif "Light Sleep" in series.values:
                return "Light Sleep"
            elif "Awake" in series.values:
                return "Awake"
            else:
                return "No Data"

        hourly_df = sleep_df.resample('1H').agg(priority_stage).reset_index()

        hourly_df['hour'] = hourly_df['time'].dt.strftime('%H:%M')

        sleep_data = [
            {"time": row['hour'], "sleep_stage": row['sleep_stage_label']}
            for _, row in hourly_df.iterrows()
        ]

        print("Aggregated Sleep Pattern (Priority):", sleep_data)

        return {"sleep_pattern": sleep_data}

    except Exception as e:
        print("Error fetching sleep pattern:", e)
        return {"sleep_pattern": [], "error": str(e)}