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
    <Card className="relative overflow-hidden border-0 shadow-sm bg-white transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`h-12 w-12 rounded-xl ${iconBgColor} flex items-center justify-center flex-shrink-0`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        </div>

        <div className="text-xl font-bold text-slate-900">{value}</div>
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
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
      <StatsCard
        title="Total"
        value={formatMontant(totalMontant)}
        icon={<DollarSign className="h-6 w-6" />}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />

      <StatsCard
        title="Abonnement"
        value={formatMontant(stats.abonnement)}
        icon={<RefreshCcw className="h-6 w-6" />}
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />

      <StatsCard
        title="Demande Messe"
        value={formatMontant(stats.demande_de_messe)}
        icon={<CalendarX2 className="h-6 w-6" />}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />

      <StatsCard
        title="Denier Culte"
        value={formatMontant(stats.denier_de_culte)}
        icon={<Wallet className="h-6 w-6" />}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
      />

      <StatsCard
        title="Quête"
        value={formatMontant(stats.quete)}
        icon={<CreditCard className="h-6 w-6" />}
        iconBgColor="bg-red-50"
        iconColor="text-red-600"
      />
    </div>
  );
}
