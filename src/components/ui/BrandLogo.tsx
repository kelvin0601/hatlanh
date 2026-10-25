import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  variant?: "default" | "footer";
};

export function BrandLogo({ className = "h-auto w-full", priority = false, variant = "default" }: BrandLogoProps) {
  const isFooterLogo = variant === "footer";

  return (
    <Image
      src={isFooterLogo ? "/images/brand/an-vi-logo-footer.webp" : "/images/brand/an-vi-logo.webp"}
      alt="An Vị - Ăn lành, vị an"
      width={isFooterLogo ? 2048 : 1304}
      height={isFooterLogo ? 684 : 512}
      className={className}
      priority={priority}
    />
  );
}
