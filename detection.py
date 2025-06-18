import cv2
import numpy as np
from PIL import Image
from io import BytesIO

def detect_objects_and_faces(image_bytes):
    # Chargement de l'image
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    image_np = np.array(image)
    gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)

    # Détection de visages
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    # Résumé du résultat
    result = []
    if len(faces) > 0:
        result.append(f"Humain : {len(faces)} visage(s) détecté(s)")

    # Tu peux ajouter ici d'autres détecteurs OpenCV (yeux, corps, etc.)
    if not result:
        result.append("Aucun visage détecté.")

    return " | ".join(result)
