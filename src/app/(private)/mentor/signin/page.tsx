"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, Eye, EyeOff, BookOpen, Users } from "lucide-react";
import { useMentorAuthStore } from "@/store/auth/mentor";
import { useThemeStore } from "@/store/layoutStore";
import GlobalNotification from "@/components/notify/notification";
import Banner from "@/assets/loginBanner.jpg";
import { GoogleLogin } from "@react-oauth/google";
import { AnimatedSphere } from "@/components/landingSection/components/landing/animated-sphere";

export default function MentorLoginPage() {
  const router = useRouter();
  const { login, googleLogin, isLoading, isAuthenticated, checkAuth } = useMentorAuthStore();
  const { initializeTheme, isDark } = useThemeStore();

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
      router.push("/mentor/dashboard");
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
      <div className="min-h-screen w-full flex font-sans bg-background overflow-hidden relative">

        {/* Background Grid (Same as landing) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute h-px bg-foreground/10"
              style={{ top: `${12.5 * (i + 1)}%`, left: 0, right: 0 }}
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute w-px bg-foreground/10"
              style={{ left: `${8.33 * (i + 1)}%`, top: 0, bottom: 0 }}
            />
          ))}
        </div>

        {/* LEFT PANEL - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden mb-12 flex flex-col items-center">
              <Image src="/progress_iq.png" alt="Logo" width={48} height={48} className="mb-4" />
              <h1 className="text-3xl font-display tracking-tight">Progress IQ</h1>
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-2">Mentor Portal</p>
            </div>

            <Card className="bg-card-glass border-2 border-foreground/5 shadow-2xl rounded-[2rem] overflow-hidden">
              <div className="p-8 lg:p-10">
                <div className="mb-10 text-center">
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em]">Mentor Access</span>
                  </div>
                  <h2 className="text-4xl font-display tracking-tight mb-2">Faculty sign in</h2>
                  <p className="text-muted-foreground text-sm">Access your mentor dashboard and student batches</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium text-center"
                      >
                        {errorMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="mentor@progressiq.com"
                        className="pl-12 h-14 bg-foreground/[0.02] border-foreground/10 focus:border-foreground/20 rounded-2xl transition-all"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <Label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Password</Label>
                      <button type="button" className="text-[10px] font-mono font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">
                        Forgot?
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-12 pr-12 h-14 bg-foreground/[0.02] border-foreground/10 focus:border-foreground/20 rounded-2xl transition-all"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 rounded-2xl font-bold text-sm transition-all group"
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : "Enter Portal"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-foreground/10"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground">
                      <span className="bg-background px-4">Social Login</span>
                    </div>
                  </div>

                  <div className="flex justify-center social-login-wrapper">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        if (credentialResponse.credential) {
                          googleLogin(credentialResponse.credential);
                        }
                      }}
                      onError={() => console.log('Login Failed')}
                      useOneTap
                      theme={isDark ? "filled_black" : "outline"}
                      shape="pill"
                      width="320px"
                    />
                  </div>
                </form>
              </div>
            </Card>

            <p className="mt-8 text-center text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
              Secured Faculty Connection
            </p>
          </motion.div>
        </div>

        {/* RIGHT PANEL - Visual (Desktop Only) */}
        <div className="hidden lg:flex w-[50%] relative overflow-hidden bg-foreground flex-col">
          {/* Animated sphere background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none invert">
            <AnimatedSphere />
          </div>

          <div className="relative z-10 p-16 w-full h-full flex flex-col justify-between text-background">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4"
            >
              <Image src="/progress_iq.png" alt="Logo" width={56} height={56} className="invert shadow-2xl" />
              <div>
                <h1 className="text-2xl font-display tracking-tight">Progress IQ</h1>
                <p className="text-background/60 text-[10px] font-mono font-bold uppercase tracking-widest mt-1">Faculty Platform</p>
              </div>
            </motion.div>

            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="inline-flex p-4 bg-background/5 backdrop-blur-xl border border-background/10 rounded-2xl mb-4">
                  <BookOpen className="w-8 h-8 text-background/80" />
                </div>
                <h2 className="text-6xl font-display leading-[1.1] tracking-tight">
                  Guide the <span className="text-background/40">next generation</span>
                </h2>
                <p className="text-lg text-background/60 leading-relaxed font-medium">
                  Review student progress, provide actionable feedback, and mentor your batches effectively within a unified environment.
                </p>

                <div className="flex gap-12 pt-8">
                  <div>
                    <div className="text-4xl font-display mb-1">Detailed</div>
                    <div className="text-[10px] font-mono font-bold text-background/40 uppercase tracking-widest text-nowrap">Tracking</div>
                  </div>
                  <div className="w-px h-full bg-background/10" />
                  <div>
                    <div className="text-4xl font-display mb-1">Direct</div>
                    <div className="text-[10px] font-mono font-bold text-background/40 uppercase tracking-widest text-nowrap">Feedback</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="text-[10px] font-mono font-bold text-background/30 uppercase tracking-[0.2em]">
              © 2026 Progress IQ. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .social-login-wrapper iframe {
          border-radius: 1rem !important;
        }
      `}</style>
    </>
  );
}