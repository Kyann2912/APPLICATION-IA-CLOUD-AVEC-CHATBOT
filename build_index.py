import os
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document

load_dotenv()

def build_index_from_mongo():
    client = MongoClient(os.getenv("MONGODB_URI"))
    db = client["chatbot"]
    kb = db["knowledge_base"]

    documents = []
    for item in kb.find():
        question = item.get("question", "").strip()
        answer = item.get("answer", "").strip()
        if question and answer:
            content = f"Q: {question}\nA: {answer}"
            documents.append(Document(page_content=content))

    total = len(documents)
    print(f" Nombre de documents récupérés : {total}")

    if total == 0:
        print(" Aucun document valide trouvé. Vérifie ta base de données.")
        return

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    db_faiss = FAISS.from_documents(documents, embeddings)
    db_faiss.save_local("faiss_index")

    print(" Index FAISS créé et sauvegardé dans le dossier 'faiss_index'.")

if __name__ == "__main__":
    build_index_from_mongo()
