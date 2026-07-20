"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { FaqDTO } from "@/lib/data";

export function FaqAccordion({ faqs }: { faqs: FaqDTO[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?._id ?? null);

  return (
    <div className="divide-y divide-foreground/10 overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/[0.03]">
      {faqs.map((f) => {
        const isOpen = open === f._id;
        return (
          <div key={f._id}>
            <button
              onClick={() => setOpen(isOpen ? null : f._id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-semibold text-foreground">
                {f.question}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                  isOpen ? "bg-brand text-white" : "bg-brand/10 text-brand"
                }`}
              >
                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 leading-relaxed text-foreground/60">
                  {f.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
