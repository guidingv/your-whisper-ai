import { Card } from "@/components/ui/card";
import { User, Wand2, Headphones } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: User,
      title: "Tell Us About You",
      description: "Share your name, mood, and favorite triggers. Everything is personalized just for you.",
      gradient: "from-primary to-primary-soft"
    },
    {
      icon: Wand2,
      title: "AI Creates Your ASMR",
      description: "Our AI generates a unique whisper experience tailored to your preferences in seconds.",
      gradient: "from-primary-soft to-accent"
    },
    {
      icon: Headphones,
      title: "Instant Comfort",
      description: "Relax and enjoy your personalized ASMR. Create unlimited variations whenever you need.",
      gradient: "from-accent to-secondary"
    }
  ];

  return (
    <section className="py-20 bg-whisper">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to your perfect ASMR experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="p-8 text-center bg-card/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 shadow-card hover:shadow-whisper group"
            >
              {/* Step Number */}
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-6">
                {index + 1}
              </div>

              {/* Icon with Gradient */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} p-4 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-full h-full text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;