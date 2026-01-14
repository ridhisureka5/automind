import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Package,
  AlertCircle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Truck,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const inventoryItems = [
  { id: 1, name: "Brake Pads", sku: "BP-001", stock: 24, maxStock: 50, price: 90, category: "Brakes", status: "ok", predictedDemand: 12 },
  { id: 2, name: "Car Battery", sku: "BAT-01", stock: 8, maxStock: 30, price: 150, category: "Electrical", status: "low", predictedDemand: 10 },
  { id: 3, name: "Spark Plugs", sku: "SP-09", stock: 5, maxStock: 60, price: 19, category: "Engine", status: "critical", predictedDemand: 15 },
];

export default function ServiceInventory() {
  const [search, setSearch] = useState("");

  const filtered = inventoryItems.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar userRole="service" />

      <div className="ml-64 p-8">
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Parts Inventory</h1>
            <p className="text-slate-500">AI-assisted inventory monitoring</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Truck className="w-4 h-4 mr-2" />
              Order Parts
            </Button>
            <Button className="bg-yellow-400 text-slate-900">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Search parts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button>
          <Button variant="outline"><ArrowUpDown className="w-4 h-4 mr-2" />Sort</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">AI Demand</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b"
                  >
                    <td className="p-4 flex gap-3 items-center">
                      <Package className="w-5 h-5 text-slate-400" />
                      {item.name}
                    </td>
                    <td className="p-4 w-48">
                      <Progress value={(item.stock / item.maxStock) * 100} />
                      <p className="text-xs mt-1">{item.stock}/{item.maxStock}</p>
                    </td>
                    <td className="p-4">
                      <Brain className="w-4 h-4 inline mr-1 text-purple-500" />
                      {item.predictedDemand}/week
                    </td>
                    <td className="p-4">
                      <Badge className={
                        item.status === "critical"
                          ? "bg-red-100 text-red-700"
                          : item.status === "low"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {(item.status !== "ok") && (
                        <Button size="sm" className="bg-yellow-400 text-slate-900">
                          Reorder
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
