import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

const controlClass =
  "w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-foreground/70 focus:border-brand-green-700 focus:outline-none focus:ring-2 focus:ring-brand-green-700/20 disabled:bg-black/5";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-foreground/80", className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlClass, "min-h-28", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(controlClass, className)} {...props} />;
}

export function FieldGroup({ label, htmlFor, error, children, hint }: { label: string; htmlFor: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-foreground/70">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-brand-terracotta-700">{error}</p>}
    </div>
  );
}
