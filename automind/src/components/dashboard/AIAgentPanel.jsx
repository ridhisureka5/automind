import { motion } from "framer-motion";
import { Brain, Cpu, Activity } from "lucide-react";

export default function AIAgentPanel({ status = "Online", sensors = 200 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 text-white rounded-2xl p-6 flex justify-between items-center mb-8"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-slate-900" />
        </div>
        <div>
          <h3 className="text-xl font-bold">AUTOMIND AI Agent</h3>
          <p className="text-slate-400 text-sm">
            Continuously monitoring vehicle health
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center">
          <Cpu className="w-5 h-5 mx-auto text-green-400 mb-1" />
          <p className="text-sm font-semibold">{sensors}+</p>
          <p className="text-xs text-slate-400">Sensors</p>
        </div>

        <div className="text-center">
          <Activity className="w-5 h-5 mx-auto text-green-400 mb-1" />
          <p className="text-sm font-semibold">{status}</p>
          <p className="text-xs text-slate-400">Status</p>
        </div>

        <span className="bg-green-600 px-4 py-2 rounded-full text-sm font-medium">
          Active
        </span>
      </div>
    </motion.div>
  );
}
