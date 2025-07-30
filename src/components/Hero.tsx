import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Headphones, Sparkles, Volume2 } from "lucide-react";
import heroImage from "@/assets/hero-asmr.jpg";

const Hero = () => {
  const handleGenerateWhisper = () => {
    // Navigate to onboarding
    console.log("Generate first whisper");
  };

  const handlePlayDemo = () => {
    console.log("Play demo");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-glow/10 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-float delay-1000" />
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-secondary/10 rounded-full blur-xl animate-float delay-2000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <div className="mb-8 animate-breathe">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-aurora bg-clip-text text-transparent leading-tight">
              ASMR That
              <br />
              <span className="text-primary-glow">Whispers Your Name</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Personalized AI-generated ASMR experiences crafted just for you. 
              No searching, no ads, no loops. Just pure comfort, on demand.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={() => window.location.href = '/onboarding'}
              className="animate-pulse-glow"
            >
              <Sparkles className="w-5 h-5" />
              Generate My First Whisper
            </Button>
            <Button 
              variant="floating" 
              size="xl" 
              onClick={handlePlayDemo}
            >
              <Play className="w-5 h-5" />
              Hear a 10s Preview
            </Button>
          </div>

          {/* Demo Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-glow mb-2">&lt; 15s</div>
              <div className="text-sm text-muted-foreground">To first whisper</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-glow mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Unique experiences</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-glow mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Available comfort</div>
            </div>
          </div>

          {/* Trigger Cloud */}
          <Card className="p-8 backdrop-blur-md bg-card/50 border-primary/20 shadow-whisper">
            <h3 className="text-xl font-semibold mb-6 text-center">Popular Triggers</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Soft Whispers", icon: Volume2 },
                { name: "Rain Sounds", icon: Headphones },
                { name: "Page Turning", icon: Play },
                { name: "Gentle Tapping", icon: Sparkles },
                { name: "Hair Brushing", icon: Volume2 },
                { name: "Forest Ambience", icon: Headphones },
              ].map((trigger, index) => (
                <Button
                  key={trigger.name}
                  variant="whisper"
                  size="sm"
                  className="hover:animate-pulse-glow"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <trigger.icon className="w-4 h-4" />
                  {trigger.name}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hero;