import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";
import AlertCard from "../components/dashboard/AlertCard";
import VehicleHealthCard from "../components/dashboard/VehicleHealthCard";

import {
  Car,
  Bell,
  Calendar,
  Activity,
  Brain,
  Shield,
  Plus,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label";

import { fetchDiagnostics } from "../services/diagnosticsApi";

export default function CustomerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ✅ ADD VEHICLE STATE */
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    vin: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadMLData();
  }, []);

  const loadMLData = async () => {
    setIsLoading(true);

    const ml = await fetchDiagnostics();

    const mlVehicle = {
      id: Date.now(),
      make: "OEM",
      model: "Predictive-X",
      year: 2024,
      licensePlate: "AI-2047",
      mileage: 42150,
      healthScore: Math.round((1 - ml.final_risk) * 100),
      components: [
        { name: "Engine", health: Math.round((1 - ml.engine_prob) * 100) },
        { name: "Bearings", health: Math.round((1 - ml.bearing_prob) * 100) },
        { name: "Stress", health: Math.round((1 - ml.stress_index) * 100) },
      ],
      telemetryData: {
        engineTemp: 98,
        oilPressure: 64,
        batteryVoltage: 12.6,
        brakeWear: 32,
      },
    };

    const mappedAlerts = ml.dtc_codes.map((code, i) => ({
      id: i + 1,
      title: code,
      description: "AI detected a high probability of component failure.",
      severity: ml.final_risk > 0.8 ? "critical" : "medium",
      predictedFailureWindow: "Within 48 hours",
      aiConfidence: Math.round(ml.final_risk * 100),
    }));

    setVehicles([mlVehicle]);
    setAlerts(mappedAlerts);
    setIsLoading(false);
  };

  /* ✅ ADD VEHICLE HANDLER */
  const handleAddVehicle = () => {
    const vehicle = {
      id: Date.now(),
      ...newVehicle,
      mileage: 0,
      healthScore: 100,
      components: [],
      telemetryData: {},
    };

    setVehicles((prev) => [...prev, vehicle]);
    setShowAddVehicleDialog(false);
    setNewVehicle({
      make: "",
      model: "",
      year: "",
      licensePlate: "",
      vin: "",
    });
  };

  const avgHealthScore =
    vehicles.length > 0
      ? Math.round(
          vehicles.reduce((sum, v) => sum + v.healthScore, 0) /
            vehicles.length
        )
      : 0;

  const criticalAlerts = alerts.filter(
    (a) => a.severity === "critical"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar  />

      <main className="ml-64 p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back!
            </h1>
            <p className="text-slate-500 mt-1">
              Here's your vehicle health overview
            </p>
          </div>

          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-slate-900"
            onClick={() => setShowAddVehicleDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Average Health Score"
            value={`${avgHealthScore}%`}
            icon={Activity}
            color="green"
          />
          <StatsCard
            title="My Vehicles"
            value={vehicles.length}
            icon={Car}
            color="blue"
          />
          <StatsCard
            title="Active Alerts"
            value={alerts.length}
            icon={Bell}
            color={criticalAlerts ? "red" : "yellow"}
          />
          <StatsCard
            title="Scheduled Services"
            value="2"
            icon={Calendar}
            color="purple"
          />
        </div>

        {/* AI AGENT */}
        <motion.div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-slate-900" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                AUTOMIND AI Agent
              </h3>
              <p className="text-slate-400 text-sm">
                Continuously monitoring your vehicles
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* VEHICLES */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">My Vehicles</h2>

            {isLoading ? (
              <Skeleton className="h-80 rounded-2xl" />
            ) : (
              <VehicleHealthCard vehicle={vehicles[0]} />
            )}
          </div>

          {/* ALERTS */}
          <div>
            <h2 className="text-xl font-bold mb-4">Active Alerts</h2>

            {isLoading ? (
              <Skeleton className="h-40 rounded-xl" />
            ) : alerts.length > 0 ? (
              alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAction={() => navigate("/alerts")}
                />
              ))
            ) : (
              <div className="bg-white p-6 rounded-xl text-center">
                <Shield className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p>No active alerts</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ADD VEHICLE DIALOG */}
      <Dialog
        open={showAddVehicleDialog}
        onOpenChange={setShowAddVehicleDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Enter your vehicle details to start monitoring
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Make</Label>
                <Input
                  value={newVehicle.make}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, make: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Model</Label>
                <Input
                  value={newVehicle.model}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, model: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Year</Label>
                <Input
                  type="number"
                  value={newVehicle.year}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, year: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>License Plate</Label>
                <Input
                  value={newVehicle.licensePlate}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      licensePlate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label>VIN</Label>
              <Input
                value={newVehicle.vin}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, vin: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddVehicleDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900"
              onClick={handleAddVehicle}
            >
              Add Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
