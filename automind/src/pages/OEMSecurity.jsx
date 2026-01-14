import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/dashboard/Sidebar";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  Brain,
  Lock,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------- DATA ---------------- */

const activityData = [
  { time: "00:00", normal: 45, anomaly: 2 },
  { time: "04:00", normal: 32, anomaly: 1 },
  { time: "08:00", normal: 78, anomaly: 3 },
  { time: "12:00", normal: 95, anomaly: 5 },
  { time: "16:00", normal: 88, anomaly: 2 },
  { time: "20:00", normal: 65, anomaly: 4 },
];

const logsData = [
  {
    id: 1,
    agentType: "scheduling",
    action: "Unauthorized access attempt",
    targetEntity: "Vehicle Telemetry",
    isAnomaly: true,
    anomalyType: "unauthorized_access",
    riskScore: 85,
    resolved: false,
  },
  {
    id: 2,
    agentType: "prediction",
    action: "Processed 2,500 sensor readings",
    targetEntity: "Sensor Data",
    isAnomaly: false,
    anomalyType: "normal",
    riskScore: 5,
    resolved: true,
  },
  {
    id: 3,
    agentType: "rca",
    action: "Privilege escalation blocked",
    targetEntity: "Admin Functions",
    isAnomaly: true,
    anomalyType: "privilege_escalation",
    riskScore: 95,
    resolved: false,
  },
];

/* ---------------- CONSTANTS ---------------- */

const agentColors = {
  master: "bg-yellow-500",
  telemetry: "bg-blue-500",
  prediction: "bg-purple-500",
  scheduling: "bg-green-500",
  notification: "bg-pink-500",
  rca: "bg-orange-500",
};

const anomalyLabels = {
  unauthorized_access: "Unauthorized Access",
  privilege_escalation: "Privilege Escalation",
  normal: "Normal",
};

/* ---------------- PAGE ---------------- */

export default function OEMSecurity() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // SAFE mount — no auth dependency
    setLogs(logsData);
  }, []);

  const anomalies = logs.filter((l) => l.isAnomaly);
  const critical = anomalies.filter((l) => l.riskScore >= 80);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.agentType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="p-8 md:ml-64">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">UEBA Security</h1>
            <p className="text-slate-500">
              AI Agent Behavior & Threat Monitoring
            </p>
          </div>
          <Button className="bg-yellow-400 text-slate-900">
            <Eye className="w-4 h-4 mr-2" />
            Live Feed
          </Button>
        </div>

        {/* Status Banner */}
        <div
          className={`rounded-2xl p-6 mb-8 text-white ${
            critical.length > 0
              ? "bg-gradient-to-r from-red-600 to-red-700"
              : "bg-gradient-to-r from-green-600 to-emerald-600"
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8" />
              <div>
                <h3 className="font-semibold">
                  {critical.length > 0
                    ? "Security Alerts Detected"
                    : "All Systems Secure"}
                </h3>
                <p className="text-sm opacity-80">
                  Continuous AI behavior monitoring
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{critical.length}</p>
              <p className="text-sm opacity-80">Critical Alerts</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Stat title="Normal" value={logs.length - anomalies.length} icon={CheckCircle} />
          <Stat title="Anomalies" value={anomalies.length} icon={AlertTriangle} />
          <Stat title="Critical" value={critical.length} icon={Lock} />
          <Stat title="AI Agents" value={5} icon={Brain} />
        </div>

        {/* Activity Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>24-Hour Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line dataKey="normal" stroke="#22c55e" strokeWidth={3} />
                <Line dataKey="anomaly" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>UEBA Logs</CardTitle>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input
                    className="pl-9"
                    placeholder="Search logs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {filteredLogs.map((log, idx) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-xl border ${
                  log.isAnomaly
                    ? "bg-red-50 border-red-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <Badge className={`${agentColors[log.agentType]} text-white`}>
                      {log.agentType}
                    </Badge>
                    <p className="font-medium mt-1">{log.action}</p>
                    <p className="text-sm text-slate-500">
                      Target: {log.targetEntity}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        log.riskScore >= 80
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      Risk {log.riskScore}
                    </Badge>
                    <p className="text-xs mt-1">
                      {anomalyLabels[log.anomalyType]}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- STAT ---------------- */

function Stat({ title, value, icon: Icon }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <Icon className="w-6 h-6 text-slate-600" />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-slate-500">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
