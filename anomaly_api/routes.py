from fastapi import APIRouter
from .anomaly_logic import predict_anomaly

router = APIRouter()

@router.get("/anomaly-detection/{patient_id}")
async def anomaly_detection(patient_id: int):
    """
    Fetch the latest wearable + video data for patient,
    run anomaly detection using pre-trained model.
    """
    result = predict_anomaly(patient_id)
    return  result