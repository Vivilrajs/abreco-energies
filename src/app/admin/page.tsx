import Link from "next/link";
import { Inbox, LayoutGrid, Clock, CheckCircle2 } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Submission from "@/lib/models/Submission";
import Solution from "@/lib/models/Solution";
import { ensureAllSeeded } from "@/lib/db-seed-helper";
import { getLocalSubmissions } from "@/lib/local-db";
import { PRODUCTS_CONTENT } from "@/lib/product-content";

export const dynamic = "force-dynamic";

async function getStats() {
  const localList = getLocalSubmissions();
  const localTotal = localList.length;
  const localNew = localList.filter((s) => s.status === "new").length;
  const localContacted = localList.filter((s) => s.status === "contacted").length;

  let dbTotal = 0;
  let dbNew = 0;
  let dbContacted = 0;
  let dbSolutions = 0;
  let dbRecent: any[] = [];

  try {
    await connectDB();
    await ensureAllSeeded();
    const [total, newCount, contacted, solutions, recent] =
      await Promise.all([
        Submission.countDocuments(),
        Submission.countDocuments({ status: "new" }),
        Submission.countDocuments({ status: "contacted" }),
        Solution.countDocuments(),
        Submission.find().sort({ createdAt: -1 }).limit(5).lean(),
      ]);
    dbTotal = total;
    dbNew = newCount;
    dbContacted = contacted;
    dbSolutions = solutions;
    dbRecent = recent;
  } catch (error) {
    console.warn("⚠️ Dashboard stats could not be loaded from MongoDB, using local fallback:", error);
    dbSolutions = PRODUCTS_CONTENT.length; // fallback
  }

  const mergedRecent = [...localList, ...dbRecent]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    total: dbTotal + localTotal,
    newCount: dbNew + localNew,
    contacted: dbContacted + localContacted,
    solutions: dbSolutions,
    recent: mergedRecent,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Total leads", value: stats.total, icon: Inbox },
    { label: "New", value: stats.newCount, icon: Clock },
    { label: "Contacted", value: stats.contacted, icon: CheckCircle2 },
    { label: "Solutions", value: stats.solutions, icon: LayoutGrid },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-neutral-500">
            Overview of leads and content.
          </p>
        </div>
        <Link
          href="/admin/submissions"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-strong"
        >
          View all leads
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-neutral-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">{c.label}</span>
              <c.icon size={18} className="text-brand" />
            </div>
            <div className="mt-3 text-3xl font-semibold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-6 py-4">
          <h2 className="font-semibold">Recent leads</h2>
        </div>
        {stats.recent.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-neutral-400">
            No submissions yet.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {stats.recent.map((r) => (
              <li
                key={String(r._id)}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <div className="font-medium">
                    {r.firstName || "Anonymous"}{" "}
                    <span className="text-neutral-400">· {r.email}</span>
                  </div>
                  <div className="text-sm text-neutral-500">
                    {r.product || "-"} · {r.state || "-"}
                  </div>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize text-neutral-600">
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
