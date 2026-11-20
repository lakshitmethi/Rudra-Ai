"""
display.py — Real-time Web Interface for Rudra (JARVIS) Assistant
Periodically reads conv.txt and status.txt and displays the conversation in a web browser.
Compatible with Taipy (if installed) or Python's built-in web server.
"""

import os
import sys
import time
import json
import webbrowser
from threading import Thread

# Check if Taipy is available
TAIPY_AVAILABLE = False
try:
    import taipy
    from taipy.gui import Gui, State, invoke_callback, get_state_id
    TAIPY_AVAILABLE = True
except ImportError:
    TAIPY_AVAILABLE = False


def run_taipy():
    """Run display using Taipy if installed."""
    conversation = {"Conversation": []}
    state_id_list = []
    selected_row = [1]
    status = "Idle"

    def on_init(state: State) -> None:
        state_id = get_state_id(state)
        state_id_list.append(state_id)

    def client_handler(gui: Gui, state_id_list: list) -> None:
        while True:
            time.sleep(0.5)
            if len(state_id_list) > 0:
                invoke_callback(gui, state_id_list[0], update_conv, [])

    def update_conv(state: State) -> None:
        try:
            with open("status.txt", "r") as f:
                state.status = f.read().strip()
        except Exception:
            state.status = "Idle"

        try:
            with open("conv.txt", "r") as f:
                conv = f.read()
        except Exception:
            conv = ""

        conversation["Conversation"] = [line for line in conv.split("\n") if line.strip()]
        if conversation == state.conversation:
            return
        state.conversation = conversation
        if len(state.conversation["Conversation"]) > 0:
            state.selected_row = [len(state.conversation["Conversation"]) - 1]

    def erase_conv(state: State) -> None:
        with open("conv.txt", "w") as f:
            f.write("")
        conversation["Conversation"] = []
        state.conversation = conversation

    def style_conv(state: State, idx: int, row: int) -> str:
        if idx is None:
            return None
        elif idx % 2 == 0:
            return "user_message"
        else:
            return "gpt_message"

    page = """
<|layout|columns=300px 1|
<|part|render=True|class_name=sidebar|
# Taipy **Rudra**{: .color-primary} # {: .logo-text}
<|New Conversation|button|class_name=fullwidth plain|id=reset_app_button|on_action=erase_conv|>
<br/>
<|{status}|text|>
|>

<|part|render=True|class_name=p2 align-item-bottom table|
<|{conversation}|table|style=style_conv|show_all|width=100%|rebuild|selected={selected_row}|>
|>
|>
"""

    gui = Gui(page)
    t = Thread(target=client_handler, args=(gui, state_id_list), daemon=True)
    t.start()
    gui.run(debug=True, dark_mode=True)


def run_standalone_server(port=5000):
    """
    Built-in standalone web interface matching the exact Taipy/JARVIS UI layout and display.css.
    Zero external dependencies required (runs directly on Python 3.8 - 3.13+).
    """
    from http.server import HTTPServer, BaseHTTPRequestHandler

    class DisplayHandler(BaseHTTPRequestHandler):
        def log_message(self, format, *args):
            return  # Suppress request spam in console

        def do_GET(self):
            if self.path == "/" or self.path == "/index.html":
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()

                # Read CSS if available
                css_content = ""
                try:
                    with open("display.css", "r") as f:
                        css_content = f.read()
                except Exception:
                    pass

                html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Rudra AI (JARVIS) — Live Conversation</title>
  <style>
    {css_content}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0c10;
      color: #e0e2ec;
      display: flex;
      height: 100vh;
      overflow: hidden;
    }}
    .sidebar {{
      width: 300px;
      background-color: #15161c;
      border-right: 1px solid #282a36;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      shrink: 0;
    }}
    .logo-text {{
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.5px;
    }}
    .logo-text span {{
      color: #ff462b;
    }}
    .btn-reset {{
      width: 100%;
      padding: 12px 16px;
      background: #ff462b;
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
    }}
    .btn-reset:hover {{
      background: #e03820;
    }}
    .btn-reset:active {{
      transform: scale(0.98);
    }}
    .status-badge {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: #1e2029;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 500;
      color: #9ea0a6;
      border: 1px solid #333644;
    }}
    .status-dot {{
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ff462b;
      animation: pulse 1.5s infinite;
    }}
    @keyframes pulse {{
      0% {{ opacity: 0.4; transform: scale(0.9); }}
      50% {{ opacity: 1; transform: scale(1.1); }}
      100% {{ opacity: 0.4; transform: scale(0.9); }}
    }}
    .content-area {{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 30px;
      overflow-y: auto;
    }}
    .messages-container {{
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 900px;
      width: 100%;
      margin: 0 auto;
    }}
    .msg-user {{
      align-self: flex-end;
      background-color: #140a1e;
      color: #ffffff;
      padding: 16px 22px;
      border-radius: 20px;
      max-width: 80%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      font-size: 16px;
      line-height: 1.45;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }}
    .msg-gpt {{
      align-self: flex-start;
      background-color: #ff462b;
      color: #ffffff;
      padding: 16px 22px;
      border-radius: 20px;
      max-width: 80%;
      box-shadow: 0 4px 12px rgba(255, 70, 43, 0.25);
      font-size: 16px;
      line-height: 1.45;
    }}
    .empty-state {{
      color: #555866;
      text-align: center;
      margin: auto;
      font-style: italic;
    }}
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="logo-text">Rudra <span>JARVIS</span></div>
    <button class="btn-reset" onclick="eraseConv()">New Conversation</button>
    <div class="status-badge">
      <span class="status-dot" id="statusDot"></span>
      <span id="statusText">Idle</span>
    </div>
    <div style="margin-top: auto; font-size: 11px; color: #555866; line-height: 1.5;">
      Voice Personal Assistant<br>
      Deepgram &bull; OpenAI &bull; ElevenLabs
    </div>
  </div>

  <div class="content-area" id="scrollContainer">
    <div class="messages-container" id="msgContainer">
      <div class="empty-state">Speak to Rudra via microphone to begin...</div>
    </div>
  </div>

  <script>
    let lastConv = "";
    let lastStatus = "";

    async function poll() {{
      try {{
        const res = await fetch('/api/data');
        const data = await res.json();

        if (data.status !== lastStatus) {{
          lastStatus = data.status;
          document.getElementById('statusText').textContent = data.status || "Idle";
        }}

        if (data.conv !== lastConv) {{
          lastConv = data.conv;
          renderMessages(data.lines);
        }}
      }} catch (e) {{
        console.error(e);
      }}
    }}

    function renderMessages(lines) {{
      const container = document.getElementById('msgContainer');
      if (!lines || lines.length === 0) {{
        container.innerHTML = '<div class="empty-state">Speak to Rudra via microphone to begin...</div>';
        return;
      }}
      container.innerHTML = '';
      lines.forEach((line, idx) => {{
        if (!line.trim()) return;
        const div = document.createElement('div');
        div.className = (idx % 2 === 0) ? 'msg-user' : 'msg-gpt';
        div.textContent = line;
        container.appendChild(div);
      }});
      const scrollContainer = document.getElementById('scrollContainer');
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }}

    async function eraseConv() {{
      await fetch('/api/erase', {{ method: 'POST' }});
      lastConv = "";
      renderMessages([]);
    }}

    setInterval(poll, 500);
    poll();
  </script>
</body>
</html>"""
                self.wfile.write(html.encode("utf-8"))

            elif self.path == "/api/data":
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()

                status = "Idle"
                try:
                    with open("status.txt", "r") as f:
                        status = f.read().strip()
                except Exception:
                    pass

                conv = ""
                try:
                    with open("conv.txt", "r") as f:
                        conv = f.read()
                except Exception:
                    pass

                lines = [line.strip() for line in conv.split("\n") if line.strip()]
                payload = json.dumps({"status": status, "conv": conv, "lines": lines})
                self.wfile.write(payload.encode("utf-8"))

            else:
                self.send_response(404)
                self.end_headers()

        def do_POST(self):
            if self.path == "/api/erase":
                try:
                    with open("conv.txt", "w") as f:
                        f.write("")
                except Exception:
                    pass
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"success": true}')
            else:
                self.send_response(404)
                self.end_headers()

    server = HTTPServer(("0.0.0.0", port), DisplayHandler)
    url = f"http://localhost:{port}"
    print("=" * 60)
    print(f"  RUDRA (JARVIS) WEB DISPLAY RUNNING AT: {url}")
    print("=" * 60)
    print("Opening web interface in your browser...")
    try:
        webbrowser.open(url)
    except Exception:
        pass
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down web display.")


if __name__ == "__main__":
    if TAIPY_AVAILABLE:
        print("Starting with Taipy engine...")
        run_taipy()
    else:
        print("Taipy not detected. Starting high-performance built-in web display...")
        run_standalone_server(port=5000)
