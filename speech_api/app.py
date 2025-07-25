from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from speech_api.routes import audio_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audio_routes.router)
