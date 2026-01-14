import React from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/dashboard/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";
import {
  Calendar,
  Users,
  Clock,
  Package,
  Brain,
  Car,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------- MOCK DATA (API READY) ---------------- */

const upcomingJobs = [
  {
    id: 1,
    vehicle: "Toyota Camry 2022",
    owner: "John Smith",
    issue: "Brake Pad Replacement",
    severity: "high",
    time: "9:00 AM",
    aiConfidence: 94,
    parts: ["Brake Pads (4)", "Brake Fluid"],
    estimatedTime: "2 hours",
  },
  {
    id: 2,
    vehicle: "Honda Accord 2021",
    owner: "Sarah Johnson",
    issue: "Battery Replacement",
    severity: "medium",
    time: "11:30 AM",
    aiConfidence: 89,
    parts: ["Battery 12V"],
    estimatedTime: "45 mins",
  },
];

const technicians = [
  { name: "Robert Chen", status: "busy", job: "Engine Repair", progress: 75 },
  { name: "Maria Garcia", status: "available", job: null, progress: 0 },
  { name: "James Wilson", status: "busy", job: "Brake Service", progress: 45 },
];

const demandForecast = [
  { day: "Mon", predicted: 12, capacity: 15 },
  { day: "Tue", predicted: 18, capacity: 15 },
  { day: "Wed", predicted: 14, capacity: 15 },
  { day: "Thu", predicted: 16, capacity: 15 },
  { day: "Fri", predicted: 20, capacity: 15 },
];

const partsInventory = [
  { name: "Brake Pads", stock: 24, min: 20, status: "ok" },
  { name: "12V Batteries", stock: 8, min: 15, status: "low" },
  { name: "Spark Plugs", stock: 5, min: 20, status: "critical" },
];

const severityColors = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

/* ---------------- COMPONENT ---------------- */

export default function ServiceDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar userRole="service" />

      <div className="p-8 md:ml-64">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Service Center Dashboard
            </h1>
            <p className="text-slate-500">
              Predictive scheduling & technician management
            </p>
          </div>
          <Button className="bg-yellow-400 text-slate-900">
            <Brain className="w-4 h-4 mr-2" />
            AI Optimize
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Today's Jobs" value={upcomingJobs.length} icon={Calendar} />
          <StatsCard title="Technicians" value="3 Active" icon={Users} />
          <StatsCard title="Avg Service Time" value="2.1 hrs" icon={Clock} />
          <StatsCard title="Parts Alerts" value="2" icon={Package} />
        </div>

        {/* AI Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 mb-8"
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-slate-900" />
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  Scheduling AI Agent
                </h3>
                <p className="text-slate-400 text-sm">
                  Optimizing capacity & parts availability
                </p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400">
              Optimizing
            </Badge>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Jobs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Today's Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 bg-slate-50 rounded-xl border"
                >
                  <div className="flex justify-between mb-2">
                    <div className="flex gap-3 items-center">
                      <Car className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-semibold">{job.vehicle}</p>
                        <p className="text-sm text-slate-500">{job.owner}</p>
                      </div>
                    </div>
                    <Badge className={severityColors[job.severity]}>
                      {job.severity}
                    </Badge>
                  </div>
                  <p className="text-sm">{job.issue}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {job.aiConfidence}% AI confidence
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Technicians */}
          <Card>
            <CardHeader>
              <CardTitle>Technician Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {technicians.map((tech, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex justify-between">
                    <span className="font-medium">{tech.name}</span>
                    <Badge>{tech.status}</Badge>
                  </div>
                  {tech.job && (
                    <>
                      <p className="text-xs text-slate-500">{tech.job}</p>
                      <Progress value={tech.progress} className="h-2 mt-1" />
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Demand + Parts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Demand Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={demandForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="predicted" stroke="#eab308" fill="#fef3c7" />
                  <Area
                    dataKey="capacity"
                    stroke="#22c55e"
                    fill="#dcfce7"
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parts Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {partsInventory.map((p, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span>{p.name}</span>
                  <span
                    className={`font-semibold ${
                      p.status === "critical"
                        ? "text-red-600"
                        : p.status === "low"
                        ? "text-orange-600"
                        : ""
                    }`}
                  >
                    {p.stock}/{p.min}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
