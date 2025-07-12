from fastapi import APIRouter
from .anomaly_logic import predict_anomaly

router = APIRouter()

@router.post("/anomaly-detection/{patient_id}")
async def anomaly_detection(patient_id: int):
    """
    Fetch the latest wearable + video data for patient,
    run anomaly detection using pre-trained model.
    """
    print(f"RUNNING THE ANOMALY FOR PATIENT {patient_id}")
    result = predict_anomaly(patient_id)
    return  result