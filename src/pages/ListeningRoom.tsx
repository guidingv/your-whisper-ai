import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Play, Pause, SkipForward, Heart, Download, 
  Timer, Volume2, RefreshCw, Settings 
} from "lucide-react";

const ListeningRoom = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [volume, setVolume] = useState([75]);
  const [isLiked, setIsLiked] = useState(false);
  const [preferences, setPreferences] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('asmr-preferences');
    if (stored) {
      setPreferences(JSON.parse(stored));
    } else {
      navigate('/onboarding');
    }
  }, [navigate]);

  const suggestions = [
    "Faster brushing",
    "More rain sounds", 
    "Add affirmations",
    "Softer whispers",
    "Different triggers"
  ];

  const handleGenerateNew = () => {
    // Simulate generating new content
    setProgress([0]);
    setIsPlaying(true);
  };

  if (!preferences) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-whisper-start to-whisper-end p-6">
      <div className="max-w-4xl mx-auto">
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
                    Gentle {preferences.triggers?.[0]} for {preferences.mood}
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {preferences.triggers?.slice(0, 3).map((trigger: string) => (
                      <Badge key={trigger} variant="secondary">{trigger}</Badge>
                    ))}
                  </div>
                </div>

                {/* Waveform Visualization */}
                <div className="h-32 bg-background/20 rounded-lg flex items-center justify-center">
                  <div className="flex items-center gap-1 h-16">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-primary/60 rounded transition-all duration-300 ${
                          isPlaying ? 'animate-pulse' : ''
                        }`}
                        style={{ 
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 50}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={progress}
                    onValueChange={setProgress}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>2:34</span>
                    <span>15:30</span>
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
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12"
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
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Whisper Another One
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
      </div>
    </div>
  );
};

export default ListeningRoom;