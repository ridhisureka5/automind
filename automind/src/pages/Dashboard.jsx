import { useEffect, useState } from "react";
import { AlertTriangle, Activity, Gauge, Bell } from "lucide-react";

import { fetchDiagnostics } from "../services/diagnosticsApi";

import Sidebar from "../components/dashboard/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";
import AIAgentPanel from "../components/dashboard/AIAgentPanel";
import AlertsList from "../components/dashboard/AlertsList";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDiagnostics()
      .then(setData)
      .catch((err) => console.error("ML API ERROR:", err));
  }, []);

  if (!data) {
    return (
      <>
        <Sidebar />
        <div className="ml-64 p-10">Loading ML data...</div>
      </>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 min-h-screen bg-slate-50 p-10">
        {/* Header */}
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, Mukul!
        </h1>
        <p className="text-slate-500 mb-8">
          Here's your vehicle health overview
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <StatsCard
            title="Final Risk Score"
            value={`${(data.final_risk * 100).toFixed(1)}%`}
            icon={AlertTriangle}
            color="red"
          />

          <StatsCard
            title="Vehicle Status"
            value={data.vehicle_status}
            icon={Activity}
            color="purple"
          />

          <StatsCard
            title="Stress Index"
            value={data.stress_index.toFixed(2)}
            icon={Gauge}
            color="yellow"
          />

          <StatsCard
            title="Active Alerts"
            value={data.dtc_codes.length}
            icon={Bell}
            color="blue"
          />
        </div>

        {/* AI Agent */}
        <AIAgentPanel status="Online" sensors={200} />

        {/* Alerts */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 text-slate-900">
            Active Alerts
          </h2>
          <AlertsList alerts={data.dtc_codes} />
        </div>
      </main>
    </>
  );
}
