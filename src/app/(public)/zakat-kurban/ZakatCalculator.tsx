"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Field";
import { calculateZakatMaal, calculateZakatFitrah } from "@/lib/zakat-calc";
import { formatRupiah } from "@/lib/format";
import { Coins, HeartHandshake, CheckCircle2, AlertCircle } from "lucide-react";

export function ZakatCalculator() {
  const [goldPrice, setGoldPrice] = useState(1500000);
  const [asset, setAsset] = useState(0);
  const [ricePrice, setRicePrice] = useState(15000);
  const [familyCount, setFamilyCount] = useState(1);

  const maal = useMemo(() => calculateZakatMaal(asset, goldPrice), [asset, goldPrice]);
  const fitrah = useMemo(() => calculateZakatFitrah(familyCount, ricePrice), [familyCount, ricePrice]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-t-4 border-t-brand-green-700 shadow-md">
        <CardHeader className="bg-brand-green-900/5">
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-brand-green-700" />
            Kalkulator Zakat Maal
          </CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <Label htmlFor="asset" className="font-semibold text-brand-green-900">
              Total harta tersimpan &gt; 1 tahun (Rp)
            </Label>
            <Input
              id="asset"
              type="number"
              min={0}
              value={asset}
              onChange={(e) => setAsset(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="goldPrice" className="font-semibold text-brand-green-900">
              Harga emas per gram (Rp)
            </Label>
            <Input
              id="goldPrice"
              type="number"
              min={0}
              value={goldPrice}
              onChange={(e) => setGoldPrice(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div className={`rounded-xl p-4 text-sm border transition-all duration-200 ${
            maal.wajibZakat 
              ? "bg-brand-green-100/90 border-brand-green-700/40 text-brand-green-950 shadow-xs" 
              : "bg-brand-cream-50 border-border-subtle text-foreground/80"
          }`}>
            <p className="flex justify-between items-center text-xs font-semibold">
              <span>Nisab Standar (85gr Emas):</span>
              <span className="font-mono text-sm text-brand-green-900 font-bold">{formatRupiah(maal.nisab)}</span>
            </p>
            <div className="mt-2 pt-2 border-t border-brand-green-900/10 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Status:</span>
              <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-0.5 rounded-full ${
                maal.wajibZakat 
                  ? "bg-brand-green-900 text-white" 
                  : "bg-black/5 text-foreground/70"
              }`}>
                {maal.wajibZakat ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-gold-400" />
                    Wajib zakat
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5" />
                    Belum mencapai nisab
                  </>
                )}
              </span>
            </div>
            {maal.wajibZakat && (
              <div className="mt-3 p-3 rounded-lg bg-white border border-brand-green-700/30 flex justify-between items-center">
                <span className="font-bold text-xs text-brand-green-900">Kewajiban Zakat (2.5%):</span>
                <span className="font-display text-lg font-extrabold text-brand-green-900">
                  {formatRupiah(maal.zakatAmount)}
                </span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <Card className="border-t-4 border-t-brand-gold-500 shadow-md">
        <CardHeader className="bg-brand-gold-100/40">
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-brand-gold-600" />
            Kalkulator Zakat Fitrah
          </CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <Label htmlFor="familyCount" className="font-semibold text-brand-green-900">
              Jumlah jiwa
            </Label>
            <Input
              id="familyCount"
              type="number"
              min={1}
              value={familyCount}
              onChange={(e) => setFamilyCount(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ricePrice" className="font-semibold text-brand-green-900">
              Harga beras per kg (Rp)
            </Label>
            <Input
              id="ricePrice"
              type="number"
              min={0}
              value={ricePrice}
              onChange={(e) => setRicePrice(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div className="rounded-xl bg-gradient-to-br from-brand-gold-100/80 to-brand-gold-50 border border-brand-gold-500/40 p-4 text-sm space-y-2 shadow-xs">
            <div className="flex justify-between items-center text-xs font-semibold text-brand-green-900">
              <span>Setara Beras (2.5kg / jiwa):</span>
              <span className="font-bold font-mono text-sm">{fitrah.riceKg} kg</span>
            </div>
            <div className="pt-2 border-t border-brand-gold-500/20 flex justify-between items-center">
              <span className="font-bold text-xs text-brand-green-900">Jika diuangkan:</span>
              <span className="font-display text-lg font-extrabold text-brand-green-900">
                {formatRupiah(fitrah.moneyEquivalent)}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
