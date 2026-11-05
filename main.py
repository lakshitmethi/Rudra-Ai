"""Main file for the Rudra (JARVIS) AI Assistant project"""
import os
from os import PathLike
from time import time
import asyncio
from typing import Union

from dotenv import load_dotenv
import pygame
from pygame import mixer

from record import speech_to_text

# Load API keys from .env
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

# Initialize OpenAI Client
gpt_client = None
if OPENAI_API_KEY:
    try:
        import openai
        gpt_client = openai.Client(api_key=OPENAI_API_KEY)
    except Exception as e:
        print(f"Notice initializing OpenAI client: {e}")

# Initialize Deepgram
deepgram_client = None
if DEEPGRAM_API_KEY:
    try:
        # Support Deepgram SDK v3
        from deepgram import DeepgramClient
        deepgram_client = DeepgramClient(DEEPGRAM_API_KEY)
    except ImportError:
        try:
            # Fallback to Deepgram SDK v2
            from deepgram import Deepgram
            deepgram_client = Deepgram(DEEPGRAM_API_KEY)
        except Exception as e:
            print(f"Notice initializing Deepgram client: {e}")

# Initialize ElevenLabs
elevenlabs_available = False
if ELEVENLABS_API_KEY:
    try:
        import elevenlabs
        if hasattr(elevenlabs, "set_api_key"):
            elevenlabs.set_api_key(ELEVENLABS_API_KEY)
        elevenlabs_available = True
    except Exception as e:
        print(f"Notice initializing ElevenLabs: {e}")

# Initialize Pygame Mixer for audio output
try:
    mixer.init()
except Exception as e:
    print(f"Notice initializing Pygame mixer: {e}")

# Rudra Assistant context and personality
DEFAULT_CONTEXT = (
    "You are Rudra, an advanced personal AI voice assistant inspired by JARVIS. "
    "You are witty, sharp, intelligent, and full of personality. "
    "Your answers should be limited to 1-2 short sentences."
)
context = os.getenv("RUDRA_CONTEXT", DEFAULT_CONTEXT)
RECORDING_PATH = "audio/recording.wav"


def request_gpt(prompt: str) -> str:
    """
    Send a prompt to the GPT API and return the response.

    Args:
        - prompt: The prompt / conversation history to send.

    Returns:
        The response from the API.
    """
    if not gpt_client:
        return "I am ready, but please configure your OPENAI_API_KEY in the .env file."

    try:
        response = gpt_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"{prompt}",
                }
            ],
            model="gpt-3.5-turbo",
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI Error: {e}")
        return f"Encountered an issue communicating with OpenAI: {e}"


async def transcribe(
    file_name: Union[Union[str, bytes, PathLike[str], PathLike[bytes]], int]
):
    """
    Transcribe audio using Deepgram API.

    Args:
        - file_name: The name of the file to transcribe.

    Returns:
        List of transcribed words or transcript string.
    """
    if not deepgram_client:
        print("Warning: DEEPGRAM_API_KEY not set. Check .env")
        return []

    try:
        with open(file_name, "rb") as audio:
            # Check for Deepgram SDK v3
            if hasattr(deepgram_client, "listen"):
                from deepgram import PrerecordedOptions, FileSource
                payload: FileSource = {"buffer": audio.read()}
                options = PrerecordedOptions(model="nova-2", smart_format=True)
                response = deepgram_client.listen.rest.v("1").transcribe_file(payload, options)
                words = response.results.channels[0].alternatives[0].words
                return [{"word": w.word} for w in words]
            # Deepgram SDK v2
            elif hasattr(deepgram_client, "transcription"):
                source = {"buffer": audio, "mimetype": "audio/wav"}
                response = await deepgram_client.transcription.prerecorded(source)
                return response["results"]["channels"][0]["alternatives"][0]["words"]
    except Exception as e:
        print(f"Deepgram transcription error: {e}")
        return []

    return []


def generate_audio(text: str, output_path: str = "audio/response.wav") -> bool:
    """
    Generate speech audio from text using ElevenLabs or system TTS fallback.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    if elevenlabs_available:
        try:
            import elevenlabs
            # ElevenLabs v0.x
            if hasattr(elevenlabs, "generate"):
                audio = elevenlabs.generate(
                    text=text, voice="Adam", model="eleven_monolingual_v1"
                )
                elevenlabs.save(audio, output_path)
                return True
            # ElevenLabs v1.x
            elif hasattr(elevenlabs, "client"):
                from elevenlabs.client import ElevenLabs
                client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
                audio_stream = client.generate(
                    text=text, voice="Adam", model="eleven_multilingual_v2"
                )
                with open(output_path, "wb") as f:
                    for chunk in audio_stream:
                        f.write(chunk)
                return True
        except Exception as e:
            print(f"ElevenLabs generation error: {e}")

    # Fallback: create silent audio or try pyttsx3
    try:
        import pyttsx3
        engine = pyttsx3.init()
        engine.save_to_file(text, output_path)
        engine.runAndWait()
        return True
    except Exception:
        pass

    return False


def log(log_msg: str):
    """
    Print and write to status.txt
    """
    print(log_msg)
    try:
        with open("status.txt", "w") as f:
            f.write(log_msg)
    except Exception:
        pass


if __name__ == "__main__":
    print("=" * 60)
    print("  RUDRA (JARVIS) VOICE ASSISTANT INITIALIZED")
    print("=" * 60)
    
    # Ensure audio directory exists
    os.makedirs("audio", exist_ok=True)
    
    while True:
        # Record audio
        log("Listening...")
        speech_to_text()
        log("Done listening")

        # Transcribe audio
        current_time = time()
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        words = loop.run_until_complete(transcribe(RECORDING_PATH))
        
        string_words = " ".join(
            word_dict.get("word") for word_dict in words if isinstance(word_dict, dict) and "word" in word_dict
        )
        
        # If no transcription detected, prompt again
        if not string_words.strip():
            print("No speech detected or missing API key. Retrying...")
            continue
            
        with open("conv.txt", "a") as f:
            f.write(f"{string_words}\n")
        transcription_time = time() - current_time
        log(f"Finished transcribing in {transcription_time:.2f} seconds.")

        # Get response from GPT
        current_time = time()
        context += f"\nUser: {string_words}\nRudra: "
        response = request_gpt(context)
        context += response
        gpt_time = time() - current_time
        log(f"Finished generating response in {gpt_time:.2f} seconds.")

        # Convert response to audio
        current_time = time()
        audio_created = generate_audio(response, "audio/response.wav")
        audio_time = time() - current_time
        log(f"Finished generating audio in {audio_time:.2f} seconds.")

        # Play response
        log("Speaking...")
        with open("conv.txt", "a") as f:
            f.write(f"{response}\n")

        if audio_created and os.path.exists("audio/response.wav"):
            try:
                sound = mixer.Sound("audio/response.wav")
                sound.play()
                pygame.time.wait(int(sound.get_length() * 1000))
            except Exception as e:
                print(f"Playback error: {e}")

        print(f"\n --- USER: {string_words}\n --- RUDRA: {response}\n")
