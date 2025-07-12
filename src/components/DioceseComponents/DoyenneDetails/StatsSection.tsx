/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Church, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { sanitizeForRender } from "./formatUtils";

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
  paroissesCount: number;
  curesCount: number;
}

export const StatsSection = ({
  paroissesCount,
  curesCount,
}: StatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <SafeStatsCard
        title="Paroisses"
        value={paroissesCount}
        icon={<Church size={24} />}
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />

      <SafeStatsCard
        title="Curés"
        value={curesCount}
        icon={<User size={24} />}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
    </div>
  );
};
