import React from "react";
import { motion } from "framer-motion";
import { Car, Factory, Wrench, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const stakeholders = [
  {
    icon: Car,
    title: "Vehicle Owners",
    role: "customer",
    description:
      "Stay ahead of breakdowns with AI-powered predictions. Receive proactive alerts and book services effortlessly.",
    benefits: [
      "Real-time vehicle health monitoring",
      "Personalized maintenance alerts",
      "Easy service scheduling",
      "Complete service history",
    ],
    color: "yellow",
  },
  {
    icon: Factory,
    title: "OEM Administrators",
    role: "oem",
    description:
      "Gain insights into fleet health, reduce warranty costs, and improve product quality through data-driven feedback.",
    benefits: [
      "Fleet-wide analytics dashboard",
      "Warranty cost optimization",
      "Manufacturing feedback loop",
      "Quality improvement insights",
    ],
    color: "blue",
  },
  {
    icon: Wrench,
    title: "Service Centers",
    role: "service",
    description:
      "Optimize operations with predictive demand forecasting and intelligent scheduling.",
    benefits: [
      "Predictive job scheduling",
      "Parts inventory optimization",
      "Technician workload balancing",
      "Customer satisfaction tracking",
    ],
    color: "green",
  },
];

const colorClasses = {
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "bg-yellow-400",
    button: "bg-yellow-400 hover:bg-yellow-500 text-slate-900",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "bg-blue-500",
    button: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "bg-green-500",
    button: "bg-green-500 hover:bg-green-600 text-white",
  },
};

export default function StakeholdersSection() {
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
            Who It's For
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-4 mb-6">
            Built for Every Stakeholder
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            AUTOMIND delivers tailored experiences for vehicle owners, OEMs, and
            service centers.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {stakeholders.map((stakeholder, index) => {
            const colors = colorClasses[stakeholder.color];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group"
              >
                <div
                  className={`${colors.bg} border-2 ${colors.border} rounded-3xl p-8 h-full hover:shadow-xl transition-all duration-300`}
                >
                  <div
                    className={`w-16 h-16 ${colors.icon} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <stakeholder.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {stakeholder.title}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {stakeholder.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {stakeholder.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${colors.icon}`}
                        />
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/role-selection"
                    className={`w-full inline-flex items-center justify-center ${colors.button} font-semibold py-6 rounded-xl transition`}
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
