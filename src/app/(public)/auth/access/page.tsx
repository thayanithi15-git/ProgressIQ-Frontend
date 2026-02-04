"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.identifier || !form.password) {
      setError("Please enter email/username and password");
      return;
    }

    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1000));
      alert("Login successful (demo)");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-poppins">
      {/* Left Image Section */}
      <div
        className="hidden lg:flex relative bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, rgba(12,156,237,0.85), rgba(24,84,191,0.9)), url('/login-bg.jpg')",
        }}
      >
        <div className="p-12 flex flex-col justify-end text-white">
          <h2 className="text-4xl font-bold mb-3">Progress IQ</h2>
          <p className="opacity-90 max-w-md">
            Smart Activity Reporting Dashboard that transforms daily work
            into meaningful insights and productivity growth.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center p-6 bg-gradient-to-br from-[#e2edfd] to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-center">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center">
                Login to continue to Progress IQ
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label>Email or Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="identifier"
                      placeholder="Enter email or username"
                      className="pl-9"
                      value={form.identifier}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      className="pl-9"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <a className="text-[#1854bf] hover:underline cursor-pointer">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0c9ced] hover:bg-[#1854bf]"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Login"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  Secure access powered by Progress IQ
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
