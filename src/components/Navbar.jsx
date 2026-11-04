import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  Layout, 
  Cpu, 
  Settings as SettingsIcon,
  Check,
  Zap,
  BrainCircuit
} from 'lucide-react';
import { AVAILABLE_MODELS } from '../services/geminiApi';

export default function Navbar({
  currentModel,
  onSelectModel,
  isDeepThink,
  onToggleDeepThink,
  onToggleCanvas,
  hasCanvasApp,
  isCanvasOpen,
  onOpenSettings
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeModelObj = AVAILABLE_MODELS.find(m => m.id === currentModel) || AVAILABLE_MODELS[0];

  return (
    <header className="h-14 px-4 bg-[#131314]/90 backdrop-blur-md border-b border-[#2d2f31] flex items-center justify-between z-20 select-none">
      {/* Brand & Model Selector */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#131314] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-base font-bold tracking-tight gemini-gradient-text">
              Rudra AI
            </span>
          </div>
        </div>

        {/* Model Picker Pill */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#1e1f20] hover:bg-[#282a2c] border border-[#333537] text-xs font-medium text-zinc-300 transition"
          >
            <span>{activeModelObj.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-[#1e1f20] border border-[#37393b] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-3 py-1.5">
                Select Intelligence Model
              </div>
              <div className="space-y-1">
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-start space-x-3 ${
                      currentModel === model.id
                        ? 'bg-[#2b2d30] border border-purple-500/30'
                        : 'hover:bg-[#282a2c]'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-[#333537] text-purple-400 shrink-0 mt-0.5">
                      {model.id.includes('thinking') ? (
                        <BrainCircuit className="w-4 h-4" />
                      ) : model.id.includes('pro') ? (
                        <Cpu className="w-4 h-4" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-200">
                          {model.name}
                        </span>
                        {currentModel === model.id && (
                          <Check className="w-3.5 h-3.5 text-purple-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                        {model.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center space-x-2">
        {/* Deep Think Mode Toggle */}
        <button
          onClick={onToggleDeepThink}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            isDeepThink
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-500/20'
              : 'bg-[#1e1f20] text-zinc-400 border-[#333537] hover:text-zinc-200 hover:bg-[#282a2c]'
          }`}
          title="Toggle Deep Chain-of-Thought Reasoning"
        >
          <BrainCircuit className={`w-3.5 h-3.5 ${isDeepThink ? 'text-purple-400 animate-pulse' : ''}`} />
          <span className="hidden sm:inline">Deep Think</span>
        </button>

        {/* Live Canvas / Sandbox Toggle Button */}
        {hasCanvasApp && (
          <button
            onClick={onToggleCanvas}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
              isCanvasOpen
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-transparent shadow-lg shadow-purple-500/25'
                : 'bg-[#1e1f20] text-cyan-400 border-cyan-500/40 hover:bg-[#282a2c]'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Live Sandbox</span>
            <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping ml-0.5" />
          </button>
        )}

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-[#1e1f20] text-zinc-400 hover:text-zinc-200 border border-transparent hover:border-[#333537] transition"
          title="Configure Rudra AI"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
