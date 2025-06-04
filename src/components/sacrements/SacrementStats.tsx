// components/sacrements/SacrementStats.tsx
import { Card } from "@/components/ui/card";

interface SacrementStatsProps {
  counts: {
    baptemes: number;
    firstcommunions: number;
    professiondefoi: number;
    sacrementdemalade: number;
  };
}

export default function SacrementStats({ counts }: SacrementStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Baptêmes</p>
        <p className="text-2xl font-bold">{counts.baptemes}</p>
      </Card>
      <Card className="p-4 flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Première Communion</p>
        <p className="text-2xl font-bold">{counts.firstcommunions}</p>
      </Card>
      <Card className="p-4 flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Profession de Foi</p>
        <p className="text-2xl font-bold">{counts.professiondefoi}</p>
      </Card>
      <Card className="p-4 flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Sacrement de Malade
        </p>
        <p className="text-2xl font-bold">{counts.sacrementdemalade}</p>
      </Card>
    </div>
  );
}
