"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Pencil, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";

type Testimonial = {
  _id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
  order: number;
  published: boolean;
};

type Draft = Partial<Testimonial>;

const EMPTY: Draft = {
  name: "",
  role: "",
  quote: "",
  avatar: "",
  rating: 5,
  order: 0,
  published: true,
};

export default function TestimonialsAdminPage() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/testimonials");
    if (res.ok) setRows((await res.json()).testimonials);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    if (!editing.name || !editing.quote) {
      toast.error("Name and quote are required.");
      return;
    }
    const isNew = !editing._id;
    const url = isNew
      ? "/api/testimonials"
      : `/api/testimonials/${editing._id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editing.name,
        role: editing.role ?? "",
        quote: editing.quote,
        avatar: editing.avatar ?? "",
        rating: Number(editing.rating) || 5,
        order: Number(editing.order) || 0,
        published: editing.published ?? true,
      }),
    });
    if (res.ok) {
      toast.success(isNew ? "Testimonial added" : "Testimonial updated");
      setEditing(null);
      load();
    } else {
      toast.error("Save failed.");
    }
  }

  async function togglePublish(t: Testimonial) {
    const res = await fetch(`/api/testimonials/${t._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !t.published }),
    });
    if (res.ok)
      setRows((prev) =>
        prev.map((r) => (r._id === t._id ? { ...r, published: !t.published } : r))
      );
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRows((prev) => prev.filter((r) => r._id !== id));
      toast.success("Deleted");
    }
  }

  function patch(p: Draft) {
    setEditing((e) => (e ? { ...e, ...p } : e));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Testimonials</h1>
          <p className="text-sm text-neutral-500">
            Customer reviews shown on the public /testimonials page.
          </p>
        </div>
        <Button
          onClick={() => setEditing({ ...EMPTY, order: rows.length + 1 })}
          className="gap-2 bg-brand text-white hover:bg-brand-strong"
        >
          <Plus size={16} /> Add testimonial
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-neutral-400">Loading…</p>
        ) : (
          rows.map((t) => (
            <div
              key={t._id}
              className="rounded-2xl border border-neutral-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-0.5 text-brand">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={13} className="fill-current" />
                  ))}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    t.published
                      ? "bg-brand/15 text-brand"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {t.published ? "Live" : "Hidden"}
                </span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-neutral-600">
                “{t.quote}”
              </p>
              <div className="mt-3 text-sm font-semibold">{t.name}</div>
              {t.role && (
                <div className="text-xs text-neutral-500">{t.role}</div>
              )}
              <div className="mt-4 flex items-center gap-1 border-t border-neutral-100 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing({ ...t })}
                  className="gap-1.5 text-neutral-600"
                >
                  <Pencil size={14} /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePublish(t)}
                  className="gap-1.5 text-neutral-600"
                >
                  {t.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  {t.published ? "Hide" : "Show"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(t._id)}
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
          <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editing._id ? "Edit testimonial" : "New testimonial"}
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

            <div className="mt-5 space-y-4">
              <Field label="Photo (optional)">
                <ImageUpload
                  value={editing.avatar ?? ""}
                  onChange={(url) => patch({ avatar: url })}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name">
                  <Input
                    value={editing.name ?? ""}
                    onChange={(e) => patch({ name: e.target.value })}
                    placeholder="Sarah M."
                  />
                </Field>
                <Field label="Role / location">
                  <Input
                    value={editing.role ?? ""}
                    onChange={(e) => patch({ role: e.target.value })}
                    placeholder="Homeowner, Melbourne"
                  />
                </Field>
              </div>
              <Field label="Quote">
                <Textarea
                  rows={3}
                  value={editing.quote ?? ""}
                  onChange={(e) => patch({ quote: e.target.value })}
                />
              </Field>
              <div className="flex items-center gap-6">
                <Field label="Rating (1–5)">
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    className="w-24"
                    value={editing.rating ?? 5}
                    onChange={(e) => patch({ rating: Number(e.target.value) })}
                  />
                </Field>
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
                    className="h-4 w-4 accent-[oklch(0.55_0.13_240)]"
                  />
                  Published
                </label>
              </div>
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
