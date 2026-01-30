import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchDiagnostics,
  fetchAlerts
} from "../services/diagnosticsApi";

import Sidebar from "../components/dashboard/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";
import AlertCard from "../components/dashboard/AlertCard";
import VehicleHealthCard from "../components/dashboard/VehicleHealthCard";

import {
  Car,
  Bell,
  Calendar,
  Activity,
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
  DialogFooter,
} from "../components/ui/dialog";

import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";


/* ---------------- HELPER ---------------- */

const randomHealth = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;


const speak = (text) => {
  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 0.9;
  window.speechSynthesis.speak(msg);
};


export default function CustomerDashboard() {

  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ADD VEHICLE STATE */
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);

  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    vin: "",
  });

  const navigate = useNavigate();


  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    loadMLData();
  }, []);


  const loadMLData = async () => {

    try {

      setIsLoading(true);

      const ml = await fetchDiagnostics();
      const backendAlerts = await fetchAlerts();


      if (!ml || ml.final_risk === undefined) {
        throw new Error("Invalid ML Data");
      }


      /* ============ ML VEHICLE ============ */

      const mlVehicle = {

        id: ml.vehicle_id || Date.now(),

        name: "Connected Vehicle",

        make: "OEM",
        model: "AI Series",

        year: new Date().getFullYear(),

        licensePlate: "AI-2047",

        mileage: ml.mileage || 0,


        healthScore: Math.round((1 - ml.final_risk) * 100),


        components: [

          {
            name: "Engine",
            health: Math.round((1 - ml.final_risk) * 100),
          },

          {
            name: "Vibration",
            health: Math.round(
              (1 - (ml.vibration || 1) / 10) * 100
            ),
          },

          {
            name: "Stress",
            health: Math.round(
              (1 - (ml.stress_index || 10) / 100) * 100
            ),
          },
        ],


        telemetryData: {

          engineTemp: ml.engine_temp,

          oilPressure: ml.oil_pressure,

          rpm: ml.rpm,

          vibration: ml.vibration,
        },
      };


      /* ============ MANUAL VEHICLES ============ */

      const saved = localStorage.getItem("manual_vehicles");

      const manualVehicles = saved
        ? JSON.parse(saved)
        : [];


      setVehicles([mlVehicle, ...manualVehicles]);


      /* ============ ALERTS ============ */

      const validAlerts = Array.isArray(backendAlerts)
        ? backendAlerts
        : [];

      setAlerts(validAlerts);


      // Voice alerts
      validAlerts.forEach((a) => {

        if (a.status === "active") {

          speak(`Alert! ${a.title}. ${a.description}`);
        }
      });


      /* ============ SERVICES ============ */

      const count = ml.service_demand || 1;

      const generated = [];

      for (let i = 1; i <= Math.min(count, 2); i++) {

        generated.push({

          id: i,

          title: `Service #${i}`,

          type: i === 1 ? "Preventive" : "Inspection",

          status: "Scheduled",

          date: new Date(
            Date.now() + i * 86400000
          ).toDateString(),
        });
      }

      setServices(generated);

      localStorage.setItem(
        "customer_services",
        JSON.stringify(generated)
      );


      setIsLoading(false);

    } catch (err) {

      console.error("Dashboard error:", err);

      setVehicles([]);
      setAlerts([]);
      setServices([]);

      setIsLoading(false);
    }
  };


  /* ---------------- ADD VEHICLE ---------------- */

  const handleAddVehicle = () => {

    if (!newVehicle.make || !newVehicle.model) return;


    const engineHealth = randomHealth(70, 95);
    const batteryHealth = randomHealth(75, 98);
    const brakeHealth = randomHealth(65, 92);


    const avgHealth = Math.round(
      (engineHealth + batteryHealth + brakeHealth) / 3
    );


    const vehicle = {

      id: Date.now(),

      name: `${newVehicle.make} ${newVehicle.model}`,

      make: newVehicle.make,
      model: newVehicle.model,

      year: newVehicle.year,

      licensePlate: newVehicle.licensePlate,

      vin: newVehicle.vin,

      mileage: randomHealth(5000, 120000),

      healthScore: avgHealth,


      components: [

        { name: "Engine", health: engineHealth },

        { name: "Battery", health: batteryHealth },

        { name: "Brakes", health: brakeHealth },
      ],


      telemetryData: {

        engineTemp: randomHealth(85, 110),

        oilPressure: randomHealth(50, 75),

        rpm: randomHealth(2000, 4500),

        vibration: randomHealth(1, 4),
      },
    };


    // Save locally
    const saved = localStorage.getItem("manual_vehicles");

    const list = saved ? JSON.parse(saved) : [];

    const updated = [...list, vehicle];

    localStorage.setItem(
      "manual_vehicles",
      JSON.stringify(updated)
    );


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


  /* ---------------- STATS ---------------- */

  const avgHealthScore =
    vehicles.length > 0
      ? Math.round(
          vehicles.reduce((s, v) => s + v.healthScore, 0) /
          vehicles.length
        )
      : 0;


  const criticalAlerts = alerts.filter(
    (a) => a.status === "active"
  ).length;


  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />


      <main className="ml-64 p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Welcome back!
            </h1>

            <p className="text-slate-500 mt-1">
              Here's your vehicle health overview
            </p>
          </div>


          {/* ADD VEHICLE BUTTON */}
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
            value={services.length}
            icon={Calendar}
            color="purple"
          />

        </div>


        {/* CONTENT */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* VEHICLES */}
          <div className="lg:col-span-2">

            <h2 className="text-xl font-bold mb-4">
              My Vehicles
            </h2>

            {isLoading ? (
              <Skeleton className="h-80 rounded-2xl" />
            ) : (
              vehicles.map((v) => (
                <VehicleHealthCard
                  key={v.id}
                  vehicle={v}
                />
              ))
            )}

          </div>


          {/* ALERTS */}
          <div>

            <h2 className="text-xl font-bold mb-4">
              Active Alerts
            </h2>

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


        {/* ADD VEHICLE DIALOG */}
        <Dialog
          open={showAddVehicleDialog}
          onOpenChange={setShowAddVehicleDialog}
        >

          <DialogContent>

            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>


            <div className="space-y-3">

              <div>
                <Label>Make</Label>
                <Input
                  value={newVehicle.make}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      make: e.target.value,
                    })
                  }
                />
              </div>


              <div>
                <Label>Model</Label>
                <Input
                  value={newVehicle.model}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      model: e.target.value,
                    })
                  }
                />
              </div>


              <div>
                <Label>Year</Label>
                <Input
                  value={newVehicle.year}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      year: e.target.value,
                    })
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


            <DialogFooter>

              <Button
                onClick={handleAddVehicle}
                className="bg-yellow-400 text-slate-900"
              >
                Add
              </Button>

            </DialogFooter>

          </DialogContent>

        </Dialog>

      </main>

    </div>
  );
}
