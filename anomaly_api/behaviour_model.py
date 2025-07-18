import pandas as pd
from sqlalchemy import create_engine
from sklearn.ensemble import IsolationForest
import joblib  # for saving models
import os

DB_USER = "postgres"
DB_PASS = "laiba"
DB_HOST = "localhost"
DB_PORT = "5432"
DATABASE_NAME = "ElderlyMonitoring"

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DATABASE_NAME}"

engine = create_engine(DATABASE_URL, echo=True)

# Load wearable data
wearable_df = pd.read_sql("SELECT * FROM health_metrics;", engine)

# Load video surveillance data
video_df = pd.read_sql("SELECT * FROM patient_activities;", engine)

# Preprocess: Merge wearable and video data on patient_id (mimic/repeat video data)
latest_video = video_df.sort_values("timestamp").drop_duplicates("patient_id", keep="last")

# 3. Merge wearable with the latest video data
merged_df = wearable_df.merge(
    latest_video.drop("timestamp", axis=1),
    on="patient_id",
    how="left"
)

# 4. Handle missing video info (if any)
merged_df['emotion'] = merged_df['emotion'].fillna(method='ffill').fillna(method='bfill')
merged_df['activity'] = merged_df['activity'].fillna(method='ffill').fillna(method='bfill')

# 5. Encode categorical features
merged_df['emotion'] = merged_df['emotion'].astype('category').cat.codes
merged_df['activity'] = merged_df['activity'].astype('category').cat.codes
# Define features for training
features = [
    'value', 'steps', 'calories', 'distance', 'sleep_stage',
    'emotion', 'activity'
]

# 📌 Patients of interest
patients_of_interest = {
    8877689391: "ALIYAN",
    5553957443: "AJLAL",
    4020332650: "SAYYAN"
}

# Create folder for models
os.makedirs("models", exist_ok=True)

# Train Isolation Forest per selected patient
for patient_id, name in patients_of_interest.items():
    patient_data = merged_df[merged_df['patient_id'] == patient_id]
    X = patient_data[features].dropna()

    if X.empty:
        print(f"⚠ Skipping {name} (Patient {patient_id}): No valid data.")
        continue

    model = IsolationForest(contamination=0.05, random_state=42)
    model.fit(X)

    model_filename = f"models/patient_{patient_id}_anomaly_model.pkl"
    joblib.dump(model, model_filename)
    print(f"✅ Model trained and saved for {name} (Patient {patient_id}): {model_filename}")