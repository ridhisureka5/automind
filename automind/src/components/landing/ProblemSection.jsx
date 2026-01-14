import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, Clock, Wrench } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "Reactive Maintenance",
    description:
      "Vehicles break down unexpectedly, causing costly repairs and safety risks",
    stat: "70%",
    statLabel: "of breakdowns are preventable",
  },
  {
    icon: DollarSign,
    title: "Warranty Loss",
    description:
      "Delayed maintenance voids warranties and increases out-of-pocket expenses",
    stat: "$3.2B",
    statLabel: "lost annually to warranty issues",
  },
  {
    icon: Clock,
    title: "Downtime Costs",
    description:
      "Every hour of vehicle downtime translates to lost productivity and revenue",
    stat: "45hrs",
    statLabel: "average annual downtime",
  },
  {
    icon: Wrench,
    title: "Inefficient Service",
    description:
      "Service centers operate reactively without predictive demand insights",
    stat: "35%",
    statLabel: "capacity wasted on emergencies",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-24 bg-slate-50 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
            The Problem
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-4 mb-6">
            Traditional Maintenance is Broken
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            The automotive industry loses billions annually due to reactive
            maintenance practices that fail to predict and prevent vehicle
            failures.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full hover:shadow-xl hover:border-red-100 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors">
                  <problem.icon className="w-7 h-7 text-red-500" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {problem.title}
                </h3>
                <p className="text-slate-600 mb-6">
                  {problem.description}
                </p>

                <div className="pt-6 border-t border-slate-100">
                  <p className="text-3xl font-bold text-red-500">
                    {problem.stat}
                  </p>
                  <p className="text-sm text-slate-500">
                    {problem.statLabel}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
