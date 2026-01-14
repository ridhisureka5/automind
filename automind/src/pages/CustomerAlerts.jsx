import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Sidebar from '../components/dashboard/Sidebar';
import AlertCard from '../components/dashboard/AlertCard';

import {
  Bell,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Brain,
  Mic,
  Phone,
} from 'lucide-react';

import { Button } from '../components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';

export default function CustomerAlerts() {
  const [user] = useState({ name: 'Demo User', userRole: 'customer' });
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setIsLoading(true);

      // ✅ FastAPI backend
      const res = await fetch('http://localhost:8000/api/alerts');
      const data = await res.json();

      setAlerts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load alerts:', error);
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (alert) => {
    setSelectedAlert(alert);
    setShowVoiceDialog(true);
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');
  const criticalAlerts = activeAlerts.filter(
    a => a.severity === 'critical' || a.severity === 'high'
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar  />

      <div className="ml-64 p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Alerts</h1>
            <p className="text-slate-500 mt-1">
              AI-generated maintenance alerts for your vehicles
            </p>
          </div>

          <Button variant="outline" className="border-slate-200">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Bell} value={activeAlerts.length} label="Active Alerts" color="yellow" />
          <StatCard icon={AlertTriangle} value={criticalAlerts.length} label="Critical" color="red" />
          <StatCard icon={CheckCircle} value={resolvedAlerts.length} label="Resolved" color="green" />
          <StatCard icon={Brain} value="96%" label="AI Accuracy" color="purple" />
        </div>

        {/* VOICE AI BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  Voice AI Notifications
                </h3>
                <p className="text-purple-200 text-sm">
                  Our AI agent can call you to explain critical alerts
                </p>
              </div>
            </div>
            <Button className="bg-white text-purple-600 hover:bg-purple-50">
              <Phone className="w-4 h-4 mr-2" />
              Enable Voice Calls
            </Button>
          </div>
        </motion.div>

        {/* TABS */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="active">Active ({activeAlerts.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolvedAlerts.length})</TabsTrigger>
            <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeAlerts.map((alert, i) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                delay={i * 0.05}
                onAction={handleAction}
              />
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedAlerts.map((alert, i) => (
              <AlertCard key={alert.id} alert={alert} delay={i * 0.05} />
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {alerts.map((alert, i) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                delay={i * 0.05}
                onAction={alert.status === 'active' ? handleAction : undefined}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* VOICE DIALOG */}
      <Dialog open={showVoiceDialog} onOpenChange={setShowVoiceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-purple-600" />
              Voice AI Assistant
            </DialogTitle>
            <DialogDescription>
              Our AI agent can explain this alert and help schedule service.
            </DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="bg-slate-50 rounded-xl p-4 my-4">
              <Badge>{selectedAlert.severity}</Badge>
              <h4 className="font-semibold mt-2">{selectedAlert.title}</h4>
              <p className="text-sm text-slate-600">{selectedAlert.description}</p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowVoiceDialog(false)}>
              Not Now
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Phone className="w-4 h-4 mr-2" />
              Call Me Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* helper – UI unchanged */
function StatCard({ icon: Icon, value, label, color }) {
  return (
    <Card className="bg-white shadow-sm border-slate-100">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
