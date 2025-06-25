"use client";

import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | ReactNode; // Modifié pour accepter ReactNode
  description?: string | ReactNode;
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
    <Card className="p-3 transition-shadow h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-base text-slate-500 truncate max-w-[70%]">
          {title}
        </h3>
        {icon && <div className="p-3.5 bg-slate-50 rounded-full">{icon}</div>}
      </div>

      <div className="mb-1">
        {" "}
        {typeof value === "string" ? (
          <p className="text-2xl font-bold">{value}</p>
        ) : (
          value
        )}
      </div>

      <div className="flex items-center text-sm">
        {trend && (
          <div className={`flex items-center ${getTrendColor()} mr-2`}>
            {getTrendIcon()}
            <span className="text-sm font-medium ml-1">{trendValue}</span>
          </div>
        )}
        {description && (
          <div className="text-xs text-slate-500 overflow-hidden">
            {description}
          </div>
        )}
      </div>
    </Card>
  );
}
