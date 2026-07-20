"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";
import { LeadForm } from "./lead-form";
import type { SettingsDTO } from "@/lib/data";

export function Hero({ settings }: { settings: SettingsDTO }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoOk, setVideoOk] = useState(true);
  const [soundOn, setSoundOn] = useState(false);

  // Browsers block autoplay with sound; ambient audio starts only on toggle.
  function toggleSound() {
    const audio = audioRef.current;
    if (!audio) return;
    if (soundOn) {
      audio.pause();
      setSoundOn(false);
    } else {
      audio.volume = 0.4;
      audio
        .play()
        .then(() => setSoundOn(true))
        .catch(() => setSoundOn(false));
    }
  }

  useEffect(() => {
    // Attempt muted autoplay of the background video.
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 -z-10">
        {settings.videoUrl && videoOk ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoOk(false)}
          >
            <source src={settings.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="hero-fallback h-full w-full animate-brand-drift" />
        )}
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* Ambient audio */}
      {settings.audioUrl && (
        <audio ref={audioRef} loop preload="none">
          <source src={settings.audioUrl} type="audio/mpeg" />
        </audio>
      )}

      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        aria-label={soundOn ? "Mute ambient sound" : "Play ambient sound"}
        className="absolute right-5 top-24 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
      >
        {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {/* Content */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 py-32 lg:grid-cols-2 lg:items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Accredited across VIC · NSW · QLD · SA
          </span>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {settings.heroSubtitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            {settings.heroBody}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-white/60">
            <Stat value="10k+" label="Installs" />
            <div className="h-8 w-px bg-white/15" />
            <Stat value="4.9★" label="Rated" />
            <div className="h-8 w-px bg-white/15" />
            <Stat value="$0" label="Consultation" />
          </div>
        </div>

        {/* Lead card */}
        <div className="animate-fade-up rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8 [animation-delay:120ms]">
          <h2 className="text-xl font-semibold text-white">
            Book your free consultation
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Tell us what you need — we&apos;ll handle the rebates.
          </p>
          <div className="mt-6">
            <LeadForm />
          </div>
        </div>
      </div>

      <a
        href="#solutions"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 transition hover:text-white"
        aria-label="Scroll to solutions"
      >
        <ChevronDown className="animate-bounce" />
      </a>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="text-xs uppercase tracking-wider text-white/40">
        {label}
      </div>
    </div>
  );
}
