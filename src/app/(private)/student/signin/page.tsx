"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Shield, ArrowRight, Eye, EyeOff, Sparkles, GraduationCap, Target } from "lucide-react";
import { useStudentAuthStore } from "@/store/auth/student";
import { useThemeStore } from "@/store/layoutStore";
import GlobalNotification from "@/components/notify/notification";
import Banner from "@/assets/loginBanner.jpg";

export default function StudentLoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, checkAuth } = useStudentAuthStore();
  const { initializeTheme } = useThemeStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/student/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.email || !form.password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    try {
      await login(form.email, form.password);
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMsg(error?.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <>
      <GlobalNotification />
      <div className="min-h-screen w-full flex font-[Poppins,sans-serif] bg-slate-50 overflow-hidden">

        {/* LEFT PANEL - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.4]" />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="lg:hidden mb-8 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-3 mb-3 h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 justify-center shadow-lg shadow-blue-500/20">
                <Image
                  src={"/progress_iq.png"}
                  alt="Progress IQ Logo"
                  width={32}
                  height={32}
                  className="brightness-0 invert"
                />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Progress IQ</h1>
              <p className="text-blue-600 font-bold tracking-wider uppercase text-xs mt-1">Student Portal</p>
            </div>


            <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-2 sm:p-6 border">
              <CardHeader className="space-y-3 pb-6 border-b border-slate-100 mb-6">

                <div className="flex items-center justify-center gap-3">
                  <Image
                    src={"/progress_iq.png"}
                    alt="Progress IQ Logo"
                    width={48}
                    height={48}
                    className="w-12 h-12 brightness invert"
                  />
                  <div>
                    <h1 className="text-2xl font-black tracking-tight">Progress IQ</h1>
                    <p className="text-blue-800 text-xs font-bold uppercase tracking-widest mt-0.5">Education Platform</p>
                  </div>
                </div>

                <div className="flex justify-center mb-2 mt-3 py-2">
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-50 border border-blue-100">
                    {/* <Sparkles className="h-3.5 w-3.5 text-blue-600 mr-1.5" /> */}
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Student Access</span>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 text-center tracking-tight">
                  Welcome Back!
                </CardTitle>
                <CardDescription className="text-center text-slate-500 font-medium font-poppins text-sm">
                  Log in to your academic dashboard
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold mb-4 text-center">
                          {errorMsg}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="student@progressiq.com"
                        className="pl-12 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-xl transition-all shadow-sm font-medium"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</Label>
                      <a className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer hover:underline transition-colors">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-12 pr-12 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-xl transition-all shadow-sm font-medium"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)] transition-all group overflow-hidden relative"
                    disabled={isLoading}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          Access Dashboard
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  </Button>

                  <div className="text-center pt-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Secured Connection
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* RIGHT PANEL - Image & Brand (Desktop Only) */}
        <div className="hidden lg:flex w-[50%] relative overflow-hidden bg-[#081326] flex-col justify-between">
          <Image
            src={Banner}
            alt="Student Campus"
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />

          {/* Gradient Overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#081326] via-transparent to-[#081326]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081326]/90 via-[#081326]/40 to-transparent" />

          {/* Floating Accents */}
          <motion.div
            animate={{ y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity }}
            className="absolute top-[20%] right-[15%] p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl"
          >
            <GraduationCap className="w-8 h-8 text-blue-400" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity }}
            className="absolute bottom-[35%] right-[25%] p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl"
          >
            <Target className="w-8 h-8 text-emerald-400" />
          </motion.div>

          <div className="relative z-10 p-12 w-full h-full flex flex-col justify-between text-white">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={"/progress_iq.png"}
                  alt="Progress IQ Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 brightness-0 invert"
                />
                <div>
                  <h1 className="text-2xl font-black tracking-tight">Progress IQ</h1>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-0.5">Education Platform</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 max-w-lg mb-12"
            >
              <h2 className="text-5xl font-extrabold leading-[1.15] tracking-tight">
                Empower Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Academic Journey</span>
              </h2>
              <p className="text-lg text-slate-300 font-medium leading-relaxed">
                Track your projects, manage internships, showcase certifications, and build a standout portfolio all in one place.
              </p>

              <div className="flex gap-4 pt-6">
                <div className="flex-1 p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="text-3xl font-black text-white mb-1">10k+</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Students</div>
                </div>
                <div className="flex-1 p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="text-3xl font-black text-white mb-1">500+</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projects Built</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}} />
      </div>
    </>
  );
}