import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2.5";

const variants = {
  primary: "bg-brand-green-900 text-white hover:bg-brand-green-700",
  gold: "bg-brand-gold-500 text-brand-green-900 hover:bg-brand-gold-300",
  outline: "border border-brand-green-900/30 text-brand-green-900 hover:bg-brand-green-100",
  ghost: "text-brand-green-900 hover:bg-brand-green-100",
  danger: "bg-brand-terracotta-500 text-white hover:opacity-90",
};

type Variant = keyof typeof variants;

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function LinkButton({
  className,
  variant = "primary",
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; href: string }) {
  return <Link href={href} className={cn(base, variants[variant], className)} {...props} />;
}
