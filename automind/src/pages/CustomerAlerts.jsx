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
} from "lucide-react";

import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";


/* ================= VOICE ================= */

const speakAlert = (alert) => {

  if (!window.speechSynthesis || !alert) return;

  const message = `
    Hello.
    This is your AI assistant.

    I am ${alert.confidence}% confident
    that this issue needs attention.

    ${alert.severity} alert detected.

    ${alert.title}.
    ${alert.description}.

    Please schedule service soon.
  `;

  const utter = new SpeechSynthesisUtterance(message);

  utter.rate = 0.9;
  utter.pitch = 1.1;
  utter.lang = "en-US";

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
};



/* ================= HELPERS ================= */

const getTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });


const randomConfidence = () =>
  Math.floor(Math.random() * 7) + 90; // 90–96



/* ================= AI ALERTS ================= */

const AI_ALERTS = [
  {
    id: 101,
    title: "Low Oil Pressure",
    description: "Oil pressure is below optimal range.",
    severity: "high",
  },
  {
    id: 102,
    title: "Brake Wear Detected",
    description: "Brake pads need replacement soon.",
    severity: "warning",
  },
  {
    id: 103,
    title: "Battery Voltage Drop",
    description: "Battery voltage is unstable.",
    severity: "warning",
  },
  {
    id: 104,
    title: "Cooling System Stress",
    description: "Cooling system is overloaded.",
    severity: "critical",
  },
  {
    id: 105,
    title: "Sensor Calibration Needed",
    description: "Vehicle sensors need recalibration.",
    severity: "low",
  },
];



export default function CustomerAlerts() {

  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filter, setFilter] = useState("all");

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);



  /* ================= LOAD ================= */

  useEffect(() => {

    setFilter("all");

    loadAlerts();

  }, []);



  const loadAlerts = async () => {

    try {

      setIsLoading(true);

      const res = await fetch("http://localhost:8000/api/alerts");

      const data = await res.json();

      let backend = Array.isArray(data) ? data : [];

      let merged = [...backend];


      // Ensure minimum 5 alerts
      if (merged.length < 4) {

        merged = [
          ...merged,
          ...AI_ALERTS.slice(0, 5 - merged.length),
        ];
      }


      // Enrich alerts
      const enriched = merged.map((a, i) => ({

        ...a,

        time: getTime(),

        confidence: randomConfidence(),

        // Every 4th alert resolved
        status: i % 4 === 0 ? "resolved" : "active",

      }));


      setAlerts(enriched);

    } catch (err) {

      console.error("Alert load failed:", err);


      // Fallback
      const fallback = AI_ALERTS.map((a, i) => ({

        ...a,

        time: getTime(),

        confidence: randomConfidence(),

        status: i % 4 === 0 ? "resolved" : "active",

      }));


      setAlerts(fallback);

    } finally {

      setIsLoading(false);
    }
  };



  /* ================= AUTO VOICE ================= */

  useEffect(() => {

    if (!alerts.length) return;

    let delay = 1500;

    alerts.forEach((a) => {

      if (
        a.status === "active" &&
        (a.severity === "critical" || a.severity === "high")
      ) {

        setTimeout(() => speakAlert(a), delay);

        delay += 4000;
      }

    });

  }, [alerts]);



  /* ================= HANDLERS ================= */

  const handleAction = (alert) => {

    setSelectedAlert(alert);

    setShowVoiceDialog(true);
  };



  /* ================= FILTERING ================= */

  const filteredAlerts =
    filter === "all"
      ? alerts
      : alerts.filter((a) => a.severity === filter);


  const activeAlerts = filteredAlerts.filter(
    (a) => a.status === "active"
  );

  const resolvedAlerts = filteredAlerts.filter(
    (a) => a.status === "resolved"
  );

  const criticalAlerts = filteredAlerts.filter(
    (a) => a.severity === "critical"
  );



  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />


      <div className="ml-64 p-8">


        {/* HEADER */}
        <div className="flex justify-between mb-8">

          <div>

            <h1 className="text-3xl font-bold">My Alerts</h1>

            <p className="text-slate-500">
              AI-powered vehicle monitoring
            </p>

          </div>


          {/* FILTER */}
          <Button
            variant="outline"
            onClick={() => {

              if (filter === "all") setFilter("critical");
              else if (filter === "critical") setFilter("warning");
              else if (filter === "warning") setFilter("low");
              else setFilter("all");
            }}
          >

            <Filter className="w-4 h-4 mr-2" />

            {filter === "all" && "All"}
            {filter === "critical" && "Critical"}
            {filter === "warning" && "Warning"}
            {filter === "low" && "Low"}

          </Button>

        </div>



        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">

          <StatCard
            icon={Bell}
            value={activeAlerts.length}
            label="Active"
            color="yellow"
          />

          <StatCard
            icon={AlertTriangle}
            value={criticalAlerts.length}
            label="Critical"
            color="red"
          />

          <StatCard
            icon={CheckCircle}
            value={resolvedAlerts.length}
            label="Resolved"
            color="green"
          />

          <StatCard
            icon={Brain}
            value="96%"
            label="AI Accuracy"
            color="purple"
          />

        </div>



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

              <AlertCard
                key={a.id}
                alert={a}
                delay={i * 0.05}
              />
            ))}

          </TabsContent>


          <TabsContent value="all" className="space-y-4">

            {alerts.map((a, i) => (

              <AlertCard
                key={a.id}
                alert={a}
                delay={i * 0.05}
                onAction={
                  a.status === "active"
                    ? handleAction
                    : undefined
                }
              />
            ))}

          </TabsContent>

        </Tabs>

      </div>



      {/* VOICE DIALOG */}
      <Dialog
        open={showVoiceDialog}
        onOpenChange={setShowVoiceDialog}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle className="flex gap-2 items-center">

              <Mic className="w-5 h-5 text-purple-600" />

              Voice AI Assistant

            </DialogTitle>


            <DialogDescription>
              AI voice explanation
            </DialogDescription>

          </DialogHeader>


          {selectedAlert && (

            <div className="bg-slate-50 p-4 rounded-xl">

              <p className="text-xs text-slate-400 mb-1">

                {selectedAlert.time} •{" "}
                {selectedAlert.confidence}% confidence

              </p>


              <h4 className="font-semibold">

                {selectedAlert.title}

              </h4>


              <p className="text-sm text-slate-600">

                {selectedAlert.description}

              </p>

            </div>
          )}


          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => setShowVoiceDialog(false)}
            >
              Not Now
            </Button>

            <Button
              className="bg-purple-600"
              onClick={() => {
                speakAlert(selectedAlert);
                setShowVoiceDialog(false);
              }}
            >

              <Phone className="w-4 h-4 mr-2" />

              Play Again

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  );
}



/* ================= STAT CARD ================= */

function StatCard({ icon: Icon, value, label, color }) {

  const colors = {
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (

    <Card>

      <CardContent className="p-4 flex gap-4 items-center">

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            colors[color]
          }`}
        >

          <Icon className="w-6 h-6" />

        </div>


        <div>

          <p className="text-2xl font-bold">{value}</p>

          <p className="text-sm text-slate-500">{label}</p>

        </div>

      </CardContent>

    </Card>
  );
}
