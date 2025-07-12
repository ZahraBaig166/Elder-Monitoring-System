from fastapi import APIRouter
from .anomaly_logic import predict_anomaly
from .anomaly_logic import fetch_patient_routine
from .schemas import Metrics
router = APIRouter()

@router.post("/anomaly-detection")
async def anomaly_detection(data: Metrics):
    """
    Fetch the latest wearable + video data for patient,
    run anomaly detection using pre-trained model.
    """
    print(f"RUNNING THE ANOMALY FOR PATIENT")
    result = predict_anomaly(data)
    return  result

@router.get("/patient-routine/{patient_id}")
async def patient_routine(patient_id: int):
    """
    Fetches patient routine (wearable + video) for last 24 hours
    """
    return fetch_patient_routine(patient_id)