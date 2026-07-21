"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Submission = {
  _id: string;
  firstName?: string;
  email: string;
  phone: string;
  state?: string;
  postcode?: string;
  product?: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-brand/15 text-brand border-brand/30",
  contacted: "bg-amber-100 text-amber-700 border-amber-200",
  closed: "bg-neutral-200 text-neutral-600 border-neutral-300",
};

export default function SubmissionsPage() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/submissions");
    if (res.ok) {
      const data = await res.json();
      setRows(data.submissions);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter]
  );

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setRows((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: status as Submission["status"] } : r
        )
      );
      toast.success("Status updated");
    } else {
      toast.error("Update failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this submission? This cannot be undone.")) return;
    const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRows((prev) => prev.filter((r) => r._id !== id));
      toast.success("Deleted");
    } else {
      toast.error("Delete failed");
    }
  }

  function exportCsv() {
    const headers = [
      "First name",
      "Email",
      "Phone",
      "State",
      "Postcode",
      "Product",
      "Status",
      "Date",
    ];
    const lines = filtered.map((r) =>
      [
        r.firstName ?? "",
        r.email,
        r.phone,
        r.state ?? "",
        r.postcode ?? "",
        r.product ?? "",
        r.status,
        new Date(r.createdAt).toISOString(),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `abreco-leads-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Submissions</h1>
          <p className="text-sm text-neutral-500">
            {rows.length} total lead{rows.length === 1 ? "" : "s"}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={(v) => setFilter(v ?? "all")}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={exportCsv}
            className="gap-2 bg-white"
          >
            <Download size={16} />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-neutral-400">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-neutral-400">
                  No submissions.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r._id} className="hover:bg-neutral-50">
                  <td className="px-5 py-3 font-medium">
                    {r.firstName || "-"}
                  </td>
                  <td className="px-5 py-3">
                    <div>{r.email}</div>
                    <div className="text-neutral-400">{r.phone}</div>
                  </td>
                  <td className="px-5 py-3">{r.product || "-"}</td>
                  <td className="px-5 py-3">
                    {r.state || "-"}
                    {r.postcode ? ` · ${r.postcode}` : ""}
                  </td>
                  <td className="px-5 py-3 text-neutral-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      variant="outline"
                      className={`capitalize ${STATUS_STYLES[r.status]}`}
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Select
                        value={r.status}
                        onValueChange={(v) => v && updateStatus(r._id, v)}
                      >
                        <SelectTrigger className="h-8 w-32 bg-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(r._id)}
                        className="h-8 w-8 text-neutral-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
