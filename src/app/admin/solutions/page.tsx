"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";

type Benefit = { icon: string; text: string };
type Install = { title: string; body: string; scenarios: string[]; image: string };

type Solution = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  published: boolean;
  tagline: string;
  headline: string;
  intro: string;
  heroImage: string;
  heroVideo: string;
  ctaLabel: string;
  benefits: Benefit[];
  commercial: Install;
  residential: Install;
};

type Draft = Partial<Solution>;

const EMPTY_INSTALL: Install = { title: "", body: "", scenarios: [], image: "" };

const EMPTY: Draft = {
  slug: "",
  title: "",
  description: "",
  icon: "⚡",
  order: 0,
  published: true,
  tagline: "",
  headline: "",
  intro: "",
  heroImage: "",
  heroVideo: "",
  ctaLabel: "Get Now!",
  benefits: [],
  commercial: { ...EMPTY_INSTALL },
  residential: { ...EMPTY_INSTALL },
};

export default function SolutionsPage() {
  const [rows, setRows] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/solutions");
    if (res.ok) setRows((await res.json()).solutions);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    const isNew = !editing._id;
    const url = isNew ? "/api/solutions" : `/api/solutions/${editing._id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: editing.slug,
        title: editing.title,
        description: editing.description,
        icon: editing.icon,
        order: Number(editing.order) || 0,
        published: editing.published ?? true,
        tagline: editing.tagline ?? "",
        headline: editing.headline ?? "",
        intro: editing.intro ?? "",
        heroImage: editing.heroImage ?? "",
        heroVideo: editing.heroVideo ?? "",
        ctaLabel: editing.ctaLabel || "Get Now!",
        benefits: editing.benefits ?? [],
        commercial: editing.commercial ?? EMPTY_INSTALL,
        residential: editing.residential ?? EMPTY_INSTALL,
      }),
    });
    if (res.ok) {
      toast.success(isNew ? "Solution created" : "Solution updated");
      setEditing(null);
      load();
    } else {
      toast.error("Save failed - check the slug is unique.");
    }
  }

  async function togglePublish(s: Solution) {
    const res = await fetch(`/api/solutions/${s._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !s.published }),
    });
    if (res.ok) {
      setRows((prev) =>
        prev.map((r) => (r._id === s._id ? { ...r, published: !s.published } : r))
      );
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this solution?")) return;
    const res = await fetch(`/api/solutions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRows((prev) => prev.filter((r) => r._id !== id));
      toast.success("Deleted");
    }
  }

  // ---- editing helpers ----
  function patch(p: Draft) {
    setEditing((e) => (e ? { ...e, ...p } : e));
  }
  function patchInstall(key: "commercial" | "residential", p: Partial<Install>) {
    setEditing((e) =>
      e ? { ...e, [key]: { ...(e[key] ?? EMPTY_INSTALL), ...p } } : e
    );
  }
  function updateBenefit(i: number, p: Partial<Benefit>) {
    setEditing((e) => {
      if (!e) return e;
      const benefits = [...(e.benefits ?? [])];
      benefits[i] = { ...benefits[i], ...p };
      return { ...e, benefits };
    });
  }
  function addBenefit() {
    patch({ benefits: [...(editing?.benefits ?? []), { icon: "⚡", text: "" }] });
  }
  function removeBenefit(i: number) {
    patch({ benefits: (editing?.benefits ?? []).filter((_, j) => j !== i) });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Solutions</h1>
          <p className="text-sm text-neutral-500">
            Products shown on the homepage and their detail pages.
          </p>
        </div>
        <Button
          onClick={() => setEditing({ ...EMPTY, order: rows.length + 1 })}
          className="gap-2 bg-brand text-white hover:bg-brand-strong"
        >
          <Plus size={16} />
          Add solution
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-neutral-400">Loading…</p>
        ) : (
          rows.map((s) => (
            <div
              key={s._id}
              className="rounded-2xl border border-neutral-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-2xl">
                  {s.icon}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    s.published
                      ? "bg-brand/15 text-brand"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {s.published ? "Published" : "Hidden"}
                </span>
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                {s.description}
              </p>
              <div className="mt-4 flex items-center gap-1 border-t border-neutral-100 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setEditing({
                      ...s,
                      commercial: s.commercial ?? { ...EMPTY_INSTALL },
                      residential: s.residential ?? { ...EMPTY_INSTALL },
                      benefits: s.benefits ?? [],
                    })
                  }
                  className="gap-1.5 text-neutral-600"
                >
                  <Pencil size={14} /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePublish(s)}
                  className="gap-1.5 text-neutral-600"
                >
                  {s.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  {s.published ? "Hide" : "Show"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(s._id)}
                  className="ml-auto h-8 w-8 text-neutral-400 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editing._id ? "Edit solution" : "New solution"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditing(null)}
                className="h-8 w-8"
              >
                <X size={18} />
              </Button>
            </div>

            <div className="mt-5 space-y-6">
              {/* Basics */}
              <Group title="Basics">
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Icon">
                    <Input
                      value={editing.icon ?? ""}
                      onChange={(e) => patch({ icon: e.target.value })}
                      placeholder="⚡"
                    />
                  </Field>
                  <div className="col-span-2">
                    <Field label="Title">
                      <Input
                        value={editing.title ?? ""}
                        onChange={(e) => patch({ title: e.target.value })}
                        placeholder="Heat Pumps"
                      />
                    </Field>
                  </div>
                </div>
                <Field label="Slug (unique, used in URL)">
                  <Input
                    value={editing.slug ?? ""}
                    onChange={(e) => patch({ slug: e.target.value })}
                    placeholder="heat-pumps"
                  />
                </Field>
                <Field label="Card description (homepage)">
                  <Textarea
                    rows={2}
                    value={editing.description ?? ""}
                    onChange={(e) => patch({ description: e.target.value })}
                  />
                </Field>
                <div className="flex items-center gap-6">
                  <Field label="Order">
                    <Input
                      type="number"
                      className="w-24"
                      value={editing.order ?? 0}
                      onChange={(e) => patch({ order: Number(e.target.value) })}
                    />
                  </Field>
                  <label className="mt-6 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editing.published ?? true}
                      onChange={(e) => patch({ published: e.target.checked })}
                      className="h-4 w-4 accent-[oklch(0.62_0.16_155)]"
                    />
                    Published
                  </label>
                </div>
              </Group>

              {/* Product page */}
              <Group title="Product page">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="CTA label">
                    <Input
                      value={editing.ctaLabel ?? ""}
                      onChange={(e) => patch({ ctaLabel: e.target.value })}
                      placeholder="Get Now!"
                    />
                  </Field>
                  <Field label="Hero image">
                    <ImageUpload
                      value={editing.heroImage ?? ""}
                      onChange={(url) => patch({ heroImage: url })}
                    />
                  </Field>
                </div>
                <Field label="Hero video (optional - shown instead of image)">
                  <ImageUpload
                    kind="video"
                    value={editing.heroVideo ?? ""}
                    onChange={(url) => patch({ heroVideo: url })}
                  />
                </Field>
                <Field label="Tagline (hero headline)">
                  <Input
                    value={editing.tagline ?? ""}
                    onChange={(e) => patch({ tagline: e.target.value })}
                    placeholder="Heat pumps cut power use, boost savings!"
                  />
                </Field>
                <Field label="Benefits headline">
                  <Input
                    value={editing.headline ?? ""}
                    onChange={(e) => patch({ headline: e.target.value })}
                    placeholder="What is so good about Heat Pumps?"
                  />
                </Field>
                <Field label="Intro paragraph">
                  <Textarea
                    rows={3}
                    value={editing.intro ?? ""}
                    onChange={(e) => patch({ intro: e.target.value })}
                  />
                </Field>
              </Group>

              {/* Benefits */}
              <Group title="Benefits">
                <div className="space-y-2">
                  {(editing.benefits ?? []).map((b, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={b.icon}
                        onChange={(e) => updateBenefit(i, { icon: e.target.value })}
                        className="w-16 shrink-0 text-center"
                      />
                      <Textarea
                        rows={2}
                        value={b.text}
                        onChange={(e) => updateBenefit(i, { text: e.target.value })}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBenefit(i)}
                        className="h-9 w-9 shrink-0 text-neutral-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addBenefit}
                  className="mt-2 gap-1.5"
                >
                  <Plus size={14} /> Add benefit
                </Button>
              </Group>

              {/* Install sections */}
              <InstallEditor
                title="Commercial installations (optional)"
                value={editing.commercial ?? EMPTY_INSTALL}
                onChange={(p) => patchInstall("commercial", p)}
              />
              <InstallEditor
                title="Residential installations (optional)"
                value={editing.residential ?? EMPTY_INSTALL}
                onChange={(p) => patchInstall("residential", p)}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button
                onClick={save}
                className="bg-brand text-white hover:bg-brand-strong"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <h3 className="text-sm font-semibold text-neutral-700">{title}</h3>
      <div className="mt-3 space-y-3">{children}</div>
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
      <Label className="text-xs text-neutral-500">{label}</Label>
      {children}
    </div>
  );
}

function InstallEditor({
  title,
  value,
  onChange,
}: {
  title: string;
  value: { title: string; body: string; scenarios: string[]; image: string };
  onChange: (p: Partial<{
    title: string;
    body: string;
    scenarios: string[];
    image: string;
  }>) => void;
}) {
  return (
    <Group title={title}>
      <Field label="Section title">
        <Input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Commercial Heat Pump Installations"
        />
      </Field>
      <Field label="Body">
        <Textarea
          rows={3}
          value={value.body}
          onChange={(e) => onChange({ body: e.target.value })}
        />
      </Field>
      <Field label="Scenarios (one per line)">
        <Textarea
          rows={3}
          value={value.scenarios.join("\n")}
          onChange={(e) =>
            onChange({
              scenarios: e.target.value.split("\n").filter((l) => l.trim()),
            })
          }
        />
      </Field>
      <Field label="Image">
        <ImageUpload
          value={value.image}
          onChange={(url) => onChange({ image: url })}
        />
      </Field>
    </Group>
  );
}
