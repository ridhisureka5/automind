import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/role-selection");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
        
        {/* LOGO + BRAND */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center mb-3 shadow-lg">
            <Brain className="w-7 h-7 text-slate-900" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            AUTOMIND
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Intelligent Vehicle Intelligence Platform
          </p>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-white mb-6 text-center">
          Sign in to your account
        </h2>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <Input
          placeholder="Email address"
          className="mb-4 bg-slate-950 border-slate-700 text-white placeholder:text-slate-400 focus:border-yellow-400 focus:ring-yellow-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <Input
          type="password"
          placeholder="Password"
          className="mb-6 bg-slate-950 border-slate-700 text-white placeholder:text-slate-400 focus:border-yellow-400 focus:ring-yellow-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <Button
          onClick={handleLogin}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-6 rounded-xl transition-all duration-200 shadow-lg"
        >
          Login
        </Button>

        {/* REGISTER */}
        <p className="text-sm text-slate-400 mt-6 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-400 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
