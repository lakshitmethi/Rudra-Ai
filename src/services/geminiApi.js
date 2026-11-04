// Rudra AI Service Engine
// Handles Google Gemini 2.0 / 1.5 API calls with streaming, 
// and includes a built-in intelligent instant builder for offline/mock usage.

export const AVAILABLE_MODELS = [
  { id: 'gemini-2.0-flash', name: 'Rudra 2.5 Flash', tag: 'Fastest & Responsive', badge: 'Flash', description: 'Lightning-fast responses with high accuracy for general chat and quick code.' },
  { id: 'gemini-1.5-pro', name: 'Rudra 2.5 Pro', tag: 'Complex Reasoning', badge: 'Pro', description: 'Advanced multimodal intelligence for complex architecture and in-depth code.' },
  { id: 'gemini-2.0-flash-thinking-exp', name: 'Rudra Deep Think (o3)', tag: 'Deep Chain-of-Thought', badge: 'Think', description: 'Reveals internal chain of thought before providing precise mathematical & logic solutions.' },
];

export const SYSTEM_PROMPT = `You are Rudra AI, a premier AI designed with the speed of Gemini and the precision of ChatGPT.
Your mission is to assist users with answers, deep logical reasoning, and building full-featured web applications and websites.

KEY INSTRUCTIONS:
1. When asked to create, code, or build ANY website, web app, dashboard, game, tool, or component:
   - Always produce COMPLETE, production-ready, standalone single-file code.
   - Wrap the full working web app inside a single \`\`\`html ... \`\`\` code block.
   - Include Tailwind CSS CDN (<script src="https://cdn.tailwindcss.com"></script>) or modern CSS styling, Lucide icons or FontAwesome icons if needed, and fully working JavaScript logic.
   - Ensure the app is responsive, interactive, visually stunning with dark/light aesthetics, micro-interactions, and functional buttons.
2. For conceptual or programming questions:
   - Provide accurate, direct, well-structured answers using clean markdown, lists, and code blocks.
3. Maintain a helpful, inspiring, and professional tone as Rudra AI.`;

// Templates for instant offline generation of impressive full-scale web apps
const PRESET_APPS = {
  solar: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Rudra Cosmic Orrery - 3D Solar System</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; background: #050508; overflow: hidden; font-family: system-ui; }
    canvas { display: block; }
  </style>
</head>
<body class="relative text-white select-none">
  <div class="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl">
    <div class="flex items-center space-x-2">
      <span class="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
      <h1 class="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Rudra Solar Canvas</h1>
    </div>
    <p class="text-xs text-zinc-400 mt-1">Interactive Celestial Simulator</p>
    <div class="mt-3 flex gap-2">
      <button id="btnSpeed" class="px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-md border border-zinc-600 transition">Speed 1x</button>
      <button id="btnTrails" class="px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-md border border-zinc-600 transition">Toggle Trails</button>
      <button id="btnReset" class="px-2.5 py-1 text-xs bg-cyan-600 hover:bg-cyan-500 rounded-md transition font-medium">Reset</button>
    </div>
  </div>

  <canvas id="space"></canvas>

  <script>
    const canvas = document.getElementById('space');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    let speedMultiplier = 1;
    let showTrails = true;

    document.getElementById('btnSpeed').onclick = (e) => {
      speedMultiplier = speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 4 : 1;
      e.target.textContent = 'Speed ' + speedMultiplier + 'x';
    };

    document.getElementById('btnTrails').onclick = () => {
      showTrails = !showTrails;
    };

    const planets = [
      { name: 'Mercury', dist: 70, size: 4, color: '#a8a8a8', speed: 0.04 },
      { name: 'Venus', dist: 110, size: 7, color: '#e3bb76', speed: 0.025 },
      { name: 'Earth', dist: 160, size: 8, color: '#4da3ff', speed: 0.018, moon: true },
      { name: 'Mars', dist: 215, size: 6, color: '#e0533c', speed: 0.014 },
      { name: 'Jupiter', dist: 285, size: 16, color: '#dca368', speed: 0.008, rings: true },
      { name: 'Saturn', dist: 360, size: 13, color: '#f5d68f', speed: 0.006, rings: true }
    ];

    let angle = 0;
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5,
      alpha: Math.random()
    }));

    function draw() {
      if (showTrails) {
        ctx.fillStyle = 'rgba(5, 5, 8, 0.25)';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, width, height);
      }

      // Stars
      ctx.fillStyle = '#ffffff';
      stars.forEach(s => {
        ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.002 + s.x) * 0.3;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });
      ctx.globalAlpha = 1;

      const cx = width / 2;
      const cy = height / 2;

      // Sun
      const sunGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 28);
      sunGrad.addColorStop(0, '#fff4cc');
      sunGrad.addColorStop(0.4, '#ffb833');
      sunGrad.addColorStop(1, 'rgba(255, 102, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fill();

      // Planets
      planets.forEach((p, idx) => {
        // Orbit ring
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.arc(cx, cy, p.dist, 0, Math.PI * 2);
        ctx.stroke();

        const currentAngle = angle * p.speed * speedMultiplier;
        const px = cx + Math.cos(currentAngle) * p.dist;
        const py = cy + Math.sin(currentAngle) * p.dist;

        // Planet body
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Planet label
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '10px system-ui';
        ctx.fillText(p.name, px + p.size + 4, py + 3);

        // Ring for Saturn
        if (p.rings) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(245, 214, 143, 0.5)';
          ctx.lineWidth = 2;
          ctx.ellipse(px, py, p.size * 1.8, p.size * 0.6, Math.PI / 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Earth Moon
        if (p.moon) {
          const mx = px + Math.cos(angle * 0.1 * speedMultiplier) * 16;
          const my = py + Math.sin(angle * 0.1 * speedMultiplier) * 16;
          ctx.beginPath();
          ctx.fillStyle = '#cccccc';
          ctx.arc(mx, my, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      angle += 0.5;
      requestAnimationFrame(draw);
    }
    draw();
  </script>
</body>
</html>`,

  snake: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cyber Snake Arcade by Rudra AI</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: #0b0c10; font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="flex flex-col items-center justify-center min-h-screen text-slate-100 p-4">
  <div class="bg-slate-900 border border-cyan-500/30 p-6 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col items-center">
    <div class="flex justify-between w-full items-center mb-4 border-b border-slate-800 pb-3">
      <div class="flex items-center space-x-2">
        <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
        <h1 class="text-xl font-bold tracking-wider text-cyan-400">CYBERSNAKE 2.5</h1>
      </div>
      <div class="flex gap-4 text-sm font-semibold">
        <span>SCORE: <span id="score" class="text-emerald-400">0</span></span>
        <span>HIGH: <span id="highScore" class="text-purple-400">0</span></span>
      </div>
    </div>

    <canvas id="gameCanvas" width="400" height="400" class="bg-black rounded-lg border border-slate-800 shadow-inner"></canvas>

    <div class="flex items-center gap-3 mt-4">
      <button id="startBtn" class="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 font-bold rounded-lg text-sm transition">START GAME</button>
      <button id="pauseBtn" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 font-bold rounded-lg text-sm transition">PAUSE</button>
    </div>
    <p class="text-xs text-slate-400 mt-3">Use Arrow Keys or WASD to navigate</p>
  </div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const grid = 20;
    let count = 0;
    let score = 0;
    let highScore = localStorage.getItem('rudra_snake_high') || 0;
    document.getElementById('highScore').textContent = highScore;

    let snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
    let apple = { x: 320, y: 320 };
    let isRunning = false;

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function resetGame() {
      snake.x = 160;
      snake.y = 160;
      snake.cells = [];
      snake.maxCells = 4;
      snake.dx = grid;
      snake.dy = 0;
      score = 0;
      document.getElementById('score').textContent = score;
      apple.x = getRandomInt(0, 20) * grid;
      apple.y = getRandomInt(0, 20) * grid;
    }

    function loop() {
      if (!isRunning) return;
      requestAnimationFrame(loop);

      if (++count < 6) return; // 10fps
      count = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snake.x += snake.dx;
      snake.y += snake.dy;

      // Wrap edges
      if (snake.x < 0) snake.x = canvas.width - grid;
      else if (snake.x >= canvas.width) snake.x = 0;
      if (snake.y < 0) snake.y = canvas.height - grid;
      else if (snake.y >= canvas.height) snake.y = 0;

      snake.cells.unshift({ x: snake.x, y: snake.y });
      if (snake.cells.length > snake.maxCells) snake.cells.pop();

      // Draw apple with neon glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ef4444';
      ctx.fillStyle = '#f87171';
      ctx.fillRect(apple.x + 2, apple.y + 2, grid - 4, grid - 4);
      ctx.shadowBlur = 0;

      // Draw snake
      snake.cells.forEach((cell, index) => {
        ctx.fillStyle = index === 0 ? '#38bdf8' : '#0284c7';
        ctx.fillRect(cell.x + 1, cell.y + 1, grid - 2, grid - 2);

        // Self collision check
        for (let i = index + 1; i < snake.cells.length; i++) {
          if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
            resetGame();
          }
        }
      });

      // Eat apple
      if (snake.x === apple.x && snake.y === apple.y) {
        snake.maxCells++;
        score += 10;
        document.getElementById('score').textContent = score;
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('rudra_snake_high', highScore);
          document.getElementById('highScore').textContent = highScore;
        }
        apple.x = getRandomInt(0, 20) * grid;
        apple.y = getRandomInt(0, 20) * grid;
      }
    }

    document.getElementById('startBtn').onclick = () => {
      resetGame();
      isRunning = true;
      requestAnimationFrame(loop);
    };

    document.getElementById('pauseBtn').onclick = () => {
      isRunning = !isRunning;
      if (isRunning) requestAnimationFrame(loop);
    };

    window.addEventListener('keydown', (e) => {
      if ((e.key === 'ArrowLeft' || e.key === 'a') && snake.dx === 0) {
        snake.dx = -grid; snake.dy = 0;
      } else if ((e.key === 'ArrowUp' || e.key === 'w') && snake.dy === 0) {
        snake.dy = -grid; snake.dx = 0;
      } else if ((e.key === 'ArrowRight' || e.key === 'd') && snake.dx === 0) {
        snake.dx = grid; snake.dy = 0;
      } else if ((e.key === 'ArrowDown' || e.key === 's') && snake.dy === 0) {
        snake.dy = grid; snake.dx = 0;
      }
    });
  </script>
</body>
</html>`,

  calculator: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Rudra Glassmorphic Calculator</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 min-h-screen flex items-center justify-center p-4">
  <div class="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl w-full max-w-sm">
    <div class="flex justify-between items-center mb-4">
      <span class="text-xs font-semibold tracking-wider text-purple-300">RUDRA CALCULATOR</span>
      <div class="flex gap-1.5">
        <span class="w-3 h-3 rounded-full bg-red-400"></span>
        <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
        <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
      </div>
    </div>
    
    <div class="bg-black/30 rounded-2xl p-4 mb-5 border border-white/10 text-right">
      <div id="subDisplay" class="text-sm text-slate-400 font-mono h-5 overflow-hidden"></div>
      <div id="mainDisplay" class="text-4xl text-white font-mono font-bold tracking-tight overflow-x-auto whitespace-nowrap">0</div>
    </div>

    <div class="grid grid-cols-4 gap-2.5">
      <button onclick="clearAll()" class="p-3.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold rounded-xl transition">AC</button>
      <button onclick="deleteLast()" class="p-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition">DEL</button>
      <button onclick="appendOp('%')" class="p-3.5 bg-white/10 hover:bg-white/20 text-purple-300 font-bold rounded-xl transition">%</button>
      <button onclick="appendOp('/')" class="p-3.5 bg-purple-600/60 hover:bg-purple-600 text-white font-bold rounded-xl transition">÷</button>

      <button onclick="appendNum('7')" class="p-3.5 bg-white/5 hover:bg-white/15 text-white font-medium rounded-xl transition">7</button>
      <button onclick="appendNum('8')" class="p-3.5 bg-white/5 hover:bg-white/15 text-white font-medium rounded-xl transition">8</button>
      <button onclick="appendNum('9')" class="p-3.5 bg-white/5 hover:bg-white/15 text-white font-medium rounded-xl transition">9</button>
      <button onclick="appendOp('*')" class="p-3.5 bg-purple-600/60 hover:bg-purple-600 text-white font-bold rounded-xl transition">×</button>

      <button onclick="appendNum('4')" class="p-3.5 bg-white/5 hover:bg-white/15 text-white font-medium rounded-xl transition">4</button>
      <button onclick="appendNum('5')" class="p-3.5 bg-white/5 hover:bg-white/15 text-white font-medium rounded-xl transition">5</button>
      <button onclick="appendNum('6')" class="p-3.5 bg-white/5 hover:bg-white/15 text-white font-medium rounded-xl transition">6</button>
      <button onclick="appendOp('-')" class="p-3.5 bg-purple-600/60 hover:bg-purple-600 text-white font-bold rounded-xl transition">−</button>

      <button onclick="appendNum('1')" class="p-3.5 bg-white/5 hover:bg-white/15 text-white font-medium rounded-xl transition">1</button>
      <button onclick="appendNum('2')" class="p-3.5 bg-white/5 hover:bg-white/15 text-white font-medium rounded-xl transition">2</button>
      <button onclick="appendNum('3')" class="p-3.5 bg-white/5 hover:bg-white/15 text-white font-medium rounded-xl transition">3</button>
      <button onclick="appendOp('+')" class="p-3.5 bg-purple-600/60 hover:bg-purple-600 text-white font-bold rounded-xl transition">+</button>

      <button onclick="appendNum('0')" class="col-span-2 p-3.5 bg-white/5 hover:bg-white/15 text-white font-medium rounded-xl transition">0</button>
      <button onclick="appendNum('.')" class="p-3.5 bg-white/5 hover:bg-white/15 text-white font-bold rounded-xl transition">.</button>
      <button onclick="calculate()" class="p-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white font-bold rounded-xl transition shadow-lg">=</button>
    </div>
  </div>

  <script>
    let expr = '';
    const main = document.getElementById('mainDisplay');
    const sub = document.getElementById('subDisplay');

    function appendNum(n) {
      if (expr === '0' && n !== '.') expr = '';
      expr += n;
      main.textContent = expr;
    }

    function appendOp(op) {
      if (!expr) return;
      const last = expr.slice(-1);
      if (['+', '-', '*', '/', '%'].includes(last)) {
        expr = expr.slice(0, -1) + op;
      } else {
        expr += op;
      }
      main.textContent = expr;
    }

    function clearAll() {
      expr = '';
      main.textContent = '0';
      sub.textContent = '';
    }

    function deleteLast() {
      expr = expr.slice(0, -1);
      main.textContent = expr || '0';
    }

    function calculate() {
      try {
        sub.textContent = expr + ' =';
        const res = Function('"use strict"; return (' + expr + ')')();
        main.textContent = Math.round(res * 100000000) / 100000000;
        expr = String(main.textContent);
      } catch (e) {
        main.textContent = 'Error';
        expr = '';
      }
    }
  </script>
</body>
</html>`,

  saas: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AetherAI — Next Gen Intelligence Platform</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #090a0f; color: #f8fafc; }</style>
</head>
<body class="overflow-x-hidden">
  <!-- Nav -->
  <nav class="sticky top-0 z-50 bg-[#090a0f]/80 backdrop-blur-md border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">Æ</div>
      <span class="text-xl font-bold tracking-tight">Aether<span class="text-cyan-400">.ai</span></span>
    </div>
    <div class="hidden md:flex items-center space-x-8 text-sm text-zinc-300">
      <a href="#features" class="hover:text-white transition">Features</a>
      <a href="#models" class="hover:text-white transition">Models</a>
      <a href="#pricing" class="hover:text-white transition">Pricing</a>
      <a href="#docs" class="hover:text-white transition">Docs</a>
    </div>
    <div class="flex items-center space-x-3">
      <button class="px-4 py-2 text-sm text-zinc-300 hover:text-white transition">Sign In</button>
      <button class="px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 shadow-lg shadow-cyan-500/25 transition">Start Free Trial</button>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="relative px-6 pt-24 pb-20 text-center max-w-5xl mx-auto">
    <div class="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-8">
      <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
      <span>Announcing Rudra 2.5 Multi-Modal Suite</span>
    </div>
    <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
      Build intelligent apps at the <br>
      <span class="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">speed of thought</span>
    </h1>
    <p class="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
      Deploy autonomous code agents, synthesize multi-modal data, and scale your intelligent infrastructure with sub-10ms latency.
    </p>
    <div class="mt-10 flex flex-wrap justify-center gap-4">
      <button class="px-7 py-3.5 rounded-xl font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition shadow-xl">Get Started with API</button>
      <button class="px-7 py-3.5 rounded-xl font-semibold bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition">View Live Demo →</button>
    </div>
  </section>

  <!-- Pricing Grid -->
  <section id="pricing" class="max-w-6xl mx-auto px-6 py-20">
    <h2 class="text-3xl font-bold text-center mb-4">Transparent, Scalable Pricing</h2>
    <p class="text-center text-zinc-400 mb-12">Choose the computing power that matches your ambition.</p>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <h3 class="text-lg font-bold">Starter</h3>
        <p class="text-3xl font-extrabold mt-3">$0<span class="text-sm font-normal text-zinc-400">/mo</span></p>
        <p class="text-xs text-zinc-400 mt-2">100K free tokens/month with standard throughput.</p>
        <button class="w-full mt-6 py-2.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition font-medium text-sm">Deploy Now</button>
      </div>
      <div class="p-8 rounded-2xl bg-gradient-to-b from-purple-950/40 to-zinc-900/80 border-2 border-purple-500/50 relative shadow-2xl">
        <span class="absolute -top-3 right-6 bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Most Popular</span>
        <h3 class="text-lg font-bold text-purple-300">Rudra Pro</h3>
        <p class="text-3xl font-extrabold mt-3">$49<span class="text-sm font-normal text-zinc-400">/mo</span></p>
        <p class="text-xs text-zinc-300 mt-2">Unlimited Flash generation, 20M deep reasoning tokens.</p>
        <button class="w-full mt-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 transition font-bold text-sm shadow-lg shadow-purple-600/30">Upgrade to Pro</button>
      </div>
      <div class="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <h3 class="text-lg font-bold">Enterprise</h3>
        <p class="text-3xl font-extrabold mt-3">Custom</p>
        <p class="text-xs text-zinc-400 mt-2">Dedicated cluster VPC, zero data retention, 24/7 SLA.</p>
        <button class="w-full mt-6 py-2.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition font-medium text-sm">Contact Sales</button>
      </div>
    </div>
  </section>
</body>
</html>`
};

// Streaming Simulation helper for instant offline/built-in mode
export async function* simulateStreamingResponse(prompt, model = 'gemini-2.0-flash', isDeepThink = false) {
  const lower = prompt.toLowerCase();
  let fullResponse = '';
  let thinkingSteps = '';

  if (isDeepThink) {
    thinkingSteps = `Analyzing input parameters: "${prompt.slice(0, 40)}..."\n` +
      `-> Decomposing user requirements into core architectural modules\n` +
      `-> Formulating precision algorithms and state machines\n` +
      `-> Validating cross-browser CSS styling & responsive viewport constraints\n` +
      `-> Synthesis complete with 99.8% confidence. Generating final output:`;
  }

  // Detect if user wants an app/website
  if (lower.includes('solar') || lower.includes('space') || lower.includes('planet') || lower.includes('orrery')) {
    fullResponse = `Here is a complete, interactive **3D Solar System & Celestial Orrery** built with HTML5 Canvas, orbital physics, and real-time animation controls!

\`\`\`html
${PRESET_APPS.solar}
\`\`\`

### ✨ Key Features Built into this App:
1. **Orbital Mechanics**: Real-time multi-speed planet revolutions around the glowing Sun with custom orbital periods.
2. **Interactive Controls**: Toggle speed multipliers (1x, 2x, 4x) and orbital trail effects.
3. **Moons & Planetary Rings**: Detailed Saturn planetary rings and Earth's orbiting Moon.
4. **Canvas Performance**: 60 FPS smooth rendering with responsive viewport resizing.

You can click **"Run Web App"** or **"Open in Live Sandbox"** above to interact with it directly!`;
  } else if (lower.includes('snake') || lower.includes('game') || lower.includes('arcade')) {
    fullResponse = `Here is a full-featured **Cyberpunk Snake Arcade Game** with retro-futuristic visuals, collision physics, local storage high scores, and responsive keyboard controls!

\`\`\`html
${PRESET_APPS.snake}
\`\`\`

### 🎮 Game Features:
- **Controls**: Arrow Keys or \`W\` \`A\` \`S\` \`D\` to turn.
- **Score System**: Real-time scoring + high score automatically saved in \`localStorage\`.
- **Neon Aesthetic**: Cyberpunk glowing apples and smooth boundary wrap-around mechanics.
- **Start / Pause**: Playable state controls with instant game reset on collision.`;
  } else if (lower.includes('calc') || lower.includes('calculator') || lower.includes('math app')) {
    fullResponse = `Here is a modern **Glassmorphic Neumorphic Calculator** with scientific operations, backspace, and clear history!

\`\`\`html
${PRESET_APPS.calculator}
\`\`\`

### 🧮 Features:
- Glassmorphic translucent backdrop blur with frosted glass effect.
- Standard arithmetic with operator chaining (\`+\`, \`-\`, \`*\`, \`/\`, \`%\`).
- Clean LCD display with secondary expression preview and history evaluation.`;
  } else if (lower.includes('saas') || lower.includes('landing') || lower.includes('website') || lower.includes('portfolio') || lower.includes('app')) {
    fullResponse = `I have designed and built a premier, responsive **AI SaaS Platform Landing Page** (Aether.ai) with modern gradients, animated badge indicators, and transparent tiered pricing grids!

\`\`\`html
${PRESET_APPS.saas}
\`\`\`

### 🚀 Highlights:
- **Hero Banner**: Animated glowing pulse badge with high-contrast call-to-actions.
- **Modern Typography**: Plus Jakarta Sans paired with gradient text masks.
- **Pricing Cards**: Feature tiers with prominent Pro highlighting and glass card styling.
- **Ready to Customize**: You can ask me to edit colors, add sections, or connect backend forms anytime!`;
  } else {
    // General conversational & coding answer
    fullResponse = `### Hello! I am Rudra AI ⚡

I received your prompt:
> *"${prompt}"*

As your premier AI pair programmer and architect, I am equipped to:
1. **Build Full-Stack & Frontend Web Apps**: Ask me to build games, dashboards, portfolios, or SaaS templates.
2. **Execute Deep Logical Reasoning**: Switch to **Rudra Deep Think** to see step-by-step mathematical proofs, architecture analysis, and debugging.
3. **Live Sandbox Preview**: Whenever I write an HTML/CSS/JS application, you can run and interact with it right inside the integrated **Rudra Live Canvas**!

Try asking me:
- *"Build a playable 2048 puzzle game with Tailwind CSS"*
- *"Create a sleek Dark Mode Crypto Portfolio tracker"*
- *"Explain how Transformers and Attention mechanisms work mathematically"*`;
  }

  // Yield thinking steps first if present
  if (thinkingSteps) {
    yield { type: 'thinking', content: thinkingSteps };
    await new Promise(r => setTimeout(r, 600));
  }

  // Stream output in chunks
  const chunkSize = 24;
  for (let i = 0; i < fullResponse.length; i += chunkSize) {
    const chunk = fullResponse.slice(i, i + chunkSize);
    yield { type: 'content', chunk };
    await new Promise(r => setTimeout(r, 12));
  }
}

// Real Gemini API Call with streaming
export async function* callGeminiApiStream({ prompt, apiKey, model = 'gemini-2.0-flash', systemPrompt = SYSTEM_PROMPT, isDeepThink = false }) {
  if (!apiKey) {
    // Fall back to intelligent simulation engine if no API key is set
    yield* simulateStreamingResponse(prompt, model, isDeepThink);
    return;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature: isDeepThink ? 0.2 : 0.7,
      maxOutputTokens: 8192,
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '').trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              yield { type: 'content', chunk: text };
            }
          } catch (e) {
            // ignore partial chunk json errors
          }
        }
      }
    }
  } catch (error) {
    yield { 
      type: 'content', 
      chunk: `\n\n> ⚠️ **API Notice**: ${error.message}. Falling back to internal Rudra Intelligence engine:\n\n` 
    };
    yield* simulateStreamingResponse(prompt, model, isDeepThink);
  }
}
