import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BellRing,
  Settings2,
  Factory,
  Shield,
  Cpu,
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Predictive Failure Detection",
    description:
      "AI analyzes real-time sensor data to predict mechanical failures weeks in advance with 95%+ accuracy",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BellRing,
    title: "Proactive Voice Alerts",
    description:
      "Voice AI agents contact vehicle owners with personalized maintenance recommendations via phone calls",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Settings2,
    title: "Service Optimization",
    description:
      "Intelligent scheduling optimizes service center workloads, reducing wait times by 60%",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Factory,
    title: "Manufacturing Feedback Loop",
    description:
      "RCA/CAPA analysis feeds insights back to OEMs to improve product quality and reduce defects",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Shield,
    title: "Secure AI Governance",
    description:
      "UEBA monitors AI agent behavior, detecting anomalies and preventing unauthorized actions",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: Cpu,
    title: "Agentic AI Architecture",
    description:
      "Master Agent orchestrates specialized worker agents for seamless autonomous operations",
    gradient: "from-yellow-500 to-amber-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white w-full">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-4 mb-6">
            Intelligent Maintenance Platform
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            AUTOMIND combines cutting-edge AI technologies to deliver a comprehensive
            predictive maintenance solution.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative bg-slate-50 rounded-2xl p-8 h-full border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden">
                {/* Hover Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
