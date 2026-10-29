"use client";

import React from "react";
import { useLocale } from "@/context/LocaleContext";
import { Compass, Cpu, Gauge, Globe, Sparkles } from "lucide-react";

interface NavbarProps {
  activeTab: "launchpad" | "engine" | "command";
  onSelectTab: (tab: "launchpad" | "engine" | "command") => void;
}

export function Navbar({ activeTab, onSelectTab }: NavbarProps) {
  const { locale, setLocale, t } = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand Logo & Aura Glow Emblem */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectTab("launchpad")}
          onKeyDown={(e) => e.key === "Enter" && onSelectTab("launchpad")}
          className="flex cursor-pointer items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
          aria-label="Aura Command Center Home"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-indigo-600 p-[1px] shadow-[0_0_20px_rgba(34,211,238,0.35)]">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-neutral-950 text-cyan-400">
              <Sparkles className="h-5 w-5 animate-pulse" aria-hidden="true" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-white">
                AURA
              </span>
              <span className="rounded-full border border-cyan-500/40 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                AI COMMAND
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (WCAG Compliant Semantic Tablist) */}
        <nav aria-label="Main Navigation">
          <ul className="flex items-center gap-1 sm:gap-2">
            <li>
              <button
                type="button"
                onClick={() => onSelectTab("launchpad")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  activeTab === "launchpad"
                    ? "border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                    : "border border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900 hover:text-neutral-200"
                }`}
                aria-current={activeTab === "launchpad" ? "page" : undefined}
              >
                <Compass className="h-4 w-4" aria-hidden="true" />
                <span>{t.navLaunchpad}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab("engine")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  activeTab === "engine"
                    ? "border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                    : "border border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900 hover:text-neutral-200"
                }`}
                aria-current={activeTab === "engine" ? "page" : undefined}
              >
                <Cpu className="h-4 w-4" aria-hidden="true" />
                <span>{t.navEngine}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab("command")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  activeTab === "command"
                    ? "border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                    : "border border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900 hover:text-neutral-200"
                }`}
                aria-current={activeTab === "command" ? "page" : undefined}
              >
                <Gauge className="h-4 w-4" aria-hidden="true" />
                <span>{t.navCommand}</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Accessible Language Switcher */}
        <div className="flex items-center gap-2 border-l border-neutral-800 pl-3">
          <Globe className="h-4 w-4 text-cyan-400" aria-hidden="true" />
          <div
            role="group"
            aria-label={t.langSwitchAria}
            className="inline-flex rounded-lg bg-neutral-900 p-0.5 border border-neutral-800"
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-md px-2.5 py-1 text-xs font-mono font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                locale === "en"
                  ? "bg-cyan-500 text-neutral-950 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                  : "text-neutral-400 hover:text-white"
              }`}
              aria-pressed={locale === "en"}
              aria-label="Switch language to English"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("es")}
              className={`rounded-md px-2.5 py-1 text-xs font-mono font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                locale === "es"
                  ? "bg-cyan-500 text-neutral-950 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                  : "text-neutral-400 hover:text-white"
              }`}
              aria-pressed={locale === "es"}
              aria-label="Cambiar idioma a Español"
            >
              ES
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
