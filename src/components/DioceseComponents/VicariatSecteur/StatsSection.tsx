import { Building2, Crown, Church } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { VicariatSecteur } from "@/services/VicariatSecteur";

interface StatsSectionProps {
  vicariats: VicariatSecteur[];
}

export const StatsSection = ({ vicariats }: StatsSectionProps) => {
  const getStatistics = () => {
    const totalVicariats = vicariats.length;
    const avecVicaireEpiscopal = vicariats.filter((v) => v.vicaire_episcopal_id).length;
    const siegesActifs = vicariats.filter((v) => v.siege_id).length;

    return {
      totalVicariats,
      avecVicaireEpiscopal,
      siegesActifs,
    };
  };

  const stats = getStatistics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="Total Vicariats"
        value={stats.totalVicariats}
        icon={<Building2 size={24} />}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />

      <StatsCard
        title="Avec Vicaire Episcopal"
        value={stats.avecVicaireEpiscopal}
        icon={<Crown size={24} />}
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