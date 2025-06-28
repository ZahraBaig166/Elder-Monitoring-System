from fastapi import APIRouter
from .schemas import FallDetectionInput
from .fall_model import predict_fall

router = APIRouter()

@router.post("/predict")
def predict(data: FallDetectionInput):
    return predict_fall(data)
