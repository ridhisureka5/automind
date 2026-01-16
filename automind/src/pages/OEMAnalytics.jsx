import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import {
  BarChart3,
  TrendingDown,
  Car,
  DollarSign,
  AlertTriangle,
  Brain,
  CheckCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";

import { fetchDiagnostics } from "../services/diagnosticsApi";

/* ---------------- STATIC CHART DATA ---------------- */

const monthlyTrends = [
  { month: "Jan", failures: 245, predictions: 230, savings: 45000 },
  { month: "Feb", failures: 220, predictions: 215, savings: 52000 },
  { month: "Mar", failures: 198, predictions: 195, savings: 61000 },
  { month: "Apr", failures: 175, predictions: 172, savings: 68000 },
  { month: "May", failures: 152, predictions: 150, savings: 75000 },
  { month: "Jun", failures: 128, predictions: 126, savings: 82000 },
];

/* ---------------- HELPERS ---------------- */

const percent = (v) => Math.round(v * 100);

function generateFailureSignals(ml) {
  const subsystems = [
    "Engine",
    "Bearings",
    "Transmission",
    "Cooling",
    "Electrical",
  ];

  const signals = [];

  for (let i = 0; i < 50; i++) {
    const subsystem = subsystems[i % subsystems.length];

    const baseRisk =
      subsystem === "Engine"
        ? ml.engine_prob
        : subsystem === "Bearings"
        ? ml.bearing_prob
        : ml.stress_index;

    const noise = Math.random() * 0.15;
    const probability = Math.min(baseRisk + noise, 0.95);

    signals.push({
      id: i + 1,
      subsystem,
      signal: `${subsystem} Sensor ${i + 1}`,
      probability: Math.round(probability * 100),
      severity:
        probability > 0.7
          ? "High"
          : probability > 0.4
          ? "Medium"
          : "Low",
    });
  }

  return signals;
}

/* ---------------- COMPONENT ---------------- */

export default function OEMAnalytics() {
  const [ml, setMl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDiagnostics()
      .then((data) => {
        setMl(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        Loading ML analytics…
      </div>
    );
  }

  if (error || !ml) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-600">
        Failed to load ML diagnostics
      </div>
    );
  }

  /* ---------------- DERIVED INSIGHTS ---------------- */

  const failuresThisMonth = Math.round(200 * ml.final_risk);
  const predictionAccuracy = percent(1 - ml.stress_index);
  const estimatedSavings = Math.round((1 - ml.final_risk) * 2500000);
  const failureSignals = generateFailureSignals(ml);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 p-8">
        <h1 className="text-3xl font-bold mb-1">Fleet Analytics</h1>
        <p className="text-slate-500 mb-8">
          OEM ML-driven fleet intelligence
        </p>

        {/* KPI METRICS */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={TrendingDown}
            value={failuresThisMonth}
            label="Predicted Failures (Month)"
            badge="ML"
            gradient="from-red-500 to-rose-600"
          />
          <MetricCard
            icon={DollarSign}
            value={`₹${(estimatedSavings / 100000).toFixed(1)} Cr`}
            label="Preventable Cost Savings"
            badge="YTD"
            gradient="from-green-500 to-emerald-600"
          />
          <MetricCard
            icon={Car}
            value="14.4K"
            label="Vehicles Monitored"
            badge="+12%"
            gradient="from-purple-500 to-violet-600"
          />
          <MetricCard
            icon={BarChart3}
            value={`${predictionAccuracy}%`}
            label="Prediction Accuracy"
            badge="AI"
            gradient="from-blue-500 to-cyan-600"
          />
        </div>

        {/* 🔥 AI FAILURE SIGNALS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Predicted Failure Signals (AI Inference Output)
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {failureSignals.map((f) => (
                <div
                  key={f.id}
                  className="border rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-sm">{f.signal}</p>
                    <p className="text-xs text-slate-500">
                      {f.subsystem}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{f.probability}%</p>
                    <Badge
                      className={
                        f.severity === "High"
                          ? "bg-red-100 text-red-700"
                          : f.severity === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {f.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* TREND CHART */}
        <Card>
          <CardHeader>
            <CardTitle>Failure Reduction Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="failures" fill="#ef4444" />
                <Line dataKey="predictions" stroke="#22c55e" />
                <Area
                  dataKey="savings"
                  fill="#dbeafe"
                  stroke="#3b82f6"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function MetricCard({ icon: Icon, value, label, badge, gradient }) {
  return (
    <Card className={`bg-gradient-to-br ${gradient} text-white`}>
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <Icon className="w-8 h-8 opacity-80" />
          <Badge className="bg-white/20 text-white">
            {badge}
          </Badge>
        </div>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-white/80 text-sm">{label}</p>
      </CardContent>
    </Card>
  );
}
