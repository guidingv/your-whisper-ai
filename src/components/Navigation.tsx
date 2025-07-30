import { Button } from "@/components/ui/button";
import { Headphones, Menu, User } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-aurora p-2">
              <Headphones className="w-full h-full text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              asmr.channel
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="/library" className="text-muted-foreground hover:text-foreground transition-colors">
              Your Library
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="w-4 h-4" />
              Sign In
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => window.location.href = '/onboarding'}
            >
              Start Free
            </Button>
            
            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;