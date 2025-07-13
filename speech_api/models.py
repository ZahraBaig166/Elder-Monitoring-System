from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, BigInteger
from datetime import datetime
from speech_api.database import Base

class DementiaDetection(Base):
    __tablename__ = "dementia_detections"

    id = Column(BigInteger, primary_key=True, index=True)
    patient_id = Column(Integer, nullable=False)
    prediction = Column(String, nullable=False)
    test_date = Column(DateTime, default=datetime.utcnow)
