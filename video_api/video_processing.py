def run_video_monitoring(video_path='video_api\data\Lab_Recording.mp4'):
    import cv2
    import numpy as np
    import joblib
    import time
    import torch
    import torch.nn as nn
    from deepface import DeepFace
    from keras_facenet import FaceNet
    from ultralytics import YOLO
    from mtcnn import MTCNN
    import mediapipe as mp
    from collections import defaultdict, deque
    import requests  # Ensure this is at the top of your file
    from datetime import datetime  # Also required if using timestamp

    

    DETECT_INTERVAL    = 10
    YOLO_CONF_THRESH   = 0.5
    TRACKER_TYPE       = "CSRT"
    EMOTION_INTERVAL   = 30.0
    RESIZE_FRAME       = True
    FRAME_WIDTH        = 640
    FRAME_HEIGHT       = 360
    ACTIVITY_CONFIDENCE_THRESHOLD = 0.90  
    ACTIVITY_INTERVAL = 30.0  
    MIN_STORE_DELAY = 30.0

    last_activity_update = defaultdict(lambda: 0.0)
    first_seen = {}
    pose_sequence = defaultdict(lambda: deque(maxlen=10))
    activity_state = defaultdict(lambda: "Loading...")

    # model    = joblib.load('models/face_recognition_model.pkl')
    
    # model    = joblib.load('')
    # encoder  = joblib.load('/models/label_encoder.pkl')
    # embedder = FaceNet()
    # face_detector = MTCNN()
    # yolo_person = YOLO('/models/yolov8n.pt')
    import os

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    yolo_model_path = os.path.join(BASE_DIR, 'models', 'yolov8n.pt')
    yolo_person = YOLO(yolo_model_path) 

#     BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# # Full paths to model files inside 'models' subdirectory
    face_model_path = os.path.join(BASE_DIR, 'models', 'face_recognition_model.pkl')
    
    label_encoder_path = os.path.join(BASE_DIR, 'models', 'label_encoder.pkl')
    # yolo_model_path = os.path.join(BASE_DIR, 'models', 'yolov8n.pt')
    activity_model_path = os.path.join(BASE_DIR, 'models', 'activity_lstm.pth')


# Load models
    model = joblib.load(face_model_path)
    encoder = joblib.load(label_encoder_path)
    # activity_model = joblib.load(activity_model_path)
    
    embedder = FaceNet()
    face_detector = MTCNN()
   

    class ActivityLSTM(nn.Module):
        def __init__(self, input_size=99, hidden_size=128, num_layers=2, num_classes=3):
            super(ActivityLSTM, self).__init__()
            self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
            self.fc = nn.Linear(hidden_size, num_classes)

        def forward(self, x):
            _, (hn, _) = self.lstm(x)
            return self.fc(hn[-1])

# Load activity model AFTER class is defined
    activity_model = ActivityLSTM()
    activity_model.load_state_dict(torch.load(activity_model_path, map_location=torch.device("cpu")))
    activity_model.eval()

    # Then initialize pose detector
    mp_pose = mp.solutions.pose
    pose_detector = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)

    CLASSES = ['Standing Still', 'Walking', 'Sitting']

    def create_tracker(name=TRACKER_TYPE):
        ctor = getattr(cv2, f"Tracker{name}_create", None)
        if ctor: return ctor()
        legacy = getattr(cv2, "legacy", None)
        ctor = getattr(legacy, f"Tracker{name}_create", None) if legacy else None
        if ctor: return ctor()
        raise RuntimeError(f"Tracker{name}_create not available")

    def recognize_face(face_img):
        face_resized = cv2.resize(face_img, (160, 160))
        emb = embedder.embeddings([face_resized])
        probs = model.predict_proba(emb)[0]
        idx = np.argmax(probs)
        return encoder.inverse_transform([idx])[0] if probs[idx] >= 0.8 else "Unknown"

    def get_face_emotion(face_img):
        try:
            res = DeepFace.analyze(face_img, actions=['emotion'], enforce_detection=False)
            return res[0]['dominant_emotion']
        except:
            return "Unknown"

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise IOError("Cannot open video")

    trackers = []
    recognized = set()
    frame_idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_idx += 1

        if RESIZE_FRAME:
            frame = cv2.resize(frame, (FRAME_WIDTH, FRAME_HEIGHT))
        display = frame.copy()

        if frame_idx % DETECT_INTERVAL == 0:
            results = yolo_person.predict(source=frame, conf=YOLO_CONF_THRESH, classes=[0], verbose=False)
            boxes = results[0].boxes.xyxy.cpu().numpy().astype(int)

            for x1, y1, x2, y2 in boxes:
                pw, ph = x2 - x1, y2 - y1
                crop = frame[y1:y1+ph, x1:x1+pw]
                if crop.size == 0:
                    continue
                rgb_crop = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
                dets = face_detector.detect_faces(rgb_crop)
                if not dets:
                    continue
                fx, fy, fw, fh = dets[0]['box']
                fx, fy = max(0, fx), max(0, fy)
                face = crop[fy:fy+fh, fx:fx+fw]
                if face.size == 0:
                    continue
                identity = recognize_face(face)
                if identity == "Unknown" or identity in recognized:
                    continue
                first_seen[identity] = time.time()
                emotion = get_face_emotion(face)
                now = time.time()
                fx_rel, fy_rel = fx / pw, fy / ph
                fw_rel, fh_rel = fw / pw, fh / ph
                tr = create_tracker()
                tr.init(frame, (x1, y1, pw, ph))
                trackers.append((tr, identity, emotion, now, fx_rel, fy_rel, fw_rel, fh_rel))
                recognized.add(identity)

        if frame_idx % (DETECT_INTERVAL * 3) == 0:
            results = yolo_person.predict(source=frame, conf=YOLO_CONF_THRESH, classes=[0], verbose=False)
            new_boxes = results[0].boxes.xyxy.cpu().numpy().astype(int)

            updated = []
            for tr, identity, emotion, last_t, fxr, fyr, fwr, fhr in trackers:
                ok, bbox = tr.update(frame)
                if not ok:
                    continue
                x, y, bw, bh = [int(v) for v in bbox]
                cx1, cy1 = x + bw // 2, y + bh // 2

                best_match = None
                min_dist = float('inf')
                for bx1, by1, bx2, by2 in new_boxes:
                    cx2, cy2 = (bx1 + bx2) // 2, (by1 + by2) // 2
                    dist = np.linalg.norm([cx1 - cx2, cy1 - cy2])
                    if dist < min_dist and dist < 100:
                        min_dist = dist
                        best_match = (bx1, by1, bx2 - bx1, by2 - by1)

                if best_match:
                    tr_new = create_tracker()
                    tr_new.init(frame, best_match)
                    updated.append((tr_new, identity, emotion, last_t, fxr, fyr, fwr, fhr))
                else:
                    updated.append((tr, identity, emotion, last_t, fxr, fyr, fwr, fhr))
            trackers = updated

        new_trackers = []
        for tr, identity, emotion, last_t, fxr, fyr, fwr, fhr in trackers:
            ok, bbox = tr.update(frame)
            if not ok:
                continue
            x, y, bw, bh = [int(v) for v in bbox]
            person_crop = frame[y:y+bh, x:x+bw]
            if person_crop.size != 0:
                person_rgb = cv2.cvtColor(person_crop, cv2.COLOR_BGR2RGB)
                resized = cv2.resize(person_rgb, (224, 224))
                results_mp = pose_detector.process(resized)
                if results_mp.pose_landmarks:
                    keypoints = []
                    for lm in results_mp.pose_landmarks.landmark:
                        keypoints.extend([lm.x, lm.y, lm.z])
                    pose_sequence[identity].append(keypoints)

            if len(pose_sequence[identity]) == 10:
                sequence_tensor = torch.tensor([list(pose_sequence[identity])], dtype=torch.float32)
                with torch.no_grad():
                    output = activity_model(sequence_tensor)
                    pred = torch.argmax(output, dim=1).item()
                    activity_state[identity] = CLASSES[pred]
                pose_sequence[identity].clear()

            activity = activity_state[identity]
            if time.time() - last_t >= EMOTION_INTERVAL:
                fx = int(fxr * bw)
                fy = int(fyr * bh)
                fw = int(fwr * bw)
                fh = int(fhr * bh)
                face_crop = frame[y + fy:y + fy + fh, x + fx:x + fx + fw]
                if face_crop.size != 0:
                    emotion = get_face_emotion(face_crop)
                last_t = time.time()

            cv2.rectangle(display, (x, y), (x + bw, y + bh), (0, 255, 0), 2)
            cv2.putText(display, f"{identity} | {emotion} | {activity}", (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 0), 2)

           # Hardcoded mapping from patient name to ID
            PATIENT_ID_MAP = {
                "Aliyan": 8877689391,
                "Ajlal": 5553957443,
                "Sayyan": 4020332650,
            }

            seen_for = time.time() - first_seen.get(identity, 0)

            if seen_for >= MIN_STORE_DELAY and activity != "Loading...":
                # Get the patient ID
                patient_id = PATIENT_ID_MAP.get(identity)
                if patient_id is None:
                    print(f"WARNING")
                else:
                    data = {
                        "patient_id": patient_id,  # <-- Add this
                        "patient_name": identity,
                        "activity": activity,
                        "emotion": emotion,
                        "video_frame_idx": frame_idx,
                        "size": bw * bh,
                        "duration": 0,
                        "timestamp": datetime.now().isoformat()  # Matches Pydantic datetime format
                    }

                try:
                    resp = requests.post("http://192.168.1.12:8001/video/log_activity", json=data)
                    resp.raise_for_status()  # Raise exception for HTTP error codes
                    # print("Activity logged:", resp.json())
                except requests.exceptions.HTTPError as http_err:
                    print("HTTP error:", resp.status_code, resp.text)
                except Exception as e:
                
                    print("POST error:", str(e))


            cv2.putText(display, f"Size: {bw*bh}", (x, y + bh + 20),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)

            new_trackers.append((tr, identity, emotion, last_t, fxr, fyr, fwr, fhr))
        trackers = new_trackers

        cv2.imshow("Face + Pose + Activity Tracking", display)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
