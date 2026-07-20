import Image from "next/image";

/** Brand lockup — the abreco Energies wordmark (public/logo1.png, transparent). */
export function Logo({
  className = "",
  height = 36,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <Image
      src="/logo1.png"
      alt="Abreco Energies"
      width={Math.round((height * 1080) / 675)}
      height={height}
      priority
      className={`w-auto ${className}`}
      style={{ height }}
    />
  );
}
