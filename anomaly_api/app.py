from fastapi import FastAPI
from backend.routes import health_api, video_api, anomaly_api

app = FastAPI()

# Mount APIs
app.include_router(anomaly_api.router, prefix="/api")  # ✅ This makes it live