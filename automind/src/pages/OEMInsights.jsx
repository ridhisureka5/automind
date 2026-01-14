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
  if (!res.ok) throw new Error("Failed to fetch diagnostics");

  const data = await res.json();

  // 🔥 Convert diagnostics → RCA/CAPA insight list
  return [
    {
      id: 1,
      component: "Engine",
      status: "identified",
      priority: data.final_risk > 0.8 ? "critical" : "medium",
      rootCause: data.dtc_codes?.[0] || "Potential engine failure detected",
      failureCount: Math.round(data.engine_prob * 10),
      affectedVehicles: Math.round(data.final_risk * 500),
      feedbackSentToManufacturing: false,
    },
    {
      id: 2,
      component: "Bearing",
      status: "investigating",
      priority: data.bearing_prob > 0.6 ? "high" : "low",
      rootCause: "Abnormal bearing vibration trend",
      failureCount: Math.round(data.bearing_prob * 8),
      affectedVehicles: Math.round(data.bearing_prob * 300),
      feedbackSentToManufacturing: false,
    },
  ];
}




async function sendFeedback(id, notes) {
  if (!id) return;
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
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [feedbackNotes, setFeedbackNotes] = useState("");

  useEffect(() => {
    fetchInsights()
      .then(setInsights)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading RCA / CAPA insights…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load insights
      </div>
    );
  }

  const identified = insights.filter(i => i?.status === "identified");
  const investigating = insights.filter(i => i?.status === "investigating");
  const resolved = insights.filter(
    i => i?.status === "resolved" || i?.status === "action_taken"
  );

  const filtered = insights.filter(i =>
    (i?.component || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i?.rootCause || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderList = (list) =>
    list.map((i, idx) => (
      <InsightCard
        key={i?.id || idx}
        insight={i}
        onSend={() => {
          setSelectedInsight(i);
          setShowDialog(true);
        }}
      />
    ));

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar  />

      {/* ✅ margin guarded to avoid off-screen blank */}
      <div className="p-8 md:ml-64">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">RCA / CAPA Insights</h1>
            <p className="text-slate-500">
              Root Cause & Corrective / Preventive Actions
            </p>
          </div>
          <Button className="bg-yellow-400 text-slate-900">
            <Brain className="w-4 h-4 mr-2" />
            Generate AI Analysis
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Stat icon={AlertTriangle} label="Identified" value={identified.length} />
          <Stat icon={Clock} label="Investigating" value={investigating.length} />
          <Stat icon={CheckCircle} label="Resolved" value={resolved.length} />
          <Stat
            icon={Factory}
            label="Sent to MFG"
            value={insights.filter(i => i?.feedbackSentToManufacturing).length}
          />
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Search by component or root cause"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({insights.length})</TabsTrigger>
            <TabsTrigger value="identified">Identified</TabsTrigger>
            <TabsTrigger value="investigating">Investigating</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all">{renderList(searchQuery ? filtered : insights)}</TabsContent>
          <TabsContent value="identified">{renderList(identified)}</TabsContent>
          <TabsContent value="investigating">{renderList(investigating)}</TabsContent>
          <TabsContent value="resolved">{renderList(resolved)}</TabsContent>
        </Tabs>
      </div>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Feedback to Manufacturing</DialogTitle>
            <DialogDescription>
              Share RCA / CAPA findings with the manufacturing team
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={feedbackNotes}
            onChange={(e) => setFeedbackNotes(e.target.value)}
            placeholder="Additional notes…"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600"
              onClick={() => {
                sendFeedback(selectedInsight?.id, feedbackNotes);
                setShowDialog(false);
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

/* ---------------- SUB COMPONENTS ---------------- */

function Stat({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardContent className="p-4 flex gap-4 items-center">
        <Icon className="w-6 h-6 text-slate-600" />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({ insight, onSend }) {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <div className="flex gap-3">
            <div
              className={`w-2 h-12 rounded-full ${
                priorityColors[insight?.priority] || "bg-slate-300"
              }`}
            />
            <div>
              <h3 className="font-semibold text-lg">
                {insight?.component || "Unknown Component"}
              </h3>
              <p className="text-sm text-slate-500">
                {(insight?.failureCount || 0)} failures •{" "}
                {(insight?.affectedVehicles || 0)} vehicles
              </p>
            </div>
          </div>
          <Badge className={statusColors[insight?.status] || "bg-slate-100 text-slate-700"}>
            {(insight?.status || "unknown").replace("_", " ")}
          </Badge>
        </div>

        <p className="text-slate-700 mb-4">
          {insight?.rootCause || "No root cause available"}
        </p>

        {!insight?.feedbackSentToManufacturing && (
          <div className="flex justify-end">
            <Button size="sm" onClick={onSend}>
              <Send className="w-4 h-4 mr-2" />
              Send to MFG
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
