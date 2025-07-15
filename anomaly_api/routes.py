from fastapi import APIRouter
from .anomaly_logic import predict_anomaly
from .anomaly_logic import fetch_patient_routine
from .anomaly_logic import get_sleep_pattern
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
    print(f"RUNNING THE ROUTINE FOR PATIENT")
    return fetch_patient_routine(patient_id)

@router.get("/patient-sleep-pattern/{patient_id}")
async def patient_sleep_pattern(patient_id: int):
    """
    Fetches sleep pattern data (24h) for the given patient.
    """
    return get_sleep_pattern(patient_id)