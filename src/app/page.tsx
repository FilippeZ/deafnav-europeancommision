"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import BraceletStatus from "@/components/BraceletStatus";
import LiveAnnouncements from "@/components/LiveAnnouncements";
import LandingPage from "@/components/LandingPage";

// --- Constants & Data ---

const NAV_ITEMS = [
    { id: "dashboard", label: "Πίνακας Ελέγχου", icon: "dashboard" },
    { id: "vibration", label: "Ρυθμίσεις Δόνησης", icon: "bolt" },
    { id: "navigation", label: "Πλοήγηση", icon: "map" },
    { id: "announcements", label: "Ανακοινώσεις", icon: "campaign" },
    { id: "community", label: "Κοινότητα", icon: "group" },
    { id: "support", label: "Υποστήριξη", icon: "support_agent" }
];

// --- Sub-Components ---

const DashboardView = ({ setActiveTab, onSelectLine, selectedLang = "el" }: { setActiveTab: (tab: string) => void; onSelectLine?: (lineId: string) => void; selectedLang?: "en" | "el" }) => {
    const isEn = selectedLang === "en";

    const linesList = [
        { id: "140", line: isEn ? "BUS 140" : "ΛΕΩΦΟΡΕΊΟ 140", direction: isEn ? "POLYGONO → GLYFADA" : "ΠΟΛΎΓΩΝΟ → ΓΛΥΦΆΔΑ", station: isEn ? "Syntagma Station" : "Σταθμός Συντάγματος", arrivalSecs: 342 },
        { id: "040", line: isEn ? "EXPRESS 040" : "EXPRESS 040", direction: isEn ? "SYNTAGMA → LAVRIO" : "ΣΎΝΤΑΓΜΑ → ΛΑΎΡΙΟ", station: isEn ? "Faliro Station" : "Σταθμός Φαλήρου", arrivalSecs: 215 },
        { id: "608", line: isEn ? "TROLLEY 608" : "ΤΡΌΛΕΪ 608", direction: isEn ? "ZOGRAFOU → THISEIO" : "ΖΩΓΡΆΦΟΥ → ΘΗΣΕΊΟ", station: isEn ? "Thiseio Station" : "Σταθμός Θησείου", arrivalSecs: 180 },
        { id: "T6", line: isEn ? "TRAM T6" : "ΤΡΑΜ T6", direction: isEn ? "SYNTAGMA → PIKRODAFNI" : "ΣΎΝΤΑΓΜΑ → ΠΙΚΡΟΔΆΦΝΗ", station: isEn ? "Pikrodafni Station" : "Σταθμός Πικροδάφνης", arrivalSecs: 412 }
    ];

    const [activeLineIdx, setActiveLineIdx] = useState(0);
    const currentLine = linesList[activeLineIdx];
    const [secondsLeft, setSecondsLeft] = useState(currentLine.arrivalSecs);

    const [liveData, setLiveData] = useState({
        battery: 85,
        bpm: 75,
        bpmStatus: isEn ? "✅ ✅ NORMAL BASELINE" : "✅ ✅ ΦΥΣΙΟΛΟΓΙΚΟΙ ΠΑΛΜΟΙ",
        connected: true
    });

    useEffect(() => {
        setSecondsLeft(linesList[activeLineIdx].arrivalSecs);
    }, [activeLineIdx]);

    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft(prev => (prev > 1 ? prev - 1 : 360));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const remSecs = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/iot/status');
                if (res.ok) {
                    const data = await res.json();
                    setLiveData(prev => ({
                        ...prev,
                        battery: data.battery ?? 85,
                        bpm: data.pulse ?? 75,
                        bpmStatus: data.stressLevel === 'Normal' ? (isEn ? "✅ ✅ NORMAL BASELINE" : "✅ ✅ ΦΥΣΙΟΛΟΓΙΚΟΙ ΠΑΛΜΟΙ") : (isEn ? "⚠️ HIGH STRESS" : "⚠️ ΥΨΗΛΟ ΣΤΡΕΣ"),
                        connected: data.connected ?? true
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch IoT status", err);
            }
        };

        fetchStatus();
        const iotInterval = setInterval(fetchStatus, 8000);
        return () => clearInterval(iotInterval);
    }, [isEn]);

    const handleNavigate = (lineId: string) => {
        if (onSelectLine) onSelectLine(lineId);
        setActiveTab("navigation");
    };

    return (
        <div className="space-y-10">
            {/* Top EU Protocol Header */}
            <header className="bg-gradient-to-r from-[#001A4D] via-[#003399] to-[#001A4D] p-8 rounded-[35px] border-2 border-[#FFCC00]/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-1 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="bg-[#FFCC00] text-[#003399] px-2.5 py-0.5 rounded text-[8px] font-[1000] uppercase tracking-wider italic">
                            EU TRANSIT PROTOCOL
                        </span>
                        <span className="text-[9px] font-black text-green-400 bg-green-500/20 px-2.5 py-0.5 rounded-full border border-green-500/40 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-ping" />
                            {isEn ? "Live Telematics Active" : "Ζωντανή Τηλεματική Ενεργή"}
                        </span>
                    </div>
                    <h2 className="text-3xl lg:text-5xl font-[1000] uppercase italic tracking-tighter text-white drop-shadow-md flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-[#FFCC00]">dashboard</span>
                        {isEn ? "DeafNav Status Dashboard" : "Πίνακας Ελέγχου DeafNav"}
                    </h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-300">
                        {isEn ? "Status Bracelet Dashboard & Real-Time Accessible Transit Telemetry" : "Status Bracelet Dashboard & Τηλεματική Προσβάσιμης Μετακίνησης"}
                    </p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <button
                        onClick={() => handleNavigate(currentLine.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#FFCC00] hover:bg-yellow-300 text-[#003399] rounded-2xl text-xs font-[1000] uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-[#FFCC00]/30 hover:scale-105"
                    >
                        <span className="material-symbols-outlined text-base">near_me</span>
                        {isEn ? "FULL ROUTE SCHEDULE" : "ΠΛΉΡΕΣ ΔΡΟΜΟΛΌΓΙΟ"}
                    </button>
                </div>
            </header>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side: Station Arrival & IoT Telemetry Cards */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Next Arrival Station Banner Card */}
                    <div className="bg-gradient-to-br from-[#001A4D] via-[#003399] to-[#00153D] rounded-[45px] p-8 lg:p-10 border-4 border-[#FFCC00]/40 shadow-2xl space-y-6 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFCC00]/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Line Selector Buttons Bar */}
                        <div className="flex flex-wrap items-center gap-2 relative z-10 border-b border-white/15 pb-4">
                            {linesList.map((item, idx) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveLineIdx(idx)}
                                    className={cn(
                                        "px-4 py-2 rounded-2xl text-[10px] font-[1000] uppercase transition-all cursor-pointer border",
                                        activeLineIdx === idx
                                            ? "bg-[#FFCC00] text-[#003399] border-white shadow-lg shadow-[#FFCC00]/30 scale-105"
                                            : "bg-[#002266]/70 text-white/80 border-white/20 hover:bg-white/10"
                                    )}
                                >
                                    {item.line}
                                </button>
                            ))}
                        </div>

                        {/* Live Station Header */}
                        <div className="flex justify-between items-start relative z-10 pt-2">
                            <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-[#FFCC00] rounded-full shadow-[0_0_25px_rgba(255,204,0,0.5)]">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#003399] animate-pulse" />
                                <span className="text-xs font-[1000] text-[#003399] uppercase tracking-widest">
                                    LIVE: {currentLine.station}
                                </span>
                            </div>
                            <span className="text-[10px] font-[1000] uppercase tracking-widest text-white/60 bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
                                Status Bracelet Dashboard
                            </span>
                        </div>

                        {/* Real-time Ticking Arrival Display */}
                        <div className="space-y-4 relative z-10">
                            <h3 className="text-2xl lg:text-3xl font-[1000] italic text-white/90 uppercase tracking-tight">
                                {isEn ? "Next Arrival:" : "Επόμενη Άφιξη:"}
                            </h3>
                            <motion.h2
                                key={secondsLeft}
                                initial={{ opacity: 0.8, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="text-7xl lg:text-[110px] font-[1000] text-[#FFCC00] leading-none drop-shadow-[0_0_35px_rgba(255,204,0,0.5)] tracking-tighter italic font-mono"
                            >
                                {formatTime(secondsLeft)}
                            </motion.h2>
                            <p className="text-base lg:text-xl font-[1000] italic text-white uppercase tracking-wider opacity-90 leading-tight">
                                {currentLine.line} - {isEn ? "DIRECTION:" : "ΚΑΤΕΎΘΥΝΣΗ:"} {currentLine.direction}
                            </p>

                            <button
                                onClick={() => handleNavigate(currentLine.id)}
                                className="inline-flex items-center gap-3 bg-[#FFCC00] hover:bg-yellow-300 text-[#003399] px-7 py-3.5 rounded-2xl font-[1000] text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#FFCC00]/30 hover:scale-105 cursor-pointer mt-2"
                            >
                                <span className="material-symbols-outlined font-black">near_me</span>
                                {isEn ? "FULL ROUTE SCHEDULE" : "ΠΛΉΡΕΣ ΔΡΟΜΟΛΌΓΙΟ"}
                            </button>
                        </div>
                    </div>

                    {/* IoT Telemetry Metrics Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Connectivity Card */}
                        <div className="bg-gradient-to-br from-[#001E5C] to-[#00153D] p-6 rounded-[32px] border-2 border-[#FFCC00]/30 hover:border-[#FFCC00] transition-all shadow-xl space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-[1000] uppercase tracking-widest text-[#FFCC00] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">router</span>
                                    {isEn ? "Connectivity" : "Συνδεσιμότητα"}
                                </span>
                                <span className="material-symbols-outlined text-green-400 text-xl">check_circle</span>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-2xl font-[1000] italic uppercase text-white">
                                    {liveData.connected ? (isEn ? "Connected" : "Συνδεδεμένο") : (isEn ? "Offline" : "Εκτός σύνδεσης")}
                                </h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-green-400">
                                    {liveData.connected ? (isEn ? "Active" : "Ενεργό") : (isEn ? "Disconnected" : "Αποσυνδεδεμένο")}
                                </p>
                            </div>
                        </div>

                        {/* Battery Telemetry Card */}
                        <div className="bg-gradient-to-br from-[#001E5C] to-[#00153D] p-6 rounded-[32px] border-2 border-[#FFCC00]/30 hover:border-[#FFCC00] transition-all shadow-xl space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-[1000] uppercase tracking-widest text-[#FFCC00] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">battery_charging_80</span>
                                    {isEn ? "Battery" : "Μπαταρία"}
                                </span>
                                <span className="text-xs font-[1000] text-green-400">85%</span>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-3xl font-[1000] italic uppercase text-white leading-none">
                                    {liveData.battery}%
                                </h4>
                                <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${liveData.battery}%` }}
                                        transition={{ duration: 1 }}
                                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full shadow-[0_0_10px_#4ade80]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Heart Pulse Card */}
                        <div className="bg-gradient-to-br from-[#001E5C] to-[#00153D] p-6 rounded-[32px] border-2 border-[#FFCC00]/30 hover:border-[#FFCC00] transition-all shadow-xl space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-[1000] uppercase tracking-widest text-[#FFCC00] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-red-400 animate-pulse">favorite</span>
                                    {isEn ? "Heart Rate" : "Παλμοί"}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <h4 className="text-3xl font-[1000] italic uppercase text-white leading-none">
                                        {liveData.bpm}
                                    </h4>
                                    <span className="text-sm font-black text-white/60">BPM</span>
                                </div>
                                <p className="text-[9px] font-[1000] uppercase text-[#FFCC00] tracking-widest mt-1">
                                    {liveData.bpmStatus}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Live Support & Live Announcements Panel */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Live Support Banner */}
                    <div className="bg-gradient-to-br from-[#001A4D] via-[#003399] to-[#00153D] rounded-[40px] p-8 border-4 border-[#FFCC00]/40 shadow-2xl text-white space-y-6 relative overflow-hidden group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-[#FFCC00] text-[#003399] px-3 py-1 rounded-full text-[9px] font-[1000] uppercase">
                                <span className="material-symbols-outlined text-xs">chat</span>
                                {isEn ? "Support" : "Υποστήριξη"}
                            </div>
                            <span className="text-[9px] font-black text-green-400 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                {isEn ? "Online Interpreter" : "Online Διερμηνέας"}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-3xl font-[1000] italic uppercase tracking-tight text-white">
                                {isEn ? "Live Chat" : "Live Chat"}
                            </h3>
                            <p className="text-sm font-bold text-white/80 leading-relaxed">
                                {isEn ? "Connect with an interpreter fluent in Sign Language." : "Σύνδεση με εκπρόσωπο που γνωρίζει την νοηματική γλώσσα."}
                            </p>
                        </div>

                        <button
                            onClick={() => setActiveTab("support")}
                            className="w-full bg-[#FFCC00] hover:bg-yellow-300 text-[#003399] py-4 rounded-2xl text-xs font-[1000] uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-[#FFCC00]/30 hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            <span>{isEn ? "CONNECT NOW" : "ΣΎΝΔΕΣΗ ΤΏΡΑ"}</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>

                    {/* Embedded Live Transit Stream Panel */}
                    <LiveAnnouncements selectedLang={selectedLang} />
                </div>
            </div>
        </div>
    );
};

const VibrationView = ({ selectedLang = "el" }: { selectedLang?: "en" | "el" }) => {
    const isEn = selectedLang === "en";

    const [intensity, setIntensity] = useState(75);
    const [isVibrating, setIsVibrating] = useState(false);
    const [activePattern, setActivePattern] = useState('Standard Guidance');
    const [syncStatus, setSyncStatus] = useState(isEn ? "Connected" : "Συνδεδεμένο");

    const updateIoT = async (newPattern: string, newIntensity: number) => {
        try {
            setSyncStatus(isEn ? "Syncing..." : "Συγχρονισμός...");
            await fetch('/api/iot/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vibrationMode: newPattern, intensity: newIntensity })
            });
            setTimeout(() => setSyncStatus(isEn ? "Connected" : "Συνδεδεμένο"), 600);
        } catch (err) {
            console.error("Failed to sync vibration mode with IoT API", err);
            setSyncStatus(isEn ? "Offline" : "Εκτός σύνδεσης");
        }
    };

    const handlePatternChange = (pattern: string) => {
        setActivePattern(pattern);
        updateIoT(pattern, intensity);
    };

    const handleIntensityChange = (val: number) => {
        setIntensity(val);
        updateIoT(activePattern, val);
    };

    const handleVibrate = () => {
        setIsVibrating(true);
        updateIoT(activePattern, intensity);

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            let pattern = [200];
            if (activePattern === 'Soft Pulse') pattern = [100, 50, 100];
            if (activePattern === 'Rapid Alert') pattern = [50, 50, 50, 50, 50];
            if (activePattern === 'Emergency SOS') pattern = [500, 200, 500, 200, 500];

            pattern = pattern.map(p => Math.round(p * (intensity / 100)));
            try { navigator.vibrate(pattern); } catch (_) {}
        }
        setTimeout(() => setIsVibrating(false), 2500);
    };

    const patterns = [
        { id: "Soft Pulse", label: isEn ? "Soft Pulse" : "Ήπιος Παλμός", desc: isEn ? "Mild 100ms haptic guidance" : "Ήπιος παλμός 100ms για καθοδήγηση", icon: "waves" },
        { id: "Rapid Alert", label: isEn ? "Rapid Alert" : "Γρήγορη Ειδοποίηση", desc: isEn ? "Fast 50ms alert bursts" : "Γρήγορες παλμικές ειδοποιήσεις 50ms", icon: "bolt" },
        { id: "Standard Guidance", label: isEn ? "Standard Guidance" : "Τυπική Καθοδήγηση", desc: isEn ? "Balanced 200ms transit pulse" : "Ισορροπημένη δόνηση 200ms για μετακίνηση", icon: "navigation" },
        { id: "Emergency SOS", label: isEn ? "Emergency SOS" : "Έκτακτη Ανάγκη SOS", desc: isEn ? "Intense 500ms repeated alerts" : "Έντονη δόνηση 500ms έκτακτης ανάγκης", icon: "warning" }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Controls & Configuration */}
            <div className="lg:col-span-7 space-y-8">
                <section className="bg-gradient-to-br from-[#001A4D] via-[#003399] to-[#00153D] rounded-[45px] p-8 lg:p-10 border-4 border-[#FFCC00]/40 shadow-2xl space-y-8 text-white relative overflow-hidden">
                    {/* EU Background Star Glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFCC00]/10 rounded-full blur-3xl pointer-events-none" />

                    <header className="space-y-2 border-b border-white/15 pb-6">
                        <div className="flex items-center gap-2">
                            <span className="bg-[#FFCC00] text-[#003399] px-2.5 py-0.5 rounded text-[8px] font-[1000] uppercase tracking-wider italic">
                                EU ACCESSIBLE WEARABLE PROTOCOL
                            </span>
                            <span className="text-[9px] font-black text-sky-300 bg-sky-500/20 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                                IoT Sync: {syncStatus}
                            </span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-[1000] uppercase italic tracking-tighter text-white drop-shadow-md flex items-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-[#FFCC00]">bolt</span>
                            {isEn ? "Vibration Settings" : "Ρυθμίσεις Δόνησης"}
                        </h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                            {isEn ? "Configuration of tactile feedback intensity and patterns." : "Ρύθμιση έντασης και μοτίβων απτικής ανατροφοδότησης."}
                        </p>
                    </header>

                    {/* Intensity Range Slider */}
                    <div className="bg-[#002266]/70 backdrop-blur-xl p-6 rounded-3xl border-2 border-[#FFCC00]/30 space-y-4 shadow-xl">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-[1000] uppercase tracking-widest text-[#FFCC00] flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">tune</span>
                                {isEn ? "Vibration Intensity (Haptic Power)" : "Ένταση Δόνησης (Haptic Power)"}
                            </label>
                            <span className="text-4xl font-[1000] italic text-[#FFCC00] tracking-tighter drop-shadow-lg">
                                {intensity}%
                            </span>
                        </div>

                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={intensity}
                            onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
                            className="w-full h-4 bg-black/50 rounded-full appearance-none cursor-pointer accent-[#FFCC00] border border-white/20 shadow-inner"
                        />

                        <div className="flex justify-between text-[9px] font-black uppercase text-white/50 tracking-widest px-1">
                            <span>10% {isEn ? "Low Tactile" : "Ήπια Δόνηση"}</span>
                            <span>50% {isEn ? "Medium" : "Μεσαία"}</span>
                            <span>100% {isEn ? "Maximum SOS" : "Μέγιστο SOS"}</span>
                        </div>
                    </div>

                    {/* Vibration Pattern Buttons Grid */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFCC00] flex items-center gap-1.5 px-1">
                            <span className="material-symbols-outlined text-sm">graphic_eq</span>
                            {isEn ? "Select Haptic Tactile Pattern" : "Επιλογή Μοτίβου Απτικής Δόνησης"}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {patterns.map((p) => {
                                const isSelected = activePattern === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => handlePatternChange(p.id)}
                                        className={cn(
                                            "flex flex-col justify-between p-5 rounded-3xl transition-all duration-300 cursor-pointer text-left relative overflow-hidden border-2",
                                            isSelected
                                                ? "bg-gradient-to-br from-[#003399] via-[#002266] to-[#001A4D] text-white border-[#FFCC00] shadow-[0_0_25px_rgba(255,204,0,0.4)] scale-[1.02]"
                                                : "bg-[#001e5c]/80 hover:bg-[#002b80] text-white/90 border-[#FFCC00]/20 hover:border-[#FFCC00]/60 shadow-md"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={cn(
                                                "p-2 rounded-xl flex items-center justify-center shadow-md",
                                                isSelected ? "bg-[#FFCC00] text-[#003399]" : "bg-[#003399] text-[#FFCC00] border border-[#FFCC00]/30"
                                            )}>
                                                <span className="material-symbols-outlined text-lg">{p.icon}</span>
                                            </div>
                                            {isSelected && (
                                                <span className="text-[8px] font-[1000] uppercase bg-[#FFCC00] text-[#003399] px-2 py-0.5 rounded-full">
                                                    {isEn ? "Active" : "Ενεργό"}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-0.5">
                                            <h4 className="text-base font-[1000] italic uppercase tracking-tight text-white">
                                                {p.label}
                                            </h4>
                                            <p className="text-[10px] font-bold text-white/70 leading-tight">
                                                {p.desc}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Test Vibration Action Button */}
                    <button
                        onClick={handleVibrate}
                        className="w-full bg-gradient-to-r from-[#FFCC00] via-yellow-300 to-[#FFCC00] hover:bg-yellow-300 text-[#003399] py-5 rounded-3xl text-sm font-[1000] uppercase tracking-widest italic shadow-[0_0_30px_rgba(255,204,0,0.5)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-2 border-white flex items-center justify-center gap-3"
                    >
                        <span className={cn("material-symbols-outlined text-xl", isVibrating && "animate-bounce")}>
                            {isVibrating ? "vibration" : "bolt"}
                        </span>
                        {isVibrating ? (isEn ? "VIBRATING DEVICE..." : "ΣΥΣΚΕΥΗ ΣΕ ΔΟΝΗΣΗ...") : (isEn ? "TEST VIBRATION" : "ΔΟΚΙΜΉ ΔΌΝΗΣΗΣ")}
                    </button>
                </section>
            </div>

            {/* Right Column: Smartwatch Simulator HUD */}
            <div className="lg:col-span-5 flex flex-col justify-center items-center">
                <section className="bg-gradient-to-br from-[#001A4D] via-[#002266] to-[#00153D] rounded-[45px] p-8 lg:p-10 border-4 border-[#FFCC00]/40 shadow-2xl w-full flex flex-col items-center justify-center space-y-8 relative overflow-hidden min-h-[550px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.1)_1px,transparent_1px)] bg-[length:24px_24px] opacity-40 pointer-events-none" />

                    <div className="text-center space-y-1 relative z-10">
                        <span className="text-[10px] font-[1000] uppercase text-[#FFCC00] tracking-[0.2em]">
                            Wearable Device HUD Simulator
                        </span>
                        <h3 className="text-2xl font-[1000] italic uppercase text-white tracking-tight">
                            DeafNav Smart Bracelet
                        </h3>
                    </div>

                    {/* Animated Smart Watch & Radial Haptic Wave Ring */}
                    <div className="relative flex items-center justify-center my-6">
                        {/* Radiating Haptic Pulsing Rings when Vibrating */}
                        {isVibrating && (
                            <>
                                <motion.div
                                    animate={{ scale: [1, 2.2], opacity: [0.8, 0] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="absolute w-44 h-44 rounded-full border-4 border-[#FFCC00] bg-[#FFCC00]/20 pointer-events-none"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                                    className="absolute w-44 h-44 rounded-full border-4 border-sky-400 bg-sky-500/20 pointer-events-none"
                                />
                            </>
                        )}

                        <motion.div
                            animate={isVibrating ? { rotate: [-4, 4, -4, 4, 0], scale: [1, 1.08, 1] } : {}}
                            transition={{ repeat: isVibrating ? Infinity : 0, duration: 0.12 }}
                            className="relative z-10 p-8 bg-[#00153D] rounded-full border-4 border-[#FFCC00] shadow-[0_0_40px_rgba(255,204,0,0.4)] flex flex-col items-center justify-center"
                        >
                            <span className="material-symbols-outlined text-[110px] text-[#FFCC00] drop-shadow-2xl">
                                {isVibrating ? "vibration" : "watch_off"}
                            </span>
                        </motion.div>
                    </div>

                    {/* Status Text & Pattern Info */}
                    <div className="text-center space-y-3 relative z-10 w-full max-w-xs">
                        <div className="bg-black/50 p-4 rounded-2xl border border-white/10 space-y-1">
                            <p className="text-xl font-[1000] italic uppercase tracking-tighter text-[#FFCC00]">
                                {isVibrating ? "VIBRATION ACTIVE" : "DEVICE STANDBY"}
                            </p>
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                                Pattern: <span className="text-white">{activePattern}</span>
                            </p>
                            <p className="text-[9px] font-mono text-green-400 uppercase">
                                Power Output: {intensity}% • Frequency Sync OK
                            </p>
                        </div>

                        <div className="flex gap-2 justify-center pt-2">
                            <span className={cn("h-2.5 rounded-full transition-all duration-300", isVibrating ? "w-10 bg-[#FFCC00] shadow-[0_0_10px_#FFCC00]" : "w-6 bg-white/20")} />
                            <span className={cn("h-2.5 rounded-full transition-all duration-300", isVibrating ? "w-10 bg-[#FFCC00] shadow-[0_0_10px_#FFCC00]" : "w-6 bg-white/20")} />
                            <span className={cn("h-2.5 rounded-full transition-all duration-300", isVibrating ? "w-10 bg-[#FFCC00] shadow-[0_0_10px_#FFCC00]" : "w-6 bg-white/20")} />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};



const NavigationView = ({ initialLine = "140", selectedLang = "el" }: { initialLine?: string; selectedLang?: "en" | "el" }) => {
    const isEn = selectedLang === "en";
    const [selectedLine, setSelectedLine] = useState(initialLine);
    const [speed, setSpeed] = useState(48);
    const [eta, setEta] = useState(11.2);

    useEffect(() => {
        if (initialLine) {
            setSelectedLine(initialLine);
            fetchTelemetry(initialLine);
        }
    }, [initialLine]);
    const [progress, setProgress] = useState(42);
    const [activeVehicles, setActiveVehicles] = useState(5);
    const [lineName, setLineName] = useState(isEn ? "Bus 140" : "Λεωφορείο 140");
    const [route, setRoute] = useState(isEn ? "Polygono → Glyfada (OASA)" : "Πολύγωνο → Γλυφάδα (OASA)");
    const [stops, setStops] = useState(["Πολύγωνο Depot", "Λεωφ. Αθηνών", "Σύνταγμα", "Γλυφάδα HQ"]);
    const [latOrigin, setLatOrigin] = useState("37.9838° N");
    const [lngOrigin, setLngOrigin] = useState("23.7275° E");
    const [latencyMs, setLatencyMs] = useState(12);
    const [activeStopIndex, setActiveStopIndex] = useState(1);

    const fetchTelemetry = async (lineId: string) => {
        try {
            const res = await fetch(`/api/metro/vehicles?lineId=${lineId}`);
            if (res.ok) {
                const data = await res.json();
                setSpeed(data.simulatedSpeed ?? 48);
                setProgress(data.simulatedProgress ?? 42);
                setActiveVehicles(data.activeCount ?? 5);
                setLineName(data.lineName ?? (isEn ? `Bus ${lineId}` : `Λεωφορείο ${lineId}`));
                setRoute(data.route ?? (isEn ? "Polygono → Glyfada" : "Πολύγωνο → Γλυφάδα"));
                if (data.stops?.length) setStops(data.stops);
                if (data.latOrigin) setLatOrigin(data.latOrigin);
                if (data.lngOrigin) setLngOrigin(data.lngOrigin);
                if (data.latencyMs) setLatencyMs(data.latencyMs);

                const remainingProg = Math.max(5, 100 - (data.simulatedProgress ?? 42));
                setEta(parseFloat((remainingProg / 7.5).toFixed(1)));
            }
        } catch (error) {
            console.error("Failed fetching Live OASA Vehicle Telemetry", error);
        }
    };

    useEffect(() => {
        fetchTelemetry(selectedLine);
        const interval = setInterval(() => fetchTelemetry(selectedLine), 8000);
        return () => clearInterval(interval);
    }, [selectedLine]);

    const handleLineSelect = (lineId: string) => {
        setSelectedLine(lineId);
        fetchTelemetry(lineId);
    };

    return (
        <div className="space-y-10">
            {/* Top Bar Navigation Header in EU Flag Theme */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-[#FFCC00]/20">
                <div className="space-y-1">
                    <div className="flex items-center gap-3.5">
                        <div className="p-3.5 bg-gradient-to-br from-[#003399] to-[#001A4D] rounded-2xl border-2 border-[#FFCC00] shadow-xl shadow-[#003399]/50 flex items-center justify-center relative">
                            <span className="material-symbols-outlined text-3xl text-[#FFCC00]">directions_bus</span>
                            <span className="absolute -top-1 -right-1 text-[10px]">⭐</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="bg-[#FFCC00] text-[#003399] px-2 py-0.5 rounded text-[8px] font-[1000] uppercase italic tracking-wider">
                                    EU TRANSIT PROTOCOL
                                </span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-[1000] uppercase italic tracking-tighter text-[#003399] dark:text-[#FFCC00] drop-shadow-md">
                                {isEn ? "Real-Time Navigation" : "Πλοήγηση Real-Time"}
                            </h2>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                                European Accessible Public Transport Intelligence
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-[#002266] text-white px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-[#FFCC00]/30 shadow-lg shadow-[#002266]/50">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
                        <span className="material-symbols-outlined text-sm text-green-400">wifi_tethering</span>
                        OASA Bus GPS Lock
                    </span>
                </div>
            </header>

            {/* Bus & Tram Line Selector Switcher - Styled in EU Royal Blue & Gold */}
            <div className="space-y-3">
                <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FFCC00] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">tune</span>
                        {isEn ? "Select Active European Transit Line" : "Επιλογή Ενεργής Γραμμής Μετακίνησης"}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-white/50 tracking-widest">
                        {isEn ? "4 Lines Monitored Live" : "4 Γραμμές σε Ζωντανή Παρακολούθηση"}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { id: "140", name: isEn ? "Bus 140" : "Λεωφορείο 140", desc: isEn ? "Polygono - Glyfada (OASA)" : "Πολύγωνο - Γλυφάδα (OASA)", icon: "directions_bus" },
                        { id: "040", name: isEn ? "Express 040" : "Express 040", desc: isEn ? "Syntagma - Lavrio (Express)" : "Σύνταγμα - Λαύριο (Express)", icon: "directions_bus" },
                        { id: "608", name: isEn ? "Trolley 608" : "Τρόλεϊ 608", desc: isEn ? "Zografou - Thiseio (Trolley)" : "Ζωγράφου - Θησείο (Trolley)", icon: "electric_bolt" },
                        { id: "T6", name: isEn ? "Tram T6" : "Τραμ T6", desc: isEn ? "Syntagma - Pikrodafni (Tram Coast)" : "Σύνταγμα - Πικροδάφνη (Tram)", icon: "tram" }
                    ].map((line) => {
                        const isSelected = selectedLine === line.id;
                        return (
                            <button
                                key={line.id}
                                onClick={() => handleLineSelect(line.id)}
                                className={cn(
                                    "flex flex-col justify-between p-5 rounded-3xl transition-all duration-300 cursor-pointer text-left relative overflow-hidden border-2",
                                    isSelected
                                        ? "bg-gradient-to-br from-[#003399] via-[#002266] to-[#001A4D] text-white border-[#FFCC00] shadow-[0_0_30px_rgba(255,204,0,0.35)] scale-[1.02]"
                                        : "bg-[#001e5c]/80 hover:bg-[#002b80] text-white/90 border-[#FFCC00]/20 hover:border-[#FFCC00]/60 shadow-lg shadow-[#001a4d]/50"
                                )}
                            >
                                {/* EU Star Glow Background */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFCC00]/10 rounded-full blur-xl pointer-events-none" />

                                <div className="flex items-center justify-between mb-3 relative z-10">
                                    <div className={cn(
                                        "p-2.5 rounded-2xl flex items-center justify-center shadow-md",
                                        isSelected ? "bg-[#FFCC00] text-[#003399]" : "bg-[#003399] text-[#FFCC00] border border-[#FFCC00]/30"
                                    )}>
                                        <span className="material-symbols-outlined text-xl">{line.icon}</span>
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                                        isSelected ? "bg-[#FFCC00] text-[#003399] border-transparent font-[1000]" : "bg-white/10 text-[#FFCC00] border-[#FFCC00]/30"
                                    )}>
                                        {isSelected ? "Active Line" : "Select Line"}
                                    </span>
                                </div>

                                <div className="space-y-1 relative z-10">
                                    <h4 className="text-lg font-[1000] italic uppercase tracking-tight text-white flex items-center gap-2">
                                        {line.name}
                                    </h4>
                                    <p className="text-[11px] font-bold text-white/70 tracking-wide leading-tight">
                                        {line.desc}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Telematics Glassmorphism Dashboard Card in EU Blue & Gold */}
            <section className="bg-gradient-to-br from-[#001A4D] via-[#003399] to-[#00153D] rounded-[45px] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl border-4 border-[#FFCC00]/40 group">
                {/* Background EU Scan & Radar */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.08)_1px,transparent_1px)] bg-[length:28px_28px] opacity-40 pointer-events-none" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-b from-[#FFCC00]/15 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none"
                />

                {/* Top Info Header */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/15">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#FFCC00] rounded-full shadow-lg shadow-[#FFCC00]/30">
                            <span className="h-2 w-2 rounded-full bg-blue-900 animate-pulse" />
                            <span className="text-[10px] font-[1000] text-[#003399] uppercase tracking-[0.25em]">
                                🇪🇺 OASA {lineName} Telemetry Active
                            </span>
                        </div>
                        <h3 className="text-4xl lg:text-6xl font-[1000] italic uppercase tracking-tighter leading-none flex items-center gap-4 text-white drop-shadow-xl">
                            <span className="material-symbols-outlined text-4xl lg:text-5xl text-[#FFCC00]">
                                {selectedLine === "T6" ? "tram" : selectedLine === "608" ? "electric_bolt" : "directions_bus"}
                            </span>
                            {lineName}
                        </h3>
                        <p className="text-sm lg:text-lg font-bold text-white/80 uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-[#FFCC00]">near_me</span>
                            {route}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchTelemetry(selectedLine)}
                            className="flex items-center gap-2.5 px-6 py-3.5 bg-[#FFCC00] hover:bg-yellow-300 text-[#003399] rounded-2xl text-xs font-[1000] uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-[#FFCC00]/30 hover:scale-105"
                        >
                            <span className="material-symbols-outlined text-base">sync</span>
                            Refresh Data
                        </button>
                    </div>
                </div>

                {/* Metrics Grid - Styled in EU Glass */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Speedometer Gauge Card */}
                    <div className="bg-[#002266]/70 backdrop-blur-xl rounded-[32px] p-6 border-2 border-[#FFCC00]/30 flex flex-col justify-between hover:border-[#FFCC00] transition-all shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCC00] flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">speed</span>
                                Live Speed (km/h)
                            </span>
                            <span className="text-[9px] font-black text-green-400 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/40">
                                {speed > 55 ? "Express Pace" : speed < 35 ? "Urban Pace" : "Normal Pace"}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-3 my-2">
                            <motion.span
                                key={speed}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-6xl lg:text-7xl font-[1000] italic text-[#FFCC00] tracking-tighter leading-none drop-shadow-2xl"
                            >
                                {speed}
                            </motion.span>
                            <span className="text-xl font-black text-white/70 uppercase">km/h</span>
                        </div>
                        <div className="w-full bg-black/40 h-3.5 rounded-full overflow-hidden mt-4 border border-white/10">
                            <motion.div
                                animate={{ width: `${Math.min(100, (speed / 80) * 100)}%` }}
                                transition={{ duration: 0.8 }}
                                className="h-full bg-gradient-to-r from-green-400 via-[#FFCC00] to-yellow-300 rounded-full shadow-[0_0_15px_#FFCC00]"
                            />
                        </div>
                    </div>

                    {/* ETA Countdown Card */}
                    <div className="bg-[#002266]/70 backdrop-blur-xl rounded-[32px] p-6 border-2 border-[#FFCC00]/30 flex flex-col justify-between hover:border-[#FFCC00] transition-all shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCC00] flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                Estimated Arrival
                            </span>
                            <span className="text-[9px] font-black text-[#003399] bg-[#FFCC00] px-3 py-1 rounded-full border border-[#FFCC00]">
                                Target: {stops[activeStopIndex] || stops[0]}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2 my-2">
                            <motion.span
                                key={eta}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl lg:text-7xl font-[1000] italic text-white tracking-tighter leading-none drop-shadow-2xl"
                            >
                                {eta.toFixed(1)}
                            </motion.span>
                            <span className="text-2xl font-black text-[#FFCC00] italic">min</span>
                        </div>
                        <p className="text-[10px] font-black text-[#FFCC00]/80 uppercase tracking-widest mt-4">
                            Next Stop: <span className="text-white">{stops[Math.min(stops.length - 1, activeStopIndex + 1)]}</span>
                        </p>
                    </div>

                    {/* GPS Coordinates & Haptics Sync Card */}
                    <div className="bg-[#002266]/70 backdrop-blur-xl rounded-[32px] p-6 border-2 border-[#FFCC00]/30 flex flex-col justify-between hover:border-[#FFCC00] transition-all shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCC00] flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                GPS Telemetry & Sync
                            </span>
                            <span className="text-[9px] font-black text-sky-300 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/40">
                                {latencyMs}ms Latency
                            </span>
                        </div>
                        <div className="space-y-2.5 my-2">
                            <div className="flex justify-between items-center text-xs font-black">
                                <span className="text-white/60 uppercase">Latitude:</span>
                                <span className="text-white font-mono">{latOrigin}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-black">
                                <span className="text-white/60 uppercase">Longitude:</span>
                                <span className="text-white font-mono">{lngOrigin}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-black pt-2 border-t border-white/10">
                                <span className="text-white/60 uppercase">Haptic Guidance:</span>
                                <span className="text-[#FFCC00]">Standard Pulse</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                            Satellite Tracking Lock Confirmed
                        </p>
                    </div>
                </div>

                {/* Progress Route Pipeline */}
                <div className="relative z-10 bg-[#00153D]/80 rounded-[35px] p-6 lg:p-8 backdrop-blur-md border-2 border-[#FFCC00]/30 shadow-inner">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/90 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-[#FFCC00]">linear_scale</span>
                            Route Timeline & Accessible Station Stops
                        </h4>
                        <span className="text-[10px] font-[1000] uppercase text-[#FFCC00] tracking-widest bg-[#FFCC00]/15 px-3 py-1 rounded-full border border-[#FFCC00]/30">
                            Progress: {progress}%
                        </span>
                    </div>

                    <div className="relative h-20 flex items-center my-4">
                        {/* Connecting Line */}
                        <div className="absolute inset-x-8 h-3.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
                            <motion.div
                                className="h-full bg-gradient-to-r from-sky-400 via-[#FFCC00] to-yellow-300 shadow-[0_0_20px_#FFCC00] rounded-full"
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeInOut", duration: 1.2 }}
                            />
                        </div>

                        {/* Station Nodes */}
                        <div className="w-full flex justify-between relative px-6 z-10">
                            {stops.map((station, idx) => {
                                const stepProgress = (idx / Math.max(1, stops.length - 1)) * 100;
                                const isPassed = progress >= stepProgress;

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveStopIndex(idx)}
                                        className="flex flex-col items-center gap-3 cursor-pointer group/node transition-all"
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-full border-4 border-[#00153D] flex items-center justify-center transition-all duration-300 shadow-xl",
                                            isPassed ? "bg-[#FFCC00] scale-125 shadow-[0_0_20px_#FFCC00]" : "bg-blue-900 border-white/30 group-hover/node:bg-[#FFCC00]/50"
                                        )}>
                                            {isPassed && <span className="w-2.5 h-2.5 rounded-full bg-[#003399]" />}
                                        </div>
                                        <div className="flex flex-col items-center text-center">
                                            <span className={cn(
                                                "text-[10px] lg:text-xs font-black uppercase italic tracking-wider transition-colors duration-300",
                                                isPassed ? "text-[#FFCC00] drop-shadow-md" : "text-white/60 group-hover/node:text-white"
                                            )}>
                                                {station}
                                            </span>
                                            <span className="text-[8px] font-bold uppercase text-white/40 tracking-widest mt-0.5">
                                                Stop #{idx + 1}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const SupportView = ({ selectedLang = "el" }: { selectedLang?: "en" | "el" }) => {
    const isEn = selectedLang === "en";

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: isEn ? 'GENERAL SUPPORT' : 'ΓΕΝΙΚΉ ΥΠΟΣΤΉΡΙΞΗ',
            text: isEn ? 'Hello! How can we assist you today?' : 'Γεια σας! Πώς μπορούμε να σας βοηθήσουμε σήμερα;',
            isUser: false
        },
        {
            id: 2,
            sender: isEn ? 'YOU' : 'ΕΣΕΊΣ',
            text: isEn ? 'I would like accessibility information for Omonia Station.' : 'Θα ήθελα πληροφορίες για την προσβασιμότητα στον σταθμό Ομόνοια.',
            isUser: true
        },
        {
            id: 3,
            sender: isEn ? 'AI INTERPRETER' : 'AI ΔΙΕΡΜΗΝΕΑΣ',
            text: isEn
                ? 'At Omonia Station (Lines 1 & 2), elevators A1, A2, and B1 are 100% operational with tactile paving and direct Sign Language video support.'
                : 'Στον Σταθμό Ομόνοιας (Γραμμές 1 & 2), οι ανελκυστήρες A1, A2 και B1 λειτουργούν 100% κανονικά με οδηγούς τυφλών και άμεση βιντεοκλήση στη Νοηματική.',
            isUser: false
        }
    ]);

    const [input, setInput] = useState('');
    const [isCalling, setIsCalling] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (customQuery?: string) => {
        const queryToUse = (customQuery || input).trim();
        if (!queryToUse) return;

        const userMsg = {
            id: Date.now(),
            sender: isEn ? 'YOU' : 'ΕΣΕΊΣ',
            text: queryToUse,
            isUser: true
        };
        setMessages(prev => [...prev, userMsg]);
        if (!customQuery) setInput('');
        setIsTyping(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: queryToUse, lang: selectedLang })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: data.modelName || (isEn ? 'AI ASSISTANT (FAISS RAG v3.0)' : 'AI ΔΙΕΡΜΗΝΕΑΣ (FAISS RAG v3.0)'),
                    text: data.reply || (isEn ? "Service operational." : "Η υπηρεσία λειτουργεί κανονικά."),
                    sourceDoc: data.sourceDoc,
                    ragasScore: data.ragasScore,
                    confidence: data.confidence,
                    modelName: data.modelName,
                    isUser: false
                }]);
            } else {
                throw new Error("Chatbot API status error");
            }
        } catch (err) {
            console.error("Failed to query open-source AI chatbot API", err);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: isEn ? 'AI ASSISTANT' : 'AI ΔΙΕΡΜΗΝΕΑΣ',
                text: isEn
                    ? `Our DeafNav AI team has registered your message "${queryToUse}". A live Sign Language interpreter is active.`
                    : `Η ομάδα DeafNav AI κατέγραψε το μήνυμά σας "${queryToUse}". Πιστοποιημένος διερμηνέας είναι ενεργός.`,
                isUser: false
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const quickQueries = [
        isEn ? "Omonia Station Accessibility" : "Προσβασιμότητα Σταθμού Ομόνοια",
        isEn ? "Syntagma Elevators" : "Ανελκυστήρες Συντάγματος",
        isEn ? "Sign Language Support" : "Υποστήριξη Νοηματικής"
    ];

    return (
        <div className="space-y-10">
            {/* Top Header */}
            <header className="bg-gradient-to-r from-[#001A4D] via-[#003399] to-[#001A4D] p-8 rounded-[35px] border-2 border-[#FFCC00]/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-1 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="bg-[#FFCC00] text-[#003399] px-2.5 py-0.5 rounded text-[8px] font-[1000] uppercase tracking-wider italic">
                            EU ACCESSIBLE HELP CENTER
                        </span>
                        <span className="text-[9px] font-black text-green-400 bg-green-500/20 px-2.5 py-0.5 rounded-full border border-green-500/40 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-ping" />
                            {isEn ? "Live Interpreter Online" : "Ζωντανός Διερμηνέας Online"}
                        </span>
                    </div>
                    <h2 className="text-3xl lg:text-5xl font-[1000] uppercase italic tracking-tighter text-white drop-shadow-md flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-[#FFCC00]">support_agent</span>
                        {isEn ? "Support Center" : "Κέντρο Υποστήριξης"}
                    </h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-300">
                        {isEn ? "Live sign-language video assistance and SOS support." : "Ζωντανή βιντεοκλήση νοηματικής γλώσσας & υποστήριξη έκτακτης ανάγκης SOS."}
                    </p>
                </div>
            </header>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side: Live Video Assistance / SOS Call HUD */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-gradient-to-br from-[#001A4D] via-[#002266] to-[#00153D] rounded-[45px] p-8 border-4 border-[#FFCC00]/40 shadow-2xl space-y-6 text-white relative overflow-hidden">
                        <div className="flex justify-between items-center border-b border-white/15 pb-4">
                            <span className="text-xs font-[1000] uppercase tracking-widest text-[#FFCC00] flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">videocam</span>
                                Video Feed • Sign Language Stream
                            </span>
                            <span className="bg-red-600 text-white text-[9px] font-[1000] uppercase px-3 py-1 rounded-full animate-pulse shadow-md">
                                {isCalling ? "SOS VIDEO LIVE" : "SOS READY"}
                            </span>
                        </div>

                        {/* Video Container Aspect Ratio */}
                        <div className="aspect-video bg-black/80 rounded-[35px] overflow-hidden relative border-2 border-[#FFCC00]/30 shadow-2xl flex flex-col justify-center items-center">
                            {!isCalling ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-t from-black/90 via-black/50 to-black/30 backdrop-blur-sm space-y-6 text-center">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsCalling(true)}
                                        className="w-36 h-36 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.7)] cursor-pointer border-4 border-white animate-pulse"
                                    >
                                        <span className="material-symbols-outlined text-5xl text-white mb-1">videocam</span>
                                        <span className="text-white text-[11px] font-[1000] tracking-widest uppercase">SOS CALL</span>
                                    </motion.button>

                                    <p className="text-white font-[1000] uppercase italic tracking-wider text-lg max-w-sm drop-shadow-md">
                                        {isEn ? "Press for immediate emergency video call." : "Πατήστε για άμεση κλήση έκτακτης ανάγκης με βίντεο."}
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full h-full relative">
                                    <video
                                        src="/videos/connecting-europe.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-6">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-[1000] uppercase shadow-md animate-pulse">
                                                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                                                Live SOS Sign Language Stream
                                            </div>
                                            <span className="text-xs font-mono text-[#FFCC00] bg-black/60 px-3 py-1 rounded-full border border-white/10">
                                                FPS: 60 • Interpreter #042
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-center gap-4 pt-4">
                                            <button
                                                onClick={() => setIsCalling(false)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-2xl font-[1000] uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all border border-white cursor-pointer flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-xl">call_end</span>
                                                {isEn ? "END SOS CALL" : "ΤΕΡΜΑΤΙΣΜΟΣ ΚΛΗΣΗΣ"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Open-Source AI Accessibility Chatbot */}
                <div className="lg:col-span-5 space-y-6">
                    <section className="bg-gradient-to-br from-[#001A4D] via-[#003399] to-[#00153D] rounded-[45px] p-8 border-4 border-[#FFCC00]/40 shadow-2xl text-white space-y-6 h-[680px] flex flex-col relative overflow-hidden">
                        <header className="flex justify-between items-center border-b border-white/15 pb-4 relative z-10">
                            <h3 className="text-2xl font-[1000] italic uppercase tracking-tight flex items-center gap-3 text-white">
                                <span className="material-symbols-outlined text-[#FFCC00] text-3xl">chat</span>
                                Live Chat
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] font-[1000] text-green-400 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 uppercase tracking-widest">
                                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                Online
                            </div>
                        </header>

                        {/* Quick Question Chips */}
                        <div className="flex flex-wrap gap-2 relative z-10">
                            {quickQueries.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(q)}
                                    className="text-[9px] font-black uppercase tracking-wider bg-[#001e5c] hover:bg-[#FFCC00] text-white hover:text-[#003399] px-3 py-1.5 rounded-full border border-[#FFCC00]/30 transition-all cursor-pointer truncate max-w-[240px]"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* Messages Stream Container */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar relative z-10 flex flex-col justify-start">
                            <AnimatePresence>
                                {messages.map((msg: any) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={cn(
                                            "p-4 rounded-3xl text-xs max-w-[90%] space-y-1.5 shadow-lg border",
                                            msg.isUser
                                                ? "bg-[#FFCC00] text-[#003399] border-white self-end rounded-tr-sm font-bold"
                                                : "bg-[#002266]/90 text-white self-start rounded-tl-sm border-[#FFCC00]/40 backdrop-blur-md"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={cn("text-[9px] font-[1000] uppercase tracking-widest", msg.isUser ? "text-[#003399]/80" : "text-[#FFCC00]")}>
                                                {msg.sender}
                                            </p>
                                            {!msg.isUser && msg.confidence && (
                                                <span className="text-[8px] font-black uppercase text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full border border-green-500/40">
                                                    FAISS {(msg.confidence * 100).toFixed(0)}%
                                                </span>
                                            )}
                                        </div>
                                        <p className="leading-relaxed">{msg.text}</p>
                                        {!msg.isUser && msg.sourceDoc && (
                                            <div className="pt-1.5 border-t border-white/10 text-[8px] font-medium text-white/50 flex flex-wrap justify-between gap-1">
                                                <span>Ref: {msg.sourceDoc}</span>
                                                {msg.ragasScore && (
                                                    <span className="text-[#FFCC00]">
                                                        RAGAS Rel: {Math.round(msg.ragasScore.relevance * 100)}% | Faith: {Math.round(msg.ragasScore.faithfulness * 100)}%
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#002266]/80 text-white px-4 py-2.5 rounded-2xl w-fit text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-[#FFCC00]/30">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFCC00] animate-ping" />
                                    {isEn ? "AI Bot Typing..." : "Το AI πληκτρολογεί..."}
                                </motion.div>
                            )}
                        </div>

                        {/* Text Input Bar */}
                        <div className="relative mt-auto pt-4 border-t border-white/15 relative z-10">
                            <input
                                type="text"
                                placeholder={isEn ? "Type your message..." : "Πληκτρολογήστε εδώ..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="w-full bg-[#00153D] border-2 border-[#FFCC00]/40 focus:border-[#FFCC00] rounded-2xl px-5 py-4 text-xs text-white placeholder:text-white/40 outline-none transition-all pr-14 shadow-inner"
                            />
                            <button
                                onClick={() => handleSend()}
                                className="absolute right-3 top-1/2 -translate-y-1/2 mt-2 bg-[#FFCC00] hover:bg-yellow-300 text-[#003399] p-2.5 rounded-xl transition-all shadow-lg cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-base font-black">send</span>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

const AnnouncementsView = ({ selectedLang = "en" }: { selectedLang?: "en" | "el" }) => {
    const [transcriptEn, setTranscriptEn] = useState("Connecting Europe Facility - Supporting sustainable infrastructure.");
    const [transcriptEl, setTranscriptEl] = useState("Διευκόλυνση «Συνδέοντας την Ευρώπη» - Υποστήριξη βιώσιμων υποδομών.");
    const [isTranslating, setIsTranslating] = useState(true);
    const [detectedGloss, setDetectedGloss] = useState("CONNECTING");
    const [confidence, setConfidence] = useState(0.98);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const handleTimeUpdate = async (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const time = e.currentTarget.currentTime;
        try {
            const res = await fetch(`/api/ml/translate?video=connecting-europe.mp4&time=${time.toFixed(1)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.transcription) {
                    setTranscriptEn(data.transcription.en || "");
                    setTranscriptEl(data.transcription.el || "");
                }
                if (data.detectedGloss) setDetectedGloss(data.detectedGloss);
                if (data.confidence) setConfidence(data.confidence);
                setIsTranslating(true);
            }
        } catch (err) {
            console.error("Failed to query ML vision translation API", err);
        }
    };

    const speakTranslation = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const textToSpeak = selectedLang === "en" ? transcriptEn : transcriptEl;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = selectedLang === "en" ? "en-US" : "el-GR";
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const activeTranscript = selectedLang === "en" ? transcriptEn : transcriptEl;

    const glossesList = [
        { gloss: "CONNECTING", labelEn: "Connecting Europe", labelEl: "Συνδέοντας την Ευρώπη", icon: "hub" },
        { gloss: "INVESTING / TEN-T", labelEn: "Trans-European Network", labelEl: "Διευρωπαϊκό Δίκτυο", icon: "railway_alert" },
        { gloss: "GREEN / ENERGY", labelEn: "Green Deal Mobility", labelEl: "Πράσινη Μετακίνηση", icon: "eco" },
        { gloss: "BUILD / FUTURE", labelEn: "Digital Infrastructure", labelEl: "Ψηφιακές Υποδομές", icon: "memory" }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
                {/* EU Header Bar */}
                <header className="bg-gradient-to-r from-[#001A4D] via-[#003399] to-[#001A4D] p-8 rounded-[35px] border-2 border-[#FFCC00]/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFCC00]/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="space-y-1 relative z-10">
                        <div className="flex items-center gap-2">
                            <span className="bg-[#FFCC00] text-[#003399] px-2.5 py-0.5 rounded text-[8px] font-[1000] uppercase tracking-wider italic">
                                EU ACCESSIBILITY PROTOCOL
                            </span>
                            <span className="text-[10px] font-black text-green-400 bg-green-500/20 px-2.5 py-0.5 rounded-full border border-green-500/40">
                                60 FPS ML Stream
                            </span>
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-[1000] uppercase italic tracking-tighter text-white drop-shadow-md flex items-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-[#FFCC00]">settings_accessibility</span>
                            {selectedLang === "en" ? "Announcements Feed & ML Vision AI" : "Ροή Ανακοινώσεων & ML Vision AI"}
                        </h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-300">
                            Open-Source Sign Language (GSL / ASL) Translation Engine
                        </p>
                    </div>
                </header>

                {/* Main Video & Vision AI HUD Container */}
                <div className="relative group rounded-[45px] overflow-hidden shadow-2xl border-4 border-[#FFCC00]/50 bg-[#000d26] aspect-video flex-shrink-0">
                    <video
                        ref={videoRef}
                        src="/videos/connecting-europe.mp4"
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover opacity-90"
                        onTimeUpdate={handleTimeUpdate}
                    />
                    {/* Gradient Overlay for Subtitle Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/40 pointer-events-none" />

                    {/* Top Vision AI HUD Bar */}
                    <div className="absolute top-5 left-6 right-6 flex items-center justify-between pointer-events-none">
                        <div className="bg-[#001A4D]/80 backdrop-blur-xl px-5 py-2.5 rounded-2xl border-2 border-[#FFCC00]/50 flex items-center gap-3 shadow-xl">
                            <span className="h-3 w-3 rounded-full bg-green-400 animate-ping" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-[1000] uppercase text-[#FFCC00] tracking-widest flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-xs">visibility</span>
                                    GLOSS: {detectedGloss}
                                </span>
                                <span className="text-[9px] font-bold text-white/80">
                                    Confidence: {(confidence * 100).toFixed(1)}% • 21 Keypoints Tracked
                                </span>
                            </div>
                        </div>

                        <div className="bg-[#003399]/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-[#FFCC00]/30 text-[9px] font-[1000] text-white uppercase tracking-widest shadow-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs text-[#FFCC00]">memory</span>
                            YOLOv8 + MediaPipe Hands
                        </div>
                    </div>

                    {/* Bottom Floating Translation Card & Audio Reader */}
                    <div className="absolute bottom-6 inset-x-6 pointer-events-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTranscript}
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-gradient-to-r from-[#003399]/95 via-[#002266]/95 to-[#001A4D]/95 backdrop-blur-2xl border-2 border-[#FFCC00] p-6 rounded-3xl shadow-[0_0_35px_rgba(0,51,153,0.6)] flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm font-black text-[#FFCC00] animate-spin-slow">
                                            settings_accessibility
                                        </span>
                                        <span className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-[#FFCC00]">
                                            Sign Language Translation ({selectedLang.toUpperCase()}) • LIVE AI VISION
                                        </span>
                                    </div>
                                    <p className="text-xl lg:text-2xl font-[1000] text-white italic leading-tight uppercase tracking-tighter drop-shadow-md">
                                        "{activeTranscript}"
                                    </p>
                                </div>

                                {/* Speech Synthesizer Button */}
                                <button
                                    onClick={speakTranslation}
                                    className={cn(
                                        "flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-[1000] uppercase tracking-widest transition-all cursor-pointer shadow-lg self-start md:self-auto border",
                                        isSpeaking
                                            ? "bg-green-500 text-white border-green-300 animate-pulse"
                                            : "bg-[#FFCC00] hover:bg-yellow-300 text-[#003399] border-transparent hover:scale-105"
                                    )}
                                >
                                    <span className="material-symbols-outlined text-base">{isSpeaking ? "volume_up" : "campaign"}</span>
                                    {isSpeaking ? "Speaking..." : "Read Aloud"}
                                </button>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Interactive Gesture Glossary Quick Bar */}
                <div className="bg-[#00153D]/90 p-5 rounded-3xl border-2 border-[#FFCC00]/30 backdrop-blur-xl shadow-xl space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-[#FFCC00] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">translate</span>
                            Active ML Sign Language Gloss Dictionary
                        </span>
                        <span className="text-[9px] font-bold uppercase text-white/50 tracking-widest">
                            Real-time Recognition
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {glossesList.map((g) => {
                            const isCurrent = detectedGloss.includes(g.gloss.split(" ")[0]);
                            return (
                                <div
                                    key={g.gloss}
                                    className={cn(
                                        "p-3.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer",
                                        isCurrent
                                            ? "bg-[#003399] border-[#FFCC00] shadow-[0_0_20px_rgba(255,204,0,0.3)] scale-[1.03]"
                                            : "bg-[#002266]/50 border-white/10 hover:border-[#FFCC00]/40"
                                    )}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="material-symbols-outlined text-sm text-[#FFCC00]">{g.icon}</span>
                                        {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-ping" />}
                                    </div>
                                    <span className="text-[10px] font-[1000] uppercase italic text-white tracking-wider">
                                        {g.gloss}
                                    </span>
                                    <span className="text-[9px] font-bold text-white/60 truncate mt-0.5">
                                        {selectedLang === "en" ? g.labelEn : g.labelEl}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* EU Priority Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#001E5C]/80 hover:bg-[#002B80] p-7 rounded-[35px] border-2 border-[#FFCC00]/30 hover:border-[#FFCC00] transition-all shadow-xl space-y-3 group">
                        <div className="p-3 bg-[#FFCC00] text-[#003399] rounded-2xl w-fit shadow-md group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">verified</span>
                        </div>
                        <h3 className="text-xl font-[1000] italic uppercase tracking-tighter text-white">Connecting Europe</h3>
                        <p className="text-white/70 font-bold text-xs leading-relaxed">
                            Seamless accessible transit travel across 26 countries and 33 European borders.
                        </p>
                    </div>

                    <div className="bg-[#001E5C]/80 hover:bg-[#002B80] p-7 rounded-[35px] border-2 border-[#FFCC00]/30 hover:border-[#FFCC00] transition-all shadow-xl space-y-3 group">
                        <div className="p-3 bg-green-400 text-[#003399] rounded-2xl w-fit shadow-md group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">eco</span>
                        </div>
                        <h3 className="text-xl font-[1000] italic uppercase tracking-tighter text-white">Green Deal</h3>
                        <p className="text-white/70 font-bold text-xs leading-relaxed">
                            Rail transport accounts for less than 0.5% of greenhouse gas emissions in Europe.
                        </p>
                    </div>

                    <div className="bg-[#001E5C]/80 hover:bg-[#002B80] p-7 rounded-[35px] border-2 border-[#FFCC00]/30 hover:border-[#FFCC00] transition-all shadow-xl space-y-3 group">
                        <div className="p-3 bg-[#FFCC00] text-[#003399] rounded-2xl w-fit shadow-md group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">railway_alert</span>
                        </div>
                        <h3 className="text-xl font-[1000] italic uppercase tracking-tighter text-white">TEN-T Goals</h3>
                        <p className="text-white/70 font-bold text-xs leading-relaxed">
                            High-quality, accessible rail infrastructure deployed across Europe by 2030.
                        </p>
                    </div>

                    <div className="bg-[#001E5C]/80 hover:bg-[#002B80] p-7 rounded-[35px] border-2 border-[#FFCC00]/30 hover:border-[#FFCC00] transition-all shadow-xl space-y-3 group">
                        <div className="p-3 bg-sky-400 text-[#003399] rounded-2xl w-fit shadow-md group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">security</span>
                        </div>
                        <h3 className="text-xl font-[1000] italic uppercase tracking-tighter text-white">Digital Safety</h3>
                        <p className="text-white/70 font-bold text-xs leading-relaxed">
                            ERTMS-compatible emergency alert logic for wearable deaf accessibility devices.
                        </p>
                    </div>
                </div>

                {/* System Status Banner */}
                <div className="bg-gradient-to-r from-[#001A4D] to-[#003399] rounded-[30px] p-7 border-l-8 border-[#FFCC00] shadow-2xl flex items-center gap-5">
                    <div className="p-3 bg-[#FFCC00] text-[#003399] rounded-2xl shadow-md">
                        <span className="material-symbols-outlined text-2xl">verified_user</span>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-[1000] uppercase text-[#FFCC00] tracking-[0.2em]">System Status</h4>
                        <p className="text-base lg:text-lg font-[1000] italic uppercase text-white leading-tight">
                            High-Definition Sign Language Interpretation Active. Ensuring accessibility across the Pan-European network.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sidebar Announcements Panel */}
            <div className="lg:col-span-4 self-start sticky top-28">
                <LiveAnnouncements selectedLang={selectedLang} />
            </div>
        </div>
    );
};

// --- Main Page ---

export default function Home() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [selectedNavLine, setSelectedNavLine] = useState("140");
    const [globalLang, setGlobalLang] = useState<"en" | "el">("en");
    const [hasEntered, setHasEntered] = useState(false);

    const isEn = globalLang === "en";

    const navItems = [
        { id: "dashboard", label: isEn ? "Dashboard" : "Πίνακας Ελέγχου", icon: "dashboard" },
        { id: "vibration", label: isEn ? "Vibration Settings" : "Ρυθμίσεις Δόνησης", icon: "bolt" },
        { id: "navigation", label: isEn ? "Navigation" : "Πλοήγηση", icon: "map" },
        { id: "announcements", label: isEn ? "Announcements" : "Ανακοινώσεις", icon: "campaign" },
        { id: "support", label: isEn ? "Support" : "Υποστήριξη", icon: "support_agent" }
    ];

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

                {/* Navigation Items Bar */}
                <nav className="flex h-full flex-1 justify-center max-w-5xl">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "flex flex-col items-center justify-center px-5 hover:bg-white/10 transition-all h-full text-[10px] font-black uppercase tracking-widest text-white/60 italic relative group cursor-pointer",
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

                {/* Right Side Info & Global Language Switcher */}
                <div className="ml-auto flex items-center gap-4">
                    <div className="flex bg-[#00153D] p-1 rounded-2xl border-2 border-[#FFCC00]/40 shadow-xl">
                        <button
                            onClick={() => setGlobalLang("en")}
                            className={cn(
                                "px-3.5 py-1.5 rounded-xl text-[10px] font-[1000] uppercase transition-all cursor-pointer flex items-center gap-1.5",
                                globalLang === "en" ? "bg-[#FFCC00] text-[#003399] shadow-md scale-105" : "text-white/70 hover:text-white"
                            )}
                        >
                            🇬🇧 EN
                        </button>
                        <button
                            onClick={() => setGlobalLang("el")}
                            className={cn(
                                "px-3.5 py-1.5 rounded-xl text-[10px] font-[1000] uppercase transition-all cursor-pointer flex items-center gap-1.5",
                                globalLang === "el" ? "bg-[#FFCC00] text-[#003399] shadow-md scale-105" : "text-white/70 hover:text-white"
                            )}
                        >
                            🇬🇷 EL
                        </button>
                    </div>

                    <div className="hidden lg:flex flex-col items-end">
                        <span className="bg-[#FFCC00] text-[#003399] px-3 py-0.5 rounded text-[9px] font-[1000] uppercase italic shadow-lg shadow-[#FFCC00]/20 mb-1">
                            EU STANDARDS COMPLIANT
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">{isEn ? "System Online" : "Σύστημα Online"}</span>
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
                        {activeTab === "dashboard" && <DashboardView setActiveTab={setActiveTab} onSelectLine={(lineId) => setSelectedNavLine(lineId)} selectedLang={globalLang} />}
                        {activeTab === "vibration" && <VibrationView selectedLang={globalLang} />}
                        {activeTab === "navigation" && <NavigationView initialLine={selectedNavLine} selectedLang={globalLang} />}
                        {activeTab === "announcements" && <AnnouncementsView selectedLang={globalLang} />}
                        {activeTab === "support" && <SupportView selectedLang={globalLang} />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* FLOATING ACTION BUTTON */}
            <div className="fixed bottom-12 right-12 z-[100]">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveTab("support")}
                    className="w-20 h-20 bg-[#003399] text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-[#FFCC00] group relative cursor-pointer"
                >
                    <span className="material-symbols-outlined text-4xl">sign_language</span>
                    <div className="absolute top-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </motion.button>
            </div>
        </div>
    );
}
