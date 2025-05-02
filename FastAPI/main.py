from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()
model = joblib.load("fall_detection_xgb_model.pkl")

# Input schema
class FallDetectionInput(BaseModel):
    accel_x_list: float
    accel_y_list: float
    accel_z_list: float
    gyro_x_list: float
    gyro_y_list: float
    gyro_z_list: float
    orientation_s_list: float
    orientation_i_list: float
    orientation_j_list: float
    orientation_k_list: float

# Prediction endpoint
@app.post("/predict")
def predict_fall(data: FallDetectionInput):
    features = np.array([
        data.accel_x_list, data.accel_y_list, data.accel_z_list,
        data.gyro_x_list, data.gyro_y_list, data.gyro_z_list,
        data.orientation_s_list, data.orientation_i_list,
        data.orientation_j_list, data.orientation_k_list
    ]).reshape(1, -1)
    
    prediction = model.predict(features)
    result = "Fall Detected" if prediction[0] == 1 else "No Fall Detected"
    print(result)
    return {"prediction": result, "raw_output": int(prediction[0])}
