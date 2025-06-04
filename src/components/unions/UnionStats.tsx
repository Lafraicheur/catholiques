/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/unions/UnionStats.tsx
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UnionCounts } from "@/types/union";

interface UnionStatsProps {
  counts: UnionCounts;
}

export default function UnionStats({ counts }: UnionStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4 flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-slate-500">En attente</p>
        <p className="text-2xl font-bold">{counts.enAttente}</p>
      </Card>

      <Card className="p-4 flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Terminés</p>
        <p className="text-2xl font-bold">{counts.rejete}</p>
      </Card>
      <Card className="p-4 flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Validé</p>
        <p className="text-2xl font-bold">{counts.confirmes}</p>
      </Card>
    </div>
  );
}
