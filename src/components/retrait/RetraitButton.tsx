// components/retrait/RetraitButton.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from "lucide-react";
import RetraitForm from "./RetraitForm";

interface RetraitButtonProps {
  onSuccess?: () => void;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function RetraitButton({
  onSuccess,
  variant = "default",
  size = "default",
  className = "",
}: RetraitButtonProps) {
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    onSuccess?.();
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowForm(true)}
        className={`flex items-center gap-2 cursor-pointer ${className}`}
      >
        <ArrowDownToLine className="h-4 w-4" />
        Effectuer un retrait
      </Button>

      <RetraitForm
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleSuccess}
      />
    </>
  );
}