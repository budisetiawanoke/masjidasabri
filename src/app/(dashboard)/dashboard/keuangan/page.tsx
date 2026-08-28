import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { can, ForbiddenError } from "@/lib/rbac";
import { listCategories, listTransactions, getBalanceSummary } from "@/server/finance/service";
import { formatRupiah } from "@/lib/format";
import { TransactionForm } from "@/app/(dashboard)/dashboard/keuangan/TransactionForm";
import { CategoryForm } from "@/app/(dashboard)/dashboard/keuangan/CategoryForm";
import { TransactionList } from "@/app/(dashboard)/dashboard/keuangan/TransactionList";

export const metadata: Metadata = { title: "Keuangan" };

export default async function KeuanganPage() {
  const session = await auth();
  const role = session!.user.role;
  if (!can(role, "VIEW_FINANCE")) throw new ForbiddenError("Anda tidak memiliki izin untuk mengakses modul keuangan.");

  const [categories, transactions, balance] = await Promise.all([
    listCategories(),
    listTransactions({ take: 100 }),
    getBalanceSummary(),
  ]);

  const canRecord = can(role, "RECORD_TRANSACTION");
  const canManageCategories = can(role, "MANAGE_CATEGORIES");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-brand-green-900">Keuangan</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Catat, sahkan, dan pantau seluruh arus kas Yayasan Masjid ASABRI.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-xs uppercase tracking-wide text-foreground/70">Total Masuk</p>
            <p className="mt-1 font-display text-xl font-semibold text-brand-green-700">{formatRupiah(balance.totalMasuk)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs uppercase tracking-wide text-foreground/70">Total Keluar</p>
            <p className="mt-1 font-display text-xl font-semibold text-brand-terracotta-700">{formatRupiah(balance.totalKeluar)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs uppercase tracking-wide text-foreground/70">Saldo</p>
            <p className="mt-1 font-display text-xl font-semibold text-brand-green-900">{formatRupiah(balance.saldo)}</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Transaksi</CardTitle>
            </CardHeader>
            <CardBody>
              <TransactionList
                transactions={transactions.map((t) => ({ ...t, date: t.date.toISOString() }))}
                role={role}
              />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          {canRecord && (
            <Card>
              <CardHeader>
                <CardTitle>Catat Transaksi Baru</CardTitle>
              </CardHeader>
              <CardBody>
                <TransactionForm categories={categories} />
              </CardBody>
            </Card>
          )}

          {canManageCategories && (
            <Card>
              <CardHeader>
                <CardTitle>Kategori Transaksi</CardTitle>
              </CardHeader>
              <CardBody className="space-y-4">
                <CategoryForm />
                <ul className="divide-y divide-border-subtle text-sm">
                  {categories.map((c) => (
                    <li key={c.id} className="flex justify-between py-1.5">
                      <span>{c.name}</span>
                      <span className="text-foreground/70">{c.kind === "MASUK" ? "Masuk" : "Keluar"}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
