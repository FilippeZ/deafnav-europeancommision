"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import BraceletStatus from "@/components/BraceletStatus";
import LiveAnnouncements from "@/components/LiveAnnouncements";
import LandingPage from "@/components/LandingPage";

// --- Constants & Data ---

const NAV_ITEMS = [
    { id: "dashboard", label: "Πίνακας Ελέγχου", icon: "dashboard" },
    { id: "vibration", label: "Ρυθμίσεις Δόνησης", icon: "bolt" },
    { id: "history", label: "Ιστορικό", icon: "history" },
    { id: "navigation", label: "Πλοήγηση", icon: "map" },
    { id: "announcements", label: "Ανακοινώσεις", icon: "campaign" },
    { id: "education", label: "Εκπαίδευση", icon: "play_circle" },
    { id: "community", label: "Κοινότητα", icon: "group" },
    { id: "support", label: "Υποστήριξη", icon: "support_agent" }
];

// --- Sub-Components ---

const DashboardView = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
    const [liveData, setLiveData] = useState({
        line: "ΓΡΑΜΜΉ 2 (ΚΌΚΚΙΝΗ)",
        direction: "ΕΛΛΗΝΙΚΌ",
        nextArrival: "05:42",
        station: "Σταθμός Συντάγματος",
        battery: 85,
        bpm: 72,
        bpmStatus: "✅ NORMAL BASELINE",
        connected: true
    });

    useEffect(() => {
        // Fetch real IoT telemetry
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/iot/status');
                if (res.ok) {
                    const data = await res.json();
                    setLiveData(prev => ({
                        ...prev,
                        battery: data.battery,
                        bpm: data.pulse,
                        bpmStatus: data.stressLevel === 'Normal' ? "✅ NORMAL BASELINE" : "⚠️ HIGH STRESS",
                        connected: data.connected
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch IoT status", err);
            }
        };

        fetchStatus();
        const iotInterval = setInterval(fetchStatus, 10000); // 10s poll

        // Simulate Next Arrival countdown
        const arrivalInterval = setInterval(() => {
            setLiveData(prev => ({
                ...prev,
                nextArrival: prev.nextArrival === "05:42" ? "05:41" : "05:42"
            }));
        }, 60000);

        return () => {
            clearInterval(iotInterval);
            clearInterval(arrivalInterval);
        };
    }, []);

    return (
        <div className="relative p-6 lg:p-10 rounded-[50px] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,51,153,0.3)] border border-white/10 group">
            {/* Full Dashboard Background Image */}
            <div className="absolute inset-0 bg-slate-950 pointer-events-none z-0">
                <motion.img
                    src="/bracelet.jpeg"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full object-cover mix-blend-overlay filter blur-[6px] group-hover:blur-[2px] transition-all duration-1000"
                    alt="Dashboard Background"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#003399]/90 via-[#003399]/60 to-[#003399]/20" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                <div className="lg:col-span-8 space-y-8">
                    <section className="relative rounded-[40px] overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md transition-transform duration-500 hover:scale-[1.01]">
                        {/* Content container */}
                        <div className="relative p-8 md:p-12 flex flex-col gap-10">
                            {/* Status Header */}
                            <div className="flex justify-between items-start">
                                <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#FFCC00] rounded-full shadow-[0_0_30px_rgba(255,204,0,0.4)]">
                                    <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                                    <span className="text-xs font-[1000] text-[#003399] uppercase tracking-widest leading-none">
                                        LIVE: {liveData.station}
                                    </span>
                                </div>
                                <div className="text-white/60 font-black uppercase tracking-widest text-[10px] hidden md:block">
                                    Status Bracelet Dashboard
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <h1 className="text-3xl md:text-4xl font-black text-white/90 uppercase tracking-tight">
                                        Επόμενη Άφιξη:
                                    </h1>
                                    <motion.h2
                                        key={liveData.nextArrival}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-[80px] md:text-[120px] font-black text-[#FFCC00] leading-none drop-shadow-2xl"
                                    >
                                        {liveData.nextArrival}
                                    </motion.h2>
                                </div>
                                <p className="text-lg md:text-2xl font-black text-white uppercase tracking-wider opacity-90 max-w-2xl">
                                    ΓΡΑΜΜΉ 2 (ΚΌΚΚΙΝΗ) - ΚΑΤΕΎΘΥΝΣΗ: ΕΛΛΗΝΙΚΌ
                                </p>

                                <button
                                    onClick={() => setActiveTab("navigation")}
                                    className="inline-flex items-center gap-3 bg-white/10 hover:bg-[#FFCC00] text-white hover:text-[#003399] backdrop-blur-md border border-white/20 hover:border-transparent px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-300 w-fit"
                                >
                                    <span className="material-symbols-outlined font-black">near_me</span>
                                    ΠΛΉΡΕΣ ΔΡΟΜΟΛΌΓΙΟ
                                </button>
                            </div>

                            {/* Telemetry info injected into the same card */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/20">
                                {/* Connectivity */}
                                <div className="bg-white/10 backdrop-blur-md rounded-[30px] p-6 flex flex-col justify-between border border-white/10 hover:bg-white/20 transition-colors">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="material-symbols-outlined text-[#FFCC00]">router</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCC00]">Connectivity</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={cn("material-symbols-outlined", liveData.connected ? "text-green-400" : "text-red-400")}>
                                                {liveData.connected ? "check_circle" : "cancel"}
                                            </span>
                                            <h3 className="text-2xl font-black uppercase text-white">
                                                {liveData.connected ? "Connected" : "Offline"}
                                            </h3>
                                        </div>
                                        <p className={cn("text-xs font-bold uppercase tracking-widest", liveData.connected ? "text-green-400" : "text-red-400")}>
                                            {liveData.connected ? "Active" : "Disconnected"}
                                        </p>
                                    </div>
                                </div>

                                {/* Battery */}
                                <div className="bg-white/10 backdrop-blur-md rounded-[30px] p-6 flex flex-col justify-between border border-white/10 hover:bg-white/20 transition-colors">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#FFCC00]">battery_charging_80</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCC00]">Μπαταρία</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black uppercase text-white leading-none">
                                            {liveData.battery}%
                                        </h3>
                                        <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${liveData.battery}%` }}
                                                transition={{ duration: 1 }}
                                                className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* BPM */}
                                <div className="bg-white/10 backdrop-blur-md rounded-[30px] p-6 flex flex-col justify-between border border-white/10 hover:bg-white/20 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-symbols-outlined text-red-400">favorite</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCC00]">Παλμοί</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-end gap-2">
                                            <h3 className="text-4xl font-black uppercase text-white leading-none">
                                                75
                                            </h3>
                                            <span className="text-sm font-black text-white/70 mb-1">BPM</span>
                                        </div>
                                        <p className="text-[10px] font-black text-[#FFCC00] uppercase tracking-widest">
                                            ✅ ✅ NORMAL BASELINE
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-gradient-to-br from-[#003399] to-blue-900 rounded-[40px] p-10 text-white h-[450px] flex flex-col justify-between relative overflow-hidden shadow-2xl border border-blue-400/20 group hover:border-[#FFCC00]/50 transition-all duration-500">
                        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                            <span className="material-symbols-outlined text-[200px]">chat</span>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-200 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xs">chat</span> Υποστήριξη
                                </h4>
                            </div>
                            <h3 className="text-5xl font-[1000] uppercase tracking-tighter mb-4">
                                Live Chat
                            </h3>
                            <p className="text-lg font-medium text-white/80 leading-relaxed">
                                Σύνδεση με εκπρόσωπο που γνωρίζει την νοηματική γλώσσα.
                            </p>
                        </div>

                        <button
                            onClick={() => setActiveTab("support")}
                            className="flex items-center justify-between w-full bg-white/10 hover:bg-[#FFCC00] text-white hover:text-[#003399] backdrop-blur-md px-6 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-300 group/btn"
                        >
                            <span>ΣΎΝΔΕΣΗ ΤΏΡΑ</span>
                            <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>

                    {/* Embedded Live Announcements Component */}
                    <LiveAnnouncements />
                </div>
            </div >
        </div >
    );
};

const VibrationView = () => {
    const [intensity, setIntensity] = useState(75);
    const [isVibrating, setIsVibrating] = useState(false);
    const [activePattern, setActivePattern] = useState('Standard Guidance');

    const handleVibrate = () => {
        setIsVibrating(true);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            let pattern = [200];
            if (activePattern === 'Soft Pulse') pattern = [100, 50, 100];
            if (activePattern === 'Rapid Alert') pattern = [50, 50, 50, 50, 50];
            if (activePattern === 'Emergency SOS') pattern = [500, 200, 500, 200, 500];

            // scale pattern duration by intensity roughly
            pattern = pattern.map(p => p * (intensity / 100));
            navigator.vibrate(pattern);
        }
        setTimeout(() => setIsVibrating(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <section className="glass rounded-[40px] p-12 space-y-10 border-l-[12px] border-[#FFCC00]">
                <header className="space-y-2">
                    <h2 className="text-4xl font-[1000] uppercase italic tracking-tighter text-[#003399] dark:text-[#FFCC00]">Ρυθμίσεις Δόνησης</h2>
                    <p className="text-slate-500 font-bold text-lg uppercase italic tracking-tight">Configuration of tactile feedback intensity and patterns.</p>
                </header>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ένταση Δόνησης</label>
                            <span className="text-3xl font-black italic text-[#003399] dark:text-white">{intensity}%</span>
                        </div>
                        <input type="range" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))} className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#003399]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {['Soft Pulse', 'Rapid Alert', 'Standard Guidance', 'Emergency SOS'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setActivePattern(type)}
                                className={cn(
                                    "glass py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#003399] transition-all italic",
                                    activePattern === type && "bg-[#003399] text-white border-transparent"
                                )}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleVibrate}
                        className="w-full bg-[#003399] py-6 rounded-3xl text-white font-black uppercase tracking-widest italic shadow-xl shadow-[#003399]/30 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        ΔΟΚΙΜΉ ΔΌΝΗΣΗΣ
                    </button>
                </div>
            </section>
            <section className="flex flex-col items-center justify-center space-y-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#003399]/5 to-transparent rounded-[60px] -z-10" />
                <motion.div
                    animate={isVibrating ? { rotate: [0, -2, 2, -2, 2, 0], scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: isVibrating ? Infinity : 0, duration: 0.1 }}
                    className="relative"
                >
                    <div className="absolute -inset-8 bg-[#FFCC00]/20 blur-3xl rounded-full opacity-50" />
                    <span className="material-symbols-outlined text-[200px] text-[#003399] dark:text-[#FFCC00] drop-shadow-2xl">watch_off</span>
                    {isVibrating && (
                        <div className="absolute -top-4 -right-4 flex gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="h-6 w-2 bg-[#FFCC00] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
                        </div>
                    )}
                </motion.div>
                <div className="text-center space-y-2">
                    <p className="text-2xl font-black italic uppercase tracking-tighter">{isVibrating ? "VIBRATION ACTIVE" : "DEVICE STANDBY"}</p>
                    <div className="flex gap-2 justify-center">
                        <span className="h-2 w-8 bg-[#003399] rounded-full" />
                        <span className="h-2 w-8 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <span className="h-2 w-8 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </div>
                </div>
            </section>
        </div>
    );
};

const HistoryView = () => {
    const [events, setEvents] = useState([
        { id: 1, time: '17:30', type: 'Station Reach', station: 'Syntagma', desc: 'Arrived at Line 2 platform', status: 'COMPLETED' },
        { id: 2, time: '17:15', type: 'Tactile Alert', station: 'Panepistimio', desc: '5min Delay Notification', status: 'ACKNOWLEDGED' },
        { id: 3, time: '16:45', type: 'Emergency SOS', station: 'Omonia', desc: 'Video Call started', status: 'RESOLVED' },
        { id: 4, time: '16:30', type: 'Telemetry Sync', station: 'N/A', desc: 'Pulse detected: 78 BPM', status: 'SYNCED' }
    ]);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = () => {
        setIsDownloading(true);
        setTimeout(() => setIsDownloading(false), 2000);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.6) {
                const newEvent = {
                    id: Date.now(),
                    time: new Date().toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' }),
                    type: Math.random() > 0.5 ? 'Connectivity' : 'System Check',
                    station: ['Network', 'Gateway D', 'Node Alpha'][Math.floor(Math.random() * 3)],
                    desc: 'Handshake completed successfully',
                    status: 'SYNCED'
                };
                setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-4xl font-[1000] uppercase italic tracking-tighter text-[#003399] dark:text-[#FFCC00]">Ιστορικό Συμβάντων</h2>
                    <p className="text-slate-500 font-bold uppercase italic tracking-tight">Archive of received alerts and transit milestones.</p>
                </div>
                <button
                    onClick={handleDownload}
                    className={cn(
                        "flex items-center gap-2 text-[10px] font-black uppercase pb-2 border-b-2 transition-all hover:scale-105 active:scale-95",
                        isDownloading ? "text-green-500 border-green-500" : "text-[#003399] border-[#003399] dark:text-[#FFCC00] dark:border-[#FFCC00]"
                    )}
                >
                    {isDownloading ? "DOWNLOADING..." : "ΚΑΤΈΒΑΣΜΑ PDF"}
                    <span className={cn("material-symbols-outlined text-sm", isDownloading && "animate-bounce")}>
                        {isDownloading ? "download_done" : "download"}
                    </span>
                </button>
            </header>
            <div className="glass rounded-[40px] overflow-hidden shadow-2xl border border-white/20 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                <table className="w-full text-left">
                    <thead className="bg-[#003399] text-white text-[10px] font-black uppercase tracking-widest h-16 border-b-4 border-[#FFCC00]">
                        <tr>
                            <th className="px-8 w-[15%]">Time</th>
                            <th className="w-[20%]">Event Type</th>
                            <th className="w-[20%]">Station</th>
                            <th className="w-[30%]">Details</th>
                            <th className="text-right px-8 w-[15%]">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-bold divide-y divide-slate-200 dark:divide-slate-800/50">
                        <AnimatePresence>
                            {events.map((row) => (
                                <motion.tr
                                    key={row.id}
                                    initial={{ opacity: 0, x: -20, backgroundColor: 'rgba(255, 204, 0, 0.2)' }}
                                    animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(0,0,0,0)' }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="h-20 hover:bg-white dark:hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-8 font-black text-[#003399] dark:text-[#FFCC00]">{row.time}</td>
                                    <td className="uppercase italic tracking-tighter text-slate-800 dark:text-slate-200">{row.type}</td>
                                    <td className="font-black italic text-slate-600 dark:text-slate-400">{row.station}</td>
                                    <td className="text-slate-500 dark:text-slate-400">{row.desc}</td>
                                    <td className="px-8 text-right">
                                        <span className={cn(
                                            "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase shadow-sm whitespace-nowrap",
                                            row.status === 'COMPLETED' ? "bg-green-100 text-green-700 border border-green-200" :
                                                row.status === 'ACKNOWLEDGED' ? "bg-blue-100 text-blue-700 border border-blue-200" :
                                                    row.status === 'RESOLVED' ? "bg-slate-200 text-slate-700 border border-slate-300" :
                                                        "bg-[#FFCC00]/20 text-[#003399] dark:text-[#FFCC00] border border-[#FFCC00]/30"
                                        )}>
                                            {row.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const NavigationView = () => {
    const [speed, setSpeed] = useState(0);
    const [eta, setEta] = useState(0);
    const [progress, setProgress] = useState(0);
    const [activeVehicles, setActiveVehicles] = useState(0);

    useEffect(() => {
        const fetchTelemetry = async () => {
            try {
                // Tracking line 140 as a demo of the OASA Real-Time integration
                const res = await fetch('/api/metro/vehicles?lineId=140');
                if (res.ok) {
                    const data = await res.json();
                    if (data.activeCount > 0) {
                        setSpeed(data.simulatedSpeed);
                        setProgress(data.simulatedProgress);
                        setActiveVehicles(data.activeCount);
                        setEta(Math.max(0.5, 15 - (data.simulatedProgress / 10))); // Mocking ETA decrease based on progress 
                    }
                }
            } catch (error) {
                console.error("Failed fetching Live OASA Vehicle Telemetry", error);
            }
        };

        fetchTelemetry(); // Initial fetch
        const interval = setInterval(fetchTelemetry, 10000); // 10s poll rate for Telematics

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter text-[#003399] dark:text-[#FFCC00]">Πλοήγηση Real-Time</h2>
                <div className="flex gap-4">
                    <span className="bg-[#003399] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">wifi_tethering</span> OASA Bus GPS Lock
                    </span>
                    <span className="bg-[#FFCC00] text-[#003399] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(255,204,0,0.5)] flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">directions_bus</span> {activeVehicles} Buses Streaming
                    </span>
                </div>
            </header>

            <section className="bg-gradient-to-br from-[#003399] to-blue-950 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl border-4 border-[#003399]/30 h-[500px] flex flex-col justify-between group">
                {/* Simulated Radar Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-b from-[#FFCC00]/5 to-transparent rounded-full blur-3xl"
                />

                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFCC00] mb-2 animate-pulse flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs">directions_bus</span>
                            OASA Bus Telemetry Active
                        </p>
                        <h3 className="text-6xl font-[1000] italic uppercase tracking-tighter leading-none mb-4 flex items-center gap-4">
                            <span className="material-symbols-outlined text-5xl">directions_bus</span>
                            Λεωφορείο <span className="text-[#FFCC00]">140</span>
                        </h3>
                        <p className="text-lg font-bold text-white/70 uppercase tracking-widest">
                            Πολύγωνο - Γλυφάδα (OASA)
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Live Speed (km/h)</p>
                        <p className="text-6xl font-[1000] text-[#FFCC00] italic tracking-tighter drop-shadow-lg">
                            {speed} <span className="text-2xl text-white/60">km/h</span>
                        </p>
                    </div>
                </div>

                <div className="relative z-10 text-center space-y-2 mt-auto">
                    <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#FFCC00]">Estimated Time of Arrival</p>
                    <p className="text-[120px] font-[1000] leading-none tracking-tighter italic drop-shadow-2xl">
                        {eta.toFixed(1)}<span className="text-5xl text-white/50 italic">m</span>
                    </p>
                </div>

                {/* Progress Pipeline */}
                <div className="relative h-24 flex items-center mt-12 bg-black/40 rounded-[30px] p-6 backdrop-blur-md border border-white/10 shadow-inner">
                    <div className="absolute inset-0 flex items-center px-12">
                        <div className="w-full h-3 bg-white/20 rounded-full relative overflow-hidden shadow-inner">
                            <motion.div
                                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#FFCC00]/50 to-[#FFCC00] shadow-[0_0_20px_#FFCC00] rounded-full"
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeInOut", duration: 1.5 }}
                            />
                        </div>
                    </div>

                    <div className="w-full flex justify-between relative px-8 text-[11px] font-[1000] uppercase italic tracking-widest text-white/50">
                        {['Starting Depot', 'Athinon', 'Syntagma', 'Glyfada HQ'].map((station, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 z-10">
                                <span className={cn(
                                    "w-5 h-5 rounded-full border-4 border-black transition-colors duration-500 shadow-xl",
                                    progress >= (idx * 33.3) ? "bg-[#FFCC00] scale-125" : "bg-white/20"
                                )} />
                                <span className={cn(
                                    "transition-colors duration-500",
                                    progress >= (idx * 33.3) ? "text-[#FFCC00] drop-shadow-[0_0_10px_#FFCC00]" : "text-white/40"
                                )}>{station}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const EducationView = () => {
    const images = [
        { src: "/images/eu/0610_Strasbourg_Gabrielle-Ferrandi2.jpg", title: "Strasbourg - Connect" },
        { src: "/images/eu/0710_Paris_Gabrielle-Ferrandi.jpg", title: "Paris - Mobility" },
        { src: "/images/eu/map.jpg", title: "EU Rail Network" }
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="space-y-12">
            <div className="flex flex-col items-center justify-center pt-8 space-y-4">
                <span className="material-symbols-outlined text-6xl text-[#003399] dark:text-[#FFCC00] bg-white/10 p-6 rounded-full shadow-2xl backdrop-blur-xl border border-white/20">school</span>
                <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#003399] to-blue-500 dark:from-[#FFCC00] dark:to-yellow-200">
                    European Union 2021
                </h2>
                <div className="h-1.5 w-40 bg-[#FFCC00] rounded-full" />
                <p className="text-xl font-bold uppercase italic text-slate-500">The European Year of Rail</p>
            </div>

            <div className="lg:col-span-12">
                <div className="relative h-full min-h-[500px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={index}
                            src={images[index].src}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003399] via-transparent to-transparent flex flex-col justify-end p-12">
                        <motion.div
                            key={index + "text"}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20"
                        >
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">{images[index].title}</h3>
                            <p className="text-[#FFCC00] font-black text-[10px] uppercase tracking-[0.2em]">EU Horizon 2021 Initiative</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CommunityView = () => {
    const [posts, setPosts] = useState([
        { title: 'Συνάντηση Κοινότητας', user: 'Μαρία Κ.', time: '2 ώρες πριν', icon: 'groups', img: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop' },
        { title: 'Νέος Οδηγός Πλοήγησης', user: 'Γιώργος Π.', time: '5 ώρες πριν', icon: 'school', img: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop' },
        { title: 'Πρόβλημα στο Μετρό', user: 'Άννα Λ.', time: '1 μέρα πριν', icon: 'report', img: 'https://images.unsplash.com/photo-1513682121497-80211f36a790?q=80&w=2072&auto=format&fit=crop' },
        { title: 'Feedback Συσκευής', user: 'Κώστας Δ.', time: '2 μέρες πριν', icon: 'rate_review', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' }
    ]);

    useEffect(() => {
        // Simulating data fetch for community updates
        const fetchCommunity = async () => {
            // Let's dynamically add a new 'Live' item occasionally to simulate real-time
            if (Math.random() > 0.8) {
                setPosts(prev => [{
                    title: 'Live Q&A Webinar',
                    user: 'OASA Support',
                    time: 'Μόλις τώρα',
                    icon: 'live_tv',
                    img: 'https://images.unsplash.com/photo-1593642532400-2682810df593?q=80&w=2069&auto=format&fit=crop'
                }, ...prev.slice(0, 3)]);
            }
        };
        const interval = setInterval(fetchCommunity, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-4xl font-[1000] uppercase italic tracking-tighter text-[#003399]">DeafNav Community</h2>
                    <p className="text-slate-500 font-bold uppercase italic tracking-tight">Connect, share feedback, and learn together.</p>
                </div>
                <button className="bg-[#FFCC00] text-[#003399] px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#003399] hover:text-[#FFCC00] transition-colors shadow-lg">
                    Νέο Post <span className="material-symbols-outlined align-middle ml-1 text-sm">add</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <AnimatePresence>
                    {posts.map((item, i) => (
                        <motion.div
                            key={item.title + item.time}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className="glass rounded-[30px] p-6 space-y-4 group hover:border-[#003399] transition-all cursor-pointer shadow-xl relative overflow-hidden"
                        >
                            <div className="h-48 bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
                                <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <span className="material-symbols-outlined text-5xl text-white relative z-10 drop-shadow-2xl group-hover:scale-125 transition-transform">{item.icon}</span>
                            </div>
                            <div className="space-y-1 relative z-10">
                                <h3 className="font-black uppercase italic text-[#003399] dark:text-white leading-tight line-clamp-2">{item.title}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black">{item.user[0]}</div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">{item.user} • {item.time}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

const SupportView = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ΓΕΝΙΚΉ ΥΠΟΣΤΉΡΙΞΗ', text: 'Γεια σας! Πώς μπορούμε να σας βοηθήσουμε σήμερα;', isUser: false },
        { id: 2, sender: 'ΕΣΕΊΣ', text: 'Θα ήθελα πληροφορίες για την προσβασιμότητα στον σταθμό Ομόνοια.', isUser: true }
    ]);
    const [input, setInput] = useState('');
    const [isCalling, setIsCalling] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const newMsg = { id: Date.now(), sender: 'ΕΣΕΊΣ', text: input, isUser: true };
        setMessages(prev => [...prev, newMsg]);
        setInput('');

        // Simulate reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'ΥΠΟΣΤΉΡΙΞΗ',
                text: 'Ευχαριστούμε για το μήνυμά σας. Ένας εκπρόσωπος συνδέεται τώρα για να σας εξυπηρετήσει στη νοηματική.',
                isUser: false
            }]);
        }, 1500);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
                <header className="space-y-2">
                    <h2 className="text-4xl font-[1000] uppercase italic tracking-tighter text-[#003399]">Κέντρο Υποστήριξης</h2>
                    <p className="text-slate-500 font-bold text-lg uppercase italic">Live sign-language video assistance and SOS support.</p>
                </header>
                <div className="aspect-video bg-slate-900 rounded-[40px] overflow-hidden relative border-4 border-[#003399]/20 shadow-2xl group">
                    <img
                        src={isCalling ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop" : "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"}
                        className={cn("w-full h-full object-cover transition-opacity duration-1000", isCalling ? "opacity-100" : "opacity-30")}
                        alt="Video Feed"
                    />

                    {!isCalling ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 bg-black/40 backdrop-blur-sm">
                            <button
                                onClick={() => setIsCalling(true)}
                                className="w-32 h-32 bg-red-600 hover:bg-red-500 rounded-full flex flex-col items-center justify-center animate-pulse shadow-[0_0_50px_rgba(220,38,38,0.6)] hover:scale-110 transition-all cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-5xl text-white mb-1">videocam</span>
                                <span className="text-white text-[10px] font-black tracking-widest uppercase">SOS CALL</span>
                            </button>
                            <p className="text-white font-black uppercase italic tracking-widest text-xl drop-shadow-md text-center max-w-sm">
                                Πατήστε για άμεση κλήση έκτακτης ανάγκης με βίντεο.
                            </p>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex flex-col justify-between p-8 bg-gradient-to-t from-black/80 via-transparent to-black/40">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3 bg-red-600/90 backdrop-blur-md px-4 py-2 rounded-full border border-red-500/50">
                                    <span className="h-3 w-3 rounded-full bg-white animate-pulse" />
                                    <span className="text-white text-xs font-black uppercase tracking-widest">Live SOS Connection</span>
                                </div>
                                <span className="material-symbols-outlined text-white text-4xl drop-shadow-xl animate-pulse">record_voice_over</span>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => setIsCalling(false)}
                                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-6 shadow-2xl hover:scale-110 transition-all border-4 border-white/20"
                                >
                                    <span className="material-symbols-outlined text-4xl">call_end</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-8">
                <section className="bg-gradient-to-b from-[#003399] to-blue-900 p-8 rounded-[40px] text-white space-y-6 shadow-2xl h-[600px] flex flex-col">
                    <header className="flex justify-between items-center border-b border-white/10 pb-4">
                        <h3 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#FFCC00]">chat</span>
                            Live Chat
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-green-400 uppercase tracking-widest">
                            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /> Online
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar flex flex-col justify-end">
                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={cn(
                                        "p-4 rounded-2xl text-sm max-w-[85%]",
                                        msg.isUser ? "bg-[#FFCC00] text-[#003399] self-end rounded-tr-sm" : "bg-white/10 backdrop-blur-md self-start rounded-tl-sm border border-white/10"
                                    )}
                                >
                                    <p className="opacity-60 mb-1 text-[10px] font-black uppercase tracking-widest">
                                        {msg.sender}
                                    </p>
                                    <p className="font-medium leading-snug">{msg.text}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="relative mt-auto pt-4 border-t border-white/10">
                        <input
                            type="text"
                            placeholder="Πληκτρολογήστε εδώ..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="w-full bg-white/10 border border-white/20 focus:border-[#FFCC00] rounded-2xl px-5 py-4 text-sm placeholder:text-white/40 outline-none transition-all"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-3 top-1/2 -translate-y-1/2 mt-2 bg-[#FFCC00] text-[#003399] p-2 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

const AnnouncementsView = () => {
    const [transcript, setTranscript] = useState("Awaiting video stream...");
    const [isTranslating, setIsTranslating] = useState(false);

    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const time = (e.currentTarget as HTMLVideoElement).currentTime;

        // Define timestamped English sentences for the sign language translation
        const sentences = [
            { start: 1, end: 4, text: "Connecting Europe Facility - Supporting sustainable infrastructure." },
            { start: 5, end: 9, text: "Investing in the Trans-European Transport Network (TEN-T)." },
            { start: 10, end: 14, text: "Promoting cleaner energy and digital connectivity." },
            { start: 15, end: 20, text: "Building a smarter, more resilient European Union." }
        ];

        let activeTranslation = false;

        for (let i = 0; i < sentences.length; i++) {
            const s = sentences[i];

            if (time >= s.start && time <= s.end) {
                activeTranslation = true;
                // Calculate progress through this specific sentence
                const progress = (time - s.start) / (s.end - s.start);

                // Split sentence into words and reveal them progressively based on time elapsed
                const words = s.text.split(" ");
                const wordsToShow = Math.max(1, Math.floor(words.length * progress));
                const currentText = words.slice(0, wordsToShow).join(" ");

                // Add a trailing ellipsis while translating to simulate streaming
                setTranscript(currentText + (progress < 0.95 ? "..." : ""));
                break;
            } else if (time > s.end && time < (sentences[i + 1]?.start || s.end + 2)) {
                // Keep the completed sentence on screen briefly before the next one starts
                setTranscript(s.text);
                activeTranslation = false;
                break;
            } else {
                setTranscript("");
            }
        }

        setIsTranslating(activeTranslation);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
                <header className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-6xl font-[1000] uppercase italic tracking-tighter text-[#003399] dark:text-[#FFCC00]">Ροή Ανακοινώσεων</h2>
                        <div className="h-1.5 w-40 bg-[#FFCC00] rounded-full" />
                    </div>
                    <div className="flex gap-4">
                        <span className="bg-[#003399] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse shadow-[0_0_15px_rgba(0,51,153,0.5)]">Live Signal</span>
                        <span className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]",
                            isTranslating ? "bg-[#FFCC00] text-[#003399] shadow-[0_0_15px_rgba(255,204,0,0.5)] animate-pulse" : "bg-white/10 text-slate-400"
                        )}>
                            {isTranslating ? "Vision AI Active" : "Waiting for SL input"}
                        </span>
                    </div>
                </header>

                <div className="relative group rounded-[40px] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-black aspect-video flex-shrink-0">
                    <video
                        src="/videos/connecting-europe.mp4"
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover opacity-80"
                        onTimeUpdate={handleTimeUpdate}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* Real-time SL-to-English Transcript Overlay */}
                    <div className="absolute bottom-24 inset-x-8 pointer-events-none">
                        <AnimatePresence>
                            {transcript && (
                                <motion.div
                                    key={transcript === "Awaiting video stream..." ? "awaiting" : "streaming"}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-[#003399]/90 backdrop-blur-xl border-l-[6px] border-[#FFCC00] p-6 rounded-2xl shadow-2xl mx-auto max-w-3xl"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={cn("material-symbols-outlined text-sm font-black text-[#FFCC00]", isTranslating && "animate-spin-slow")}>
                                            settings_accessibility
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCC00]">
                                            Sign Language to English {isTranslating && '(LIVE)'}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-[1000] text-white italic leading-tight uppercase tracking-tighter drop-shadow-md">
                                        {transcript}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="grid grid-col-1 md:grid-cols-2 gap-8">
                        <div className="glass rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#003399]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="material-symbols-outlined text-5xl text-[#003399] dark:text-[#FFCC00] mb-6 block">verified</span>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-slate-800 dark:text-white">Connecting Europe</h3>
                            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">Seamless travel across 26 countries and 33 borders.</p>
                        </div>

                        <div className="glass rounded-[40px] p-10 shadow-2xl relative overflow-hidden group delay-100">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="material-symbols-outlined text-5xl text-green-500 mb-6 block">verified</span>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-slate-800 dark:text-white">Green Deal</h3>
                            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">Rail accounts for less than 0.5% of transport-related GHG.</p>
                        </div>

                        <div className="glass rounded-[40px] p-10 shadow-2xl relative overflow-hidden group delay-200">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFCC00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="material-symbols-outlined text-5xl text-[#FFCC00] mb-6 block">verified</span>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-slate-800 dark:text-white">TEN-T Goals</h3>
                            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">High-quality rail infrastructure by 2030.</p>
                        </div>

                        <div className="glass rounded-[40px] p-10 shadow-2xl relative overflow-hidden group delay-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="material-symbols-outlined text-5xl text-blue-500 mb-6 block">verified</span>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-slate-800 dark:text-white">Digital Safety</h3>
                            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">ERTMS-compatible alert logic for wearable devices.</p>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-[30px] p-8 border-l-[10px] border-[#003399] shadow-xl hover:scale-[1.01] transition-transform">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2">System Status</h4>
                    <p className="text-lg font-black italic uppercase text-[#003399] dark:text-white leading-tight">
                        High-Definition Sign Language Interpretation Active. Ensuring accessibility across the Pan-European network.
                    </p>
                </div>
            </div>
            <div className="lg:col-span-4 self-start sticky top-28">
                <LiveAnnouncements />
            </div>
        </div>
    );
};

// --- Main Page ---

export default function Home() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [hasEntered, setHasEntered] = useState(false);

    if (!hasEntered) {
        return <LandingPage onEnter={() => setHasEntered(true)} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            {/* Header Integrated Nav */}
            <header className="h-20 flex items-center bg-[#003399] border-b-4 border-[#FFCC00] sticky top-0 z-[200] px-6 shadow-2xl">
                {/* Logo on the Left */}
                <div className="flex items-center gap-4 mr-8 group cursor-pointer" onClick={() => setActiveTab("dashboard")}>
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-[#FFCC00] shadow-lg shadow-black/40 group-hover:scale-105 transition-transform duration-300">
                        <img src="/logo.jpg" alt="DeafNav Logo" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col -space-y-1">
                        <h1 className="text-2xl font-[1000] text-white italic uppercase tracking-tighter leading-none">DeafNav</h1>
                        <span className="text-[8px] font-black text-[#FFCC00] uppercase tracking-[0.2em] italic">HD Unified Hub</span>
                    </div>
                </div>

                {/* 8 Buttons Navigation */}
                <nav className="flex h-full flex-1 justify-center max-w-5xl">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "flex flex-col items-center justify-center px-5 hover:bg-white/10 transition-all h-full text-[10px] font-black uppercase tracking-widest text-white/60 italic relative group",
                                activeTab === item.id && "text-white bg-white/5"
                            )}
                        >
                            <span className={cn(
                                "material-symbols-outlined text-2xl mb-1 transition-transform duration-300 group-hover:-translate-y-1",
                                activeTab === item.id ? "text-[#FFCC00]" : "text-white/40 group-hover:text-white"
                            )}>{item.icon}</span>
                            <span className="hidden xl:inline">{item.label}</span>

                            {/* Active Indicator */}
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="nav-active"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFCC00] shadow-[0_-4px_10px_rgba(255,204,0,0.5)]"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Right Side Info */}
                <div className="ml-auto flex items-center gap-6">
                    <div className="hidden lg:flex flex-col items-end">
                        <span className="bg-[#FFCC00] text-[#003399] px-3 py-0.5 rounded text-[9px] font-[1000] uppercase italic shadow-lg shadow-[#FFCC00]/20 mb-1">
                            EU STANDARDS COMPLIANT
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">System Online</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-8 max-w-[1700px] mx-auto w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {activeTab === "dashboard" && <DashboardView setActiveTab={setActiveTab} />}
                        {activeTab === "vibration" && <VibrationView />}
                        {activeTab === "history" && <HistoryView />}
                        {activeTab === "navigation" && <NavigationView />}
                        {activeTab === "announcements" && <AnnouncementsView />}
                        {activeTab === "education" && <EducationView />}
                        {activeTab === "community" && <CommunityView />}
                        {activeTab === "support" && <SupportView />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* FLOATING ACTION BUTTON */}
            <div className="fixed bottom-12 right-12 z-[100]">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveTab("support")}
                    className="w-20 h-20 bg-[#003399] text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-[#FFCC00] group relative"
                >
                    <span className="material-symbols-outlined text-4xl">sign_language</span>
                    <div className="absolute top-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </motion.button>
            </div>
        </div>
    );
}
