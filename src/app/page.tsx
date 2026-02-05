'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { BarChart3, Users, ShieldCheck, Activity, ArrowRight, Moon, Sun, Menu, X, LogIn, BookOpen, Briefcase, TrendingUp, BarChart2, Star, CheckCircle, FileText, Settings } from "lucide-react";
import { useThemeStore } from "@/store/layoutStore";
import Link from "next/link";
import HeroSection from "@/components/landing/hero";
import HeaderSection from "@/components/landing/header";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { isDark, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'mentor' | 'admin' | null>(null);

  const router = useRouter();

  const steps = [
    {
      step: 1,
      title: "Setup & Mapping",
      desc: "Admin configures system and maps students to mentors",
      icon: <Settings className="w-10 h-10 text-primary" />
    },
    {
      step: 2,
      title: "Activity Submission",
      desc: "Students submit tasks, projects, and certifications",
      icon: <FileText className="w-10 h-10 text-primary" />
    },
    {
      step: 3,
      title: "Validation & Feedback",
      desc: "Mentors verify and provide feedback on submissions",
      icon: <CheckCircle className="w-10 h-10 text-primary" />
    },
    {
      step: 4,
      title: "Points & Ranking",
      desc: "System awards points based on performance",
      icon: <Star className="w-10 h-10 text-primary" />
    },
    {
      step: 5,
      title: "Analytics & Insights",
      desc: "Generate reports and visualize trends",
      icon: <BarChart2 className="w-10 h-10 text-primary" />
    },
    {
      step: 6,
      title: "Continuous Improvement",
      desc: "Use data to optimize and improve processes",
      icon: <TrendingUp className="w-10 h-10 text-primary" />
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''} font-poppins`}>
      <style>{`
        :root {
          --background: ${isDark ? 'oklch(0.2223 0.0060 271.1393)' : '#e2edfd'};
          --foreground: ${isDark ? 'oklch(0.9551 0 0)' : '#0a1f44'};
          --card: ${isDark ? 'oklch(0.2568 0.0076 274.6528)' : '#ffffff'};
          --card-foreground: ${isDark ? 'oklch(0.9551 0 0)' : '#0a1f44'};
          --primary: ${isDark ? 'oklch(0.6132 0.2294 291.7437)' : '#1854bf'};
          --primary-foreground: #ffffff;
          --secondary: ${isDark ? 'oklch(0.2940 0.0130 272.9312)' : '#0c9ced'};
          --secondary-foreground: #ffffff;
          --accent: ${isDark ? 'oklch(0.2795 0.0368 260.0310)' : '#0c9ced'};
          --accent-foreground: ${isDark ? 'oklch(0.7857 0.1153 246.6596)' : '#ffffff'};
          --muted: ${isDark ? 'oklch(0.2940 0.0130 272.9312)' : '#f0f6ff'};
          --muted-foreground: ${isDark ? 'oklch(0.7058 0 0)' : '#4a6fa5'};
          --border: ${isDark ? 'oklch(0.3289 0.0092 268.3843)' : '#c9dcff'};
          --input: ${isDark ? 'oklch(0.3289 0.0092 268.3843)' : '#ffffff'};
          --ring: ${isDark ? 'oklch(0.6132 0.2294 291.7437)' : '#0c9ced'};
        }
      `}</style>

      <HeaderSection />

      <HeroSection />

      <section id="features" className="pt-10 pb-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="bg-primary/10 text-primary mb-4">Key Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Choose Progress IQ?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive tools designed to streamline activity tracking and performance monitoring
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Activity className="h-7 w-7 text-primary" />}
              title="Real-Time Tracking"
              desc="Monitor daily activities and task updates instantly across teams and departments."
              isDark={isDark}
            />

            <FeatureCard
              icon={<BarChart3 className="h-7 w-7 text-primary" />}
              title="Smart Analytics"
              desc="AI-driven insights to measure productivity, progress, and performance metrics."
              isDark={isDark}
            />

            <FeatureCard
              icon={<Users className="h-7 w-7 text-primary" />}
              title="Team Collaboration"
              desc="Centralized workspace for mentors, students, and administrators to work together."
              isDark={isDark}
            />

            <FeatureCard
              icon={<ShieldCheck className="h-7 w-7 text-primary" />}
              title="Secure & Reliable"
              desc="Role-based access control with enterprise-grade security and data protection."
              isDark={isDark}
            />
          </div>
        </div>
      </section>

      <section id="flow" className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="bg-secondary/10 text-secondary mb-4">System Flow</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How Progress IQ Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A seamless workflow from setup to analytics and reporting
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div>{item.icon}</div>
                    <div>
                      <Badge className="bg-primary/10 text-primary mb-2">
                        Step {item.step}
                      </Badge>
                      <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <section id="roles" className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="bg-accent/10 text-accent-foreground mb-4">Role-Based Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tailored for Every Role
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Specialized features designed for administrators, mentors, and students
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all border-2 border-primary">
                <div className="h-2 bg-gradient-to-r from-primary to-accent"></div>
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
                  <CardDescription>System management and institutional oversight</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[
                      "Bulk user & mentor management",
                      "Student-mentor mapping",
                      "Activity monitoring & logs",
                      "Top rankers view",
                      "Analytics & insights",
                      "PDF/Excel reports",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-primary text-white  mt-4"
                    onClick={() => router.push('/admin/signin')}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Admin Login
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all border-2 border-accent md:scale-105">
                <div className="h-2 bg-gradient-to-r from-accent to-primary"></div>
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Mentor Dashboard</CardTitle>
                  <CardDescription>Student guidance and performance tracking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[
                      "Student monitoring",
                      "Submission validation",
                      "Approval workflow",
                      "Points allocation",
                      "Feedback system",
                      "Task management",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-accent/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-accent-foreground"></div>
                        </div>
                        <span className="text-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-accent text-white mt-4 hover:bg-accent/90"
                    onClick={() => router.push('/mentor/signin')}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Mentor Login
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all border-2 border-[oklch(0.7459_0.1483_156.4499)]">
                <div className="h-2 bg-gradient-to-r from-[oklch(0.7459_0.1483_156.4499)] to-primary"></div>
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 bg-[oklch(0.7459_0.1483_156.4499)]/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[oklch(0.7459_0.1483_156.4499)]" />
                  </div>
                  <CardTitle className="text-2xl">Student Dashboard</CardTitle>
                  <CardDescription>Activity tracking and progress monitoring</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[
                      "Personal dashboard",
                      "Task completion",
                      "Project tracking",
                      "Certification upload",
                      "Activity heatmaps",
                      "Ranking & analytics",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-[oklch(0.7459_0.1483_156.4499)]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-[oklch(0.7459_0.1483_156.4499)]"></div>
                        </div>
                        <span className="text-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-[oklch(0.7459_0.1483_156.4499)] text-white mt-4 hover:bg-[oklch(0.7459_0.1483_156.4499)]/90"
                    onClick={() => router.push('/student/signin')}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Student Login
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Ready to Transform Your Institution?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/90 text-lg max-w-2xl mx-auto"
          >
            Join 50+ institutions that have already switched to Progress IQ. Eliminate spreadsheets, embrace intelligence.
          </motion.p>
        </div>
      </section>

      <footer className="bg-card border-t border-border px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image
                  src={"/progress_iq.png"}
                  alt="Progress IQ Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <span className="font-bold text-foreground">Progress IQ</span>
              </div>
              <p className="text-muted-foreground text-sm">Smart Activity Reporting Dashboard</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Product</h4>
              <ul className="space-y-1 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Company</h4>
              <ul className="space-y-1 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="space-y-1 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-muted-foreground text-sm text-center">
              © 2026 Progress IQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {selectedRole && (
        <RoleLoginModal role={selectedRole} onClose={() => setSelectedRole(null)} />
      )}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  isDark
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Card className={`h-full hover:shadow-lg transition-all hover:border-primary/50 ${isDark ? 'hover:bg-primary/5' : 'hover:bg-primary/10'}`}>
        <CardContent className="p-6 space-y-4">
          <div className="p-3 bg-primary/20 w-fit rounded-lg">{icon}</div>
          <h4 className="font-bold text-lg text-foreground">{title}</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RoleLoginModal({ role, onClose }: { role: string; onClose: () => void }) {
  const roleConfig = {
    student: { title: "Student Login", link: "/login", color: "accent" },
    mentor: { title: "Mentor Login", link: "/mentor/login", color: "secondary" },
    admin: { title: "Admin Login", link: "/admin/login", color: "primary" },
  };

  const config = roleConfig[role as keyof typeof roleConfig];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl p-8 max-w-md w-full space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{config.title}</h2>
          <p className="text-muted-foreground">Choose your preferred authentication method</p>
        </div>

        <div className="space-y-3">
          <Link href={config.link} className="block w-full">
            <Button className="w-full bg-primary text-white font-bold h-12">
              Continue with Email
            </Button>
          </Link>

          <Button variant="outline" className="w-full border-2 border-border h-12 font-bold">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>
        </div>

        <button
          onClick={onClose}
          className="w-full text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
}