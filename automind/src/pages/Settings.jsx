import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import {
  User,
  Bell,
  Shield,
  Smartphone,
  Mail,
  Volume2,
  Save,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Settings() {
  const navigate = useNavigate();

  /* ---------------- AUTH USER ---------------- */

  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    voice: false,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/login");
        return;
      }

      setUser({
        uid: firebaseUser.uid,
        fullName: firebaseUser.displayName || "User",
        email: firebaseUser.email || "",
        phone: firebaseUser.phoneNumber || "",
        role: "service", // 🔁 later load from Firestore
      });
    });

    return () => unsub();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading user settings…
      </div>
    );
  }

  /* ---------------- SAVE (MOCK) ---------------- */

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved (mock)");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar userRole={user.role} />

      <div className="ml-64 p-8">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-slate-500">
              Manage your account preferences
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="max-w-4xl space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* PROFILE */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={user.fullName} disabled />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={user.email} disabled />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={user.phone}
                      onChange={(e) =>
                        setUser({ ...user, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input value={user.role} disabled />
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-yellow-400 text-slate-900"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you receive alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "email", icon: Mail, label: "Email Alerts" },
                  { key: "sms", icon: Smartphone, label: "SMS Alerts" },
                  { key: "push", icon: Bell, label: "Push Notifications" },
                  { key: "voice", icon: Volume2, label: "Voice AI Calls" },
                ].map((n) => (
                  <div
                    key={n.key}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <n.icon className="w-5 h-5 text-slate-600" />
                      <span className="font-medium">{n.label}</span>
                    </div>
                    <Switch
                      checked={notifications[n.key]}
                      onCheckedChange={(v) =>
                        setNotifications({
                          ...notifications,
                          [n.key]: v,
                        })
                      }
                    />
                  </div>
                ))}

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-yellow-400 text-slate-900"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Account protection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="font-medium text-green-800">
                    Account Secure
                  </p>
                  <p className="text-sm text-green-700">
                    Firebase authentication enabled
                  </p>
                </div>

                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Manage Sessions</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
