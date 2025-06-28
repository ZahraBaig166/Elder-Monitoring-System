from sqlalchemy import Column, Integer, BigInteger, String, TIMESTAMP, ForeignKey
from .database import Base
import datetime

class Patient(Base):
    __tablename__ = 'patients'
    
    patient_id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255))
    age = Column(Integer)
    medical_conditions = Column(String)  # or Text if you want to import Text
    status = Column(String)  # You can map the ENUM manually if needed
    emergency_contact = Column(String(255))
    assigned_caregiver_id = Column(Integer)


class PatientActivity(Base):
    __tablename__ = 'patient_activities'

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(BigInteger, ForeignKey('patients.patient_id', ondelete='CASCADE'))
    patient_name = Column(String(100))  # Optional, if you're storing it redundantly
    timestamp = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    activity = Column(String(50))
    emotion = Column(String(50))
    video_frame_idx = Column(Integer)
    size = Column(Integer)
    duration = Column(Integer)
