import os
from fastapi import UploadFile
import tempfile
from speech_api.config import UPLOAD_FOLDER
from speech_api.utils.feature_utils import preprocess_audio, extract_acoustic_features, extract_linguistic_features_from_text
from speech_api.utils.cha_utils import generate_cha, parse_cha_file
from speech_api.services.whisper_service import transcribe_with_whisper
from speech_api.services.model_service import predict_label
from pydub import AudioSegment

from datetime import datetime

async def handle_audio_upload(audio: UploadFile, patient_id: int):
    print("[START] Audio upload received.")

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{audio.filename.split('.')[-1]}") as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name
        print(f"[INFO] Saved uploaded file to: {tmp_path}")

    # Convert to WAV
    wav_path = os.path.splitext(tmp_path)[0] + ".wav"
    print(f"[INFO] Converting to WAV: {wav_path}")
    AudioSegment.from_file(tmp_path).export(wav_path, format="wav")
    print("[SUCCESS] Converted to WAV.")

    # Transcription
    print("[INFO] Starting transcription with Whisper...")
    result = transcribe_with_whisper(wav_path)
    transcription = result.get("text", "").strip()
    print(f"[TRANSCRIBED] Text: {transcription}")

    if not transcription:
        raise ValueError("Transcription failed")

    # CHA generation
    print("[INFO] Generating .cha content...")
    cha_content = generate_cha(result.get("segments", []), wav_path)
    cha_path = os.path.splitext(wav_path)[0] + ".cha"
    with open(cha_path, "w", encoding="utf-8") as f:
        f.write(cha_content)
    print(f"[SUCCESS] Saved .cha file: {cha_path}")

    # Feature extraction
    print("[INFO] Extracting acoustic features...")
    y_audio, sr = preprocess_audio(wav_path)
    acoustic = extract_acoustic_features(y_audio, sr)
    print(f"[FEATURE] Acoustic shape: {len(acoustic)}")

    print("[INFO] Extracting linguistic features...")
    text = parse_cha_file(cha_path)
    linguistic = extract_linguistic_features_from_text(text)
    print(f"[FEATURE] Linguistic: {linguistic}")

    # Prediction
    print("[INFO] Predicting label...")
    prediction = predict_label(acoustic, linguistic)
    print(f"[RESULT] Prediction: {prediction}")


    print("[DONE] All steps completed successfully.\n")

    return {
        "prediction": prediction,
        "transcription": transcription
    }
