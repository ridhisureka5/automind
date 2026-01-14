import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Car, Factory, Wrench, Brain, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

/* ---------------- ROLES ---------------- */

const roles = [
  {
    id: "customer",
    icon: Car,
    title: "Vehicle Owner",
    description:
      "Monitor your vehicle health, receive AI alerts, and book maintenance services",
    features: [
      "Real-time health score",
      "Predictive alerts",
      "Easy service booking",
      "Maintenance history",
    ],
    color: "yellow",
    route: "/customer/dashboard",
  },
  {
    id: "oem",
    icon: Factory,
    title: "OEM Administrator",
    description:
      "Access fleet analytics, quality insights, and manufacturing feedback loops",
    features: [
      "Fleet-wide analytics",
      "Warranty optimization",
      "Quality insights",
      "RCA / CAPA reports",
    ],
    color: "blue",
    route: "/oem/dashboard",
  },
  {
    id: "service",
    icon: Wrench,
    title: "Service Center",
    description:
      "Manage predictive scheduling, parts inventory, and technician assignments",
    features: [
      "Predictive scheduling",
      "Parts management",
      "Technician allocation",
      "Customer tracking",
    ],
    color: "green",
    route: "/service/dashboard",
  },
];

const colorClasses = {
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-400",
    icon: "bg-yellow-400",
    hover: "hover:border-yellow-400",
    ring: "ring-yellow-400",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    icon: "bg-blue-500",
    hover: "hover:border-blue-500",
    ring: "ring-blue-500",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-500",
    icon: "bg-green-500",
    hover: "hover:border-green-500",
    ring: "ring-green-500",
  },
};

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  /* ---------------- AUTH CHECK ONLY ---------------- */
  /* ❌ NO auto-dashboard redirect here */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      // ✅ User logged in → allow role selection
      setCheckingAuth(false);
    });

    return () => unsub();
  }, [navigate]);

  /* ---------------- CONTINUE ---------------- */

  const handleContinue = () => {
    if (!selectedRole) return;

    localStorage.setItem("userRole", selectedRole.id);
    navigate(selectedRole.route);
  };

  /* ---------------- LOADING ---------------- */

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin h-8 w-8 border-b-2 border-yellow-400 rounded-full" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl relative"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-slate-900" />
            </div>
            <span className="text-3xl font-bold text-white">AUTOMIND</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Select Your Role
          </h1>
          <p className="text-slate-400 text-lg">
            Choose how you’ll use AUTOMIND
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {roles.map((role) => {
            const colors = colorClasses[role.color];
            const isSelected = selectedRole?.id === role.id;

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                  isSelected
                    ? `${colors.bg} ${colors.border} ring-4 ${colors.ring} ring-opacity-30`
                    : `bg-slate-800/50 border-slate-700 ${colors.hover}`
                }`}
              >
                {isSelected && (
                  <div
                    className={`absolute -top-3 -right-3 w-8 h-8 ${colors.icon} rounded-full flex items-center justify-center`}
                  >
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={`w-14 h-14 ${colors.icon} rounded-xl flex items-center justify-center mb-5`}
                >
                  <role.icon className="w-7 h-7 text-white" />
                </div>

                <h3
                  className={`text-xl font-bold mb-2 ${
                    isSelected ? "text-slate-900" : "text-white"
                  }`}
                >
                  {role.title}
                </h3>

                <p
                  className={`text-sm mb-5 ${
                    isSelected ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {role.description}
                </p>

                <ul className="space-y-2">
                  {role.features.map((feature, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2 text-sm ${
                        isSelected ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${colors.icon}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedRole}
            className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-12 py-7 text-lg rounded-xl disabled:opacity-50"
          >
            Continue
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        <p className="text-center text-slate-500 mt-6 text-sm">
          Role is selected once and validated by backend after login
        </p>
      </motion.div>
    </div>
  );
}
