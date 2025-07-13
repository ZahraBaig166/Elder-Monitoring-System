import librosa
import numpy as np
import spacy

nlp = spacy.load("en_core_web_sm")

def preprocess_audio(file_path, sr=16000, duration=4.0):
    y, _ = librosa.load(file_path, sr=sr, mono=True)
    target_length = int(sr * duration)
    return y[:target_length] if len(y) > target_length else np.pad(y, (0, target_length - len(y))), sr

def extract_acoustic_features(y, sr):
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfccs_mean, mfccs_std = np.mean(mfccs, axis=1), np.std(mfccs, axis=1)
    chroma = np.mean(librosa.feature.chroma_stft(y=y, sr=sr), axis=1)
    zcr = np.mean(librosa.feature.zero_crossing_rate(y))
    spec_cent = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
    return np.hstack([mfccs_mean, mfccs_std, chroma, zcr, spec_cent])

def extract_linguistic_features_from_text(text):
    doc = nlp(text)
    num_tokens = len(doc)
    num_sents = len(list(doc.sents))
    num_nouns = len([t for t in doc if t.pos_ == "NOUN"])
    num_verbs = len([t for t in doc if t.pos_ == "VERB"])
    num_adjs = len([t for t in doc if t.pos_ == "ADJ"])
    avg_sentence_length = num_tokens / num_sents if num_sents else 0
    ttr = len(set([t.text.lower() for t in doc if t.is_alpha])) / num_tokens if num_tokens else 0
    return [num_tokens, num_sents, avg_sentence_length, num_nouns, num_verbs, num_adjs, ttr]
