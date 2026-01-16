import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  Activity,
  TrendingUp,
  Brain,
  AlertTriangle,
  Factory,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ---------------- API ---------------- */

async function fetchDiagnostics() {
  const res = await fetch("http://localhost:8000/api/diagnostics");
  if (!res.ok) throw new Error("Failed to fetch diagnostics");
  return res.json();
}

/* ---------------- HELPERS ---------------- */

function getVehicleStatus(health) {
  if (health < 40) return "Critical";
  if (health < 70) return "Warning";
  return "Healthy";
}

function statusColor(status) {
  if (status === "Critical") return "bg-red-100 text-red-700";
  if (status === "Warning") return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
}

/* ---------------- COMPONENT ---------------- */

export default function OEMDashboard() {
  const [ml, setMl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    fetchDiagnostics()
      .then(setMl)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  /* ---------------- MOCK FLEET (REALISTIC) ---------------- */
  const fleet = [
    { id: 1, vin: "DEF-2047", model: "Defender", health: Math.round((1 - ml.final_risk) * 100) },
    { id: 2, vin: "CAR-1123", model: "Carens", health: 72 },
    { id: 3, vin: "FOR-9988", model: "Fortuner", health: 58 },
    { id: 4, vin: "CRE-4501", model: "Creta", health: 34 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64 p-8">
        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">OEM Dashboard</h1>
            <p className="text-slate-500">Fleet-level AI analytics</p>
          </div>

          <Button
            className="bg-yellow-400 text-slate-900"
            onClick={() => setShowAI(true)}
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Analysis
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Final Risk"
            value={`${Math.round(ml.final_risk * 100)}%`}
            icon={AlertTriangle}
            color="red"
          />
          <StatsCard
            title="Stress Index"
            value={`${Math.round(ml.stress_index * 100)}%`}
            icon={Activity}
            color="yellow"
          />
          <StatsCard
            title="Engine Failure"
            value={`${Math.round(ml.engine_prob * 100)}%`}
            icon={TrendingUp}
            color="purple"
          />
          <StatsCard
            title="Bearing Failure"
            value={`${Math.round(ml.bearing_prob * 100)}%`}
            icon={Factory}
            color="blue"
          />
        </div>

        {/* FLEET STATUS LIST */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Vehicle Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fleet.map((v) => {
              const status = getVehicleStatus(v.health);
              return (
                <div
                  key={v.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div className="flex gap-3 items-center">
                    <Car className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-medium">{v.model}</p>
                      <p className="text-xs text-slate-500">VIN: {v.vin}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <span className="text-sm font-semibold">
                      {v.health}%
                    </span>
                    <Badge className={statusColor(status)}>
                      {status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* AI ANALYSIS DIALOG */}
      <Dialog open={showAI} onOpenChange={setShowAI}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Fleet Analysis</DialogTitle>
            <DialogDescription>
              ML-driven insights and recommendations
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4 text-sm">
            <p>🔴 High-risk vehicles detected</p>
            <p>🟡 2 vehicles require preventive maintenance</p>
            <p>🟢 Remaining fleet healthy</p>

            <div className="bg-slate-100 rounded-lg p-3 mt-3">
              <p className="font-semibold mb-1">AI Recommendation</p>
              <p>
                Schedule service for vehicles below 60% health within 7 days to
                prevent breakdowns.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
