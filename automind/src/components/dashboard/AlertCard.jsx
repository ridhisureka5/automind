import { motion } from "framer-motion";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Cpu,
} from "lucide-react";
import { Button } from "../ui/button";


const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
    iconColor: "text-red-500",
  },
  high: {
    icon: AlertCircle,
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    iconColor: "text-orange-500",
  },
  medium: {
    icon: Info,
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
    iconColor: "text-yellow-500",
  },
  low: {
    icon: CheckCircle,
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    iconColor: "text-blue-500",
  },
};

export default function AlertCard({ alert, onAction, delay = 0 }) {
  const config = severityConfig[alert.severity] || severityConfig.low;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`${config.bg} border ${config.border} rounded-xl p-5`}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">{alert.title}</h4>
          <p className="text-slate-600 text-sm mb-2">
            {alert.description}
          </p>

          <div className="flex gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {alert.predictedFailureWindow}
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              {alert.aiConfidence}% confidence
            </span>
          </div>
        </div>

        {onAction && (
          <Button size="sm" onClick={() => onAction(alert)}>
            Take Action
          </Button>
        )}
      </div>
    </motion.div>
  );
}
