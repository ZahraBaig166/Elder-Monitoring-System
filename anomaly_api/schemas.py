from pydantic import BaseModel
class Metrics(BaseModel):
    patient_id: int
    value: float
    steps: int
    calories: float
    distance: float
    sleep_stage: int


