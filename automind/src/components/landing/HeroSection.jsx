import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(250, 204, 21, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(250, 204, 21, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full mb-8">
              <Brain className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">
                Agentic AI Powered
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Transforming
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                Vehicle Uptime
              </span>
              with Agentic AI
            </h1>

            <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-lg">
              AUTOMIND uses autonomous AI agents to predict failures before they happen,
              optimize maintenance schedules, and keep your fleet running at peak performance.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/role-selection"
                className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-8 py-6 text-lg rounded-xl transition"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>

              <button className="border border-slate-600 text-white hover:bg-slate-800 px-8 py-6 text-lg rounded-xl transition">
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-8 mt-12">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">99.9%</p>
                  <p className="text-slate-500 text-sm">Uptime</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">40%</p>
                  <p className="text-slate-500 text-sm">Cost Reduction</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-16 h-16 text-slate-900" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
