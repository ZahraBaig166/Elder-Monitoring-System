import joblib
import numpy as np

# Load model at startup
model = joblib.load("fall_api/fall_detection_xgb_model.pkl")

def predict_fall(data):
    features = np.array([
        data.accel_x_list, data.accel_y_list, data.accel_z_list,
        data.gyro_x_list, data.gyro_y_list, data.gyro_z_list,
        data.orientation_s_list, data.orientation_i_list,
        data.orientation_j_list, data.orientation_k_list
    ]).reshape(1, -1)

    prediction = model.predict(features)
    result = "Fall Detected" if prediction[0] == 1 else "No Fall Detected"
    return {"prediction": result, "raw_output": int(prediction[0])}
