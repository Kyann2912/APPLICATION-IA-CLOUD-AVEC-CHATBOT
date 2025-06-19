import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Eye, ScanFace } from 'lucide-react';

const ImagePreviewArea = ({ imagePreview, isCameraOpen, removeImage, onAnalyzeImageOnly, onDetectFaces }) => {
  return (
    <AnimatePresence>
      {imagePreview && !isCameraOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 relative"
        >
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Aperçu" 
              className="max-h-32 rounded-lg border border-white/20"
            />
            <Button
              onClick={removeImage}
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex space-x-2 mt-2">
            <Button onClick={onAnalyzeImageOnly} size="sm" className="bg-purple-500 hover:bg-purple-600 text-xs">
              <Eye className="w-3 h-3 mr-1" /> Analyser Image
            </Button>
             <Button onClick={onDetectFaces} size="sm" className="bg-pink-500 hover:bg-pink-600 text-xs">
              <ScanFace className="w-3 h-3 mr-1" /> Détecter Visages
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImagePreviewArea;