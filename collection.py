from pymongo import MongoClient

# Connexion à MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["chatbot"]
kb = db["knowledge_base"]

# Données à insérer
documents = [
    {
        "question": "Qu'est-ce que la virtualisation ?",
        "answer": "La virtualisation est une technologie qui permet de créer plusieurs environnements simulés ou ressources dédiées à partir d’un seul système matériel physique."
    },
    {
        "question": "Quels sont les avantages de la virtualisation ?",
        "answer": "Les avantages incluent une meilleure utilisation des ressources, une réduction des coûts matériels, une gestion centralisée et une plus grande flexibilité."
    },
    {
        "question": "Qu'est-ce qu'un hyperviseur ?",
        "answer": "Un hyperviseur est un logiciel qui permet de faire fonctionner plusieurs systèmes d'exploitation sur une seule machine physique en isolant chaque machine virtuelle."
    },
    {
        "question": "Quels sont les types d'hyperviseurs ?",
        "answer": "Il existe deux types : les hyperviseurs de type 1 (bare metal), qui s'exécutent directement sur le matériel, et ceux de type 2 (hosted), qui s'exécutent au-dessus d’un système d’exploitation."
    },
    {
        "question": "Quelle est la différence entre la virtualisation et le cloud computing ?",
        "answer": "La virtualisation est une technologie, tandis que le cloud computing est un modèle de service basé sur cette technologie pour fournir des ressources à la demande."
    },
    {
        "question": "Comment fonctionne VMware ?",
        "answer": "VMware est une plateforme de virtualisation qui utilise des hyperviseurs pour créer et gérer des machines virtuelles sur des serveurs physiques."
    },
    {
        "question": "Qu'est-ce qu'une machine virtuelle (VM) ?",
        "answer": "Une machine virtuelle est une simulation logicielle d’un ordinateur physique, capable d'exécuter un système d’exploitation et des applications comme un PC réel."
    }
]

# Insertion dans la collection
result = kb.insert_many(documents)
print(f"{len(result.inserted_ids)} documents insérés avec succès dans 'knowledge_base'.")
