
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useCameraLogic = (setImagePreview, setSelectedImage) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // Pour garder une référence au stream

  const startCamera = async () => {
    if (streamRef.current) { // Si un stream existe déjà, l'arrêter d'abord
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream; // Stocker le nouveau stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // S'assurer que la vidéo joue après avoir défini la source
        videoRef.current.play().catch(e => console.error("Video play error:", e));
      }
      setIsCameraOpen(true);
      toast({ title: "📷 Caméra activée", description: "Prêt à capturer une image." });
    } catch (err) {
      console.error("Error accessing camera: ", err);
      toast({ title: "Erreur Caméra", description: "Impossible d'accéder à la caméra. Vérifiez les permissions.", variant: "destructive" });
      setIsCameraOpen(false); // S'assurer que l'état est correct en cas d'erreur
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null; // Réinitialiser la référence du stream
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const toggleCamera = () => {
    if (isCameraOpen) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && isCameraOpen && videoRef.current.readyState >= 2) { // readyState >= 2 (HAVE_CURRENT_DATA)
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // S'assurer que videoWidth et videoHeight sont disponibles
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        toast({ title: "Erreur de capture", description: "Les dimensions de la vidéo ne sont pas encore disponibles.", variant: "destructive"});
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      
      setImagePreview(dataUrl);

      canvas.toBlob(blob => {
        if (blob) {
            setSelectedImage(new File([blob], "capture.png", { type: "image/png" }));
        }
      }, 'image/png');
      
      stopCamera(); 
    } else {
        toast({ title: "Caméra non prête", description: "Veuillez patienter que la vidéo se charge ou activer la caméra.", variant: "destructive"});
    }
  };
  
  useEffect(() => {
    // Nettoyage lors du démontage du composant
    return () => {
        stopCamera();
    };
  }, []);


  return {
    isCameraOpen,
    videoRef,
    canvasRef,
    toggleCamera,
    startCamera, // Exposer pour une utilisation potentielle directe
    stopCamera,
    captureImage
  };
};
