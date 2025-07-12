/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Church, User, Building2 } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { Paroisse } from "@/services/ParoiseofDiocese";

interface StatsSectionProps {
  paroisses: Paroisse[];
}

export const StatsSection = ({ paroisses }: StatsSectionProps) => {
  const getStatistics = () => {
    const totalParoisses = paroisses.length;
    const quasiParoisses = paroisses.filter((p) =>
      p.statut?.toLowerCase().includes("quasi")
    ).length;
    const paroissesSansQuasi = paroisses.filter((p) =>
      !p.statut?.toLowerCase().includes("quasi")
    ).length;

    return {
      totalParoisses,
      quasiParoisses,
      paroissesSansQuasi,
    };
  };

  const stats = getStatistics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Paroisses"
        value={stats.totalParoisses}
        icon={<Church size={24} />}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />

      <StatsCard
        title="Paroisses"
        value={stats.paroissesSansQuasi}
        icon={<User size={24} />}
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />

      <StatsCard
        title="Quasi-Paroisses"
        value={stats.quasiParoisses}
        icon={<Building2 size={24} />}
        iconBgColor="bg-orange-50"
        iconColor="text-orange-600"
      />
    </div>
  );
};