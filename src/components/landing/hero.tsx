'use client';

import React, { useEffect, useState } from 'react'
import { Award, Shield, CheckCircle, ArrowRight, Eye } from 'lucide-react';

export default function HeroSection() {

    const [stats, setStats] = useState({ learners: 0, credentials: 0, institutions: 0, uptime: 0 });

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            setStats({
                learners: Math.floor((500000 / steps) * step),
                credentials: Math.floor((2000000 / steps) * step),
                institutions: Math.floor((1000 / steps) * step),
                uptime: Math.min(99.9, (99.9 / steps) * step)
            });
            if (step >= steps) clearInterval(timer);
        }, increment);

        return () => clearInterval(timer);
    }, []);

    return (
        <div>
            <section className="relative pb-24 bg-background pt-30 md:pt-25 sm:pb-32 overflow-hidden">

                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex max-md:flex-col w-full gap-16 items-center ">
                            <div className="space-y-8 animate-fade-in-up max-md:mx-10 md:w-[55%]">
                                <div className="inline-flex items-center space-x-2 px-5 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-primary">Trusted by 500K+ Learners</span>
                                </div>

                                <h1 className="text-6xl font-bold leading-tight">
                                    Smart Activity
                                    <br />
                                    <span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent animate-gradient">
                                        Reporting Platform
                                    </span>
                                </h1>

                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    Track, verify, and showcase student achievements with an intelligent activity monitoring platform. Empower institutions with real-time insights and data-driven decision making.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* <button className="group px-8 py-4 bg-gradient-to-r from-primary to-accent-foreground text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105 flex items-center justify-center space-x-2">
                                        <span>Start Free Today</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button> */}
                                    {/* <button className="px-8 py-4 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center space-x-2">
                                        <Eye className="w-5 h-5" />
                                        <span>Watch Demo</span>
                                    </button> */}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                                    <div className="text-center sm:text-left">
                                        <div className="text-3xl font-bold text-primary">{Math.floor(stats.learners / 1000)}K+</div>
                                        <div className="text-sm text-muted-foreground">Active Learners</div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-3xl font-bold text-primary">{Math.floor(stats.credentials / 1000000)}M+</div>
                                        <div className="text-sm text-muted-foreground">Activities Tracked</div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-3xl font-bold text-primary">{stats.institutions}+</div>
                                        <div className="text-sm text-muted-foreground">Institutions</div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-3xl font-bold text-primary">{stats.uptime.toFixed(1)}%</div>
                                        <div className="text-sm text-muted-foreground">Uptime</div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative h-[600px] hidden lg:block w-[45%]">
                                <div className="absolute inset-0 flex items-center justify-center">

                                    {[
                                        { title: "Task Completion", level: "78%", org: "Real-time", color: "from-[oklch(0.6132_0.2294_291.7437)] to-[oklch(0.7857_0.1153_246.6596)]", rotate: -6, top: 20, left: 0 },
                                        { title: "Project Submissions", level: "92%", org: "Tracked", color: "from-[oklch(0.8003_0.1821_151.7110)] to-[oklch(0.7459_0.1483_156.4499)]", rotate: 3, top: 80, right: 0 },
                                        { title: "Certification Progress", level: "85%", org: "Verified", color: "from-[oklch(0.7459_0.1483_156.4499)] to-[oklch(0.8003_0.1821_151.7110)]", rotate: -3, bottom: 120, left: 40 },
                                        { title: "Mentor Feedback", level: "88%", org: "Recorded", color: "from-[oklch(0.8077_0.1035_19.5706)] to-[oklch(0.7336_0.1758_50.5517)]", rotate: 6, bottom: 40, right: 20 }
                                    ].map((card, idx) => (
                                        <div
                                            key={idx}
                                            className="absolute w-72 bg-card border border-border rounded-2xl p-6 shadow-2xl transition-all duration-500 hover:scale-110 hover:z-50 cursor-pointer animate-scale-in backdrop-blur-sm"
                                            style={{
                                                transform: `rotate(${card.rotate}deg)`,
                                                top: card.top ? `${card.top}px` : 'auto',
                                                bottom: card.bottom ? `${card.bottom}px` : 'auto',
                                                left: card.left !== undefined ? `${card.left}px` : 'auto',
                                                right: card.right !== undefined ? `${card.right}px` : 'auto',
                                                animation: `float ${3 + idx}s ease-in-out infinite`,
                                                animationDelay: `${idx * 200}ms`
                                            }}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                                    <Award className="w-8 h-8 text-white" />
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <CheckCircle className="w-5 h-5 text-[oklch(0.8003_0.1821_151.7110)]" />
                                                    <span className="text-xs font-semibold text-[oklch(0.8003_0.1821_151.7110)]">Verified</span>
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-3">{card.level}</p>
                                            <div className="flex items-center justify-between pt-3 border-t border-border">
                                                <span className="text-xs text-muted-foreground">{card.org}</span>
                                                <div className="flex items-center space-x-1">
                                                    <Shield className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-medium text-primary">Secure</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}