"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Faq = {
  _id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
};

type Draft = Partial<Faq>;

const EMPTY: Draft = {
  question: "",
  answer: "",
  order: 0,
  published: true,
};

export default function FaqAdminPage() {
  const [rows, setRows] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/faqs");
    if (res.ok) setRows((await res.json()).faqs);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    if (!editing.question || !editing.answer) {
      toast.error("Question and answer are required.");
      return;
    }
    const isNew = !editing._id;
    const url = isNew ? "/api/faqs" : `/api/faqs/${editing._id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: editing.question,
        answer: editing.answer,
        order: Number(editing.order) || 0,
        published: editing.published ?? true,
      }),
    });
    if (res.ok) {
      toast.success(isNew ? "FAQ added" : "FAQ updated");
      setEditing(null);
      load();
    } else {
      toast.error("Save failed.");
    }
  }

  async function togglePublish(f: Faq) {
    const res = await fetch(`/api/faqs/${f._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !f.published }),
    });
    if (res.ok)
      setRows((prev) =>
        prev.map((r) => (r._id === f._id ? { ...r, published: !f.published } : r))
      );
  }

  async function remove(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
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
          <h1 className="text-2xl font-semibold">FAQ</h1>
          <p className="text-sm text-neutral-500">
            Questions &amp; answers shown on the public /faq page.
          </p>
        </div>
        <Button
          onClick={() => setEditing({ ...EMPTY, order: rows.length + 1 })}
          className="gap-2 bg-brand text-white hover:bg-brand-strong"
        >
          <Plus size={16} /> Add FAQ
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-neutral-400">Loading…</p>
        ) : (
          rows.map((f) => (
            <div
              key={f._id}
              className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{f.question}</h3>
                  {!f.published && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                  {f.answer}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditing({ ...f })}
                  className="h-8 w-8 text-neutral-600"
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePublish(f)}
                  className="h-8 w-8 text-neutral-600"
                >
                  {f.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(f._id)}
                  className="h-8 w-8 text-neutral-400 hover:text-red-600"
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
                {editing._id ? "Edit FAQ" : "New FAQ"}
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
              <Field label="Question">
                <Input
                  value={editing.question ?? ""}
                  onChange={(e) => patch({ question: e.target.value })}
                  placeholder="How long does installation take?"
                />
              </Field>
              <Field label="Answer">
                <Textarea
                  rows={5}
                  value={editing.answer ?? ""}
                  onChange={(e) => patch({ answer: e.target.value })}
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
