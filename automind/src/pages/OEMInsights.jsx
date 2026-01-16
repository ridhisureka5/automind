import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Factory,
  Send,
  Search,
  Filter,
  Brain,
  TrendingDown,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";

/* ---------------- COLORS ---------------- */

const statusColors = {
  identified: "bg-red-100 text-red-700",
  investigating: "bg-yellow-100 text-yellow-700",
  action_taken: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
};

const priorityColors = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

/* ---------------- API ---------------- */

async function fetchInsights() {
  const res = await fetch("http://localhost:8000/api/diagnostics");
  const data = await res.json();

  return [
    {
      id: 1,
      component: "Engine",
      status: "identified",
      priority: data.final_risk > 0.7 ? "critical" : "medium",
      rootCause:
        data.dtc_codes?.[0] ||
        "Abnormal combustion & thermal stress pattern detected",
      failureCount: Math.round(data.engine_prob * 12),
      affectedVehicles: Math.round(data.final_risk * 800),
      confidence: Math.round(data.engine_prob * 100),
      impact: "High",
      recommendation:
        "Revise piston cooling design & update ECU calibration",
      feedbackSentToManufacturing: false,
    },
    {
      id: 2,
      component: "Bearing",
      status: "investigating",
      priority: data.bearing_prob > 0.6 ? "high" : "low",
      rootCause: "Vibration RMS exceeding tolerance over 3 cycles",
      failureCount: Math.round(data.bearing_prob * 10),
      affectedVehicles: Math.round(data.bearing_prob * 500),
      confidence: Math.round(data.bearing_prob * 100),
      impact: "Medium",
      recommendation:
        "Audit supplier heat-treatment process & lubrication specs",
      feedbackSentToManufacturing: false,
    },
  ];
}

async function sendFeedback(id, notes) {
  await fetch(`http://localhost:8000/api/insights/${id}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes }),
  });
}

/* ---------------- PAGE ---------------- */

export default function OEMInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [feedbackNotes, setFeedbackNotes] = useState("");

  useEffect(() => {
    fetchInsights().then(setInsights).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading RCA / CAPA insights…
      </div>
    );
  }

  const filtered = insights.filter(
    (i) =>
      i.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.rootCause.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="p-8 md:ml-64">
        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">RCA / CAPA Insights</h1>
            <p className="text-slate-500">
              AI-driven root cause & manufacturing feedback loop
            </p>
          </div>

          <Button
            className="bg-yellow-400 text-slate-900"
            onClick={() => setShowAIDialog(true)}
          >
            <Brain className="w-4 h-4 mr-2" />
            Generate AI Analysis
          </Button>
        </div>

        {/* SEARCH */}
        <div className="flex gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Search component or root cause"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* INSIGHTS */}
        {filtered.map((insight) => (
          <Card key={insight.id} className="mb-4">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex gap-3">
                  <div
                    className={`w-2 h-14 rounded-full ${
                      priorityColors[insight.priority]
                    }`}
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {insight.component}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {insight.failureCount} failures •{" "}
                      {insight.affectedVehicles} vehicles
                    </p>
                  </div>
                </div>

                <Badge className={statusColors[insight.status]}>
                  {insight.status.replace("_", " ")}
                </Badge>
              </div>

              <p className="text-slate-700 mb-3">{insight.rootCause}</p>

              <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                <Info label="AI Confidence" value={`${insight.confidence}%`} />
                <Info label="Impact" value={insight.impact} />
                <Info
                  label="Recommendation"
                  value={insight.recommendation}
                />
              </div>

              {!insight.feedbackSentToManufacturing && (
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedInsight(insight);
                      setShowFeedbackDialog(true);
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send to Manufacturing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI SUMMARY DIALOG */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI RCA Summary</DialogTitle>
            <DialogDescription>
              Cross-vehicle pattern analysis & preventive guidance
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <p>🔴 Engine system is the dominant risk contributor</p>
            <p>📉 Early intervention can reduce failures by ~42%</p>
            <p>🏭 Manufacturing design feedback recommended</p>
            <p>⏱ Action window: next 14 days</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* FEEDBACK DIALOG */}
      <Dialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Feedback to Manufacturing</DialogTitle>
            <DialogDescription>
              Share corrective actions & observations
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={feedbackNotes}
            onChange={(e) => setFeedbackNotes(e.target.value)}
            placeholder="Engineering notes / corrective action…"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600"
              onClick={() => {
                sendFeedback(selectedInsight.id, feedbackNotes);
                setShowFeedbackDialog(false);
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- SMALL UI ---------------- */

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
