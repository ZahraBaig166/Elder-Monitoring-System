import whisper

# Load the model once at module level
print("[INFO] Loading Whisper model...")
model = whisper.load_model("base")
print("[INFO] Whisper model loaded.")

def transcribe_with_whisper(file_path: str) -> dict:
    print(f"[INFO] Transcribing audio file: {file_path}")
    result = model.transcribe(file_path, word_timestamps=True)
    return result
