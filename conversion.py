import base64

with open("C:/Users/kouakou/Downloads/A1.png", "rb") as image_file:
    encoded = base64.b64encode(image_file.read()).decode("utf-8")
    print(encoded)
