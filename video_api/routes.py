from fastapi import APIRouter, HTTPException
from .database import SessionLocal
from .models import PatientActivity
from .schemas import ActivityIn

router = APIRouter()

@router.post("/log_activity")
async def log_activity(rec: ActivityIn):
    db = SessionLocal()
    try:
        entry = PatientActivity(**rec.model_dump())
        db.add(entry)
        db.commit()
        return {"message": "Activity logged successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()

@router.get("/activities/{patient_name}")
def get_activities(patient_name: str):
    db = SessionLocal()
    try:
        rows = db.query(PatientActivity).filter(PatientActivity.patient_name == patient_name).order_by(PatientActivity.timestamp.desc()).all()
        return rows
    finally:
        db.close()