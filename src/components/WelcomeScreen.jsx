import React from 'react';
import { 
  Sparkles, 
  Globe, 
  Gamepad2, 
  Calculator, 
  Rocket, 
  Code2, 
  BrainCircuit,
  ArrowRight
} from 'lucide-react';

export default function WelcomeScreen({ onSelectPrompt }) {
  const suggestions = [
    {
      title: 'Build a 3D Solar System Orrery',
      desc: 'Interactive HTML5 canvas simulator with planetary orbits and speed controls',
      icon: Globe,
      color: 'from-blue-500 to-cyan-400',
      prompt: 'Build an interactive 3D Solar System & Celestial Orrery in HTML5 canvas with real-time controls and orbital mechanics.'
    },
    {
      title: 'Playable Cyberpunk Snake Game',
      desc: 'Retro arcade game with neon effects, collision physics, and local high-scores',
      icon: Gamepad2,
      color: 'from-emerald-500 to-teal-400',
      prompt: 'Build a full-featured playable Cyberpunk Snake game with neon glow, score tracking, and keyboard controls.'
    },
    {
      title: 'Glassmorphic Neumorphic Calculator',
      desc: 'Frosted glass UI with history tape, scientific operators, and smooth keys',
      icon: Calculator,
      color: 'from-purple-500 to-pink-500',
      prompt: 'Build a glassmorphic calculator with frosted glass styling and full arithmetic operations.'
    },
    {
      title: 'AI SaaS Landing Page (Aether.ai)',
      desc: 'Complete responsive modern homepage with animated hero and pricing tiers',
      icon: Rocket,
      color: 'from-amber-500 to-rose-500',
      prompt: 'Create a modern AI SaaS platform landing page with dark theme, animated hero badge, and pricing tables.'
    }
  ];

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 max-w-4xl mx-auto w-full select-none">
      {/* Hero Greeting */}
      <div className="text-left w-full mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Rudra AI 2.5 Active</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
          <span className="gemini-gradient-text">Hello, Creator</span>
        </h1>
        <p className="text-xl sm:text-2xl font-normal text-zinc-400">
          How can Rudra AI empower your code and ideas today?
        </p>
      </div>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {suggestions.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group p-4 rounded-2xl bg-[#1e1f20] hover:bg-[#282a2c] border border-[#333537] hover:border-[#484a4d] transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2e3033] flex items-center justify-between text-[11px] text-zinc-500 group-hover:text-zinc-400">
                <span>Instant Live App</span>
                <span className="font-mono text-purple-400/80">Click to Run</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Capabilities Pill */}
      <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs text-zinc-400">
        <span className="px-3 py-1 rounded-full bg-[#1e1f20] border border-[#333537]">
          ⚡ Gemini 2.0 Speed
        </span>
        <span className="px-3 py-1 rounded-full bg-[#1e1f20] border border-[#333537]">
          🎯 ChatGPT Precision
        </span>
        <span className="px-3 py-1 rounded-full bg-[#1e1f20] border border-[#333537]">
          🛠️ Live Canvas Sandbox
        </span>
        <span className="px-3 py-1 rounded-full bg-[#1e1f20] border border-[#333537]">
          🎙️ Voice Recognition
        </span>
      </div>
    </div>
  );
}
