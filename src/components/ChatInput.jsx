import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Image, Mic, Video } from 'lucide-react';

const ChatInput = ({
  inputText,
  setInputText,
  handleSendMessage,
  fileInputRef,
  handleImageUpload,
  toggleCamera,
  isCameraOpen,
  toggleListening,
  isListening,
  isTyping,
  selectedImage
}) => {

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-end space-x-3">
      <div className="flex-1">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tapez votre message ou utilisez les icônes..."
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows="1"
          style={{ minHeight: '48px', maxHeight: '120px' }}
        />
      </div>
      
      <div className="flex space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
         <Button
          onClick={toggleCamera}
          size="sm"
          variant="outline"
          className={`bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 w-12 p-0 ${isCameraOpen ? 'ring-2 ring-red-500' : ''}`}
        >
          <Video className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => fileInputRef.current?.click()}
          size="sm"
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 w-12 p-0"
        >
          <Image className="w-4 h-4" />
        </Button>
        <Button
          onClick={toggleListening}
          size="sm"
          variant="outline"
          className={`bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 w-12 p-0 ${isListening ? 'ring-2 ring-green-500 animate-pulse' : ''}`}
        >
          <Mic className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleSendMessage}
          disabled={(!inputText.trim() && !selectedImage) || isTyping}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white h-12 w-12 p-0 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;