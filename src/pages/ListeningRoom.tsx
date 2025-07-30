import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTTS } from "@/hooks/useTTS";
import { generateASMRScript, generateQuickVariation } from "@/utils/asmrScripts";
import { 
  Play, Pause, SkipForward, Heart, Download, 
  Timer, Volume2, RefreshCw, Settings, Loader2, ArrowLeft 
} from "lucide-react";

const ListeningRoom = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading: ttsLoading, isGenerating, progress: ttsProgress, audioUrl, error: ttsError, generateSpeech, cleanup, audioRef } = useTTS();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [volume, setVolume] = useState([75]);
  const [isLiked, setIsLiked] = useState(false);
  const [preferences, setPreferences] = useState<any>(null);
  const [currentScript, setCurrentScript] = useState<string>("");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progressUpdateRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const stored = localStorage.getItem('asmr-preferences');
    if (stored) {
      const prefs = JSON.parse(stored);
      setPreferences(prefs);
      
      // Generate initial script and audio
      const script = generateASMRScript(prefs);
      setCurrentScript(script);
      generateInitialAudio(script);
    } else {
      navigate('/onboarding');
    }
  }, [navigate]);

  // Setup audio element event listeners
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      const audio = audioRef.current;
      audio.src = audioUrl;
      audio.volume = volume[0] / 100;
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        setProgress([progressPercent]);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioUrl, volume]);

  // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const generateInitialAudio = async (script: string) => {
    try {
      await generateSpeech(script, preferences?.voice, preferences?.triggers);
      toast({
        title: "ASMR Ready",
        description: "Your personalized whisper session is ready to play.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed", 
        description: "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const suggestions = [
    "Faster brushing",
    "More rain sounds", 
    "Add affirmations",
    "Softer whispers",
    "Different triggers"
  ];

  const handleGenerateNew = async () => {
    if (!preferences) return;
    
    const newScript = generateASMRScript(preferences);
    setCurrentScript(newScript);
    setProgress([0]);
    setCurrentTime(0);
    setIsPlaying(false);
    
    try {
      await generateSpeech(newScript, preferences.voice, preferences.triggers);
      toast({
        title: "New Whisper Generated",
        description: "Your fresh ASMR experience is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate new audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (!currentScript) return;
    
    const variationScript = generateQuickVariation(currentScript, suggestion);
    setCurrentScript(variationScript);
    setProgress([0]);
    setCurrentTime(0);
    setIsPlaying(false);
    
    try {
      await generateSpeech(variationScript, preferences?.voice, preferences?.triggers);
      toast({
        title: "Variation Generated",
        description: `Applied: ${suggestion}`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate variation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (newProgress: number[]) => {
    if (!audioRef.current || !duration) return;
    
    const newTime = (newProgress[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newProgress);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!preferences) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-whisper-start to-whisper-end p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Create New Content
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Your Personal ASMR Feed
          </h1>
          <p className="text-muted-foreground">
            {preferences.name ? `Hello ${preferences.name}, ` : ""}
            here's your customized whisper experience
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Player */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Now Playing</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="w-5 h-5" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Track Info */}
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-2">
                    {ttsLoading || isGenerating ? 'Generating Your Whisper...' : 
                     `Gentle ${preferences.triggers?.[0]} for ${preferences.mood}`}
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {preferences.triggers?.slice(0, 3).map((trigger: string) => (
                      <Badge key={trigger} variant="secondary">{trigger}</Badge>
                    ))}
                  </div>
                  {(ttsLoading || isGenerating) && (
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        {ttsLoading ? `Loading TTS Model... ${ttsProgress}%` : 'Generating speech...'}
                      </span>
                    </div>
                  )}
                  {ttsError && (
                    <div className="mt-2 text-sm text-destructive">
                      {ttsError}
                    </div>
                  )}
                </div>

                {/* Waveform Visualization */}
                <div className="h-32 bg-background/20 rounded-lg flex items-center justify-center">
                  {(ttsLoading || isGenerating) ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="text-muted-foreground">
                        {ttsLoading ? 'Loading...' : 'Generating...'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 h-16">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 bg-primary/60 rounded transition-all duration-300 ${
                            isPlaying && audioUrl ? 'animate-pulse' : ''
                          }`}
                          style={{ 
                            height: `${Math.random() * 100}%`,
                            animationDelay: `${i * 50}ms`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={progress}
                    onValueChange={handleProgressChange}
                    max={100}
                    step={0.1}
                    className="w-full"
                    disabled={!audioUrl || ttsLoading || isGenerating}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button variant="ghost" size="icon">
                    <Timer className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlayPause}
                    className="w-12 h-12"
                    disabled={!audioUrl || ttsLoading || isGenerating}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>

                  <Button variant="ghost" size="icon">
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-10">
                    {volume[0]}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Generate New */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Want Something New?</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleGenerateNew}
                  className="w-full mb-4"
                  size="lg"
                  disabled={ttsLoading || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Whisper Another One
                    </>
                  )}
                </Button>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Quick variations:</p>
                  <div className="space-y-2">
                    {suggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => handleSuggestionClick(suggestion)}
                        disabled={ttsLoading || isGenerating}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Your Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Mood</p>
                  <Badge variant="secondary" className="capitalize">
                    {preferences.mood}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Voice</p>
                  <Badge variant="secondary">
                    {preferences.voice?.replace('-', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Background</p>
                  <Badge variant="secondary" className="capitalize">
                    {preferences.background}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/onboarding')}
                >
                  Update Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Hidden audio element */}
        <audio ref={audioRef} preload="auto" />
      </div>
    </div>
  );
};

export default ListeningRoom;