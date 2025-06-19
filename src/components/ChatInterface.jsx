
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Sparkles, Brain, Video, Mic } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import MessageList from '@/components/MessageList';
import ChatInput from '@/components/ChatInput';
import CameraView from '@/components/CameraView';
import ImagePreviewArea from '@/components/ImagePreviewArea';
import ChatHeader from '@/components/ChatHeader';
import { useChatLogic } from '@/hooks/useChatLogic';
import { useCameraLogic } from '@/hooks/useCameraLogic';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      sender: 'Fatou',
      content: "Salut ! 👋 Je suis Fatou, votre assistant IA multimodal. Utilisez la caméra, uploadez une image ou posez-moi une question !",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { 
    isCameraOpen, 
    videoRef, 
    canvasRef, 
    toggleCamera, 
    stopCamera, 
    captureImage: captureAndSetImage 
  } = useCameraLogic(setImagePreview, setSelectedImage);

  const { 
    isListening, 
    toggleListening 
  } = useSpeechRecognition(setInputText, (text) => handleSendMessage(text));

  const { 
    isTyping, 
    handleSendMessage,
  } = useChatLogic(
    messages, 
    setMessages, 
    inputText, 
    setInputText, 
    selectedImage, 
    setSelectedImage, 
    imagePreview, 
    setImagePreview, 
    removeImage,
    'Fatou', // Nom du bot
    'Humain' // Nom de l'utilisateur
  );


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function removeImage() {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "Veuillez sélectionner une image de moins de 10MB.",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(file);
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptureImage = () => {
    captureAndSetImage(); // Ceci mettra à jour selectedImage et imagePreview via useCameraLogic
    toast({ title: "📸 Image capturée!", description: "L'image est prête à être envoyée." });
  };
  
  const handleAnalyzeImageOnly = () => {
    if (!selectedImage) {
        toast({ title: "Aucune image", description: "Veuillez uploader ou capturer une image d'abord.", variant: "destructive" });
        return;
    }
    handleSendMessage("Analyse cette image.", "analyze_image_only");
  };
  
  const handleDetectFaces = () => {
     if (!selectedImage) {
        toast({ title: "Aucune image", description: "Veuillez uploader ou capturer une image d'abord.", variant: "destructive" });
        return;
    }
    handleSendMessage("Détecte les visages sur cette image.", "detect_faces");
  };


  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <ChatHeader />

      <div className="flex-1 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden relative flex flex-col">
        <CameraView 
            videoRef={videoRef} 
            canvasRef={canvasRef} 
            onCapture={handleCaptureImage} 
            onClose={stopCamera} 
            isCameraOpen={isCameraOpen}
        />
        <MessageList 
          messages={messages} 
          isTyping={isTyping} 
          messagesEndRef={messagesEndRef} 
          isCameraOpen={isCameraOpen}
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4"
      >
        <ImagePreviewArea 
          imagePreview={imagePreview}
          isCameraOpen={isCameraOpen}
          removeImage={removeImage}
          onAnalyzeImageOnly={handleAnalyzeImageOnly}
          onDetectFaces={handleDetectFaces}
        />
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          handleSendMessage={() => handleSendMessage()}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          toggleCamera={toggleCamera}
          isCameraOpen={isCameraOpen}
          toggleListening={toggleListening}
          isListening={isListening}
          isTyping={isTyping}
          selectedImage={selectedImage}
        />
         <div className="mt-3 flex flex-wrap gap-2">
          <div className="flex items-center space-x-1 bg-purple-500/20 px-2 py-1 rounded-full text-xs text-purple-200">
            <Eye className="w-3 h-3" />
            <span>Analyse d'images</span>
          </div>
          <div className="flex items-center space-x-1 bg-cyan-500/20 px-2 py-1 rounded-full text-xs text-cyan-200">
            <Sparkles className="w-3 h-3" />
            <span>IA Conversationnelle</span>
          </div>
          <div className="flex items-center space-x-1 bg-pink-500/20 px-2 py-1 rounded-full text-xs text-pink-200">
            <Brain className="w-3 h-3" />
            <span>Multimodal</span>
          </div>
           <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full text-xs text-green-200">
            <Video className="w-3 h-3" />
            <span>Caméra</span>
          </div>
           <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-full text-xs text-yellow-200">
            <Mic className="w-3 h-3" />
            <span>Vocal</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatInterface;
