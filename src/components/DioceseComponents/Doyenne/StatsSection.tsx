/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Building2, User, Church } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { Doyenne } from "@/services/Doyennes";

interface StatsSectionProps {
  doyennes: Doyenne[];
}

export const StatsSection = ({ doyennes }: StatsSectionProps) => {
  const getStatistics = () => {
    const totalDoyennes = doyennes.length;
    const avecDoyen = doyennes.filter((d) => d.doyen_id).length;
    const siegesActifs = doyennes.filter((d) => d.siege_id).length;

    return {
      totalDoyennes,
      avecDoyen,
      siegesActifs,
    };
  };

  const stats = getStatistics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="Total Doyennés"
        value={stats.totalDoyennes}
        icon={<Building2 size={24} />}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />

      <StatsCard
        title="Avec Doyen Assigné"
        value={stats.avecDoyen}
        icon={<User size={24} />}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />

      <StatsCard
        title="Sièges Actifs"
        value={stats.siegesActifs}
        icon={<Church size={24} />}
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />
    </div>
  );
};