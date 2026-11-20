"""
main.py — Core Voice Assistant Loop for Rudra (JARVIS)
Workflow: Microphone -> Deepgram (STT) -> OpenAI GPT (LLM) -> ElevenLabs/Windows TTS (Speech) -> Pygame
"""

import os
import sys
import time
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import requests

from record import speech_to_text

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

# Initialize OpenAI
gpt_client = None
if OPENAI_API_KEY:
    try:
        import openai
        gpt_client = openai.Client(api_key=OPENAI_API_KEY)
    except Exception as e:
        print(f"Notice initializing OpenAI client: {e}")

# Initialize Pygame Mixer for Audio Playback
mixer_initialized = False
try:
    import pygame
    from pygame import mixer
    mixer.init()
    mixer_initialized = True
except Exception as e:
    print(f"Notice initializing Pygame mixer: {e}")

# Personality Context
DEFAULT_CONTEXT = (
    "You are Rudra, an advanced personal AI voice assistant inspired by JARVIS. "
    "You are witty, sharp, intelligent, and helpful. "
    "Keep your answers short and conversational, limited to 1-2 sentences."
)
context = os.getenv("RUDRA_CONTEXT", DEFAULT_CONTEXT)
RECORDING_PATH = "audio/recording.wav"
RESPONSE_AUDIO_PATH = "audio/response.wav"


def log(log_msg: str):
    """Print to console and write to status.txt for web interface synchronization."""
    print(log_msg)
    try:
        with open("status.txt", "w") as f:
            f.write(log_msg)
    except Exception:
        pass


def transcribe_audio(file_path: str) -> str:
    """Transcribe audio using Deepgram REST API (fast, reliable, zero SDK version conflicts)."""
    if not os.path.exists(file_path):
        return ""

    if not DEEPGRAM_API_KEY:
        print("\n[!] Notice: DEEPGRAM_API_KEY is not set in .env.")
        return ""

    url = "https://api.deepgram.com/v1/listen?smart_format=true&model=nova-2"
    headers = {
        "Authorization": f"Token {DEEPGRAM_API_KEY}",
        "Content-Type": "audio/wav",
    }

    try:
        with open(file_path, "rb") as audio_file:
            response = requests.post(url, headers=headers, data=audio_file, timeout=15)
            if response.status_code == 200:
                data = response.json()
                transcript = (
                    data.get("results", {})
                    .get("channels", [{}])[0]
                    .get("alternatives", [{}])[0]
                    .get("transcript", "")
                )
                return transcript.strip()
            else:
                print(f"Deepgram API Error ({response.status_code}): {response.text}")
    except Exception as e:
        print(f"Deepgram connection error: {e}")

    return ""


def request_gpt(prompt_context: str) -> str:
    """Send conversation context to OpenAI GPT."""
    if not gpt_client:
        return "I am listening, but please add your OPENAI_API_KEY to the .env file so I can generate live answers."

    try:
        response = gpt_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt_context}],
            model="gpt-3.5-turbo",
            max_tokens=150,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return f"I encountered an issue connecting to OpenAI: {e}"


def generate_and_play_speech(text: str) -> None:
    """Synthesize speech using ElevenLabs (if configured) or Windows built-in voice synthesizer."""
    Path("audio").mkdir(parents=True, exist_ok=True)
    audio_played = False

    # 1. Try ElevenLabs REST API
    if ELEVENLABS_API_KEY:
        # Default Adam voice ID or Rachel
        voice_id = "pNInz6obpgDQGcFmaJgB"  # Adam
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }
        payload = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
        }
        try:
            res = requests.post(url, json=payload, headers=headers, timeout=15)
            if res.status_code == 200:
                with open(RESPONSE_AUDIO_PATH, "wb") as f:
                    f.write(res.content)
                if mixer_initialized:
                    sound = mixer.Sound(RESPONSE_AUDIO_PATH)
                    sound.play()
                    pygame.time.wait(int(sound.get_length() * 1000))
                    audio_played = True
        except Exception as e:
            print(f"ElevenLabs TTS error: {e}")

    # 2. Windows Native SAPI Speech Fallback (Zero install required, works on all Windows PCs)
    if not audio_played:
        try:
            safe_text = text.replace('"', ' ').replace("'", " ")
            cmd = f'powershell -Command "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak(\'{safe_text}\')"'
            subprocess.run(cmd, shell=True, check=False)
        except Exception as e:
            print(f"Speech playback notice: {e}")


def main_loop():
    global context
    print("=" * 60)
    print("  RUDRA (JARVIS) VOICE ASSISTANT INITIALIZED")
    print("=" * 60)
    print("Microphone listening loop starting...\n")

    Path("audio").mkdir(parents=True, exist_ok=True)

    # Inform user about API keys if missing
    if not OPENAI_API_KEY or not DEEPGRAM_API_KEY:
        print("[!] Quick Setup Tip: You can configure your keys in .env:")
        print("    - OPENAI_API_KEY (from platform.openai.com)")
        print("    - DEEPGRAM_API_KEY (from console.deepgram.com)")
        print("    - ELEVENLABS_API_KEY (optional, Windows voice used as fallback)\n")

    while True:
        log("Listening...")
        speech_to_text(output_path=RECORDING_PATH, silence_seconds=2.0)
        log("Done listening")

        # Transcribe
        t0 = time.time()
        user_text = transcribe_audio(RECORDING_PATH)
        transcription_time = time.time() - t0

        if not user_text:
            # If no speech transcribed or key missing, wait briefly and listen again
            time.sleep(1.0)
            continue

        log(f"Finished transcribing in {transcription_time:.2f} seconds.")

        # Log User text to conv.txt
        with open("conv.txt", "a", encoding="utf-8") as f:
            f.write(f"{user_text}\n")

        # Get LLM Response
        t0 = time.time()
        context += f"\nUser: {user_text}\nRudra: "
        response = request_gpt(context)
        context += response
        gpt_time = time.time() - t0
        log(f"Finished generating response in {gpt_time:.2f} seconds.")

        # Log Assistant response to conv.txt
        with open("conv.txt", "a", encoding="utf-8") as f:
            f.write(f"{response}\n")

        # Speak
        log("Speaking...")
        generate_and_play_speech(response)

        print(f"\n--- USER: {user_text}")
        print(f"--- RUDRA: {response}\n")


if __name__ == "__main__":
    try:
        main_loop()
    except KeyboardInterrupt:
        log("Idle")
        print("\nRudra Assistant stopped.")
