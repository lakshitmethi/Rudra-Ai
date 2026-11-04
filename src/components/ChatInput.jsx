import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Square, 
  Mic, 
  MicOff, 
  Paperclip, 
  Globe, 
  Sparkles, 
  Code,
  Image as ImageIcon
} from 'lucide-react';

export default function ChatInput({
  onSendMessage,
  isLoading,
  onStopGeneration
}) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!input.trim() && !webSearchEnabled) || isLoading) return;
    const finalPrompt = webSearchEnabled ? `[Search the web]: ${input.trim()}` : input.trim();
    onSendMessage(finalPrompt);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 pt-2">
      {/* Input Pill Container */}
      <div className="relative bg-[#1e1f20] border border-[#333537] rounded-[28px] p-2.5 sm:p-3 shadow-xl gemini-pill-glow transition duration-200">
        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask Rudra AI to code, build websites, or solve complex logic..."
          className="w-full bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none px-3 py-1.5 max-h-44 leading-relaxed"
        />

        {/* Bottom Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2b2d30] mt-1 px-1">
          {/* Left Action Buttons */}
          <div className="flex items-center space-x-1.5">
            {/* Web Search Toggle */}
            <button
              type="button"
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs transition border ${
                webSearchEnabled
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                  : 'text-zinc-400 border-transparent hover:bg-[#282a2c] hover:text-zinc-200'
              }`}
              title="Toggle Live Web Grounding"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Web Search</span>
            </button>

            {/* Quick App Shortcut */}
            <button
              type="button"
              onClick={() => setInput('Build an interactive modern web app with ')}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs text-zinc-400 hover:text-zinc-200 hover:bg-[#282a2c] transition"
              title="Preset web app starter"
            >
              <Code className="w-3.5 h-3.5 text-purple-400" />
              <span>Build App</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-1.5">
            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-full transition ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#282a2c]'
              }`}
              title={isListening ? 'Stop recording voice' : 'Voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send / Stop Button */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="p-2 rounded-full bg-[#34373a] hover:bg-[#43464a] text-zinc-100 transition shadow-md"
                title="Stop generation"
              >
                <Square className="w-4 h-4 fill-current text-purple-400" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 hover:opacity-90 disabled:opacity-30 disabled:hover:opacity-30 text-white transition shadow-md shadow-purple-500/20"
                title="Send to Rudra AI"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gemini Style Disclaimer */}
      <p className="text-center text-[11px] text-zinc-400 mt-2 select-none">
        Rudra AI 2.5 can generate full web apps & code. Always test live applications in the sandbox before deployment.
      </p>
    </div>
  );
}
