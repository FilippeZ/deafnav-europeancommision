"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Announcement {
    id: string;
    timestamp: string;
    content: string;
    type: string;
    signLanguageVideoId: string;
    station: string;
}

export default function LiveAnnouncements() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [search, setSearch] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await fetch("/api/metro/announcements");
                const data = await res.json();
                setAnnouncements(data);
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            }
        };

        fetchAnnouncements();
        const interval = setInterval(fetchAnnouncements, 10000);
        return () => clearInterval(interval);
    }, []);

    // Web Speech API Integration
    useEffect(() => {
        if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = "el-GR"; // Default to Greek for Athens Metro

            recognitionRef.current.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result: any) => result.transcript)
                    .join("");

                if (event.results[0].isFinal) {
                    const newAnn: Announcement = {
                        id: `live-${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        content: transcript,
                        type: "live_stt",
                        signLanguageVideoId: "sl-live",
                        station: "Current Location"
                    };
                    setAnnouncements(prev => [newAnn, ...prev]);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech Recognition Error", event.error);
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
        setIsListening(!isListening);
    };

    const filtered = announcements.filter(a => a.content.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="bg-gradient-to-br from-[#003399] to-blue-950 rounded-[40px] border border-blue-400/20 p-8 shadow-2xl flex flex-col h-[750px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FFCC00]/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#FFCC00] text-4xl drop-shadow-lg">campaign</span>
                        Live Feed
                    </h3>
                    <button
                        onClick={toggleListening}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg",
                            isListening ? "bg-red-500 text-white animate-pulse shadow-red-500/40" : "bg-white/10 text-white/70 hover:bg-[#FFCC00] hover:text-[#003399]"
                        )}
                    >
                        <span className="material-symbols-outlined text-sm">{isListening ? 'mic' : 'mic_none'}</span>
                        {isListening ? "Listening..." : "Start STT"}
                    </button>
                </div>
                <div className="relative group/search w-full md:w-auto">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/search:text-[#FFCC00] transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="Search transcript..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder:text-white/30 focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] w-full md:w-64 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10 space-y-4">
                <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-white/30 space-y-4 pt-12">
                            <div className="bg-white/5 rounded-full p-8 mb-4 border border-white/10 shadow-inner">
                                <span className="material-symbols-outlined text-6xl text-[#FFCC00]">info</span>
                            </div>
                            <p className="font-black text-lg text-white">OASA Live Telemetry: All accessible infrastructure on Line 2 & 3 is currently fully operational.</p>
                            <div className="flex items-center gap-1.5 bg-black/20 px-4 py-2 rounded-full border border-white/5 mt-4">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                <span className="text-[10px] font-black uppercase text-white/70 tracking-widest whitespace-nowrap">
                                    02:13 μ.μ. • System Wide
                                </span>
                            </div>
                        </motion.div>
                    ) : (
                        filtered.map((ann) => (
                            <motion.div
                                key={ann.id}
                                layout
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                className={cn(
                                    "p-5 rounded-[24px] border border-white/10 backdrop-blur-md transition-all hover:scale-[1.02] flex gap-5 items-start relative overflow-hidden",
                                    ann.type === 'alert' ? "bg-red-500/10 hover:bg-red-500/20 border-red-500/30" : "bg-white/5 hover:bg-white/10"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-2xl flex-shrink-0 shadow-lg",
                                    ann.type === 'alert' ? "bg-red-500 text-white" : "bg-[#FFCC00] text-[#003399]"
                                )}>
                                    <span className="material-symbols-outlined">{ann.type === 'alert' ? 'warning' : 'info'}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white leading-relaxed">
                                        {ann.content}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 mt-3">
                                        <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                            <span className="text-[9px] font-black uppercase text-white/70 tracking-widest whitespace-nowrap">
                                                {new Date(ann.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {ann.station}
                                            </span>
                                        </div>
                                        <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#FFCC00] hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[14px]">sign_language</span>
                                            View Sign Language
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
