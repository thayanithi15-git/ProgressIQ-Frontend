'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { BarChart3, Users, ShieldCheck, Activity, ArrowRight } from "lucide-react";

export default function IntroPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-poppins">
      
      <section className="bg-brand-gradient pt-16 pb-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Badge className="bg-white/20 text-white">
              Smart Reporting Platform
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Progress IQ – Smart Activity Reporting Dashboard
            </h1>

            <p className="text-white/90 text-lg">
              Track, analyze and visualize team performance with AI‑powered
              insights. Replace manual reports with real‑time intelligent
              activity monitoring.
            </p>

            <div className="flex gap-4 pt-2">
              <Button className="bg-white text-primary hover:bg-white/90">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button variant="outline" className="text-white bg-primary border-white">
                Live Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block"
          >
            <Card className="bg-card-glass shadow-xl border-0">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Today Activity</h3>
                  <Badge>Live</Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Reports Completed</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Team Engagement</span>
                      <span>64%</span>
                    </div>
                    <Progress value={64} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-10 text-center">
            Why Progress IQ?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Activity className="h-6 w-6 text-primary" />}
              title="Real‑Time Tracking"
              desc="Monitor daily activities and task updates instantly across teams."
            />

            <FeatureCard
              icon={<BarChart3 className="h-6 w-6 text-primary" />}
              title="Smart Analytics"
              desc="AI driven insights to measure productivity and progress."
            />

            <FeatureCard
              icon={<Users className="h-6 w-6 text-primary" />}
              title="Team Collaboration"
              desc="Centralized workspace for managers and employees."
            />

            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6 text-primary" />}
              title="Secure & Reliable"
              desc="Role based access with enterprise grade security."
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-primary text-white">
            <CardContent className="p-10 text-center space-y-4">
              <h3 className="text-2xl font-semibold">
                Ready to upgrade your reporting workflow?
              </h3>

              <p className="text-white/90">
                Join organizations that replaced spreadsheets with
                intelligent dashboards.
              </p>

              <Button className="bg-white text-primary hover:bg-white/90">
                Create Workspace
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="shadow-sm hover:shadow transition">
      <CardContent className="p-6 space-y-3">
        <div className="p-2 bg-secondary/20 w-fit rounded-lg">{icon}</div>
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-muted-foreground text-sm">{desc}</p>
      </CardContent>
    </Card>
  );
}
