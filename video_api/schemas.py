from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActivityIn(BaseModel):
    patient_id: int  # Use this to associate activity with a patient
    patient_name: Optional[str] = None  # Optional, only if you still want to store/display it
    activity: str
    emotion: str
    video_frame_idx: int
    size: int
    duration: int
    timestamp: Optional[datetime] = None  # Optional: if you're allowing timestamp submission
