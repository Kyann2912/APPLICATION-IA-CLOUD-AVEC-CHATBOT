import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useSpeechRecognition = (setInputText, onSpeechEndCallback) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'fr-FR';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        stopListening(); // Arrête l'écoute après avoir obtenu un résultat
        if (onSpeechEndCallback) {
          onSpeechEndCallback(transcript); // Appelle le callback avec le texte reconnu
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = "Un problème est survenu. Veuillez réessayer.";
        if (event.error === 'no-speech') {
            errorMessage = "Aucune parole détectée. Veuillez réessayer.";
        } else if (event.error === 'audio-capture') {
            errorMessage = "Problème de capture audio. Vérifiez votre microphone.";
        } else if (event.error === 'not-allowed') {
            errorMessage = "Accès au microphone refusé. Veuillez autoriser l'accès.";
        }
        toast({
          title: "Erreur de reconnaissance vocale",
          description: errorMessage,
          variant: "destructive"
        });
        stopListening();
      };

      recognitionRef.current.onend = () => {
        // Si isListening est toujours vrai, cela signifie que l'arrêt n'était pas manuel (par exemple, timeout)
        // ou que l'API s'est arrêtée d'elle-même.
        if (isListening) {
            stopListening(); // Assure que l'état est bien mis à jour.
        }
      };
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
    
    // Nettoyage au démontage
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.abort(); // Arrête toute reconnaissance en cours
        }
    };
  }, [setInputText, onSpeechEndCallback]); // isListening n'est plus une dépendance ici

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast({ title: "🎙️ Je vous écoute...", description: "Parlez maintenant." });
      } catch (error) {
        // Gère les erreurs si start() est appelé alors que la reconnaissance est déjà active (rare avec la logique actuelle)
        console.error("Error starting speech recognition:", error);
        toast({ title: "Erreur micro", description: "Impossible de démarrer la reconnaissance vocale.", variant: "destructive" });
        setIsListening(false); 
      }
    } else if (!recognitionRef.current) {
         toast({ title: "🎤 Non supporté", description: "La reconnaissance vocale n'est pas supportée par votre navigateur." });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) { // Vérifie si isListening est vrai avant d'arrêter
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return {
    isListening,
    startListening,
    stopListening,
    toggleListening
  };
};