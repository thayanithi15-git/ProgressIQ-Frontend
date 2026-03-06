"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Lock, Mail, Shield, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useStudentAuthStore } from "@/store/auth/student";
import GlobalNotification from "@/components/notify/notification";
import Banner from "@/assets/loginBanner.jpg";

export default function StudentLoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, checkAuth } = useStudentAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      // router.push("/student/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return;
    }

    try {
      await login(form.email, form.password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <GlobalNotification />
      <div className="min-h-screen grid lg:grid-cols-2 font-poppins bg-background">
        
        <div className="flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg"
          >
            <div className="lg:hidden mb-8 text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <Image
                  src={"/progress_iq.png"}
                  alt="Progress IQ Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <h1 className="text-2xl font-black text-foreground">Progress IQ</h1>
              </div>
              <p className="text-secondary font-semibold">Student Portal</p>
            </div>

            <Card className="border-2 border-border shadow-2xl shadow-border/50 p-8">
              <CardHeader className="space-y-3 pb-8">
                <CardTitle className="text-3xl font-black text-foreground text-center">
                  Student Access
                </CardTitle>
                <CardDescription className="text-center text-base">
                  Enter your credentials to access the control panel
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="student@progressiq.com"
                        className="pl-12 h-12 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-12 pr-12 h-12 border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2">
                    <a className="text-primary hover:text-secondary font-semibold cursor-pointer hover:underline transition-colors">
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Access Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-4">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" />
                      Secured with 256-bit encryption
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary">

          <Image
            src={Banner}
            alt="Login Banner"
            fill
            className="object-cover opacity-30"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/0 to-primary/40" />

          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-secondary to-primary rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary to-secondary rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />

          <div className="relative z-10 p-16 flex flex-col justify-between text-white w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Image
                  src={"/progress_iq.png"}
                  alt="Progress IQ Logo"
                  width={50}
                  height={50}
                  className="w-12 h-12"
                />
                <div>
                  <h1 className="text-3xl font-black tracking-tight">Progress IQ</h1>
                  <p className="text-white/80 text-sm font-semibold">Student Portal</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-black leading-tight max-w-lg">
                Student <span className="text-white">Control</span>
              </h2>
              <p className="text-white/90 text-lg max-w-md leading-relaxed">
                Secure access to system administration, user management, and comprehensive analytics dashboard.
              </p>

              <div className="flex gap-4 pt-4">
                <div className="flex-1 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-white">100%</div>
                  <div className="text-sm text-white/70">System Uptime</div>
                </div>
                <div className="flex-1 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-white/70">Monitoring</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </>
  );
}