import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { User, Heart, Zap, Sparkles, Volume2, CloudRain, Wind, Waves } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [selectedBackground, setSelectedBackground] = useState("");

  const moods = [
    { id: "tired", label: "Tired", icon: "😴" },
    { id: "stressed", label: "Stressed", icon: "😰" },
    { id: "lonely", label: "Lonely", icon: "🥺" },
    { id: "anxious", label: "Anxious", icon: "😟" },
    { id: "excited", label: "Excited", icon: "✨" },
    { id: "calm", label: "Calm", icon: "😌" }
  ];

  const triggers = [
    "Whispering", "Tapping", "Brushing", "Crinkling", 
    "Rain sounds", "Personal attention", "Role play", "Soft speaking"
  ];

  const voices = [
    { id: "female-whisper", label: "Female Whisper" },
    { id: "male-soft", label: "Male Soft Spoken" },
    { id: "nonbinary-gentle", label: "Gentle Nonbinary" }
  ];

  const backgrounds = [
    { id: "rain", label: "Rain", icon: CloudRain },
    { id: "forest", label: "Forest", icon: Wind },
    { id: "ocean", label: "Ocean", icon: Waves },
    { id: "silent", label: "Silent", icon: Volume2 }
  ];

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleGenerate = () => {
    // Store selections in localStorage for now
    localStorage.setItem('asmr-preferences', JSON.stringify({
      name,
      mood: selectedMood,
      triggers: selectedTriggers,
      voice: selectedVoice,
      background: selectedBackground
    }));
    navigate('/listening-room');
  };

  const isComplete = selectedMood && selectedTriggers.length > 0 && selectedVoice && selectedBackground;

  return (
    <div className="min-h-screen bg-gradient-to-br from-whisper-start to-whisper-end p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Build Your Channel
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell us about yourself to create the perfect ASMR experience
          </p>
        </div>

        <div className="space-y-8">
          {/* Name Input */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Name (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="We can whisper your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50"
              />
            </CardContent>
          </Card>

          {/* Mood Selection */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                How are you feeling?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {moods.map((mood) => (
                  <Button
                    key={mood.id}
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    onClick={() => setSelectedMood(mood.id)}
                    className="h-auto p-4 flex flex-col gap-2"
                  >
                    <span className="text-2xl">{mood.icon}</span>
                    <span>{mood.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trigger Selection */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Your Favorite Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {triggers.map((trigger) => (
                  <Badge
                    key={trigger}
                    variant={selectedTriggers.includes(trigger) ? "default" : "outline"}
                    className="cursor-pointer p-2 hover:scale-105 transition-transform"
                    onClick={() => toggleTrigger(trigger)}
                  >
                    {trigger}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Voice Style */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Voice Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {voices.map((voice) => (
                  <Button
                    key={voice.id}
                    variant={selectedVoice === voice.id ? "default" : "outline"}
                    onClick={() => setSelectedVoice(voice.id)}
                    className="justify-start"
                  >
                    {voice.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Background Sounds */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Background Atmosphere</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {backgrounds.map((bg) => {
                  const Icon = bg.icon;
                  return (
                    <Button
                      key={bg.id}
                      variant={selectedBackground === bg.id ? "default" : "outline"}
                      onClick={() => setSelectedBackground(bg.id)}
                      className="h-auto p-4 flex flex-col gap-2"
                    >
                      <Icon className="w-6 h-6" />
                      <span>{bg.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!isComplete}
            size="lg"
            className="w-full h-14 text-lg"
          >
            Generate My First Whisper ✨
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;