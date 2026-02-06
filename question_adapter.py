import hashlib

def apply_question(poles, question: str):
    h = int(hashlib.sha256(question.encode()).hexdigest(), 16)

    for i, p in enumerate(poles):
        v = ((h >> (i * 8)) & 0xFF) / 255.0
        p["T"] = min(1.0, p["T"] + 0.25 * v)
        p["E"] = min(1.0, p["E"] + 0.15 * (1 - v))
