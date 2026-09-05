"use client";

import { useState, type ReactNode } from "react";
import { HelpCircle, BookOpen, ClipboardList } from "lucide-react";

type TabId = "faq" | "panduan" | "playbook";

const TABS: { id: TabId; label: string; icon: typeof HelpCircle }[] = [
  { id: "faq", label: "Pertanyaan Umum", icon: HelpCircle },
  { id: "panduan", label: "Buku Panduan", icon: BookOpen },
  { id: "playbook", label: "Playbook Pengurus", icon: ClipboardList },
];

/**
 * Tab sederhana untuk halaman /faq — memisahkan tiga konten panjang (FAQ,
 * Buku Panduan, Playbook) supaya jamaah tidak perlu scroll satu halaman
 * raksasa untuk cari salah satunya. State tab HANYA di client (tidak
 * memengaruhi URL) — cukup untuk kebutuhan halaman statis seperti ini.
 */
export function FaqTabs({ faq, panduan, playbook }: { faq: ReactNode; panduan: ReactNode; playbook: ReactNode }) {
  const [active, setActive] = useState<TabId>("faq");
  const content: Record<TabId, ReactNode> = { faq, panduan, playbook };

  return (
    <div>
      <div role="tablist" aria-label="Bagian FAQ" className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-brand-green-900 text-white shadow-sm"
                  : "bg-surface text-brand-green-900/80 border border-border-subtle hover:bg-brand-cream-50"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {tab.label}
            </button>
          );
        })}
      </div>
      {content[active]}
    </div>
  );
}
