import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Package,
  Plus,
  Search,
  ArrowUpDown,
  Truck,
  Brain,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/* ---------------- INITIAL DATA ---------------- */

const initialInventory = [
  {
    id: 1,
    name: "Brake Pads",
    sku: "BP-001",
    stock: 24,
    maxStock: 50,
    predictedDemand: 12,
    status: "ok",
  },
  {
    id: 2,
    name: "Car Battery",
    sku: "BAT-01",
    stock: 8,
    maxStock: 30,
    predictedDemand: 10,
    status: "low",
  },
  {
    id: 3,
    name: "Spark Plugs",
    sku: "SP-09",
    stock: 5,
    maxStock: 60,
    predictedDemand: 15,
    status: "critical",
  },
];

export default function ServiceInventory() {
  const [items, setItems] = useState(initialInventory);
  const [search, setSearch] = useState("");

  /* MODALS */
  const [addOpen, setAddOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    stock: "",
    maxStock: "",
    predictedDemand: "",
  });

  const [orderQty, setOrderQty] = useState({});

  /* ---------------- HELPERS ---------------- */

  const computeStatus = (stock, maxStock) => {
    if (stock < maxStock * 0.2) return "critical";
    if (stock < maxStock * 0.4) return "low";
    return "ok";
  };

  /* ---------------- SEARCH FILTER ---------------- */

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- ADD ITEM ---------------- */

  const handleAddItem = () => {
    const stock = Number(newItem.stock);
    const maxStock = Number(newItem.maxStock);

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newItem.name,
        sku: newItem.sku,
        stock,
        maxStock,
        predictedDemand: Number(newItem.predictedDemand),
        status: computeStatus(stock, maxStock),
      },
    ]);

    setNewItem({
      name: "",
      sku: "",
      stock: "",
      maxStock: "",
      predictedDemand: "",
    });
    setAddOpen(false);
  };

  /* ---------------- ORDER PARTS ---------------- */

  const handleOrderConfirm = () => {
    setItems((prev) =>
      prev.map((item) => {
        const qty = Number(orderQty[item.id] || 0);
        if (!qty) return item;

        const newStock = item.stock + qty;
        return {
          ...item,
          stock: newStock,
          status: computeStatus(newStock, item.maxStock),
        };
      })
    );
    setOrderQty({});
    setOrderOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar userRole="service" />

      <div className="ml-64 p-8">
        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Parts Inventory</h1>
            <p className="text-slate-500">
              AI-assisted inventory monitoring
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOrderOpen(true)}>
              <Truck className="w-4 h-4 mr-2" />
              Order Parts
            </Button>

            <Button
              className="bg-yellow-400 text-slate-900"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative w-72 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
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
                {filteredItems.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <Package className="w-5 h-5 text-slate-400" />
                      {item.name}
                    </td>

                    <td className="p-4 w-48">
                      <Progress
                        value={(item.stock / item.maxStock) * 100}
                      />
                      <p className="text-xs mt-1">
                        {item.stock}/{item.maxStock}
                      </p>
                    </td>

                    <td className="p-4">
                      <Brain className="w-4 h-4 inline mr-1 text-purple-500" />
                      {item.predictedDemand}/week
                    </td>

                    <td className="p-4">
                      <Badge
                        className={
                          item.status === "critical"
                            ? "bg-red-100 text-red-700"
                            : item.status === "low"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>

                    <td className="p-4">
                      {item.status !== "ok" && (
                        <Button
                          size="sm"
                          onClick={() => setOrderOpen(true)}
                        >
                          Reorder
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                ))}

                {filteredItems.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-6 text-center text-slate-500"
                    >
                      No matching parts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* ---------------- ADD ITEM DIALOG ---------------- */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
            />
            <Input
              placeholder="SKU"
              value={newItem.sku}
              onChange={(e) =>
                setNewItem({ ...newItem, sku: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Stock"
              value={newItem.stock}
              onChange={(e) =>
                setNewItem({ ...newItem, stock: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Max Stock"
              value={newItem.maxStock}
              onChange={(e) =>
                setNewItem({ ...newItem, maxStock: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Predicted Demand"
              value={newItem.predictedDemand}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  predictedDemand: e.target.value,
                })
              }
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-yellow-400 text-slate-900"
              onClick={handleAddItem}
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- ORDER PARTS DIALOG ---------------- */}
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Parts</DialogTitle>
          </DialogHeader>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center gap-3 mb-2"
            >
              <span>{item.name}</span>
              <Input
                type="number"
                className="w-24"
                placeholder="Qty"
                onChange={(e) =>
                  setOrderQty({
                    ...orderQty,
                    [item.id]: e.target.value,
                  })
                }
              />
            </div>
          ))}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleOrderConfirm}>
              Confirm Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
