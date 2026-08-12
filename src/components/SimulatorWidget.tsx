"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, RefreshCw, Brain } from "lucide-react";

type GestureData = {
  name: string;
  emoji: string;
  confidence: number;
  sensors: number[]; // [Thumb, Index, Middle, Ring, Pinky] 0-100
};

const GESTURES: Record<string, GestureData> = {
  peace: { name: "Peace", emoji: "✌️", confidence: 94, sensors: [80, 10, 10, 95, 90] },
  hello: { name: "Hello", emoji: "👋", confidence: 88, sensors: [15, 15, 15, 15, 15] },
  love: { name: "Love you", emoji: "🤟", confidence: 91, sensors: [10, 10, 95, 95, 10] },
  thumbsup: { name: "Thumbs up", emoji: "👍", confidence: 96, sensors: [10, 90, 90, 90, 90] },
  fist: { name: "Fist", emoji: "✊", confidence: 98, sensors: [95, 95, 95, 95, 95] },
  open: { name: "Open hand", emoji: "✋", confidence: 85, sensors: [5, 5, 5, 5, 5] },
};

const FINGER_NAMES = ["Thumb", "Index", "Middle", "Ring", "Pinky"];

export default function SimulatorWidget() {
  const [activeGesture, setActiveGesture] = useState<string>("peace");
  const [liveSensors, setLiveSensors] = useState<number[]>([...GESTURES["peace"].sensors]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Simulate noise jitter
  useEffect(() => {
    const interval = setInterval(() => {
      const target = GESTURES[activeGesture].sensors;
      setLiveSensors(current => 
        current.map((val, i) => {
          // Add ±3% noise
          const noise = (Math.random() * 6) - 3;
          // Slowly drift towards target
          const drifted = val + (target[i] - val) * 0.1;
          return Math.max(0, Math.min(100, drifted + noise));
        })
      );
    }, 800);
    return () => clearInterval(interval);
  }, [activeGesture]);

  const handleSpeak = () => {
    setIsSpeaking(true);
    // In a real app, we'd use SpeechSynthesis API here
    setTimeout(() => setIsSpeaking(false), 1500);
  };

  return (
    <section id="demo" className="py-20 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Try the live simulator
          </h2>
          <p className="text-lg text-text-secondary">
            Select a gesture to see how the flex sensors respond and the machine learning model classifies the output in real-time.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-border rounded-xl shadow-lg overflow-hidden">
            
            {/* Top Bar */}
            <div className="bg-bg-secondary border-b border-border px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                  Live Sensor Feed
                </span>
              </div>
              <span className="text-xs text-text-muted font-mono">Status: Connected</span>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-8">
              
              {/* Left: Sensors */}
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-4 uppercase tracking-wider">Raw Flex Data</h3>
                <div className="space-y-4">
                  {FINGER_NAMES.map((name, i) => (
                    <div key={name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-primary font-medium">{name}</span>
                        <span className="text-text-muted font-mono">{Math.round(liveSensors[i])}%</span>
                      </div>
                      <div className="h-2 w-full bg-bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary"
                          animate={{ width: `${liveSensors[i]}%` }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Output */}
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-text-secondary mb-4 uppercase tracking-wider">ML Classification</h3>
                <div className="flex-1 bg-bg-secondary border border-border rounded-lg flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  
                  {/* Background Icon */}
                  <Brain className="absolute -right-4 -bottom-4 w-32 h-32 text-border opacity-20 pointer-events-none" />

                  <motion.div 
                    key={activeGesture}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl mb-4"
                  >
                    {GESTURES[activeGesture].emoji}
                  </motion.div>
                  
                  <h4 className="text-2xl font-bold text-text-primary mb-1">
                    {GESTURES[activeGesture].name}
                  </h4>
                  <p className="text-sm text-text-muted font-mono mb-6">
                    Confidence: {GESTURES[activeGesture].confidence}%
                  </p>

                  <button
                    onClick={handleSpeak}
                    disabled={isSpeaking}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                      isSpeaking 
                        ? "bg-success text-white scale-95 shadow-inner" 
                        : "bg-white border border-border text-text-primary hover:border-accent hover:text-accent shadow-sm"
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Speaking...
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Play Audio
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Controls */}
            <div className="bg-bg-secondary border-t border-border p-6">
              <h3 className="text-sm font-medium text-text-secondary mb-4 uppercase tracking-wider">Control Panel</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(GESTURES).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setActiveGesture(key)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeGesture === key
                        ? "bg-primary text-white shadow-md"
                        : "bg-white border border-border text-text-primary hover:border-accent hover:text-accent"
                    }`}
                  >
                    {data.name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
