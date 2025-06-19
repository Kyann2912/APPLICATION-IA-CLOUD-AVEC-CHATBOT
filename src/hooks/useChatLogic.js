
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

const FLASK_API_URL = 'http://localhost:5000/api';

export const useChatLogic = (
  messages, 
  setMessages, 
  inputText, 
  setInputText, 
  selectedImage, 
  setSelectedImage, 
  imagePreview, 
  setImagePreview,
  removeImageCallback,
  botName = 'Bot', // Nom par défaut si non fourni
  userName = 'Utilisateur' // Nom par défaut si non fourni
) => {
  const [isTyping, setIsTyping] = useState(false);

  const simulateTyping = (duration = 1500 + Math.random() * 1000) => {
    setIsTyping(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false);
        resolve();
      }, duration);
    });
  };

  const callFlaskAPI = async (endpoint, data, isFormData = false) => {
    try {
      const headers = {};
      let body;

      if (isFormData) {
        body = data;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
      }

      const response = await fetch(`${FLASK_API_URL}/${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Erreur de l'API inconnue" }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error calling Flask API endpoint ${endpoint}:`, error);
      toast({
        title: `Erreur API (${endpoint})`,
        description: error.message || "Impossible de contacter le serveur Flask. Vérifiez qu'il est bien lancé.",
        variant: "destructive"
      });
      return { error: error.message || "Erreur de communication avec l'API Flask." };
    }
  };

  const generateBotResponse = async (userMessageContent, hasImage, action = "chat") => {
    const placeholders = {
        analyze_image_only: "🚧 L'analyse d'image via API Flask sera bientôt disponible ! 🚀",
        detect_faces: "🚧 La détection de visages via API Flask arrive prochainement ! 🚀",
        chat_multimodal: "🚧 Le chat multimodal avec API Flask est en cours de finalisation ! 🚀",
        chat: "🚧 Le chat textuel avec API Flask sera bientôt opérationnel ! 🚀"
    };
    
    const finalAction = (action === "analyze_image_only" && hasImage) ? "analyze_image_only" : 
                       (action === "detect_faces" && hasImage) ? "detect_faces" :
                       (hasImage) ? "chat_multimodal" : "chat";
    return placeholders[finalAction] || "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀";
  };

  const handleSendMessage = async (textOverride = null, action = "chat") => {
    const currentInputText = textOverride !== null ? textOverride : inputText.trim();
    if (!currentInputText && !selectedImage && action === "chat") return;
    if (!selectedImage && (action === "analyze_image_only" || action === "detect_faces")) {
        toast({ title: "Aucune image sélectionnée", description: "Veuillez sélectionner ou capturer une image.", variant: "destructive" });
        return;
    }

    const newMessage = {
      id: Date.now(),
      type: 'user',
      sender: userName,
      content: currentInputText,
      image: imagePreview, 
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    if (textOverride === null) setInputText('');
    
    const hasImage = !!selectedImage;
    
    if (action !== "analyze_image_only" && action !== "detect_faces") {
        if (removeImageCallback) removeImageCallback();
    }

    await simulateTyping();

    const botResponseContent = await generateBotResponse(currentInputText, hasImage, action);
    
    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      sender: botName,
      content: botResponseContent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botResponse]);
    
    if (action === "analyze_image_only" || action === "detect_faces") {
        if (removeImageCallback) removeImageCallback();
    }
  };

  return {
    isTyping,
    handleSendMessage,
    generateBotResponse,
    simulateTyping,
    callFlaskAPI
  };
};
