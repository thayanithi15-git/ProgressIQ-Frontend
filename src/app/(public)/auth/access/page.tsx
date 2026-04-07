"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/utils/notification";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
export default function LoginPage() {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotificationStore();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleLoginSuccess = (data: any) => {
    localStorage.setItem("credxUser", JSON.stringify(data));
    localStorage.setItem("role", data.role);
    localStorage.setItem("auth-token", data.token);
    showNotification("Login successful!", "success");
    const role = data.role.toLowerCase();
    if (role === "admin") router.push("/admin/dashboard");
    else if (role === "mentor") router.push("/mentor/dashboard");
    else router.push("/student/dashboard");
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
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: form.identifier,
        password: form.password
      });
      handleLoginSuccess(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/auth/google`, {
        credential: credentialResponse.credential
      });
      handleLoginSuccess(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-poppins">
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
              <div className="space-y-5">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                </form>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Google Login Failed")}
                    theme="outline"
                    width="100%"
                  />
                </div>
                <div className="text-center text-xs text-muted-foreground">
                  Secure access powered by Progress IQ
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
