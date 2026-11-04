import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import WelcomeScreen from './components/WelcomeScreen';
import ChatArea, { extractHtmlCode } from './components/ChatArea';
import ChatInput from './components/ChatInput';
import LiveCanvas from './components/LiveCanvas';
import SettingsModal from './components/SettingsModal';
import { callGeminiApiStream, SYSTEM_PROMPT } from './services/geminiApi';

export default function App() {
  // Storage keys
  const STORAGE_CHATS = 'rudra_ai_chats_v1';
  const STORAGE_KEY = 'rudra_ai_api_key';
  const STORAGE_MODEL = 'rudra_ai_model';
  const STORAGE_SYSTEM = 'rudra_ai_system_prompt';

  // State
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHATS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHATS);
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.length > 0 ? parsed[0].id : null;
    } catch {
      return null;
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState(() => {
    return localStorage.getItem(STORAGE_MODEL) || 'gemini-2.0-flash';
  });
  const [isDeepThink, setIsDeepThink] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || '';
  });
  const [systemPrompt, setSystemPrompt] = useState(() => {
    return localStorage.getItem(STORAGE_SYSTEM) || SYSTEM_PROMPT;
  });

  // Canvas State (Live App Sandbox)
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasData, setCanvasData] = useState({ code: '', title: 'Web Application' });

  // Generation state
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const abortControllerRef = useRef(null);

  // Sync chats to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHATS, JSON.stringify(chats));
    } catch (e) {
      console.error('Failed to save chats to localStorage', e);
    }
  }, [chats]);

  const activeChat = chats.find(c => c.id === activeChatId);
  const messages = activeChat ? activeChat.messages : [];

  // Create New Chat
  const handleNewChat = () => {
    const newChat = {
      id: `chat_${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setIsCanvasOpen(false);
  };

  // Select Existing Chat
  const handleSelectChat = (id) => {
    setActiveChatId(id);
    // If chat contains an HTML app, preload it into canvasData
    const chat = chats.find(c => c.id === id);
    if (chat) {
      const lastAiMessage = [...chat.messages].reverse().find(m => m.role === 'model');
      if (lastAiMessage) {
        const html = extractHtmlCode(lastAiMessage.content);
        if (html) {
          setCanvasData({ code: html, title: chat.title || 'Web Application' });
        }
      }
    }
  };

  // Delete Chat
  const handleDeleteChat = (id) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (activeChatId === id) {
        setActiveChatId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  // Clear All Chats
  const handleClearAllChats = () => {
    setChats([]);
    setActiveChatId(null);
    setIsCanvasOpen(false);
    localStorage.removeItem(STORAGE_CHATS);
  };

  // Send Message
  const handleSendMessage = async (promptText) => {
    if (!promptText || isLoading) return;

    let targetChatId = activeChatId;
    let currentChats = [...chats];

    // If no active chat exists, create one
    if (!targetChatId) {
      const newChat = {
        id: `chat_${Date.now()}`,
        title: promptText.slice(0, 30) + (promptText.length > 30 ? '...' : ''),
        messages: [],
        createdAt: new Date().toISOString()
      };
      targetChatId = newChat.id;
      currentChats = [newChat, ...currentChats];
      setActiveChatId(targetChatId);
    }

    const userMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toISOString()
    };

    // Update active chat title if it's the first message
    const updatedChats = currentChats.map(c => {
      if (c.id === targetChatId) {
        const isFirst = c.messages.length === 0;
        return {
          ...c,
          title: isFirst ? promptText.slice(0, 32) + (promptText.length > 32 ? '...' : '') : c.title,
          messages: [...c.messages, userMessage]
        };
      }
      return c;
    });

    setChats(updatedChats);
    setIsLoading(true);
    setStreamingMessage({ content: '', thinking: '' });

    let accumulatedContent = '';
    let accumulatedThinking = '';

    try {
      const stream = callGeminiApiStream({
        prompt: promptText,
        apiKey: apiKey.trim(),
        model: currentModel,
        systemPrompt,
        isDeepThink
      });

      for await (const chunkObj of stream) {
        if (chunkObj.type === 'thinking') {
          accumulatedThinking += chunkObj.content;
          setStreamingMessage({
            content: accumulatedContent,
            thinking: accumulatedThinking
          });
        } else if (chunkObj.type === 'content') {
          accumulatedContent += chunkObj.chunk;
          setStreamingMessage({
            content: accumulatedContent,
            thinking: accumulatedThinking
          });
        }
      }

      // Finalize message
      const aiMessage = {
        id: `rudra_${Date.now()}`,
        role: 'model',
        content: accumulatedContent,
        thinking: accumulatedThinking || null,
        model: currentModel.replace('gemini-', 'Rudra ').replace('-exp', ''),
        timestamp: new Date().toISOString()
      };

      setChats(prev => prev.map(c => {
        if (c.id === targetChatId) {
          return {
            ...c,
            messages: [...c.messages, aiMessage]
          };
        }
        return c;
      }));

      // Check if response contains an HTML web app and auto-ready the canvas
      const htmlApp = extractHtmlCode(accumulatedContent);
      if (htmlApp) {
        setCanvasData({
          code: htmlApp,
          title: promptText.slice(0, 24) || 'Interactive Web App'
        });
        setIsCanvasOpen(true);
      }
    } catch (err) {
      console.error('Error during generation:', err);
    } finally {
      setIsLoading(false);
      setStreamingMessage(null);
    }
  };

  const handleStopGeneration = () => {
    setIsLoading(false);
    setStreamingMessage(null);
  };

  const handleOpenCanvasWithCode = (code, title) => {
    setCanvasData({ code, title });
    setIsCanvasOpen(true);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#131314] text-[#e3e3e3] font-sans antialiased">
      {/* Collapsible Gemini Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKey={Boolean(apiKey)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Top Navbar */}
        <Navbar
          currentModel={currentModel}
          onSelectModel={(id) => {
            setCurrentModel(id);
            localStorage.setItem(STORAGE_MODEL, id);
          }}
          isDeepThink={isDeepThink}
          onToggleDeepThink={() => setIsDeepThink(!isDeepThink)}
          onToggleCanvas={() => setIsCanvasOpen(!isCanvasOpen)}
          hasCanvasApp={Boolean(canvasData.code)}
          isCanvasOpen={isCanvasOpen}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Chat / Canvas Split Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Chat Feed */}
          <div className="flex-1 flex flex-col h-full min-w-0">
            {messages.length === 0 && !streamingMessage ? (
              <WelcomeScreen onSelectPrompt={handleSendMessage} />
            ) : (
              <ChatArea
                messages={messages}
                isLoading={isLoading}
                streamingMessage={streamingMessage}
                onOpenCanvasWithCode={handleOpenCanvasWithCode}
              />
            )}

            {/* Bottom Floating Gemini Pill Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onStopGeneration={handleStopGeneration}
            />
          </div>

          {/* Interactive Live Web App Canvas Sandbox (Right Panel) */}
          {isCanvasOpen && (
            <div className="w-full md:w-[50%] lg:w-[45%] h-full shrink-0 border-l border-[#333537] z-20">
              <LiveCanvas
                isOpen={isCanvasOpen}
                code={canvasData.code}
                title={canvasData.title}
                onClose={() => setIsCanvasOpen(false)}
                onRefine={(refinePrompt) => handleSendMessage(refinePrompt)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={(key) => {
          setApiKey(key);
          localStorage.setItem(STORAGE_KEY, key);
        }}
        currentModel={currentModel}
        onSelectModel={(id) => {
          setCurrentModel(id);
          localStorage.setItem(STORAGE_MODEL, id);
        }}
        systemPrompt={systemPrompt}
        onSaveSystemPrompt={(prompt) => {
          setSystemPrompt(prompt);
          localStorage.setItem(STORAGE_SYSTEM, prompt);
        }}
        onClearAllChats={handleClearAllChats}
      />
    </div>
  );
}
