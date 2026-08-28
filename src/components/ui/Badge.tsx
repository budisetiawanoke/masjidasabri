import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

const tones = {
  gold: "bg-brand-gold-100 text-brand-green-900 border-brand-gold-500/40",
  green: "bg-brand-green-100 text-brand-green-900 border-brand-green-700/30",
  terracotta: "bg-brand-terracotta-100 text-brand-terracotta-700 border-brand-terracotta-500/30",
  neutral: "bg-black/5 text-foreground border-black/10",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
