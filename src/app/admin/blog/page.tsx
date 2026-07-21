"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";

type Post = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  published: boolean;
};

type Draft = Partial<Post>;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY: Draft = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  image: "",
  author: "Abreco Energies",
  date: todayISO(),
  readTime: "5 min read",
  published: true,
};

export default function BlogAdminPage() {
  const [rows, setRows] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/posts");
    if (res.ok) setRows((await res.json()).posts);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    const isNew = !editing._id;
    const url = isNew ? "/api/posts" : `/api/posts/${editing._id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: editing.slug,
        title: editing.title,
        excerpt: editing.excerpt ?? "",
        body: editing.body ?? "",
        image: editing.image ?? "",
        author: editing.author || "Abreco Energies",
        date: editing.date || todayISO(),
        readTime: editing.readTime || "5 min read",
        published: editing.published ?? true,
      }),
    });
    if (res.ok) {
      toast.success(isNew ? "Post created" : "Post updated");
      setEditing(null);
      load();
    } else {
      toast.error("Save failed - check the slug is unique.");
    }
  }

  async function togglePublish(p: Post) {
    const res = await fetch(`/api/posts/${p._id}`, {
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
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
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
          <h1 className="text-2xl font-semibold">Blog</h1>
          <p className="text-sm text-neutral-500">
            Articles shown on the public /blog page and their detail pages.
          </p>
        </div>
        <Button
          onClick={() => setEditing({ ...EMPTY })}
          className="gap-2 bg-brand text-white hover:bg-brand-strong"
        >
          <Plus size={16} /> Add post
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-neutral-400">Loading…</p>
        ) : (
          rows.map((p) => (
            <div
              key={p._id}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
            >
              <div className="aspect-[16/9] bg-neutral-100">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl text-neutral-300">
                    📰
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-snug">{p.title}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.published
                        ? "bg-brand/15 text-brand"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {p.published ? "Live" : "Hidden"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                  {p.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-1 border-t border-neutral-100 pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setEditing({ ...p, date: p.date?.slice(0, 10) })
                    }
                    className="gap-1.5 text-neutral-600"
                  >
                    <Pencil size={14} /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublish(p)}
                    className="gap-1.5 text-neutral-600"
                  >
                    {p.published ? <EyeOff size={14} /> : <Eye size={14} />}
                    {p.published ? "Hide" : "Show"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(p._id)}
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
                {editing._id ? "Edit post" : "New post"}
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
              <Field label="Cover image">
                <ImageUpload
                  value={editing.image ?? ""}
                  onChange={(url) => patch({ image: url })}
                />
              </Field>
              <Field label="Title">
                <Input
                  value={editing.title ?? ""}
                  onChange={(e) => patch({ title: e.target.value })}
                  placeholder="How many solar panels do you need?"
                />
              </Field>
              <Field label="Slug (unique, used in URL)">
                <Input
                  value={editing.slug ?? ""}
                  onChange={(e) => patch({ slug: e.target.value })}
                  placeholder="how-many-solar-panels"
                />
              </Field>
              <Field label="Excerpt (card blurb)">
                <Textarea
                  rows={2}
                  value={editing.excerpt ?? ""}
                  onChange={(e) => patch({ excerpt: e.target.value })}
                />
              </Field>
              <Field label="Body (one paragraph per line)">
                <Textarea
                  rows={7}
                  value={editing.body ?? ""}
                  onChange={(e) => patch({ body: e.target.value })}
                />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Author">
                  <Input
                    value={editing.author ?? ""}
                    onChange={(e) => patch({ author: e.target.value })}
                  />
                </Field>
                <Field label="Date">
                  <Input
                    type="date"
                    value={editing.date ?? ""}
                    onChange={(e) => patch({ date: e.target.value })}
                  />
                </Field>
                <Field label="Read time">
                  <Input
                    value={editing.readTime ?? ""}
                    onChange={(e) => patch({ readTime: e.target.value })}
                    placeholder="5 min read"
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.published ?? true}
                  onChange={(e) => patch({ published: e.target.checked })}
                  className="h-4 w-4 accent-[oklch(0.55_0.13_240)]"
                />
                Published
              </label>
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
