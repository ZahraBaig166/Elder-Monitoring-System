from fastapi import FastAPI
from contextlib import asynccontextmanager
from fall_api.routes import router as fall_router
from video_api.routes import router as video_router
from video_api.video_processing import run_video_monitoring
from anomaly_api.routes import router as  anomaly_router
import threading

# Lifespan handler to run video monitoring on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    thread = threading.Thread(target=run_video_monitoring, daemon=True)
    thread.start()
    print("Background video monitoring thread started.")
    yield  # Control is handed to FastAPI to start handling requests
    print("App shutdown (if needed, add cleanup logic here)")

app = FastAPI(lifespan=lifespan)

# Routers
app.include_router(fall_router, prefix="/fall", tags=["Fall Detection"])
app.include_router(video_router, prefix="/video", tags=["Video Monitoring"])
app.include_router(anomaly_router, prefix="/anomaly", tags=["Anomaly Detection"])   
