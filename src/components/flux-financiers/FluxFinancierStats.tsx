// components/flux-financiers/FluxFinancierStats.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  RefreshCcw,
  CreditCard,
  Wallet,
  CalendarX2,
} from "lucide-react";

interface CompteStatistiques {
  id: number;
  abonnement: number;
  demande_de_messe: number;
  denier_de_culte: number;
  quete: number;
  don: number;
}

interface FluxFinancierStatsProps {
  stats: CompteStatistiques;
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
}: StatsCardProps) => {
  return (
    <Card className="relative overflow-hidden border-0 bg-white transition-shadow duration-200">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`h-8 w-8 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
          <h3 className="text-xs font-medium text-slate-600 truncate">{title}</h3>
        </div>
        
        <div className="text-sm font-bold text-slate-900 truncate">{value}</div>
      </CardContent>
    </Card>
  );
};

export default function FluxFinancierStats({ stats }: FluxFinancierStatsProps) {
  const formatMontant = (montant: number): string => {
    if (isNaN(montant) || montant === null || montant === undefined) {
      return "0 F CFA";
    }
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "XOF",
      useGrouping: true,
      minimumFractionDigits: 0,
    }).format(montant);
    const withoutCurrency = formatted
      .replace(/XOF\s?/, "")
      .replace(/F\s?CFA\s?/, "")
      .replace(/CFA\s?/, "")
      .trim();
    return `${withoutCurrency} F CFA`;
  };

  const totalMontant =
    stats.abonnement +
    stats.demande_de_messe +
    stats.denier_de_culte +
    stats.quete +
    stats.don;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 mb-4">
      <StatsCard
        title="Total"
        value={formatMontant(totalMontant)}
        icon={<DollarSign />}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />

      <StatsCard
        title="Abonnement"
        value={formatMontant(stats.abonnement)}
        icon={<RefreshCcw />}
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />

      <StatsCard
        title="Demande Messe"
        value={formatMontant(stats.demande_de_messe)}
        icon={<CalendarX2 />}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />

      <StatsCard
        title="Denier Culte"
        value={formatMontant(stats.denier_de_culte)}
        icon={<Wallet />}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
      />

      <StatsCard
        title="Dons"
        value={formatMontant(stats.don)}
        icon={<CreditCard />}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
      />

      <StatsCard
        title="Fnc"
        value="0 F CFA"
        icon={<CreditCard />}
        iconBgColor="bg-indigo-50"
        iconColor="text-indigo-600"
      />

      <StatsCard
        title="Quête"
        value={formatMontant(stats.quete)}
        icon={<CreditCard />}
        iconBgColor="bg-rose-50"
        iconColor="text-rose-600"
      />
    </div>
  );
}