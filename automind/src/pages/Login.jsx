import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Login</h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <Input
          placeholder="Email"
          className="mb-4 text-white placeholder:text-slate-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          className="mb-6 text-white placeholder:text-slate-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          onClick={handleLogin}
          className="w-full bg-yellow-400 text-black"
        >
          Login
        </Button>

        {/* ✅ Register Option */}
        <p className="text-sm text-slate-400 mt-4 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
