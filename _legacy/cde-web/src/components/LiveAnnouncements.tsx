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
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-black flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-xl">campaign</span>
                        Live Feed
                    </h3>
                    <button
                        onClick={toggleListening}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase transition-all",
                            isListening ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 text-slate-500 hover:bg-primary hover:text-white"
                        )}
                    >
                        <span className="material-symbols-outlined text-sm">{isListening ? 'mic' : 'mic_none'}</span>
                        {isListening ? "Listening..." : "Start STT"}
                    </button>
                </div>
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="Search transcript..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary w-full md:w-64"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filtered.map((ann, idx) => (
                        <motion.div
                            key={ann.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-primary/20 transition-all flex gap-4 items-start"
                        >
                            <div className={`p-2 rounded-lg ${ann.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                                <span className="material-symbols-outlined text-sm">{ann.type === 'alert' ? 'warning' : 'info'}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {ann.content}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                                        {new Date(ann.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {ann.station}
                                    </span>
                                    <button className="flex items-center gap-1 text-[10px] font-black uppercase text-primary hover:underline">
                                        <span className="material-symbols-outlined text-[12px]">sign_language</span>
                                        View Sign Language
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
