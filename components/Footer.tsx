"use client";

import { Github, Twitter, Heart } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "./FadeIn";

export function Footer()
{
    return (
        <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-sm mt-auto">
            <FadeIn className="container mx-auto px-6 py-8" delay={0.5}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    {/* Brand & Copyright */}
                    <div className="flex flex-col items-center md:items-start space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg tracking-tight">Xandeum Explorer</span>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-white/5">
                                Beta
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Open Source Dashboard.
                        </p>
                    </div>

                    {/* Version / STATUS */}
                    <div className="hidden md:flex flex-col items-center space-y-1 text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>All Systems Normal</span>
                        </div>
                        <span className="opacity-50">v1.0.4</span>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="https://github.com/Arpit-Khandelwal/xandeum-dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-white/10 transition-colors group"
                            aria-label="GitHub Repository"
                        >
                            <Github className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                        </Link>

                        <Link
                            href="https://twitter.com/Arpitkhandewa3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-white/10 transition-colors group"
                            aria-label="Twitter Profile"
                        >
                            <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-[#1DA1F2] transition-colors" />
                        </Link>
                    </div>
                </div>
            </FadeIn>
        </footer>
    );
}
