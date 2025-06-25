/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/unions/UnionStats.tsx
// import { Calendar } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { UnionCounts } from "@/types/union";

// interface UnionStatsProps {
//   counts: UnionCounts;
// }

// export default function UnionStats({ counts }: UnionStatsProps) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       <Card className="p-4 flex flex-col items-center justify-center">
//         <p className="text-sm font-medium text-slate-500">En attente</p>
//         <p className="text-2xl font-bold">{counts.enAttente}</p>
//       </Card>

//       <Card className="p-4 flex flex-col items-center justify-center">
//         <p className="text-sm font-medium text-slate-500">Terminés</p>
//         <p className="text-2xl font-bold">{counts.rejete}</p>
//       </Card>
//       <Card className="p-4 flex flex-col items-center justify-center">
//         <p className="text-sm font-medium text-slate-500">Validé</p>
//         <p className="text-2xl font-bold">{counts.confirmes}</p>
//       </Card>
//     </div>
//   );
// }

import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, TrendingUp, TrendingDown } from "lucide-react";
import { UnionCounts } from "@/types/union";

interface UnionStatsProps {
  counts: UnionCounts;
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  trend,
}: StatsCardProps) => {
  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-y-1">
        <div className="flex items-center mb-4">
          <div
            className={`h-12 w-12 rounded-xl ${iconBgColor} flex items-center justify-center`}
          >
            <span className={`text-2xl ${iconColor}`}>{icon}</span>
          </div>
          &nbsp;&nbsp;
          <h3 className="text-sm font-medium text-slate-600 mb-2">{title}</h3>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold text-slate-900">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function UnionStats({ counts }: UnionStatsProps) {
  const total = counts.enAttente + counts.confirmes + counts.rejete;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Unions"
        value={total}
        icon="💍"
        iconBgColor="bg-pink-50"
        iconColor="text-pink-600"
      />

      <StatsCard
        title="En Attente"
        value={counts.enAttente}
        icon="⏳"
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
      />

      <StatsCard
        title="Validées"
        value={counts.confirmes}
        icon="💒"
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />

      <StatsCard
        title="Rejetées"
        value={counts.rejete}
        icon="💔"
        iconBgColor="bg-red-50"
        iconColor="text-red-600"
      />
    </div>
  );
}
