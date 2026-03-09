"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Lock, Mail, Shield, ArrowRight, Eye, EyeOff, Users, TrendingUp, BookOpen, Award, CheckCircle, BarChart3 } from "lucide-react";
import { useMentorAuthStore } from "@/store/auth/mentor";
import { useThemeStore } from "@/store/layoutStore";
import GlobalNotification from "@/components/notify/notification";
import Banner from "@/assets/loginBanner.jpg";

export default function MentorLoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, checkAuth } = useMentorAuthStore();
  const { initializeTheme } = useThemeStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/mentor/dashboard");
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

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Comprehensive student profile tracking and performance monitoring"
    },
    {
      icon: BookOpen,
      title: "Mentor Coordination",
      description: "Streamlined mentor assignment and communication tools"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights and detailed progress reports"
    },
    {
      icon: Award,
      title: "Achievement Tracking",
      description: "Monitor milestones and celebrate student successes"
    }
  ];

  const stats = [
    { label: "System Uptime", value: "99.9%", icon: CheckCircle },
    { label: "Active Users", value: "1,234", icon: Users },
    { label: "Success Rate", value: "98.5%", icon: TrendingUp }
  ];

  return (
    <>
      <GlobalNotification />
      <div className="min-h-screen grid lg:grid-cols-2 font-poppins bg-background">
        {/* Left Side - Login Form */}
        <div className="flex items-center flex-col justify-center p-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-[80%] flex"
          >
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={"/progress_iq.png"}
                alt="Progress IQ Logo"
                width={50}
                height={50}
                className="w-12 h-12"
              />
              <div>
                <h1 className="text-3xl text-foreground font-black font-poppins tracking-tight">Progress IQ</h1>
                <p className="text-foreground/80 text-sm font-semibold font-poppins">Mentor Portal</p>
              </div>
            </div>
          </motion.div>

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
                <h1 className="text-2xl font-black text-foreground font-poppins">Progress IQ</h1>
              </div>
              <p className="text-secondary font-semibold font-poppins">Mentor Portal</p>
            </div>

            <Card className="border-2 shadow-none mt-5 border-border p-3">
              <CardHeader className="space-y-3 pb-8">
                <CardTitle className="text-3xl font-black text-foreground text-center font-poppins">
                  Mentor Access
                </CardTitle>
                <CardDescription className="text-center text-base font-poppins">
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
                        placeholder="mentor@progressiq.com"
                        className="pl-12 h-12 border-1 shadow-none border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                        className="pl-12 pr-12 h-12 border-1 shadow-none border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                    <a className="text-primary underline hover:text-secondary font-semibold cursor-pointer hover:underline transition-colors">
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/70 hover:from-primary/90 hover:to-secondary/90 text-white font-bold text-base shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground  rounded-full animate-spin mr-2" />
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
                      Secured data with end-to-end encryption
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Side - Enhanced Clean UI */}
        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary/35 via-background to-primary/35">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={Banner}
              alt="Login Banner"
              fill
              className="object-cover opacity-5"
              priority
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden  font-poppins">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/40 rounded-full blur-3xl" />
          </div>

          {/* Grid Pattern */}
          <div
            className="absolute  font-poppins inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-12 flex flex-col justify-between w-full">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Image
                    src={"/progress_iq.png"}
                    alt="Progress IQ Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h1 className="text-2xl text-foreground font-black font-poppins tracking-tight">Progress IQ</h1>
                  <p className="text-muted-foreground text-sm font-medium">Mentor Platform</p>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <h2 className="text-xl font-black text-foreground leading-tight font-poppins">
                  Empowering Education
                  Through Intelligence
                </h2>
                <p className="text-muted-foreground text-sm max-w-md font-poppins">
                  Manage students, mentors, and track academic progress with our comprehensive platform
                </p>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="group p-5 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm mb-1 font-poppins">{feature.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed font-poppins">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}