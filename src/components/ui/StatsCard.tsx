// components/ui/StatsCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: "blue" | "pink" | "green" | "amber";
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    pink: "bg-pink-100 text-pink-600",
    green: "bg-green-100 text-green-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClasses[color]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
