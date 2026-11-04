import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  Code2, 
  Volume2, 
  VolumeX, 
  BrainCircuit, 
  ChevronDown, 
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Extract HTML code block if present
export function extractHtmlCode(text = '') {
  const match = text.match(/```html([\s\S]*?)```/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  // Also check if text starts with <!DOCTYPE html> or <html>
  if (text.includes('<!DOCTYPE html>') || (text.includes('<html') && text.includes('</html>'))) {
    return text.trim();
  }
  return null;
}

export default function ChatArea({
  messages,
  isLoading,
  streamingMessage,
  onOpenCanvasWithCode,
  onRetry
}) {
  const messagesEndRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [openThinkingMap, setOpenThinkingMap] = useState({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const toggleThinking = (id) => {
    setOpenThinkingMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text, id) => {
    if (!('speechSynthesis' in window)) {
      alert('Text to speech is not supported in this browser.');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner voice
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted for speech.')
      .replace(/[#*_`]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Render text with code block parsing
  const renderMessageContent = (text, msgId) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const firstLineBreak = part.indexOf('\n');
        const lang = part.slice(3, firstLineBreak).trim() || 'code';
        const codeContent = part.slice(firstLineBreak + 1, -3);
        const isHtmlApp = lang.toLowerCase() === 'html' || codeContent.includes('<!DOCTYPE html>') || codeContent.includes('<script>');

        return (
          <div key={index} className="my-4 rounded-2xl overflow-hidden border border-[#333537] bg-[#101114] shadow-lg">
            {/* Code Block Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1b1c20] border-b border-[#2d2f33] text-xs">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-zinc-300 uppercase tracking-wider">{lang}</span>
              </div>
              <div className="flex items-center space-x-2">
                {isHtmlApp && (
                  <button
                    onClick={() => {
                      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
                      onOpenCanvasWithCode(codeContent, 'Generated Web Application');
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white font-semibold transition shadow-md shadow-purple-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Web App</span>
                  </button>
                )}
                <button
                  onClick={() => handleCopy(codeContent, `${msgId}-${index}`)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#282a2c] hover:bg-[#35383c] text-zinc-300 transition"
                  title="Copy code"
                >
                  {copiedId === `${msgId}-${index}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Body */}
            <pre className="p-4 text-xs font-mono overflow-x-auto text-zinc-200 leading-relaxed max-h-96">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Format markdown styling roughly (bold, lists, headings)
      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed text-[15px] text-zinc-200">
          {part}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full space-y-6">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        const htmlCode = !isUser ? extractHtmlCode(msg.content) : null;

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full`}
          >
            {/* User Message */}
            {isUser ? (
              <div className="flex items-start justify-end space-x-3 max-w-[85%]">
                <div className="bg-[#282a2c] text-zinc-100 px-4 py-2.5 rounded-[22px] rounded-tr-sm text-sm sm:text-[15px] leading-relaxed shadow-sm">
                  {msg.content}
                </div>
              </div>
            ) : (
              /* Rudra AI Message */
              <div className="flex items-start space-x-3.5 w-full">
                {/* AI Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-0.5 shrink-0 shadow-md">
                  <div className="w-full h-full bg-[#131314] rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name Header & Model Tag */}
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="text-xs font-bold text-zinc-200">Rudra AI</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#282a2c] text-purple-300 font-medium border border-[#37393b]">
                      {msg.model || 'Rudra 2.5'}
                    </span>
                  </div>

                  {/* Thinking Process Dropdown (if present) */}
                  {msg.thinking && (
                    <div className="mb-3 rounded-xl border border-purple-500/20 bg-purple-950/10 overflow-hidden">
                      <button
                        onClick={() => toggleThinking(msg.id)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-purple-300 font-medium hover:bg-purple-500/10 transition"
                      >
                        <div className="flex items-center space-x-2">
                          <BrainCircuit className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                          <span>Thinking Process</span>
                          <span className="text-[10px] text-zinc-500">(Analyzed multi-step parameters)</span>
                        </div>
                        {openThinkingMap[msg.id] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>

                      {openThinkingMap[msg.id] && (
                        <div className="p-3 bg-[#111216] border-t border-purple-500/20 text-xs font-mono text-zinc-400 whitespace-pre-wrap leading-relaxed">
                          {msg.thinking}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="text-zinc-200">
                    {renderMessageContent(msg.content, msg.id)}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex items-center space-x-2 mt-3 pt-2 text-zinc-400 text-xs">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="p-1.5 rounded-lg hover:bg-[#282a2c] hover:text-white transition"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleSpeak(msg.content, msg.id)}
                      className={`p-1.5 rounded-lg hover:bg-[#282a2c] transition ${
                        speakingId === msg.id ? 'text-purple-400 bg-purple-500/20' : 'hover:text-white'
                      }`}
                      title={speakingId === msg.id ? 'Stop audio' : 'Listen to response'}
                    >
                      {speakingId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {htmlCode && (
                      <button
                        onClick={() => {
                          confetti({ particleCount: 30, spread: 60 });
                          onOpenCanvasWithCode(htmlCode, 'Web App Canvas');
                        }}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition font-medium"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Interactive Canvas</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Streaming Message Indicator */}
      {streamingMessage && (
        <div className="flex items-start space-x-3.5 w-full animate-in fade-in">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-0.5 shrink-0 shadow-md animate-pulse">
            <div className="w-full h-full bg-[#131314] rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-xs font-bold text-zinc-200">Rudra AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#282a2c] text-cyan-300 font-medium border border-[#37393b] animate-pulse">
                Generating...
              </span>
            </div>

            {streamingMessage.thinking && (
              <div className="mb-3 rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 text-xs font-mono text-purple-200 whitespace-pre-wrap leading-relaxed animate-pulse">
                <div className="flex items-center space-x-1.5 text-purple-400 font-semibold mb-1">
                  <BrainCircuit className="w-3.5 h-3.5 animate-spin" />
                  <span>Thinking & Reasoning...</span>
                </div>
                {streamingMessage.thinking}
              </div>
            )}

            <div className="text-zinc-200">
              {renderMessageContent(streamingMessage.content, 'streaming')}
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton if no tokens yet */}
      {isLoading && !streamingMessage && (
        <div className="flex items-start space-x-3.5 w-full">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-0.5 shrink-0 shadow-md">
            <div className="w-full h-full bg-[#131314] rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
            </div>
          </div>
          <div className="space-y-2.5 flex-1 max-w-md pt-2">
            <div className="h-4 bg-[#282a2c] rounded-full shimmer-loading w-3/4"></div>
            <div className="h-4 bg-[#282a2c] rounded-full shimmer-loading w-1/2"></div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
