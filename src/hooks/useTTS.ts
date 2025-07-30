import { useState, useCallback, useRef } from 'react';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

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
      console.log('Initializing SpeechT5 TTS...');
      ttsRef.current = await pipeline(
        'text-to-speech',
        'Xenova/speecht5_tts',
        { 
          device: 'webgpu',
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              setProgress(Math.round(progress.progress || 0));
            }
          }
        }
      );
      console.log('SpeechT5 TTS initialized successfully');
      return ttsRef.current;
    } catch (err) {
      console.error('Failed to initialize TTS:', err);
      setError('Failed to load TTS model. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateSpeech = useCallback(async (text: string, voice?: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const tts = await initializeTTS();
      console.log('Generating speech for:', text.substring(0, 50) + '...');
      
      // For SpeechT5, we need speaker embeddings
      const result = await tts(text, {
        speaker_embeddings: 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin'
      });
      
      // Convert the result to audio blob
      const audioData = result.audio;
      const sampleRate = result.sampling_rate || 24000;
      
      // Create audio buffer
      const audioContext = new AudioContext();
      const audioBuffer = audioContext.createBuffer(1, audioData.length, sampleRate);
      audioBuffer.getChannelData(0).set(audioData);
      
      // Convert to WAV blob
      const blob = await audioBufferToWav(audioBuffer);
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