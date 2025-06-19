
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, X } from 'lucide-react';

const CameraView = ({ videoRef, canvasRef, onCapture, onClose, isCameraOpen }) => {
  useEffect(() => {
    if (isCameraOpen && videoRef.current && !videoRef.current.srcObject) {
      const startStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera from CameraView: ", err);
        }
      };
      startStream();
    }
  }, [isCameraOpen, videoRef]);

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }} 
      animate={{ opacity: isCameraOpen ? 1 : 0, height: isCameraOpen ? '240px' : 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="relative w-full bg-slate-800/80 rounded-t-2xl overflow-hidden"
      style={{ flexShrink: 0 }}
    >
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
      <canvas ref={canvasRef} className="hidden"></canvas>
      {isCameraOpen && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
          <Button onClick={onCapture} className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg">
            <Zap className="w-5 h-5 mr-1" /> Capturer
          </Button>
          <Button onClick={onClose} variant="destructive" className="p-3 rounded-full shadow-lg">
            <X className="w-5 h-5 mr-1" /> Fermer
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default CameraView;
