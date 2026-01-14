import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  Activity,
  DollarSign,
  TrendingUp,
  Brain,
  AlertTriangle,
  Factory,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ---------------- API ---------------- */

async function fetchDiagnostics() {
  const res = await fetch("http://localhost:8000/api/diagnostics");
  if (!res.ok) throw new Error("Failed to fetch diagnostics");
  return res.json();
}

/* ---------------- STATIC CHART DATA ---------------- */

const failureTrendData = [
  { month: "Jan", failures: 45, predicted: 38 },
  { month: "Feb", failures: 52, predicted: 45 },
  { month: "Mar", failures: 38, predicted: 35 },
  { month: "Apr", failures: 42, predicted: 40 },
  { month: "May", failures: 35, predicted: 32 },
  { month: "Jun", failures: 28, predicted: 25 },
];

const fleetHealthDistribution = [
  { name: "Excellent", value: 45, color: "#22c55e" },
  { name: "Good", value: 30, color: "#eab308" },
  { name: "Fair", value: 15, color: "#f97316" },
  { name: "Poor", value: 10, color: "#ef4444" },
];

export default function OEMDashboard() {
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
      <div className="min-h-screen flex items-center justify-center">
        Loading ML analytics…
      </div>
    );
  }

  if (error || !ml) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load ML diagnostics
      </div>
    );
  }

  const riskPercent = Math.round(ml.final_risk * 100);
  const stressPercent = Math.round(ml.stress_index * 100);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar  />

      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              OEM Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              ML-driven fleet analytics
            </p>
          </div>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900">
            <Brain className="w-4 h-4 mr-2" />
            AI Analysis
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Final Risk"
            value={`${riskPercent}%`}
            icon={AlertTriangle}
            color="red"
          />
          <StatsCard
            title="Stress Index"
            value={`${stressPercent}%`}
            icon={Activity}
            color="yellow"
          />
          <StatsCard
            title="Engine Failure Prob."
            value={`${Math.round(ml.engine_prob * 100)}%`}
            icon={TrendingUp}
            color="purple"
          />
          <StatsCard
            title="Bearing Failure Prob."
            value={`${Math.round(ml.bearing_prob * 100)}%`}
            icon={Factory}
            color="blue"
          />
        </div>

        {/* Status */}
        <Card className="mb-8">
          <CardContent className="flex justify-between items-center p-6">
            <span className="font-semibold">Vehicle Status</span>
            <Badge
              className={
                ml.vehicle_status === "Critical"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }
            >
              {ml.vehicle_status}
            </Badge>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Failure Trends vs Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={failureTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="failures" stroke="#ef4444" />
                  <Line dataKey="predicted" stroke="#22c55e" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fleet Health</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={fleetHealthDistribution}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={80}
                  >
                    {fleetHealthDistribution.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* DTC Codes */}
        <Card>
          <CardHeader>
            <CardTitle>DTC Codes</CardTitle>
          </CardHeader>
          <CardContent>
            {ml.dtc_codes.length ? (
              <ul className="list-disc pl-6">
                {ml.dtc_codes.map((code, i) => (
                  <li key={i}>{code}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500">No DTC codes</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
