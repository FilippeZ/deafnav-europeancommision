"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface LandingPageProps {
    onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
    const TOTAL_FRAMES = 80;
    const FRAME_RATE = 12;
    const [currentFrame, setCurrentFrame] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const preloadImages = async () => {
            const promises = [];
            for (let i = 0; i < TOTAL_FRAMES; i++) {
                const paddedIndex = i.toString().padStart(3, '0');
                const rawFilename = `Βίντεο_έτοιμο_για_προβολή_${paddedIndex}.jpg`;
                const safeSrc = `/landing_frames/${encodeURIComponent(rawFilename)}`;
                const img = new Image();
                img.src = safeSrc;
                promises.push(new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                }));
            }
            await Promise.all(promises);
            if (isMounted) setImagesLoaded(true);
        };
        preloadImages();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (!imagesLoaded) return;
        const interval = setInterval(() => {
            setCurrentFrame((prev) => (prev + 1) % TOTAL_FRAMES);
        }, 1000 / FRAME_RATE);
        return () => clearInterval(interval);
    }, [imagesLoaded]);

    const paddedIndex = currentFrame.toString().padStart(3, '0');
    const rawFilename = `Βίντεο_έτοιμο_για_προβολή_${paddedIndex}.jpg`;
    const imageSrc = `/landing_frames/${encodeURIComponent(rawFilename)}`;

    return (
        <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-white flex flex-col justify-between">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src={imageSrc}
                    alt=""
                    className="w-full h-full object-cover opacity-95 filter contrast-105 brightness-105"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/40" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(15,23,42,0.6)_100%)]" />
            </div>

            {/* Top Bar */}
            <header className="relative z-20 w-full px-8 lg:px-14 py-6 flex items-center justify-between">
                {/* Live Status Dot */}
                <div className="flex items-center gap-2.5">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFCC00] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFCC00]"></span>
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                        EU Directive 2019/882 Compliant
                    </span>
                </div>

                {/* Status Pills */}
                <div className="hidden md:flex items-center gap-6 text-[10px] font-semibold uppercase tracking-[0.2em]">
                    <span className="text-white/40">
                        IoT Telemetry — <span className="text-emerald-400">Active</span>
                    </span>
                    <span className="text-white/20">|</span>
                    <span className="text-white/40">
                        Vision AI — <span className="text-sky-400">Online</span>
                    </span>
                </div>
            </header>

            {/* Center Content */}
            <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto my-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                    className="flex flex-col items-center gap-10"
                >
                    {/* Compliance Tags */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { label: "EU Compliant", sub: "Directive 2019/882" },
                            { label: "HD Analysis", sub: "WCAG 2.1 AAA" },
                            { label: "IoT Haptics", sub: "MQTT Protocol" },
                            { label: "Next-Gen Transit", sub: "Real-Time Telemetry" },
                        ].map((tag) => (
                            <div
                                key={tag.label}
                                className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-left"
                            >
                                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">{tag.label}</span>
                                <span className="block text-[9px] font-normal tracking-wider text-white/35 mt-0.5">{tag.sub}</span>
                            </div>
                        ))}
                    </div>

                    {/* Headline */}
                    <div className="space-y-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-[#FFCC00]/80">
                            Next Generation Mobility
                        </p>
                        <h1 className="text-7xl md:text-9xl lg:text-[120px] font-black uppercase italic tracking-tighter leading-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
                            Deaf<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-[#FFCC00]">Nav</span>
                        </h1>
                        <p className="text-base md:text-xl font-light text-white/55 max-w-xl mx-auto leading-relaxed">
                            Unified telemetry and accessibility hub for real-time transit intelligence.
                        </p>
                    </div>

                    {/* CTA */}
                    <div>
                        {imagesLoaded ? (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onEnter}
                                className="inline-flex items-center gap-4 px-12 py-5 font-black text-sm uppercase tracking-[0.25em] text-[#003399] bg-[#FFCC00] rounded-full shadow-[0_0_40px_rgba(255,204,0,0.4)] hover:shadow-[0_0_60px_rgba(255,204,0,0.6)] transition-all cursor-pointer"
                            >
                                Enter Command Center
                                <span className="w-px h-4 bg-[#003399]/30" />
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </motion.button>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-2 border-[#FFCC00]/20 border-t-[#FFCC00] rounded-full animate-spin"></div>
                                <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30">
                                    Initializing...
                                </span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="relative z-20 w-full py-5 px-8 lg:px-14 border-t border-white/8 bg-slate-950/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-[#003399] border border-[#FFCC00]/60 flex items-center justify-center">
                        <span className="text-[#FFCC00] text-[8px] font-black tracking-tight">EU</span>
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">
                        European Commission — Inclusive Transport Initiative
                    </span>
                </div>
                <span className="hidden sm:block text-[9px] font-normal tracking-wider text-white/20">
                    CEF Mobility Protocol — Haptic Telemetry v2.4
                </span>
            </footer>
        </div>
    );
}
