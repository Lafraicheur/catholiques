import { Users, CheckCircle, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { sanitizeForRender } from "./SafeValue";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

const SafeStatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
}: StatsCardProps) => {
  const safeValue = sanitizeForRender(value);

  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-card transition-shadow duration-200">
      <CardContent className="p-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`h-3 w-12 rounded-xl ${iconBgColor} flex items-center justify-center`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-xl font-bold text-card-foreground">{safeValue}</div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatsSectionProps {
  paroissiens: any[];
}

export const StatsSection = ({ paroissiens }: StatsSectionProps) => {
  const getStatistics = () => {
    const totalParoissiens = paroissiens.length;
    const paroissensAbornes = paroissiens.filter(p => p.est_abonne).length;
    const paroissiensBaptises = paroissiens.filter(p =>
      p.statut?.toLowerCase().includes("baptis")
    ).length;

    return {
      totalParoissiens,
      paroissensAbornes,
      paroissiensBaptises,
    };
  };

  const stats = getStatistics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <SafeStatsCard
        title="Total Paroissiens"
        value={stats.totalParoissiens}
        icon={<Users size={24} />}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />

      <SafeStatsCard
        title="Abonnés"
        value={stats.paroissensAbornes}
        icon={<CheckCircle size={24} />}
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />

      <SafeStatsCard
        title="Baptisés"
        value={stats.paroissiensBaptises}
        icon={<UserPlus size={24} />}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
    </div>
  );
};