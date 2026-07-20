"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATES = ["VIC", "NSW", "QLD", "SA"];
const PRODUCTS = ["Heat Pump", "Air Conditioner", "Solar System", "Battery"];

export function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("");
  const [product, setProduct] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      firstName: String(data.get("firstName") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      postcode: String(data.get("postcode") || ""),
      state: state || undefined,
      product: product || undefined,
    };

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Thanks! We'll be in touch shortly.");
      form.reset();
      setState("");
      setProduct("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="firstName" className="text-white/70">
          First name
        </Label>
        <Input
          id="firstName"
          name="firstName"
          placeholder="Jane"
          className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-white/70">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jane@email.com"
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-white/70">
            Phone *
          </Label>
          <Input
            id="phone"
            name="phone"
            required
            placeholder="0400 000 000"
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-white/70">State</Label>
          <Select value={state} onValueChange={(v) => setState(v ?? "")}>
            <SelectTrigger className="w-full border-white/15 bg-white/5 text-white">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="postcode" className="text-white/70">
            Postcode
          </Label>
          <Input
            id="postcode"
            name="postcode"
            placeholder="3000"
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-white/70">Product of interest</Label>
        <Select value={product} onValueChange={(v) => setProduct(v ?? "")}>
          <SelectTrigger className="w-full border-white/15 bg-white/5 text-white">
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCTS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="w-full bg-brand text-white hover:bg-brand-strong"
      >
        {loading ? "Sending…" : "Book your free consultation"}
      </Button>
      <p className="text-center text-xs text-white/40">
        No obligation. We respond within one business day.
      </p>
    </form>
  );
}
