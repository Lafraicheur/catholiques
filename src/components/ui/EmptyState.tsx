// components/ui/EmptyState.tsx
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
      <Icon className="h-12 w-12 text-slate-300 mb-3" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-4">{description}</p>
      <div className="flex gap-2">
        {action && (
          <Button onClick={action.onClick} className="cursor-pointer">
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};