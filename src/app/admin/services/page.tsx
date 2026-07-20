"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";

type Service = {
  _id: string;
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  image: string;
  order: number;
  published: boolean;
};

type Draft = Partial<Service>;

const EMPTY: Draft = {
  slug: "",
  eyebrow: "",
  title: "",
  description: "",
  body: "",
  image: "",
  order: 0,
  published: true,
};

export default function ServicesAdminPage() {
  const [rows, setRows] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/services");
    if (res.ok) setRows((await res.json()).services);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    const isNew = !editing._id;
    const url = isNew ? "/api/services" : `/api/services/${editing._id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: editing.slug,
        eyebrow: editing.eyebrow ?? "",
        title: editing.title,
        description: editing.description,
        body: editing.body ?? "",
        image: editing.image ?? "",
        order: Number(editing.order) || 0,
        published: editing.published ?? true,
      }),
    });
    if (res.ok) {
      toast.success(isNew ? "Service created" : "Service updated");
      setEditing(null);
      load();
    } else {
      toast.error("Save failed — check the slug is unique.");
    }
  }

  async function togglePublish(s: Service) {
    const res = await fetch(`/api/services/${s._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !s.published }),
    });
    if (res.ok)
      setRows((prev) =>
        prev.map((r) => (r._id === s._id ? { ...r, published: !s.published } : r))
      );
  }

  async function remove(id: string) {
    if (!confirm("Delete this service?")) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
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
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-sm text-neutral-500">
            Shown on the public /services page and their detail pages.
          </p>
        </div>
        <Button
          onClick={() => setEditing({ ...EMPTY, order: rows.length + 1 })}
          className="gap-2 bg-brand text-white hover:bg-brand-strong"
        >
          <Plus size={16} /> Add service
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-neutral-400">Loading…</p>
        ) : (
          rows.map((s) => (
            <div
              key={s._id}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
            >
              <div className="aspect-[16/9] bg-neutral-100">
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl text-neutral-300">
                    ☀️
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">{s.title}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      s.published
                        ? "bg-brand/15 text-brand"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {s.published ? "Live" : "Hidden"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                  {s.description}
                </p>
                <div className="mt-4 flex items-center gap-1 border-t border-neutral-100 pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing({ ...s })}
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
            </div>
          ))
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-8 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editing._id ? "Edit service" : "New service"}
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
              <Field label="Image">
                <ImageUpload
                  value={editing.image ?? ""}
                  onChange={(url) => patch({ image: url })}
                />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Eyebrow">
                  <Input
                    value={editing.eyebrow ?? ""}
                    onChange={(e) => patch({ eyebrow: e.target.value })}
                    placeholder="Solar"
                  />
                </Field>
                <div className="col-span-2">
                  <Field label="Title">
                    <Input
                      value={editing.title ?? ""}
                      onChange={(e) => patch({ title: e.target.value })}
                      placeholder="Solar Installation"
                    />
                  </Field>
                </div>
              </div>
              <Field label="Slug (unique, used in URL)">
                <Input
                  value={editing.slug ?? ""}
                  onChange={(e) => patch({ slug: e.target.value })}
                  placeholder="solar-installation"
                />
              </Field>
              <Field label="Card description">
                <Textarea
                  rows={2}
                  value={editing.description ?? ""}
                  onChange={(e) => patch({ description: e.target.value })}
                />
              </Field>
              <Field label="Detail body (one paragraph per line)">
                <Textarea
                  rows={5}
                  value={editing.body ?? ""}
                  onChange={(e) => patch({ body: e.target.value })}
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
