import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const publicSans = Public_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-public-sans"
});

export const metadata: Metadata = {
    title: "DeafNav | IoT Accessibility Hub",
    description: "Next-generation accessibility platform for the deaf and hard of hearing community.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet" />
            </head>
            <body className={cn(
                inter.variable,
                publicSans.variable,
                "font-sans bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased"
            )}>
                <div className="flex min-h-screen overflow-hidden">
                    {/* Sidebar */}
                    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20">
                        <div className="p-6 flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-2xl">navigation</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none italic uppercase">DeafNav</h1>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Accessibility Hub</span>
                            </div>
                        </div>

                        <nav className="flex-1 px-4 py-8 space-y-3">
                            <a href="/" className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-primary text-white font-black transition-all shadow-xl shadow-primary/20 scale-[1.02]">
                                <span className="material-symbols-outlined text-2xl">dashboard</span>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm uppercase tracking-tighter italic">DeafNav Hub</span>
                                    <span className="text-[9px] opacity-60 font-bold uppercase tracking-widest leading-none">Command Center</span>
                                </div>
                                <span className="material-symbols-outlined ml-auto text-lg opacity-40 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </a>
                            <a href="#" className="group flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-bold">
                                <span className="material-symbols-outlined text-2xl">campaign</span>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm uppercase tracking-tighter italic">Real-Time Feed</span>
                                    <span className="text-[9px] opacity-60 font-bold uppercase tracking-widest leading-none">Transcripts</span>
                                </div>
                                <span className="material-symbols-outlined ml-auto text-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">arrow_forward</span>
                            </a>
                            <a href="#" className="group flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-bold">
                                <span className="material-symbols-outlined text-2xl">chat_bubble</span>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm uppercase tracking-tighter italic">Support Center</span>
                                    <span className="text-[9px] opacity-60 font-bold uppercase tracking-widest leading-none">Live Help</span>
                                </div>
                                <span className="material-symbols-outlined ml-auto text-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">arrow_forward</span>
                            </a>
                        </nav>

                        <div className="p-4 mt-auto">
                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-primary text-sm">stars</span>
                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">EU STANDARDS</p>
                                </div>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Compliant with accessibility guidelines WCAG 2.1.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>
                                <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] italic">Station proximity ACTIVE</h2>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-all">
                                    <span className="material-symbols-outlined">search</span>
                                </button>
                                <button className="h-10 px-5 flex items-center gap-2 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                    <span className="material-symbols-outlined text-lg">sos</span>
                                    Emergency SOS
                                </button>
                                <div className="h-10 w-10 rounded-full bg-accent/20 border-2 border-accent overflow-hidden">
                                    <div className="w-full h-full bg-accent/10 flex items-center justify-center text-primary font-bold">JD</div>
                                </div>
                            </div>
                        </header>

                        <div className="flex-1 p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
