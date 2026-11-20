"""Function for recording audio from a microphone."""
import io
import time
import wave
import struct
import math
from pathlib import Path

import pyaudio

pa = pyaudio.PyAudio()


def calculate_rms(data: bytes) -> float:
    """Calculate the Root Mean Square (volume level) of an audio chunk."""
    count = len(data) // 2
    if count == 0:
        return 0.0
    try:
        shorts = struct.unpack(f"{count}h", data)
        sum_squares = sum(s * s for s in shorts)
        return math.sqrt(sum_squares / count)
    except Exception:
        return 0.0


def speech_to_text(output_path: str = "audio/recording.wav", silence_seconds: float = 2.0, threshold: float = 600.0) -> None:
    """
    Records audio from the microphone until silence is detected.
    Saves audio to output_path (default: audio/recording.wav).
    Uses pure-Python RMS detection compatible with Python 3.8 - 3.13+.
    """
    rate = 16000
    chunk_size = 960
    channels = 1
    sample_format = pyaudio.paInt16

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    try:
        audio_stream = pa.open(
            rate=rate,
            format=sample_format,
            channels=channels,
            input=True,
            frames_per_buffer=chunk_size,
        )
    except Exception as e:
        print(f"Microphone initialization notice: {e}")
        # Create an empty or silent wav file as fallback
        with wave.open(output_path, "wb") as wf:
            wf.setnchannels(channels)
            wf.setsampwidth(2)
            wf.setframerate(rate)
            wf.writeframes(b"\x00" * (rate * 2))
        return

    frames = []
    has_started_speaking = False
    silence_start_time = None
    start_time = time.time()
    max_record_time = 15.0  # Max 15 seconds per turn

    try:
        while True:
            chunk = audio_stream.read(chunk_size, exception_on_overflow=False)
            frames.append(chunk)

            rms = calculate_rms(chunk)

            if rms > threshold:
                if not has_started_speaking:
                    has_started_speaking = True
                silence_start_time = None
            else:
                if has_started_speaking:
                    if silence_start_time is None:
                        silence_start_time = time.time()
                    elif time.time() - silence_start_time >= silence_seconds:
                        # User stopped speaking
                        break

            # If user hasn't spoken for 6 seconds, stop waiting
            if not has_started_speaking and (time.time() - start_time) > 6.0:
                break

            # Safety cap
            if time.time() - start_time > max_record_time:
                break

    finally:
        try:
            audio_stream.stop_stream()
            audio_stream.close()
        except Exception:
            pass

    # Save to WAV file
    with wave.open(output_path, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(2)
        wf.setframerate(rate)
        wf.writeframes(b"".join(frames))


if __name__ == "__main__":
    print("Recording audio test...")
    speech_to_text()
    print("Saved to audio/recording.wav")
