from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from datetime import datetime
from speech_api.services.audio_service import handle_audio_upload
from speech_api.database import SessionLocal
from speech_api.models import DementiaDetection

router = APIRouter()

@router.post("/upload")
async def upload_audio(audio: UploadFile = File(...), patient_id: int = Form(...)):
    print("Received audio upload request")    
    try:
        result = await handle_audio_upload(audio, patient_id)
        prediction = result["prediction"]

        # Save to DB here
        db = None
        db = SessionLocal()
        detection = DementiaDetection(
            patient_id=patient_id,
            prediction=prediction,
            test_date=datetime.utcnow()
        )
        db.add(detection)
        db.commit()
        db.refresh(detection)

        return {
            "message": "Upload and prediction successful",
            "prediction": prediction,
            "transcription": result["transcription"],
            "detection_id": detection.id
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
