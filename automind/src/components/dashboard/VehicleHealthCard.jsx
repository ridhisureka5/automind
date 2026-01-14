import { motion } from "framer-motion";
import {
  Car,
  Activity,
  Thermometer,
  Battery,
  Settings2,
} from "lucide-react";

const getHealthColor = (score) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
};

const getProgressColor = (score) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
};

export default function VehicleHealthCard({ vehicle, delay = 0 }) {
  const components = vehicle.components || [];
  const telemetry = vehicle.telemetryData || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
            <Car className="w-7 h-7 text-slate-600 group-hover:text-slate-900" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-slate-500 text-sm">
              {vehicle.year} • {vehicle.licensePlate}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`text-3xl font-bold ${getHealthColor(
              vehicle.healthScore
            )}`}
          >
            {vehicle.healthScore}%
          </div>
          <p className="text-xs text-slate-500">Health Score</p>
        </div>
      </div>

      {/* Component Health */}
      <div className="space-y-3 mb-6">
        {components.map((component, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-600">
                {component.name}
              </span>
              <span
                className={`text-sm font-medium ${getHealthColor(
                  component.health
                )}`}
              >
                {component.health}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(
                  component.health
                )} rounded-full`}
                style={{ width: `${component.health}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Telemetry */}
      <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-100">
        <TelemetryItem icon={Thermometer} label="Temp" value={`${telemetry.engineTemp || "--"}°`} />
        <TelemetryItem icon={Activity} label="Oil" value={`${telemetry.oilPressure || "--"}%`} />
        <TelemetryItem icon={Battery} label="Battery" value={`${telemetry.batteryVoltage || "--"}V`} />
        <TelemetryItem icon={Settings2} label="Brakes" value={`${telemetry.brakeWear || "--"}%`} />
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
        <span className="text-xs text-slate-500">
          {vehicle.mileage?.toLocaleString() || 0} miles
        </span>
        <span className="text-xs text-yellow-600 font-medium">
          View Details →
        </span>
      </div>
    </motion.div>
  );
}

function TelemetryItem({ icon: Icon, label, value }) {
  return (
    <div className="text-center">
      <Icon className="w-4 h-4 mx-auto text-slate-400 mb-1" />
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
