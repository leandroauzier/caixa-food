import Image from "next/image";

export function ProductImage({
  src,
  alt,
  className,
  priority = false,
  fit = "cover",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[22px] bg-gradient-to-br from-white/70 to-white/30",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 320px"
        className={fit === "contain" ? "object-contain p-1.5" : "object-cover"}
      />
    </div>
  );
}
