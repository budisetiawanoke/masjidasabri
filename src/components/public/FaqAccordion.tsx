"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/faq-content";

/** Kelompokkan FAQ_ITEMS per kategori sambil mempertahankan urutan aslinya. */
function groupByCategory(items: FaqItem[]) {
  const groups: { category: string; items: FaqItem[] }[] = [];
  for (const item of items) {
    const group = groups.find((g) => g.category === item.category);
    if (group) group.items.push(item);
    else groups.push({ category: item.category, items: [item] });
  }
  return groups;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const groups = groupByCategory(items);
  // Pakai "kategori::pertanyaan" sebagai key unik supaya buka/tutup tiap
  // butir independen walau ada pertanyaan dengan teks mirip di kategori beda.
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.category}>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-gold-700">{group.category}</h3>
          <div className="divide-y divide-border-subtle rounded-xl border border-border-subtle bg-surface">
            {group.items.map((item) => {
              const key = `${item.category}::${item.question}`;
              const isOpen = openKey === key;
              return (
                <div key={key}>
                  <button
                    type="button"
                    onClick={() => setOpenKey(isOpen ? null : key)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-brand-green-900 hover:bg-brand-cream-50/60 transition-colors"
                  >
                    {item.question}
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-foreground/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-4 pb-4 text-sm leading-relaxed text-foreground/75">{item.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
