// components/flux-financiers/FluxFinancierStats.tsx
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

  const statsCards = [
    {
      title: "Total",
      value: formatMontant(totalMontant),
      icon: DollarSign,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Abonnement",
      value: formatMontant(stats.abonnement),
      icon: RefreshCcw,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Demande Messe",
      value: formatMontant(stats.demande_de_messe),
      icon: CalendarX2,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Denier Culte",
      value: formatMontant(stats.denier_de_culte),
      icon: Wallet,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Quête",
      value: formatMontant(stats.quete),
      icon: CreditCard,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {statsCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <h3 className="text-xl font-bold">{stat.value}</h3>
                </div>
                <div
                  className={`h-10 w-10 rounded-full ${stat.bgColor} flex items-center justify-center`}
                >
                  <IconComponent className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
