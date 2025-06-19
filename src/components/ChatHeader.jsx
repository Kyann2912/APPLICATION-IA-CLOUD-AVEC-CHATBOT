import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const ChatHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-4 border border-white/20"
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">ChatBot IA Multimodal</h1>
          <p className="text-purple-200">Assistant intelligent avec analyse d'images et vocale</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatHeader;