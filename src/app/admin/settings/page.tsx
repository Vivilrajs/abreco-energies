"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Settings = {
  heroTitle: string;
  heroSubtitle: string;
  heroBody: string;
  videoUrl: string;
  audioUrl: string;
  phone: string;
  email: string;
  address: string;
};

export default function SettingsPage() {
  const [form, setForm] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setForm(d.settings));
  }, []);

  function set<K extends keyof Settings>(key: K, value: string) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) toast.success("Settings saved");
    else toast.error("Save failed");
  }

  if (!form) {
    return <p className="text-neutral-400">Loading…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Site settings</h1>
      <p className="text-sm text-neutral-500">
        Edit homepage hero content, media, and contact details.
      </p>

      <div className="mt-8 space-y-8">
        <Section title="Hero">
          <Field label="Title">
            <Input
              value={form.heroTitle}
              onChange={(e) => set("heroTitle", e.target.value)}
            />
          </Field>
          <Field label="Subtitle (main headline)">
            <Input
              value={form.heroSubtitle}
              onChange={(e) => set("heroSubtitle", e.target.value)}
            />
          </Field>
          <Field label="Body text">
            <Textarea
              rows={3}
              value={form.heroBody}
              onChange={(e) => set("heroBody", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Media">
          <Field label="Background video URL">
            <Input
              value={form.videoUrl}
              onChange={(e) => set("videoUrl", e.target.value)}
              placeholder="/media/hero.mp4"
            />
          </Field>
          <Field label="Ambient audio URL">
            <Input
              value={form.audioUrl}
              onChange={(e) => set("audioUrl", e.target.value)}
              placeholder="/media/ambient.mp3"
            />
          </Field>
          <p className="text-xs text-neutral-400">
            Place files in <code>/public/media/</code> or paste a full URL. If
            the video is missing, an animated gradient is shown instead.
          </p>
        </Section>

        <Section title="Contact">
          <Field label="Phone">
            <Input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field label="Email">
            <Input
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
          <Field label="Address">
            <Input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </Field>
        </Section>

        <div className="flex justify-end">
          <Button
            onClick={save}
            disabled={saving}
            className="bg-brand text-white hover:bg-brand-strong"
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
