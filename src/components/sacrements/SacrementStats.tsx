// // components/sacrements/SacrementStats.tsx
// import { Card } from "@/components/ui/card";

// interface SacrementStatsProps {
//   counts: {
//     baptemes: number;
//     firstcommunions: number;
//     professiondefoi: number;
//     sacrementdemalade: number;
//   };
// }

// export default function SacrementStats({ counts }: SacrementStatsProps) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       <Card className="p-4 flex flex-col items-center justify-center">
//         <p className="text-sm font-medium text-slate-500">Baptêmes</p>
//         <p className="text-2xl font-bold">{counts.baptemes}</p>
//       </Card>
//       <Card className="p-4 flex flex-col items-center justify-center">
//         <p className="text-sm font-medium text-slate-500">Première Communion</p>
//         <p className="text-2xl font-bold">{counts.firstcommunions}</p>
//       </Card>
//       <Card className="p-4 flex flex-col items-center justify-center">
//         <p className="text-sm font-medium text-slate-500">Profession de Foi</p>
//         <p className="text-2xl font-bold">{counts.professiondefoi}</p>
//       </Card>
//       <Card className="p-4 flex flex-col items-center justify-center">
//         <p className="text-sm font-medium text-slate-500">
//           Sacrement de Malade
//         </p>
//         <p className="text-2xl font-bold">{counts.sacrementdemalade}</p>
//       </Card>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-unused-vars */

import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, TrendingUp, TrendingDown } from "lucide-react";

interface SacrementStatsProps {
  counts: {
    baptemes: number;
    firstcommunions: number;
    professiondefoi: number;
    sacrementdemalade: number;
  };
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
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
    <Card className="relative overflow-hidden border-0 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`h-12 w-12 rounded-xl ${iconBgColor} flex items-center justify-center`}
          >
            <span className={`text-2xl ${iconColor}`}>{icon}</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">{title}</h3>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold text-slate-900">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function SacrementStats({ counts }: SacrementStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Baptêmes"
        value={counts.baptemes}
        icon="🕊️"
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />

      <StatsCard
        title="Première Communion"
        value={counts.firstcommunions}
        icon="🍞"
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
      />

      <StatsCard
        title="Profession de Foi"
        value={counts.professiondefoi}
        icon="📿"
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />

      <StatsCard
        title="Sacrement de Malade"
        value={counts.sacrementdemalade}
        icon="🙏"
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />
    </div>
  );
}
