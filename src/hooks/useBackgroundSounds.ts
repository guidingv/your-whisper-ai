import { useState, useRef, useCallback, useEffect } from 'react';

interface BackgroundSound {
  id: string;
  name: string;
  isPlaying: boolean;
  volume: number;
  audioNode?: AudioNode;
}

export const useBackgroundSounds = () => {
  const [sounds, setSounds] = useState<BackgroundSound[]>([
    { id: 'rain', name: 'Rain', isPlaying: false, volume: 0.3 },
    { id: 'brushing', name: 'Brushing', isPlaying: false, volume: 0.3 }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const rainNoiseRef = useRef<AudioBufferSourceNode | null>(null);
  const brushingAudioRef = useRef<HTMLAudioElement | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const brushingGainRef = useRef<GainNode | null>(null);

  // Initialize audio context
  const initAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    }
    return audioContextRef.current;
  }, []);

  // Generate rain sound using Web Audio API
  const generateRainSound = useCallback(async () => {
    const audioContext = await initAudioContext();
    
    // Create noise buffer for rain
    const bufferSize = audioContext.sampleRate * 2; // 2 seconds
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate pink noise for more natural rain sound
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    
    return buffer;
  }, [initAudioContext]);

  // Fetch brushing sound from Freesound
  const fetchBrushingSound = useCallback(async () => {
    try {
      // Using a free brushing sound URL (you can replace with Freesound API call)
      const brushingUrl = 'https://freesound.org/data/previews/316/316847_4113635-hq.mp3';
      
      // For demo, we'll use a simple brushing sound simulation
      // In production, you'd make an API call to Freesound
      const audioContext = await initAudioContext();
      const bufferSize = audioContext.sampleRate * 3; // 3 seconds
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate a brushing-like sound with filtered noise and rhythmic patterns
      for (let i = 0; i < bufferSize; i++) {
        const time = i / audioContext.sampleRate;
        const brushPattern = Math.sin(time * 2 * Math.PI) * Math.sin(time * 8 * Math.PI);
        const noise = (Math.random() * 2 - 1) * 0.3;
        const filtered = noise * brushPattern * Math.exp(-time * 0.5);
        data[i] = filtered * 0.4;
      }
      
      return buffer;
    } catch (err) {
      console.error('Failed to fetch brushing sound:', err);
      throw err;
    }
  }, [initAudioContext]);

  const toggleSound = useCallback(async (soundId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const audioContext = await initAudioContext();
      
      if (soundId === 'rain') {
        if (rainNoiseRef.current) {
          // Stop rain
          rainNoiseRef.current.stop();
          rainNoiseRef.current = null;
          if (rainGainRef.current) {
            rainGainRef.current.disconnect();
            rainGainRef.current = null;
          }
        } else {
          // Start rain
          const rainBuffer = await generateRainSound();
          const source = audioContext.createBufferSource();
          const gainNode = audioContext.createGain();
          
          source.buffer = rainBuffer;
          source.loop = true;
          source.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          const rainSound = sounds.find(s => s.id === 'rain');
          gainNode.gain.value = rainSound?.volume || 0.3;
          
          source.start();
          rainNoiseRef.current = source;
          rainGainRef.current = gainNode;
        }
      } else if (soundId === 'brushing') {
        if (brushingAudioRef.current?.paused === false) {
          // Stop brushing
          brushingAudioRef.current.pause();
          brushingAudioRef.current.currentTime = 0;
        } else {
          // Start brushing using generated buffer
          if (brushingGainRef.current) {
            brushingGainRef.current.disconnect();
          }
          
          const brushingBuffer = await fetchBrushingSound();
          const source = audioContext.createBufferSource();
          const gainNode = audioContext.createGain();
          
          source.buffer = brushingBuffer;
          source.loop = true;
          source.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          const brushingSound = sounds.find(s => s.id === 'brushing');
          gainNode.gain.value = brushingSound?.volume || 0.3;
          
          source.start();
          brushingGainRef.current = gainNode;
          
          // Store reference for stopping
          source.onended = () => {
            setSounds(prev => prev.map(s => 
              s.id === 'brushing' ? { ...s, isPlaying: false } : s
            ));
          };
        }
      }
      
      setSounds(prev => prev.map(sound => 
        sound.id === soundId 
          ? { ...sound, isPlaying: !sound.isPlaying }
          : sound
      ));
    } catch (err) {
      console.error('Failed to toggle sound:', err);
      setError(`Failed to play ${soundId} sound`);
    } finally {
      setIsLoading(false);
    }
  }, [sounds, initAudioContext, generateRainSound, fetchBrushingSound]);

  const setVolume = useCallback((soundId: string, volume: number) => {
    setSounds(prev => prev.map(sound => 
      sound.id === soundId ? { ...sound, volume } : sound
    ));
    
    // Update actual audio volume
    if (soundId === 'rain' && rainGainRef.current) {
      rainGainRef.current.gain.value = volume;
    } else if (soundId === 'brushing' && brushingGainRef.current) {
      brushingGainRef.current.gain.value = volume;
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    // Stop rain
    if (rainNoiseRef.current) {
      rainNoiseRef.current.stop();
      rainNoiseRef.current = null;
    }
    if (rainGainRef.current) {
      rainGainRef.current.disconnect();
      rainGainRef.current = null;
    }
    
    // Stop brushing
    if (brushingGainRef.current) {
      brushingGainRef.current.disconnect();
      brushingGainRef.current = null;
    }
    
    setSounds(prev => prev.map(sound => ({ ...sound, isPlaying: false })));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAllSounds]);

  return {
    sounds,
    isLoading,
    error,
    toggleSound,
    setVolume,
    stopAllSounds
  };
};