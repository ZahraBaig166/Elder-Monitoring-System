import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_FOLDER = BASE_DIR / "uploads"
MODEL_PATH = BASE_DIR / "models" / "xgb_model.pkl"
ENCODER_PATH = BASE_DIR / "models" / "label_encoder.pkl"
ALLOWED_EXTENSIONS = {"wav", "mp3", "m4a", "caf"}

os.environ["PATH"] += os.pathsep + r"C:\\Users\\HC\\Desktop\\ffmpeg-2025-06-23-git-e6298e0759-essentials_build\\bin"