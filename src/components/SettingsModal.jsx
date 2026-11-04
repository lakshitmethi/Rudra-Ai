import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Cpu, 
  Sliders, 
  Trash2, 
  Check, 
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { AVAILABLE_MODELS, SYSTEM_PROMPT } from '../services/geminiApi';

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  currentModel,
  onSelectModel,
  systemPrompt,
  onSaveSystemPrompt,
  onClearAllChats
}) {
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [tempPrompt, setTempPrompt] = useState(systemPrompt || SYSTEM_PROMPT);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(tempKey.trim());
    onSaveSystemPrompt(tempPrompt);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1e1f20] border border-[#333537] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#333537]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">Rudra AI Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#282a2c] text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Gemini API Key */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>Google Gemini API Key</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy... (Leave empty to use built-in offline engine)"
                className="w-full bg-[#131314] border border-[#37393b] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-white transition"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1.5">
              Your API key is stored locally in your browser. If empty, Rudra AI uses its built-in simulated high-speed engine for instant demos.
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center space-x-1.5 mb-2">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Default Intelligence Engine</span>
            </label>
            <div className="space-y-2">
              {AVAILABLE_MODELS.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectModel(m.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    currentModel === m.id
                      ? 'bg-[#2b2d30] border-purple-500/50 text-white'
                      : 'bg-[#131314] border-[#333537] text-zinc-400 hover:border-[#484a4d]'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">{m.name}</div>
                    <div className="text-[11px] text-zinc-400">{m.description}</div>
                  </div>
                  {currentModel === m.id && (
                    <Check className="w-4 h-4 text-purple-400 shrink-0 ml-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* System Instructions */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center space-x-1.5 mb-2">
              <Sliders className="w-3.5 h-3.5 text-pink-400" />
              <span>Rudra AI System Directive</span>
            </label>
            <textarea
              value={tempPrompt}
              onChange={(e) => setTempPrompt(e.target.value)}
              rows={4}
              className="w-full bg-[#131314] border border-[#37393b] rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none font-mono leading-relaxed"
            />
          </div>

          {/* Clear history */}
          <div className="pt-2 border-t border-[#333537] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-300">Clear All Conversations</div>
              <div className="text-[11px] text-zinc-500">Deletes all saved chats from local storage</div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to delete all saved conversations?')) {
                  onClearAllChats();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30 transition flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#333537] bg-[#18191a] flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-[#282a2c] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white shadow-lg shadow-purple-500/25 transition flex items-center space-x-1.5"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save & Apply</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
