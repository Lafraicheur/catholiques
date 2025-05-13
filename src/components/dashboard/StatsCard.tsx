"use client";

import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "same";
  trendValue?: string;
}

export default function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
}: StatsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-3 w-3 text-green-600" />;
      case "down":
        return <ArrowDown className="h-3 w-3 text-red-600" />;
      case "same":
      default:
        return <ArrowRight className="h-3 w-3 text-slate-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "same":
      default:
        return "text-slate-600";
    }
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium text-sm text-slate-500">{title}</h3>
        {icon && <div className="p-2 bg-slate-50 rounded-full">{icon}</div>}
      </div>

      <div className="mb-2">
        <p className="text-2xl font-bold">{value}</p>
      </div>

      <div className="flex items-center space-x-2">
        {trend && (
          <div className={`flex items-center ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-xs font-medium ml-1">{trendValue}</span>
          </div>
        )}
        {description && (
          <span className="text-xs text-slate-500">{description}</span>
        )}
      </div>
    </Card>
  );
}