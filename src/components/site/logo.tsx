import Image from "next/image";

/** Brand lockup — the abreco Energies wordmark (public/logo.jpeg). */
export function Logo({
  className = "",
  height = 36,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <Image
      src="/logo.jpeg"
      alt="Abreco Energies"
      width={Math.round((height * 1586) / 992)}
      height={height}
      priority
      className={`w-auto rounded-md ${className}`}
      style={{ height }}
    />
  );
}
