import React from "react";
import { motion } from "framer-motion";
import {
  Radio,
  Brain,
  Bell,
  Calendar,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Radio,
    title: "Real-Time Telemetry",
    description:
      "Continuous monitoring of 200+ vehicle sensors including engine, brakes, battery, and transmission",
    color: "bg-blue-500",
  },
  {
    icon: Brain,
    title: "AI Prediction",
    description:
      "Agentic AI analyzes patterns and predicts failures 2-4 weeks before they occur",
    color: "bg-purple-500",
  },
  {
    icon: Bell,
    title: "Proactive Alerts",
    description:
      "Voice AI and notifications contact vehicle owners with personalized recommendations",
    color: "bg-yellow-500",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Automated appointment booking optimized for service center capacity and customer preferences",
    color: "bg-green-500",
  },
  {
    icon: CheckCircle,
    title: "Continuous Learning",
    description:
      "RCA/CAPA analysis feeds insights back to manufacturing for quality improvement",
    color: "bg-emerald-500",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden w-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(250,204,21,0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-6">
            The AUTOMIND Process
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Our Master AI Agent orchestrates multiple specialized worker agents
            to deliver end-to-end predictive maintenance automation.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400/50 via-yellow-400 to-yellow-400/50 -translate-y-1/2" />

          <div className="grid lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-6 h-full hover:border-yellow-400/50 transition-all duration-300 group">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-6 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
                    {index + 1}
                  </div>

                  <div
                    className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mb-5 mt-2 group-hover:scale-110 transition-transform`}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 z-10">
                    <ArrowRight className="w-8 h-8 text-yellow-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
