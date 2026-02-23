"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LandingPageProps {
    onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
    const TOTAL_FRAMES = 80;
    const FRAME_RATE = 12; // Adjusted for slower playback
    const [currentFrame, setCurrentFrame] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Preload images to avoid flickering
    useEffect(() => {
        const preloadImages = async () => {
            const promises = [];
            for (let i = 0; i < TOTAL_FRAMES; i++) {
                const img = new Image();
                const paddedIndex = i.toString().padStart(3, '0');
                img.src = `/landing_frames/Βίντεο_έτοιμο_για_προβολή_${paddedIndex}.jpg`;
                promises.push(new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve; // Continue even if one fails
                }));
            }
            await Promise.all(promises);
            setImagesLoaded(true);
        };
        preloadImages();
    }, []);

    // Playback loop
    useEffect(() => {
        if (!imagesLoaded) return;

        let interval = setInterval(() => {
            setCurrentFrame((prev) => (prev + 1) % TOTAL_FRAMES);
        }, 1000 / FRAME_RATE);

        return () => clearInterval(interval);
    }, [imagesLoaded]);

    const paddedIndex = currentFrame.toString().padStart(3, '0');
    const imageSrc = `/landing_frames/Βίντεο_έτοιμο_για_προβολή_${paddedIndex}.jpg`;

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black text-white flex items-center justify-center">
            {/* Background Frames Sequence */}
            <div className="absolute inset-0 z-0">
                <img
                    src={imageSrc}
                    alt={`Frame ${currentFrame}`}
                    className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.6)_100%)]" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto h-full">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <div className="flex justify-center gap-6 mb-8">
                        <div className="flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                            <span className="material-symbols-outlined text-4xl text-[#FFCC00] mb-2">policy</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">EU Compliant</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                            <span className="material-symbols-outlined text-4xl text-[#003399] mb-2 dark:text-[#FFCC00]">accessibility_new</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">HD Analysis</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm md:text-base font-black uppercase tracking-[0.5em] text-[#FFCC00] glowing-text">
                            Next Generation Mobility
                        </p>
                        <h1 className="text-6xl md:text-8xl lg:text-[120px] font-[1000] uppercase italic tracking-tighter leading-none drop-shadow-2xl">
                            Deaf<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003399] to-[#FFCC00]">Nav</span>
                        </h1>
                        <p className="text-lg md:text-2xl font-light text-white/80 max-w-2xl mx-auto pt-4 leading-relaxed">
                            Unified telemetry and accessibility hub for real-time transit intelligence.
                        </p>
                    </div>

                    {imagesLoaded ? (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onEnter}
                            className="mt-12 group relative inline-flex items-center justify-center px-12 py-6 font-black text-lg uppercase tracking-widest text-[#003399] bg-[#FFCC00] rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,204,0,0.4)] transition-all"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            <span className="relative flex items-center gap-3">
                                ENTER COMMAND CENTER
                                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </span>
                        </motion.button>
                    ) : (
                        <div className="mt-12 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-[#FFCC00]/30 border-t-[#FFCC00] rounded-full animate-spin"></div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50 animate-pulse">Initializing HD Stream...</span>
                        </div>
                    )}
                </motion.div>

            </div>

            {/* European Commission Footer banner */}
            <div className="absolute bottom-8 left-0 w-full flex justify-center z-10 opacity-70">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#FFCC00]">public</span>
                    European Commission • Inclusive Transport Initiative
                </p>
            </div>
        </div>
    );
}
