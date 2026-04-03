"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Briefcase, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const roles = [
  {
    title: "Administrator",
    description: "Full institutional oversight and system management.",
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    features: [
      "Bulk user & mentor management",
      "Student-mentor mapping",
      "Activity monitoring & logs",
      "Top rankers view",
      "Analytics & insights",
      "PDF/Excel reports",
    ],
    link: "/admin/signin",
    color: "border-primary",
    bgColor: "bg-primary/5",
  },
  {
    title: "Mentor",
    description: "Direct student guidance and performance validation.",
    icon: <Briefcase className="w-8 h-8 text-secondary" />,
    features: [
      "Student monitoring",
      "Submission validation",
      "Approval workflow",
      "Points allocation",
      "Feedback system",
      "Task management",
    ],
    link: "/mentor/signin",
    color: "border-secondary",
    bgColor: "bg-secondary/5",
  },
  {
    title: "Student",
    description: "Personal activity tracking and progress monitoring.",
    icon: <BookOpen className="w-8 h-8 text-accent-foreground" />,
    features: [
      "Personal dashboard",
      "Task completion",
      "Project tracking",
      "Certification upload",
      "Activity heatmaps",
      "Ranking & analytics",
    ],
    link: "/student/signin",
    color: "border-accent",
    bgColor: "bg-accent/5",
  },
];

export function RolesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="roles"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Access Portals
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Tailored for every role.
            <br />
            <span className="text-muted-foreground">Select your portal to continue.</span>
          </h2>
        </div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative flex flex-col p-8 rounded-3xl border-2 ${role.color} ${role.bgColor} hover:shadow-2xl hover:shadow-foreground/5 transition-all duration-500`}
            >
              <div className="mb-6 p-4 bg-background rounded-2xl w-fit shadow-sm">
                {role.icon}
              </div>
              
              <h3 className="text-2xl font-display mb-3">
                {role.title}
              </h3>
              <p className="text-muted-foreground mb-8">
                {role.description}
              </p>

              <ul className="space-y-4 mb-10 flex-1">
                {role.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-foreground/80">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="w-full h-14 rounded-full text-base font-medium group/btn"
              >
                <Link href={role.link}>
                  Login as {role.title}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
