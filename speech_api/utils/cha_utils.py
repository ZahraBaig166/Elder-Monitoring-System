import os
import spacy

nlp = spacy.load("en_core_web_sm")

def generate_cha(segments, wav_path, speaker="PAR"):
    media_name = os.path.splitext(os.path.basename(wav_path))[0]
    lines = [
        "@UTF8", "@Begin", "@Languages:\teng",
        "@Participants:\tPAR Participant, INV Investigator",
        "@ID:\teng|Pitt|PAR|55;|female|||Participant||",
        "@ID:\teng|Pitt|INV|||||Investigator||",
        f"@Media:\t{media_name}, audio"
    ]
    for seg in segments:
        utt = seg['text'].strip()
        if not utt:
            continue
        start, end = int(seg['start'] * 1000), int(seg['end'] * 1000)
        doc = nlp(utt)
        mor = ' '.join([f"{t.pos_.lower()}|{t.text}" for t in doc if t.text.strip()])
        token_indices = {token: idx for idx, token in enumerate(doc)}
        gra = ' '.join([
            f"{i+1}|{(token_indices[t.head]+1 if t.head != t else 0)}|{t.dep_.upper()}"
            for i, t in enumerate(doc)
        ])
        lines.append(f"*{speaker}: {utt} \u0015{start}_{end}\u0015")
        lines.append(f"%mor:\t{mor}")
        lines.append(f"%gra:\t{gra}")
    lines.append("@End")
    return '\\n'.join(lines)

def parse_cha_file(cha_path):
    with open(cha_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    return ' '.join([line.split(':', 1)[1].strip() for line in lines if line.startswith('*PAR:')])
