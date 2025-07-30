export interface ASMRPreferences {
  name?: string;
  mood: string;
  triggers: string[];
  voice: string;
  background: string;
  intensity?: string;
}

export const generateASMRScript = (preferences: ASMRPreferences): string => {
  const { name, mood, triggers, voice, background } = preferences;
  
  // Create personalized greeting
  const greeting = name 
    ? `Hello ${name}, welcome to your personal ASMR session.` 
    : "Welcome to your personal ASMR session.";
  
  // Mood-based introductions
  const moodIntros = {
    relaxed: "Let's take some time to unwind and let go of any tension.",
    sleepy: "It's time to prepare your mind and body for peaceful sleep.",
    stressed: "Let's slow down and find some calm in this moment.",
    anxious: "Take a deep breath with me, and let's ease that anxiety away.",
    focused: "Let's clear your mind and help you find your center.",
    lonely: "You're not alone. I'm here with you, and we'll spend this time together.",
    sad: "It's okay to feel what you're feeling. Let's find some comfort together."
  };
  
  // Trigger-based content
  const triggerScripts = {
    whispering: [
      "Listen to the gentle sound of my voice, soft and soothing.",
      "Each whisper is meant just for you, carrying away your worries.",
      "Let these soft sounds wash over you like a gentle breeze."
    ],
    tapping: [
      "Can you hear these gentle taps? Each one is rhythmic and calming.",
      "The soft tapping creates a peaceful pattern, like raindrops on a window.",
      "Focus on each tap, letting it guide you deeper into relaxation."
    ],
    brushing: [
      "Imagine soft bristles gently brushing away all your stress.",
      "The rhythmic brushing sounds help your mind drift and wander.",
      "Each brush stroke is like a gentle caress, soothing and comforting."
    ],
    "page turning": [
      "Listen to the delicate sound of pages turning slowly.",
      "Each page carries away a worry, leaving space for peace.",
      "The gentle rustling of paper creates a cocoon of calm around you."
    ],
    rain: [
      "Let the gentle patter of rain wash away your concerns.",
      "Each drop brings renewal and freshness to your spirit.",
      "The steady rhythm of rainfall creates perfect harmony for rest."
    ],
    "personal attention": [
      "You deserve this moment of care and attention.",
      "I'm here to take care of you, to help you feel valued and peaceful.",
      "This time is just for you, to feel heard and understood."
    ]
  };
  
  // Build the script
  let script = greeting + " ";
  
  // Add mood introduction
  script += moodIntros[mood as keyof typeof moodIntros] || moodIntros.relaxed;
  script += " ";
  
  // Add trigger-specific content
  const selectedTriggers = triggers.slice(0, 2); // Use first 2 triggers
  selectedTriggers.forEach(trigger => {
    const triggerContent = triggerScripts[trigger as keyof typeof triggerScripts];
    if (triggerContent) {
      const randomContent = triggerContent[Math.floor(Math.random() * triggerContent.length)];
      script += randomContent + " ";
    }
  });
  
  // Add background-aware content
  const backgroundContent = {
    rain: "The gentle rain outside creates the perfect atmosphere for our time together.",
    forest: "Imagine you're in a peaceful forest, surrounded by nature's gentle sounds.",
    ocean: "Let the distant sound of waves carry you to a place of complete tranquility.",
    silence: "In this quiet space, we can focus entirely on these gentle sounds and your breathing.",
    fireplace: "The warm, crackling sounds create a cozy sanctuary just for you."
  };
  
  script += backgroundContent[background as keyof typeof backgroundContent] || "";
  script += " ";
  
  // Add closing
  const closings = [
    "Take your time, breathe deeply, and let yourself fully relax.",
    "You're safe here, and you can stay as long as you need.",
    "Feel the peace settling over you like a warm, gentle blanket.",
    "Let go of everything else and just be present in this moment."
  ];
  
  script += closings[Math.floor(Math.random() * closings.length)];
  
  // Add name if provided
  if (name) {
    script += ` Sweet dreams, ${name}.`;
  }
  
  return script;
};

export const generateQuickVariation = (baseScript: string, suggestion: string): string => {
  const variations = {
    "Faster brushing": baseScript.replace(/gentle/g, "rhythmic").replace(/slow/g, "steady"),
    "More rain sounds": baseScript + " Listen as the rain grows a little stronger, each drop creating perfect harmony.",
    "Add affirmations": baseScript + " You are worthy of peace. You are deserving of rest. You are exactly where you need to be.",
    "Softer whispers": baseScript.replace(/Listen/g, "Softly listen").replace(/Can you hear/g, "Can you gently hear"),
    "Different triggers": baseScript.replace(/tapping/g, "gentle scratching").replace(/brushing/g, "soft fabric sounds")
  };
  
  return variations[suggestion as keyof typeof variations] || baseScript;
};