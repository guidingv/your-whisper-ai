import { useState, useCallback, useRef } from 'react';
import { KokoroTTS } from 'kokoro-js';

export const useTTS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ttsRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initializeTTS = useCallback(async () => {
    if (ttsRef.current) return ttsRef.current;
    
    setIsLoading(true);
    setError(null);
    try {
      console.log('Initializing Kokoro TTS...');
      ttsRef.current = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
        dtype: 'q8', // Quantized for faster loading
        progress_callback: (progress: any) => {
          if (progress.status === 'downloading') {
            setProgress(Math.round(progress.progress || 0));
          }
        }
      });
      console.log('Kokoro TTS initialized successfully');
      return ttsRef.current;
    } catch (err) {
      console.error('Failed to initialize TTS:', err);
      setError('Failed to load TTS model. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateSpeech = useCallback(async (text: string, voiceStyle?: string, triggers?: string[]) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const tts = await initializeTTS();
      console.log('Generating speech for:', text.substring(0, 50) + '...');
      
      // Map ASMR voice styles to Kokoro voices
      const voiceMapping = {
        'female-whisper': 'af_bella',
        'male-soft': 'am_adam', 
        'nonbinary-gentle': 'af_sarah'
      };
      
      const selectedVoice = voiceMapping[voiceStyle as keyof typeof voiceMapping] || 'af_bella';
      
      // Modify text for ASMR effects based on triggers
      let processedText = text;
      if (triggers?.includes('Whispering') || voiceStyle === 'female-whisper') {
        // Add whisper markers and slow down speech
        processedText = processedText.replace(/\./g, '... ').replace(/,/g, ', ');
      }
      
      // Generate audio using Kokoro TTS
      const audio = await tts.generate(processedText, {
        voice: selectedVoice
      });
      
      // Convert the audio data to a blob
      const audioBuffer = audio.audio; // This should be Float32Array
      const sampleRate = audio.sample_rate || 24000;
      
      // Create audio context and buffer
      const audioContext = new AudioContext();
      const buffer = audioContext.createBuffer(1, audioBuffer.length, sampleRate);
      buffer.getChannelData(0).set(audioBuffer);
      
      // Convert to WAV blob
      const blob = await audioBufferToWav(buffer);
      const url = URL.createObjectURL(blob);
      
      setAudioUrl(url);
      console.log('Speech generated successfully');
      return url;
    } catch (err) {
      console.error('Speech generation failed:', err);
      setError('Failed to generate speech. Please try again.');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [initializeTTS]);

  const cleanup = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [audioUrl]);

  return {
    isLoading,
    isGenerating,
    progress,
    audioUrl,
    error,
    generateSpeech,
    cleanup,
    audioRef
  };
};

// Helper function to convert AudioBuffer to WAV
async function audioBufferToWav(buffer: AudioBuffer): Promise<Blob> {
  const length = buffer.length;
  const sampleRate = buffer.sampleRate;
  const numberOfChannels = buffer.numberOfChannels;
  
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * numberOfChannels * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * numberOfChannels * 2, true);
  
  // Convert float32 to int16
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}