import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Calendar,
  Clock,
  User,
  Wrench,
  CheckCircle,
  AlertCircle,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const schedule = [
  { time: "9:00 AM", vehicle: "Toyota Camry", owner: "John", service: "Brake Repair", severity: "high", status: "confirmed" },
  { time: "11:00 AM", vehicle: "Honda Civic", owner: "Mary", service: "Oil Change", severity: "low", status: "confirmed" },
  { time: "2:00 PM", vehicle: "Ford F-150", owner: "Mike", service: "Transmission", severity: "critical", status: "pending" },
];

export default function ServiceSchedule() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar userRole="service" />

      <div className="ml-64 p-8">
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Service Schedule</h1>
            <p className="text-slate-500">AI-optimized daily planning</p>
          </div>
          <Button className="bg-yellow-400 text-slate-900">
            <Brain className="w-4 h-4 mr-2" />
            Optimize
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedule.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-50 rounded-xl border"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">{s.time}</p>
                    <p className="text-sm text-slate-500">{s.vehicle}</p>
                  </div>
                  <Badge className={
                    s.severity === "critical"
                      ? "bg-red-100 text-red-700"
                      : s.severity === "high"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }>
                    {s.severity}
                  </Badge>
                </div>

                <div className="flex gap-4 mt-3 text-sm text-slate-600">
                  <span className="flex gap-1"><User className="w-4 h-4" />{s.owner}</span>
                  <span className="flex gap-1"><Wrench className="w-4 h-4" />{s.service}</span>
                </div>

                {s.status === "pending" && (
                  <Button size="sm" className="mt-3 bg-green-600 text-white">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Confirm
                  </Button>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
