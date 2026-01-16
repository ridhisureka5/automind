import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Star,
  Wrench,
  Phone,
  Mail,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

/* ---------------- INITIAL DATA ---------------- */

const initialTechnicians = [
  {
    id: 1,
    name: "Robert Chen",
    skill: "Engine",
    status: "busy",
    progress: 75,
    rating: 4.9,
  },
  {
    id: 2,
    name: "Maria Garcia",
    skill: "Electrical",
    status: "available",
    progress: 0,
    rating: 4.8,
  },
];

export default function ServiceTechnicians() {
  const [technicians, setTechnicians] = useState(initialTechnicians);
  const [open, setOpen] = useState(false);

  const [newTech, setNewTech] = useState({
    name: "",
    skill: "",
    rating: "",
  });

  /* ---------------- ADD TECHNICIAN ---------------- */

  const handleAddTechnician = () => {
    if (!newTech.name || !newTech.skill) return;

    setTechnicians([
      ...technicians,
      {
        id: Date.now(),
        name: newTech.name,
        skill: newTech.skill,
        rating: Number(newTech.rating) || 4.5,
        status: "available",
        progress: 0,
      },
    ]);

    setNewTech({ name: "", skill: "", rating: "" });
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar userRole="service" />

      <div className="ml-64 p-8">
        {/* ---------------- HEADER ---------------- */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Technicians</h1>
            <p className="text-slate-500">Workforce management</p>
          </div>
          <Button
            className="bg-yellow-400 text-slate-900"
            onClick={() => setOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Technician
          </Button>
        </div>

        {/* ---------------- TECHNICIAN GRID ---------------- */}
        <div className="grid md:grid-cols-2 gap-6">
          {technicians.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-3">
                    <div>
                      <h3 className="font-bold">{t.name}</h3>
                      <p className="text-sm text-slate-500">{t.skill}</p>
                    </div>
                    <Badge
                      className={
                        t.status === "busy"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {t.status}
                    </Badge>
                  </div>

                  <div className="flex gap-4 text-sm mb-3">
                    <span className="flex gap-1 items-center">
                      <Star className="w-4 h-4 text-yellow-400" />
                      {t.rating}
                    </span>
                    <span className="flex gap-1 items-center">
                      <Wrench className="w-4 h-4" />
                      {t.skill}
                    </span>
                  </div>

                  {t.progress > 0 && <Progress value={t.progress} />}

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ---------------- ADD TECHNICIAN MODAL ---------------- */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Add Technician</h2>

            <Input
              placeholder="Full Name"
              className="mb-2"
              value={newTech.name}
              onChange={(e) =>
                setNewTech({ ...newTech, name: e.target.value })
              }
            />
            <Input
              placeholder="Skill (Engine / Electrical / Body)"
              className="mb-2"
              value={newTech.skill}
              onChange={(e) =>
                setNewTech({ ...newTech, skill: e.target.value })
              }
            />
            <Input
              type="number"
              step="0.1"
              placeholder="Rating (optional)"
              className="mb-4"
              value={newTech.rating}
              onChange={(e) =>
                setNewTech({ ...newTech, rating: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-yellow-400 text-slate-900"
                onClick={handleAddTechnician}
              >
                Add Technician
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
