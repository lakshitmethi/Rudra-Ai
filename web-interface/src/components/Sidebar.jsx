import React from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Settings as SettingsIcon, 
  Menu, 
  Sparkles, 
  Code2, 
  Cpu, 
  ExternalLink,
  KeyRound
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onToggle,
  chats = [],
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenSettings,
  hasApiKey = false
}) {
  return (
    <aside
      className={`fixed md:relative top-0 left-0 h-full bg-[#1e1f20] border-r border-[#333537] z-40 transition-all duration-300 flex flex-col justify-between ${
        isOpen ? 'w-72' : 'w-16'
      }`}
    >
      {/* Top Header & New Chat */}
      <div className="p-3">
        {/* Toggle Button & Logo */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onToggle}
            className="p-2 rounded-full hover:bg-[#282a2c] text-zinc-400 hover:text-white transition"
            title={isOpen ? 'Collapse Menu' : 'Expand Menu'}
          >
            <Menu className="w-5 h-5" />
          </button>

          {isOpen && (
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-semibold">
                v2.5
              </span>
            </div>
          )}
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className={`flex items-center space-x-3 w-full py-2.5 rounded-full bg-[#282a2c] hover:bg-[#34373a] text-zinc-200 transition border border-[#37393b] shadow-sm ${
            isOpen ? 'px-4' : 'justify-center px-0'
          }`}
          title="New Chat"
        >
          <Plus className="w-5 h-5 text-purple-400" />
          {isOpen && <span className="text-sm font-medium">New chat</span>}
        </button>

        {/* Recent Chats Section */}
        {isOpen && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-3 mb-2">
              Recent Chats
            </h3>
            <div className="space-y-1 max-h-[38vh] overflow-y-auto pr-1">
              {chats.length === 0 ? (
                <p className="text-xs text-zinc-500 px-3 py-2 italic">
                  No chats yet. Start a new session!
                </p>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition ${
                      activeChatId === chat.id
                        ? 'bg-[#2b2d30] text-white font-medium border border-[#3d4044]'
                        : 'text-zinc-400 hover:bg-[#282a2c] hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 text-zinc-400 group-hover:text-purple-400 transition" />
                      <span className="truncate">{chat.title || 'Conversation'}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Area (Settings & Profile) */}
      <div className="p-3 border-t border-[#333537] space-y-1">
        {/* API Key Status Pill */}
        {isOpen && (
          <div
            onClick={onOpenSettings}
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#282a2c]/60 hover:bg-[#282a2c] border border-[#37393b] cursor-pointer transition mb-2"
          >
            <div className="flex items-center space-x-2">
              <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs text-zinc-300">
                {hasApiKey ? 'Gemini API Active' : 'Demo Engine (Active)'}
              </span>
            </div>
            <span
              className={`w-2 h-2 rounded-full ${
                hasApiKey ? 'bg-emerald-400' : 'bg-cyan-400 animate-pulse'
              }`}
            />
          </div>
        )}

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className={`flex items-center space-x-3 w-full py-2 rounded-xl text-zinc-400 hover:bg-[#282a2c] hover:text-zinc-200 transition text-xs ${
            isOpen ? 'px-3' : 'justify-center'
          }`}
          title="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
          {isOpen && <span>Settings & API Keys</span>}
        </button>

        {/* User Badge */}
        <div
          className={`flex items-center space-x-3 py-2 rounded-xl text-xs text-zinc-300 ${
            isOpen ? 'px-3' : 'justify-center'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center font-bold text-white text-[11px] shadow-sm">
            R
          </div>
          {isOpen && (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-zinc-200 truncate">Rudra User</span>
              <span className="text-[10px] text-zinc-500 truncate">Rudra AI Studio</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
