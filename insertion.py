from pymongo import MongoClient

# Connexion à MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["chatbot"]
salutations = db["knowledge_base"]

# Données à insérer
messages = [
    {"question": "Bonjour", "answer": "Bonjour ! Comment puis-je vous aider aujourd’hui ?"},
    {"question": "Bonsoir", "answer": "Bonsoir ! Je suis à votre service."},
    {"question": "Salut", "answer": "Salut ! Ravi de vous voir ici."},
    {"question": "Coucou", "answer": "Coucou ! Que puis-je faire pour vous ?"},
    {"question": "Bonne nuit", "answer": "Bonne nuit ! Faites de beaux rêves."},
    {"question": "Merci", "answer": "Avec plaisir !"},
    {"question": "Merci beaucoup", "answer": "Je vous en prie, c’est un plaisir !"},
    {"question": "À plus", "answer": "À bientôt ! Prenez soin de vous."},
    {"question": "À bientôt", "answer": "À très vite !"},
    {"question": "Présente toi", "answer": "Je suis un assistant virtuel conçu pour vous aider."},
    {"question": "Qui es-tu ?", "answer": "Je suis un chatbot intelligent, prêt à vous assister."},
    {"question": "Tu fais quoi ?", "answer": "Je réponds à vos questions et vous accompagne."},
    {"question": "Comment tu vas ?", "answer": "Je vais très bien, merci ! Et vous ?"},
    {"question": "Ça va ?", "answer": "Oui, ça va très bien. Et vous ?"},
    {"question": "Enchanté", "answer": "Le plaisir est pour moi !"},
    {"question": "Je suis fatigué", "answer": "Prenez un peu de repos, c’est important."},
    {"question": "Bonne journée", "answer": "Merci ! Excellente journée à vous aussi."},
    {"question": "Bonne soirée", "answer": "Bonne soirée ! Reposez-vous bien."},
    {"question": "Quel âge as-tu ?", "answer": "Je n’ai pas d’âge, je suis un programme informatique."},
    {"question": "Tu parles français ?", "answer": "Oui, je parle français couramment !"},
    {"question": "Tu es réel ?", "answer": "Je suis virtuel, mais bien réel dans mon monde numérique."},
    {"question": "T'es là ?", "answer": "Oui, je suis toujours là pour vous !"},
    {"question": "T'es intelligent ?", "answer": "J’apprends chaque jour pour mieux vous aider !"},
    {"question": "Ok", "answer": "Parfait !"},
    {"question": "D'accord", "answer": "Très bien, allons-y !"}
]

# Insertion dans la collection
result = salutations.insert_many(messages)
print(f"{len(result.inserted_ids)} messages insérés avec succès dans 'salutations_base'.")
