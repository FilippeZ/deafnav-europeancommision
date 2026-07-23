"use client";

import { useState, useEffect } from "react";
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

export default function LiveAnnouncements({ selectedLang = "el" }: { selectedLang?: "en" | "el" }) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [search, setSearch] = useState("");
    const [selectedSignLanguage, setSelectedSignLanguage] = useState<Announcement | null>(null);

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch("/api/metro/announcements");
            if (res.ok) {
                const data = await res.json();
                setAnnouncements(data);
            }
        } catch (error) {
            console.error("Failed to fetch announcements", error);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
        const interval = setInterval(fetchAnnouncements, 8000);
        return () => clearInterval(interval);
    }, []);

    const filtered = announcements.filter(a => a.content.toLowerCase().includes(search.toLowerCase()));

    const isEn = selectedLang === "en";

    return (
        <div className="bg-gradient-to-br from-[#003399] to-blue-950 rounded-[40px] border border-blue-400/20 p-8 shadow-2xl flex flex-col h-[750px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FFCC00]/5 rounded-full blur-[60px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex flex-col gap-4 mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl lg:text-3xl font-[1000] italic uppercase tracking-tighter text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#FFCC00] text-4xl drop-shadow-lg">campaign</span>
                        {isEn ? "Live Transit Feed" : "Ζωντανή Ροή Μετακίνησης"}
                    </h3>
                    <span className="bg-[#FFCC00] text-[#003399] text-[9px] font-[1000] uppercase px-3 py-1 rounded-full shadow-md">
                        {isEn ? "OASA Telematics" : "Τηλεματική ΟΑΣΑ"}
                    </span>
                </div>

                {/* Search Bar */}
                <div className="relative group/search w-full">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/search:text-[#FFCC00] transition-colors">search</span>
                    <input
                        type="text"
                        placeholder={isEn ? "Search transit stream..." : "Αναζήτηση στη ροή ανακοινώσεων..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder:text-white/30 focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] w-full transition-all outline-none"
                    />
                </div>
            </div>

            {/* Announcements List */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10 space-y-4">
                <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-white/30 space-y-4 pt-12">
                            <div className="bg-white/5 rounded-full p-8 mb-4 border border-white/10 shadow-inner">
                                <span className="material-symbols-outlined text-6xl text-[#FFCC00]">info</span>
                            </div>
                            <p className="font-black text-sm text-center text-white">
                                {isEn ? "OASA Live Telemetry: All accessible infrastructure operational." : "Τηλεμετρία ΟΑΣΑ: Όλες οι προσβάσιμες υποδομές λειτουργούν κανονικά."}
                            </p>
                        </motion.div>
                    ) : (
                        filtered.map((ann) => (
                            <motion.div
                                key={ann.id}
                                layout
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
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
                                        <button
                                            onClick={() => setSelectedSignLanguage(ann)}
                                            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#FFCC00] hover:text-white transition-colors cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">sign_language</span>
                                            {isEn ? "Sign Language View" : "Προβολή στη Νοηματική"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Sign Language Modal Preview */}
            <AnimatePresence>
                {selectedSignLanguage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl z-50 p-6 flex flex-col justify-between"
                    >
                        <div className="flex justify-between items-center border-b border-white/20 pb-4">
                            <h4 className="text-xl font-black uppercase text-[#FFCC00] flex items-center gap-2">
                                <span className="material-symbols-outlined">sign_language</span>
                                {isEn ? "Sign Language Translation" : "Μετάφραση στη Νοηματική Γλώσσα"}
                            </h4>
                            <button
                                onClick={() => setSelectedSignLanguage(null)}
                                className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center my-4 space-y-4">
                            <div className="relative w-full max-w-md aspect-video bg-slate-900 rounded-2xl overflow-hidden border-2 border-[#FFCC00]/50 shadow-2xl flex items-center justify-center">
                                <video
                                    src="/videos/connecting-europe.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3 bg-[#FFCC00] text-[#003399] px-3 py-1 rounded-full text-[9px] font-[1000] uppercase shadow-md">
                                    {isEn ? "60 FPS Vision AI Stream" : "Ροή 60 FPS ML Vision"}
                                </div>
                            </div>
                            <p className="text-xs font-bold text-white/80 text-center max-w-sm">
                                {selectedSignLanguage.content}
                            </p>
                        </div>
                        <button
                            onClick={() => setSelectedSignLanguage(null)}
                            className="w-full bg-[#FFCC00] text-[#003399] py-3 rounded-xl font-black uppercase text-xs hover:bg-white transition-colors cursor-pointer"
                        >
                            {isEn ? "Close Translation" : "Κλείσιμο Μετάφρασης"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
