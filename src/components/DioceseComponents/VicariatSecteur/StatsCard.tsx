/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

export const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
}: StatsCardProps) => {
  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-card transition-shadow duration-200">
      <CardContent className="p-y-1">
        {/* Header avec icône et menu */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`h-3 w-12 rounded-xl flex items-center justify-center`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
        </div>

        {/* Valeur et tendance */}
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-card-foreground">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
};