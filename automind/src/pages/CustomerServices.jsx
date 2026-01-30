import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/dashboard/Sidebar";

import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Wrench,
  Star,
  Plus,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

/* ---------------- HELPERS ---------------- */

// Convert 24h → AM/PM
const formatTime = (time24) => {
  if (!time24) return "";

  const [h, m] = time24.split(":");
  let hour = parseInt(h, 10);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${m} ${ampm}`;
};

/* ---------------- CONSTANTS ---------------- */

const statusColors = {
  scheduled: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
};

const serviceCenters = [
  "AutoMind Service Center – Rajouri Garden",
  "AutoMind Service Center – Shalimar Bagh",
  "AutoMind Service Center – Vaishali",
  "AutoMind Service Center – Sonipat",
];

/* ---------------- COMPONENT ---------------- */

export default function CustomerServices() {

  const [services, setServices] = useState([]);

  /* Load default AI services */
  useEffect(() => {

    const initialServices = [

      {
        id: 1,
        serviceType: "Predictive Maintenance",
        serviceCenterName: serviceCenters[0],
        scheduledDate: "2026-02-05",
        timeSlot: "10:00 AM",
        estimatedCost: 4800,
        status: "scheduled",
      },

      {
        id: 2,
        serviceType: "Engine Diagnostics",
        serviceCenterName: serviceCenters[1],
        scheduledDate: "2026-01-18",
        timeSlot: "02:30 PM",
        estimatedCost: 5200,
        status: "completed",
      },
    ];

    setServices(initialServices);

  }, []);

  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [rating, setRating] = useState(0);

  const [bookingForm, setBookingForm] = useState({
    serviceType: "Predictive Maintenance",
    serviceCenterName: serviceCenters[0],
    scheduledDate: "",
    timeSlot: "",
    estimatedCost: 4500,
  });

  /* Filters */

  const upcomingServices = services.filter(
    (s) => s.status === "scheduled" || s.status === "in_progress"
  );

  const completedServices = services.filter(
    (s) => s.status === "completed"
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 p-8">

        {/* HEADER */}
        <div className="flex justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold">Service History</h1>
            <p className="text-slate-500">
              ML-driven predictive service scheduling
            </p>
          </div>

          <Button
            className="bg-yellow-400 text-slate-900"
            onClick={() => setShowBookingDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Book Service
          </Button>

        </div>


        {/* TABS */}
        <Tabs defaultValue="upcoming">

          <TabsList className="bg-white border">

            <TabsTrigger value="upcoming">
              Upcoming ({upcomingServices.length})
            </TabsTrigger>

            <TabsTrigger value="completed">
              Completed ({completedServices.length})
            </TabsTrigger>

          </TabsList>


          {/* UPCOMING */}
          <TabsContent value="upcoming" className="mt-6 space-y-4">

            {upcomingServices.length > 0 ? (

              upcomingServices.map((service, index) => (

                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >

                  <Card>

                    <CardContent className="p-6">

                      <div className="flex justify-between mb-4">

                        <div className="flex gap-4">

                          <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center">
                            <Car className="w-7 h-7 text-slate-900" />
                          </div>

                          <div>
                            <h3 className="font-semibold text-lg">
                              {service.serviceType}
                            </h3>

                            <p className="text-slate-500">
                              {service.serviceCenterName}
                            </p>
                          </div>

                        </div>

                        <Badge className={statusColors[service.status]}>
                          {service.status}
                        </Badge>

                      </div>


                      <div className="grid md:grid-cols-3 gap-4 mb-4">

                        <InfoItem
                          icon={Calendar}
                          text={service.scheduledDate}
                        />

                        <InfoItem
                          icon={Clock}
                          text={service.timeSlot}
                        />

                        <InfoItem
                          icon={MapPin}
                          text={service.serviceCenterName}
                        />

                      </div>


                      <div className="flex justify-between border-t pt-4">

                        <span className="text-sm text-slate-500">
                          Estimated Cost
                        </span>

                        <span className="font-semibold">
                          ₹ {service.estimatedCost.toLocaleString("en-IN")}
                        </span>

                      </div>

                    </CardContent>

                  </Card>

                </motion.div>

              ))

            ) : (

              <Empty text="No upcoming services scheduled" />

            )}

          </TabsContent>


          {/* COMPLETED */}
          <TabsContent value="completed" className="mt-6">

            {completedServices.length > 0 ? (

              completedServices.map((service) => (

                <Card key={service.id} className="mb-4">

                  <CardContent className="p-6">

                    <h3 className="font-semibold">
                      {service.serviceType}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {service.serviceCenterName}
                    </p>

                  </CardContent>

                </Card>

              ))

            ) : (

              <Empty text="No completed services yet" />

            )}

          </TabsContent>

        </Tabs>

      </main>


      {/* BOOK SERVICE DIALOG */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>

        <DialogContent>

          <DialogHeader>

            <DialogTitle>Book Service</DialogTitle>

            <DialogDescription>
              Schedule maintenance with nearest service center
            </DialogDescription>

          </DialogHeader>


          <div className="space-y-4 py-4">

            {/* DATE */}
            <input
              type="date"
              required
              className="w-full p-3 border rounded-xl"
              value={bookingForm.scheduledDate}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  scheduledDate: e.target.value,
                })
              }
            />

            {/* TIME */}
            <input
              type="time"
              required
              className="w-full p-3 border rounded-xl"
              value={bookingForm.timeSlot}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  timeSlot: e.target.value,
                })
              }
            />

            {/* CENTER */}
            <select
              className="w-full p-3 border rounded-xl"
              value={bookingForm.serviceCenterName}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  serviceCenterName: e.target.value,
                })
              }
            >

              {serviceCenters.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}

            </select>


            {/* COST */}
            <input
              type="number"
              className="w-full p-3 border rounded-xl"
              value={bookingForm.estimatedCost}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  estimatedCost: Number(e.target.value),
                })
              }
            />

          </div>


          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => setShowBookingDialog(false)}
            >
              Cancel
            </Button>

            <Button
              className="bg-yellow-400 text-slate-900"
              onClick={() => {

                if (!bookingForm.scheduledDate || !bookingForm.timeSlot) {
                  alert("Please select date and time");
                  return;
                }

                const formattedTime =
                  formatTime(bookingForm.timeSlot);

                setServices((prev) => [

                  ...prev,

                  {
                    id: Date.now(),
                    ...bookingForm,
                    timeSlot: formattedTime,
                    status: "scheduled",
                    estimatedCost: Number(
                      bookingForm.estimatedCost
                    ),
                  },

                ]);

                setShowBookingDialog(false);

                // Reset
                setBookingForm({
                  serviceType: "Predictive Maintenance",
                  serviceCenterName: serviceCenters[0],
                  scheduledDate: "",
                  timeSlot: "",
                  estimatedCost: 4500,
                });
              }}
            >
              Schedule Service
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>


      {/* FEEDBACK */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>

        <DialogContent>

          <DialogHeader>

            <DialogTitle>Rate Your Service</DialogTitle>

            <DialogDescription>
              Your feedback helps improve AI predictions
            </DialogDescription>

          </DialogHeader>


          <div className="flex justify-center gap-2 py-6">

            {[1, 2, 3, 4, 5].map((s) => (

              <Star
                key={s}
                onClick={() => setRating(s)}
                className={`w-8 h-8 cursor-pointer ${
                  s <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-slate-300"
                }`}
              />

            ))}

          </div>


          <DialogFooter>

            <Button variant="outline">
              Cancel
            </Button>

            <Button className="bg-yellow-400 text-slate-900">
              Submit
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  );
}


/* ---------------- HELPERS ---------------- */

function InfoItem({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </div>
  );
}


function Empty({ text }) {
  return (
    <div className="bg-white p-12 rounded-2xl text-center">
      <Wrench className="w-14 h-14 text-slate-300 mx-auto mb-4" />
      <p className="text-slate-500">{text}</p>
    </div>
  );
}
