"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Field";
import { calculateZakatMaal, calculateZakatFitrah } from "@/lib/zakat-calc";
import { formatRupiah } from "@/lib/format";

export function ZakatCalculator() {
  const [goldPrice, setGoldPrice] = useState(1500000);
  const [asset, setAsset] = useState(0);
  const [ricePrice, setRicePrice] = useState(15000);
  const [familyCount, setFamilyCount] = useState(1);

  const maal = useMemo(() => calculateZakatMaal(asset, goldPrice), [asset, goldPrice]);
  const fitrah = useMemo(() => calculateZakatFitrah(familyCount, ricePrice), [familyCount, ricePrice]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Kalkulator Zakat Maal</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <Label htmlFor="asset">Total harta tersimpan &gt; 1 tahun (Rp)</Label>
            <Input id="asset" type="number" min={0} value={asset} onChange={(e) => setAsset(Number(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="goldPrice">Harga emas per gram (Rp)</Label>
            <Input id="goldPrice" type="number" min={0} value={goldPrice} onChange={(e) => setGoldPrice(Number(e.target.value))} />
          </div>
          <div className="rounded-lg bg-brand-green-100 p-4 text-sm">
            <p>Nisab (85gr emas): <strong>{formatRupiah(maal.nisab)}</strong></p>
            <p className="mt-1">
              Status: <strong>{maal.wajibZakat ? "Wajib zakat" : "Belum mencapai nisab"}</strong>
            </p>
            {maal.wajibZakat && (
              <p className="mt-1">
                Zakat (2.5%): <strong className="text-brand-green-900">{formatRupiah(maal.zakatAmount)}</strong>
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kalkulator Zakat Fitrah</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <Label htmlFor="familyCount">Jumlah jiwa</Label>
            <Input id="familyCount" type="number" min={1} value={familyCount} onChange={(e) => setFamilyCount(Number(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="ricePrice">Harga beras per kg (Rp)</Label>
            <Input id="ricePrice" type="number" min={0} value={ricePrice} onChange={(e) => setRicePrice(Number(e.target.value))} />
          </div>
          <div className="rounded-lg bg-brand-gold-100 p-4 text-sm">
            <p>Setara beras: <strong>{fitrah.riceKg} kg</strong></p>
            <p className="mt-1">
              Jika diuangkan: <strong className="text-brand-green-900">{formatRupiah(fitrah.moneyEquivalent)}</strong>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
