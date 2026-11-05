import React, { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  Code2, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LiveCanvas({ 
  code, 
  title = "Interactive Web App", 
  isOpen, 
  onClose,
  onRefine
}) {
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'code'
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [refineText, setRefineText] = useState('');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'rudra-app'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleRefresh = () => {
    setIframeKey(k => k + 1);
  };

  const handleRefineSubmit = (e) => {
    e.preventDefault();
    if (!refineText.trim()) return;
    if (onRefine) {
      onRefine(`Refine the current web app (${title}): ${refineText}`);
      setRefineText('');
    }
  };

  const viewportWidthClass = {
    desktop: 'w-full',
    tablet: 'w-[768px] mx-auto shadow-2xl rounded-xl border border-zinc-700 my-4',
    mobile: 'w-[375px] mx-auto shadow-2xl rounded-2xl border-4 border-zinc-700 my-4'
  }[viewport];

  return (
    <div className="flex flex-col h-full bg-[#1e1f20] border-l border-[#333537] z-30 transition-all duration-300">
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#333537] bg-[#18191a]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Rudra Canvas</span>
          </div>
          <span className="text-sm font-semibold text-zinc-200 truncate max-w-[200px]" title={title}>
            {title}
          </span>
        </div>

        {/* View mode toggle (Preview vs Code) */}
        <div className="flex items-center bg-[#282a2c] p-0.5 rounded-lg border border-[#37393b]">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
              activeTab === 'preview'
                ? 'bg-[#3b3e41] text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
              activeTab === 'code'
                ? 'bg-[#3b3e41] text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>

        {/* Responsive viewport selector (when in preview mode) */}
        {activeTab === 'preview' && (
          <div className="hidden sm:flex items-center space-x-1 bg-[#282a2c] p-0.5 rounded-lg border border-[#37393b]">
            <button
              onClick={() => setViewport('desktop')}
              title="Desktop View"
              className={`p-1.5 rounded transition ${viewport === 'desktop' ? 'bg-[#3b3e41] text-blue-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              title="Tablet View (768px)"
              className={`p-1.5 rounded transition ${viewport === 'tablet' ? 'bg-[#3b3e41] text-blue-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              title="Mobile View (375px)"
              className={`p-1.5 rounded transition ${viewport === 'mobile' ? 'bg-[#3b3e41] text-blue-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Canvas action buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleRefresh}
            title="Refresh Preview"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-[#282a2c] transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            title="Download index.html"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-[#282a2c] transition"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenNewTab}
            title="Open in new window"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-[#282a2c] transition"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Close Canvas"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-[#282a2c] transition ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Sandbox Area */}
      <div className="flex-1 overflow-auto bg-[#131314] relative flex flex-col justify-center">
        {activeTab === 'preview' ? (
          <div className="w-full h-full flex items-center justify-center p-0 overflow-auto">
            <iframe
              key={iframeKey}
              srcDoc={code}
              title={title}
              sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
              className={`h-full border-0 transition-all duration-200 bg-white ${viewportWidthClass}`}
            />
          </div>
        ) : (
          <div className="relative w-full h-full p-4 overflow-auto font-mono text-xs text-zinc-300 bg-[#0e0e10]">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#222428] hover:bg-[#2d3036] border border-zinc-700 text-zinc-300 text-xs transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
            <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Quick Refine & Prompt Bar */}
      <div className="p-3 bg-[#18191a] border-t border-[#333537]">
        <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 text-[11px] text-zinc-400">
          <span className="text-zinc-500 font-medium">Quick Tweaks:</span>
          <button 
            onClick={() => onRefine && onRefine(`Tweak ${title}: Add smooth transition animations and hover effects`)}
            className="px-2 py-0.5 rounded-full bg-[#282a2c] hover:bg-[#34373a] hover:text-white transition whitespace-nowrap"
          >
            ✨ Add Animations
          </button>
          <button 
            onClick={() => onRefine && onRefine(`Tweak ${title}: Add a Dark/Light mode theme switch`)}
            className="px-2 py-0.5 rounded-full bg-[#282a2c] hover:bg-[#34373a] hover:text-white transition whitespace-nowrap"
          >
            🌙 Dark Mode Toggle
          </button>
          <button 
            onClick={() => onRefine && onRefine(`Tweak ${title}: Make styling ultra-modern with vibrant gradients`)}
            className="px-2 py-0.5 rounded-full bg-[#282a2c] hover:bg-[#34373a] hover:text-white transition whitespace-nowrap"
          >
            🎨 Vibrant Colors
          </button>
        </div>
        
        <form onSubmit={handleRefineSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={refineText}
            onChange={(e) => setRefineText(e.target.value)}
            placeholder="Ask Rudra AI to modify this web app..."
            className="flex-1 bg-[#282a2c] border border-[#37393b] rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition"
          />
          <button
            type="submit"
            disabled={!refineText.trim()}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition"
          >
            Update App
          </button>
        </form>
      </div>
    </div>
  );
}
