import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import {
  BarChart3,
  TrendingDown,
  Car,
  DollarSign,
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

/* ---------------- STATIC DATA ---------------- */

const monthlyTrends = [
  { month: "Jan", failures: 245, predictions: 230, savings: 45000 },
  { month: "Feb", failures: 220, predictions: 215, savings: 52000 },
  { month: "Mar", failures: 198, predictions: 195, savings: 61000 },
  { month: "Apr", failures: 175, predictions: 172, savings: 68000 },
  { month: "May", failures: 152, predictions: 150, savings: 75000 },
  { month: "Jun", failures: 128, predictions: 126, savings: 82000 },
];

export default function OEMAnalytics() {
  const [ml, setMl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDiagnostics()
      .then((data) => {
        console.log("ML OK:", data);
        setMl(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ML ERROR:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  // ⛔ DO NOT RENDER UNTIL SAFE
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

  const failuresThisMonth = Math.round(200 * ml.final_risk);
  const predictionAccuracy = Math.round((1 - ml.stress_index) * 100);

  return (
    <div className="min-h-screen bg-slate-50">
      {<Sidebar  />}

      <main className="ml-64 p-8">
        <h1 className="text-3xl font-bold mb-1">Fleet Analytics</h1>
        <p className="text-slate-500 mb-8">
          OEM ML-driven fleet intelligence
        </p>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={TrendingDown}
            value={failuresThisMonth}
            label="Failures This Month"
            badge="ML"
            gradient="from-green-500 to-emerald-600"
          />
          <MetricCard
            icon={DollarSign}
            value="$2.4M"
            label="Cost Savings YTD"
            badge="+82%"
            gradient="from-blue-500 to-cyan-600"
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
            gradient="from-yellow-500 to-amber-600"
          />
        </div>

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
                <Area dataKey="savings" fill="#dbeafe" stroke="#3b82f6" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function MetricCard({ icon: Icon, value, label, badge, gradient }) {
  return (
    <Card className={`bg-gradient-to-br ${gradient} text-white`}>
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <Icon className="w-8 h-8 opacity-80" />
          <Badge className="bg-white/20 text-white">{badge}</Badge>
        </div>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-white/80 text-sm">{label}</p>
      </CardContent>
    </Card>
  );
}
