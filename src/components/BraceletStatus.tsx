"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface IoTStatus {
    connected: boolean;
    battery: number;
    pulse: number;
    stressLevel: string;
    vibrationMode: string;
}

export default function BraceletStatus() {
    const [status, setStatus] = useState<IoTStatus | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch("/api/iot/status");
                const data = await res.json();
                setStatus(data);
            } catch (error) {
                console.error("Failed to fetch IoT status", error);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    if (!status) return <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-32 rounded-3xl" />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connectivity</span>
                    <span className={`material-symbols-outlined ${status.connected ? 'text-primary' : 'text-slate-300'}`}>watch</span>
                </div>
                <h4 className="text-2xl font-black">{status.connected ? "Connected" : "Disconnected"}</h4>
                <p className={`text-sm font-bold flex items-center gap-1 ${status.connected ? 'text-green-600' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined text-xs">{status.connected ? 'check_circle' : 'error'}</span>
                    Active
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Battery</span>
                    <span className="material-symbols-outlined text-primary">battery_charging_80</span>
                </div>
                <h4 className="text-2xl font-black">{status.battery}%</h4>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: `${status.battery}%` }} />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biometrics</span>
                    <span className="material-symbols-outlined text-red-500 animate-pulse">favorite</span>
                </div>
                <h4 className="text-2xl font-black">{status.pulse} <span className="text-sm font-normal text-slate-400">bpm</span></h4>
                <p className="text-sm font-bold text-primary">{status.stressLevel}</p>
            </motion.div>
        </div>
    );
}
