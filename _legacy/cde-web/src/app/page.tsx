"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import BraceletStatus from "@/components/BraceletStatus";
import LiveAnnouncements from "@/components/LiveAnnouncements";

const SCREENS = [
    {
        id: "dashboard",
        title: "DeafNav Hub",
        description: "Central command for IoT bracelet and metro accessibility.",
        path: "/designs/core/dashboard/code.html",
        icon: "dashboard",
        index: 0
    },
    {
        id: "announcements",
        title: "Real-Time Feed",
        description: "Live transcripts and sign language interpretation.",
        path: "/designs/core/announcements/code.html",
        icon: "campaign",
        index: 1
    },
    {
        id: "communication",
        title: "Support Center",
        description: "Live chat and SOS video calls with interpreters.",
        path: "/designs/core/support/code.html",
        icon: "chat_bubble",
        index: 2
    }
];

export default function Home() {
    const [selectedScreen, setSelectedScreen] = useState<typeof SCREENS[0] | null>(null);
    const [iotFeedback, setIotFeedback] = useState<any>(null);
    const [isSimulatingArrival, setIsSimulatingArrival] = useState(false);

    // Listen to IoT Stream (SSE)
    useEffect(() => {
        const eventSource = new EventSource("/api/iot/stream");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setIotFeedback(data);
            // Auto-clear feedback after 3 seconds
            setTimeout(() => setIotFeedback(null), 3000);
        };

        eventSource.onerror = (err) => {
            console.error("SSE Connection failed", err);
            eventSource.close();
        };

        return () => eventSource.close();
    }, []);

    return (
        <div className="space-y-12 pb-24">
            {/* Real-time Tactile Notification Toast */}
            <AnimatePresence>
                {iotFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-8 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 border border-white/20 backdrop-blur-xl"
                    >
                        <div className="bg-white/20 p-2 rounded-xl animate-pulse">
                            <span className="material-symbols-outlined">vibration</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Tactile Signal</span>
                            <span className="text-base font-bold tracking-tight">{iotFeedback.data.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 dark:border-slate-800/50 pb-8 mt-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-white text-2xl">navigation</span>
                        </div>
                        <h1 className="text-4xl font-[1000] tracking-tighter text-slate-900 dark:text-white uppercase italic">
                            DeafNav
                        </h1>
                        <span className="h-6 w-[2px] bg-slate-200 dark:bg-slate-800 hidden md:block" />
                        <span className="text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest hidden md:block">
                            EU Accessibility Standards
                        </span>
                    </div>
                    <p className="text-slate-500 max-w-xl font-semibold text-lg leading-relaxed">
                        The next generation of accessible mobility. IoT-enabled guidance system for the deaf and hard of hearing community.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSimulatingArrival(!isSimulatingArrival)}
                        className={cn(
                            "px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 active:scale-95",
                            isSimulatingArrival
                                ? "bg-red-500 text-white shadow-red-500/30"
                                : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-primary/30"
                        )}
                    >
                        <span className="material-symbols-outlined text-lg">{isSimulatingArrival ? 'stop_circle' : 'sensors'}</span>
                        {isSimulatingArrival ? "Active Sensor Simulation" : "Simulate Station Proximity"}
                    </button>
                </div>
            </header>

            {!selectedScreen ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-12">
                        {/* IoT Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 px-1">
                                <span className="material-symbols-outlined text-primary text-xl">watch</span>
                                <h2 className="text-xs font-[1000] text-slate-400 uppercase tracking-[0.3em]">Device Telemetry</h2>
                            </div>
                            <BraceletStatus />
                        </section>

                        {/* Announcements Feed */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 px-1">
                                <span className="material-symbols-outlined text-primary text-xl">sensors_kronecker</span>
                                <h2 className="text-xs font-[1000] text-slate-400 uppercase tracking-[0.3em]">Network Intelligence</h2>
                            </div>
                            <LiveAnnouncements />
                        </section>

                        {/* Navigation Visual Prototype */}
                        <section className="bg-slate-900 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl group border border-white/5">
                            <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')] bg-cover grayscale" />
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 text-center md:text-left">
                                <div className="space-y-4">
                                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                                        Live Transit Guidance
                                    </span>
                                    <h3 className="text-5xl font-[1000] tracking-tighter uppercase italic">
                                        Syntagma <span className="text-primary not-italic">➔</span> Panepistimio
                                    </h3>
                                    <p className="text-slate-400 font-bold text-xl uppercase tracking-tighter">
                                        Line 2 <span className="text-slate-600">|</span> Arrival in 3.5 minutes
                                    </p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[30px] border border-white/10 min-w-[200px]">
                                    <span className="text-xs font-black text-slate-500 uppercase block mb-1">Signal Quality</span>
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4].map(i => <div key={i} className="h-4 w-1.5 bg-primary rounded-full" />)}
                                        <div className="h-4 w-1.5 bg-white/10 rounded-full" />
                                    </div>
                                    <span className="text-2xl font-black">98.2%</span>
                                </div>
                            </div>
                            <div className="mt-12 space-y-3 relative z-10">
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "68%" }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-primary/50 to-primary relative"
                                    >
                                        <div className="absolute right-0 top-0 h-full w-4 bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                                    </motion.div>
                                </div>
                                <div className="flex justify-between text-[11px] font-[1000] uppercase tracking-widest text-slate-500 px-1">
                                    <span>Origin Station</span>
                                    <span className="text-primary">In Transit</span>
                                    <span>Destination</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="lg:col-span-4 space-y-10">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 px-1">
                                <span className="material-symbols-outlined text-primary text-xl">auto_awesome_motion</span>
                                <h2 className="text-xs font-[1000] text-slate-400 uppercase tracking-[0.3em]">System Modes</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-5">
                                {SCREENS.map((screen, idx) => (
                                    <motion.button
                                        key={screen.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => setSelectedScreen(screen)}
                                        className="group w-full text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-[30px] p-6 hover:shadow-2xl hover:border-primary hover:translate-y-[-4px] transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-all shadow-inner">
                                                <span className="material-symbols-outlined text-3xl leading-none">{screen.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors italic">{screen.title}</h3>
                                                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">arrow_forward</span>
                                                </div>
                                                <p className="text-sm text-slate-500 font-bold leading-tight mt-1">{screen.description}</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </section>

                        {/* Accessibility Status Card */}
                        <section className="bg-primary shadow-2xl shadow-primary/30 rounded-[40px] p-8 text-white space-y-6 relative overflow-hidden">
                            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/60 mb-2">Compliance Status</h4>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="material-symbols-outlined text-4xl">verified_user</span>
                                    <span className="text-2xl font-[1000] uppercase italic leading-none">WCAG 2.1 Expert</span>
                                </div>
                                <p className="text-sm font-bold text-white/80 leading-relaxed mb-6">
                                    This platform fully adheres to EU Accessibility Standards for digital mobility services.
                                </p>
                                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full w-full bg-white opacity-40" />
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSelectedScreen(null)}
                            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-all group"
                        >
                            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-[-4px]">arrow_back</span>
                            Back to Hub
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-xs">visibility</span>
                                HD Preview
                            </span>
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full aspect-[16/10] bg-white dark:bg-slate-900 rounded-3xl border-4 border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl"
                    >
                        <iframe
                            src={selectedScreen.path}
                            className="w-full h-full border-none"
                            title={selectedScreen.title}
                        />
                    </motion.div>
                </div>
            )}
        </div>
    );
}
