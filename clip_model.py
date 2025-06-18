from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
from io import BytesIO
import torch

# Chargement du modèle et du processeur BLIP
caption_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
caption_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def describe_image_with_clip(image_bytes):
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    inputs = caption_processor(images=image, return_tensors="pt")

    # Assurez-vous que le modèle est exécuté sans GPU si non dispo
    with torch.no_grad():
        out = caption_model.generate(**inputs)

    caption = caption_processor.decode(out[0], skip_special_tokens=True)
    return caption
