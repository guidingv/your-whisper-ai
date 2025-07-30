import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Check, Sparkles, Crown, Infinity, 
  Play, Volume2, User, Zap 
} from "lucide-react";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      price: 0,
      yearlyPrice: 0,
      description: "Perfect for trying ASMR",
      features: [
        "3 custom whispers per month",
        "Daily community stream",
        "Basic voice selection",
        "Standard audio quality",
        "Mobile app access"
      ],
      limitations: [
        "No name personalization",
        "Limited background sounds",
        "No download option"
      ],
      cta: "Start Free",
      popular: false,
      icon: Play
    },
    {
      name: "Premium",
      price: 9.99,
      yearlyPrice: 8.33,
      description: "Unlimited personal comfort",
      features: [
        "Unlimited custom whispers",
        "Name personalization in whispers",
        "Premium voice selection",
        "Advanced ambient engine",
        "High-quality audio (320kbps)",
        "Download for offline listening",
        "Sleep timer & playlists",
        "Priority generation speed",
        "Exclusive voice styles"
      ],
      cta: "Go Premium",
      popular: true,
      icon: Sparkles
    },
    {
      name: "Whisper Pass",
      price: 199,
      yearlyPrice: 199,
      isLifetime: true,
      description: "Lifetime of personalized whispers",
      features: [
        "All Premium features forever",
        "1 free custom voice pack monthly",
        "Early access to new features",
        "Exclusive community Discord",
        "Direct feedback to development team",
        "Commercial usage rights",
        "API access for developers"
      ],
      cta: "Get Lifetime Access",
      popular: false,
      icon: Crown
    }
  ];

  const faqItems = [
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
    },
    {
      question: "What makes the premium voices different?",
      answer: "Premium voices are trained on higher quality datasets and offer more natural intonation, better emotional range, and clearer whisper quality."
    },
    {
      question: "How does name personalization work?",
      answer: "Our AI can naturally incorporate your name into whispers and personal attention triggers, making the experience feel more intimate and personal."
    },
    {
      question: "Is there a family plan?",
      answer: "Currently, each subscription is for individual use. We're exploring family options for future releases."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-whisper-start to-whisper-end p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Unlimited Comfort, One Subscription
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the perfect plan for your relaxation journey
          </p>

          {/* Annual Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={!isAnnual ? "font-semibold" : "text-muted-foreground"}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span className={isAnnual ? "font-semibold" : "text-muted-foreground"}>
              Annual
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const currentPrice = plan.isLifetime 
              ? plan.price 
              : isAnnual 
                ? plan.yearlyPrice 
                : plan.price;

            return (
              <Card
                key={plan.name}
                className={`glass-card relative ${
                  plan.popular 
                    ? 'ring-2 ring-primary scale-105 shadow-2xl' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="px-4 py-1 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">
                        ${currentPrice}
                      </span>
                      {!plan.isLifetime && (
                        <span className="text-muted-foreground">
                          /{isAnnual ? 'mo' : 'mo'}
                        </span>
                      )}
                    </div>
                    {plan.isLifetime && (
                      <p className="text-sm text-muted-foreground mt-1">
                        One-time payment
                      </p>
                    )}
                    {isAnnual && !plan.isLifetime && plan.price > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Billed annually at ${(currentPrice * 12).toFixed(0)}
                      </p>
                    )}
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button 
                    className="w-full h-12 text-lg"
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations?.map((limitation, index) => (
                      <div key={index} className="flex items-center gap-3 opacity-60">
                        <div className="w-4 h-4 rounded-full border border-muted-foreground/30 flex-shrink-0" />
                        <span className="text-sm line-through">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Hear the Difference
          </h2>
          
          <Card className="glass-card">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Free Experience
                  </h3>
                  <div className="p-4 bg-background/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Sample whisper:</p>
                    <p className="italic">"Hello there, let me help you relax with some gentle sounds..."</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Play Free Sample
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Premium Experience
                  </h3>
                  <div className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Personalized whisper:</p>
                    <p className="italic">"Hello Sarah, I know you've had a long day. Let me whisper away your stress with your favorite brushing sounds..."</p>
                  </div>
                  <Button className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Play Premium Sample
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {faqItems.map((faq, index) => (
              <Card key={index} className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="glass-card text-center">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready for Unlimited Whispers?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands finding their perfect sleep and relaxation companion
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                View All Features
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;