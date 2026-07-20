"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";

type Project = {
  _id: string;
  title: string;
  category: string;
  image: string;
  order: number;
  published: boolean;
};

type Draft = Partial<Project>;

const EMPTY: Draft = {
  title: "",
  category: "",
  image: "",
  order: 0,
  published: true,
};

export default function ProjectsAdminPage() {
  const [rows, setRows] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/projects");
    if (res.ok) setRows((await res.json()).projects);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    if (!editing.image) {
      toast.error("Please upload an image first.");
      return;
    }
    const isNew = !editing._id;
    const url = isNew ? "/api/projects" : `/api/projects/${editing._id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editing.title ?? "",
        category: editing.category ?? "",
        image: editing.image,
        order: Number(editing.order) || 0,
        published: editing.published ?? true,
      }),
    });
    if (res.ok) {
      toast.success(isNew ? "Project added" : "Project updated");
      setEditing(null);
      load();
    } else {
      toast.error("Save failed.");
    }
  }

  async function togglePublish(p: Project) {
    const res = await fetch(`/api/projects/${p._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });
    if (res.ok)
      setRows((prev) =>
        prev.map((r) => (r._id === p._id ? { ...r, published: !p.published } : r))
      );
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
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
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-neutral-500">
            Photo gallery shown on the public /projects page. Image required;
            title &amp; category optional.
          </p>
        </div>
        <Button
          onClick={() => setEditing({ ...EMPTY, order: rows.length + 1 })}
          className="gap-2 bg-brand text-white hover:bg-brand-strong"
        >
          <Plus size={16} /> Add project
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <p className="text-neutral-400">Loading…</p>
        ) : (
          rows.map((p) => (
            <div
              key={p._id}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100"
            >
              <div className="aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {!p.published && (
                <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                  Hidden
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-black/65 p-2 opacity-0 transition group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditing({ ...p })}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePublish(p)}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  {p.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(p._id)}
                  className="h-8 w-8 text-white hover:bg-white/20 hover:text-red-400"
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
          <div className="my-8 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editing._id ? "Edit project" : "New project"}
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
              <Field label="Image (required)">
                <ImageUpload
                  value={editing.image ?? ""}
                  onChange={(url) => patch({ image: url })}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Title (optional)">
                  <Input
                    value={editing.title ?? ""}
                    onChange={(e) => patch({ title: e.target.value })}
                    placeholder="Rooftop solar — 8kW"
                  />
                </Field>
                <Field label="Category (optional)">
                  <Input
                    value={editing.category ?? ""}
                    onChange={(e) => patch({ category: e.target.value })}
                    placeholder="Residential"
                  />
                </Field>
              </div>
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
