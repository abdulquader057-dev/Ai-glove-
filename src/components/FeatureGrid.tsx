"use client";

import { Zap, Brain, Wifi, Accessibility } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Real-time recognition",
    description: "Detects gestures in under 300ms — faster than human reaction time",
    icon: <Zap className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    title: "AI powered",
    description: "Edge ML model runs locally on the device — no cloud required",
    icon: <Brain className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    title: "Wireless",
    description: "Bluetooth LE with 30-meter range and minimal power consumption",
    icon: <Wifi className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    title: "Accessibility first",
    description: "Designed with the deaf and non-verbal community",
    icon: <Accessibility className="w-6 h-6" strokeWidth={1.5} />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6 } 
  },
};

export default function FeatureGrid() {
  return (
    <section id="features" className="py-20 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Advanced technology, simplified.
          </h2>
          <p className="text-lg text-text-secondary">
            AI Glove combines off-the-shelf hardware with custom machine learning models to deliver 
            unprecedented accuracy in a lightweight, wearable format.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-border-hover transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg bg-bg-secondary flex items-center justify-center text-accent group-hover:text-accent-hover transition-colors mb-5">
                {feature.icon}
              </div>
              <h3 className="text-[15px] font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
