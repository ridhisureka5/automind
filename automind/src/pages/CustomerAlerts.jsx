import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Sidebar from "../components/dashboard/Sidebar";
import AlertCard from "../components/dashboard/AlertCard";

import {
  Bell,
  Filter,
  CheckCircle,
  AlertTriangle,
  Brain,
  Mic,
  Phone,
  Shield,
} from "lucide-react";

import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

/* ---------------- VOICE AI FUNCTION ---------------- */

const speakAlert = (alert) => {
  if (!window.speechSynthesis || !alert) return;

  const message = `
    Attention.
    ${alert.severity} alert detected.
    ${alert.title}.
    ${alert.description}.
    Recommended action: Please schedule service immediately.
  `;

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.lang = "en-US";

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

export default function CustomerAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  /* ---------------- LOAD ALERTS ---------------- */

  const loadAlerts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:8000/api/alerts");
      const data = await res.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load alerts:", err);
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- AUTO SPEAK CRITICAL ---------------- */

  useEffect(() => {
    const critical = alerts.find(
      (a) => a.status === "active" && a.severity === "critical"
    );
    if (critical) speakAlert(critical);
  }, [alerts]);

  /* ---------------- HANDLERS ---------------- */

  const handleAction = (alert) => {
    setSelectedAlert(alert);
    setShowVoiceDialog(true);
  };

  const activeAlerts = alerts.filter((a) => a.status === "active");
  const resolvedAlerts = alerts.filter((a) => a.status === "resolved");
  const criticalAlerts = activeAlerts.filter(
    (a) => a.severity === "critical" || a.severity === "high"
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64 p-8">
        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Alerts</h1>
            <p className="text-slate-500">
              AI-generated maintenance alerts
            </p>
          </div>

          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Bell} value={activeAlerts.length} label="Active" color="yellow" />
          <StatCard icon={AlertTriangle} value={criticalAlerts.length} label="Critical" color="red" />
          <StatCard icon={CheckCircle} value={resolvedAlerts.length} label="Resolved" color="green" />
          <StatCard icon={Brain} value="96%" label="AI Accuracy" color="purple" />
        </div>

        {/* VOICE AI BANNER */}
        <motion.div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  Voice AI Assistant
                </h3>
                <p className="text-purple-200 text-sm">
                  Explains critical alerts using voice
                </p>
              </div>
            </div>
            <Button className="bg-white text-purple-600">
              Enable Voice
            </Button>
          </div>
        </motion.div>

        {/* TABS */}
        <Tabs defaultValue="active">
          <TabsList className="bg-white border">
            <TabsTrigger value="active">
              Active ({activeAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({resolvedAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All ({alerts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeAlerts.map((a, i) => (
              <AlertCard
                key={a.id}
                alert={a}
                delay={i * 0.05}
                onAction={handleAction}
              />
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedAlerts.map((a, i) => (
              <AlertCard key={a.id} alert={a} delay={i * 0.05} />
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {alerts.map((a, i) => (
              <AlertCard
                key={a.id}
                alert={a}
                delay={i * 0.05}
                onAction={a.status === "active" ? handleAction : undefined}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* VOICE DIALOG */}
      <Dialog open={showVoiceDialog} onOpenChange={setShowVoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <Mic className="w-5 h-5 text-purple-600" />
              Voice AI Assistant
            </DialogTitle>
            <DialogDescription>
              The AI can explain this alert using voice
            </DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="bg-slate-50 p-4 rounded-xl">
              <Badge>{selectedAlert.severity}</Badge>
              <h4 className="font-semibold mt-2">
                {selectedAlert.title}
              </h4>
              <p className="text-sm text-slate-600">
                {selectedAlert.description}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVoiceDialog(false)}>
              Not Now
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                speakAlert(selectedAlert);
                setShowVoiceDialog(false);
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Me Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <Card>
      <CardContent className="p-4 flex gap-4 items-center">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
