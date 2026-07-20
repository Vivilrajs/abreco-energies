export function Eyebrow({
  children,
  className = "",
  tone = "brand",
}: {
  children: React.ReactNode;
  className?: string;
  /** "onMedia" = white, high-contrast over photos/video. */
  tone?: "brand" | "onMedia";
}) {
  const styles =
    tone === "onMedia"
      ? "border-white/40 bg-black/30 text-white"
      : "border-brand/30 bg-brand/10 text-brand";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${styles} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${tone === "onMedia" ? "bg-white" : "bg-brand"}`}
      />
      {children}
    </span>
  );
}
