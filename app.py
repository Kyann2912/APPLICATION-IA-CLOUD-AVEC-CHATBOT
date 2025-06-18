import os
import base64
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from clip_model import describe_image_with_clip
from detection import detect_objects_and_faces  # ✅ détection visages + objets

load_dotenv()

app = Flask(__name__)

# Chargement embeddings + index FAISS
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
db_faiss = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question", "")
    image_b64 = data.get("image_base64")

    prompt_parts = []

    # Si image fournie
    if image_b64:
        image_bytes = base64.b64decode(image_b64)

        # 🖼 Description image avec CLIP
        description = describe_image_with_clip(image_bytes)
        prompt_parts.append(f"Image description: {description}")

        # 🧠 Détection d’objets et visages
        detection_result = detect_objects_and_faces(image_bytes)
        prompt_parts.append(f"Analyse image : {detection_result}")

    if question:
        prompt_parts.append(f"Question: {question}")

    # Construction du prompt global
    prompt = ". ".join(prompt_parts)

    # 🔍 Recherche sémantique avec FAISS
    docs = db_faiss.similarity_search(prompt, k=1)
    answers = [doc.page_content for doc in docs]

    return jsonify({
        "query": prompt,
        "answers": answers
    })

# Nouvelle route uniquement pour analyse image
@app.route("/analyze", methods=["POST"])
def analyze_image():
    data = request.json
    image_b64 = data.get("image_base64")

    if not image_b64:
        return jsonify({"error": "Aucune image reçue."}), 400

    image_bytes = base64.b64decode(image_b64)
    result = detect_objects_and_faces(image_bytes)

    return jsonify({"resultat": result})

from flask_cors import CORS
CORS(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
