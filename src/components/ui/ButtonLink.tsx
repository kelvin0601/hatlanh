import type { ComponentProps } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";

type ButtonVariant = "primary" | "light" | "outline-light" | "outline-dark";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-forest text-white ring-1 ring-forest/10 shadow-[0_8px_24px_rgba(24,53,34,0.24)] hover:bg-forest-hover hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(24,53,34,0.32)]",
  light:
    "bg-white text-forest ring-1 ring-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.24)] hover:bg-cream hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.3)]",
  "outline-light":
    "border border-white/65 bg-ink/35 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md hover:border-white hover:bg-white hover:text-forest hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.28)]",
  "outline-dark":
    "border border-forest/35 bg-white/55 text-forest shadow-[0_6px_18px_rgba(33,55,40,0.08)] backdrop-blur-sm hover:border-forest hover:bg-forest hover:text-white hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(33,55,40,0.2)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-5 text-[13px]",
  md: "h-12 px-6 text-[15px]",
  lg: "h-[52px] px-7 text-[15px]",
};

const arrowClasses: Record<ButtonVariant, string> = {
  primary: "bg-white/15 group-hover:bg-white group-hover:text-forest",
  light: "bg-forest/10 group-hover:bg-forest group-hover:text-white",
  "outline-light": "bg-white/15 group-hover:bg-forest group-hover:text-white",
  "outline-dark": "bg-forest/10 group-hover:bg-white group-hover:text-forest",
};

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={clsx(
        "group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all duration-300 ease-[var(--ease-organic)] active:translate-y-0 active:scale-[0.97] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wheat focus-visible:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-[-60%] left-[-35%] w-[24%] -rotate-12 bg-gradient-to-r from-transparent via-white/55 to-transparent opacity-0 blur-[1px] transition-all duration-700 group-hover:left-[115%] group-hover:opacity-100"
      />
      <span className="relative z-10">{children}</span>
      {withArrow && (
        <span
          className={clsx(
            "relative z-10 grid h-6 w-6 place-items-center rounded-full transition-all duration-300 group-hover:translate-x-1 group-hover:rotate-[-8deg]",
            arrowClasses[variant],
          )}
        >
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      )}
    </Link>
  );
}
