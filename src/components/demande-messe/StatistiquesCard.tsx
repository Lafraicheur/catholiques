// =============================================================================
// 5. COMPOSANT STATISTIQUES - components/StatistiquesCard.tsx
// =============================================================================

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Hand, CheckCircle, Clock } from "lucide-react";

interface StatistiquesCardProps {
  totalDemandes: number;
  payees: number;
  nonPayees: number;
}

export const StatistiquesCard: React.FC<StatistiquesCardProps> = ({
  totalDemandes,
  payees,
  nonPayees,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total</p>
              <h3 className="text-2xl font-bold">{totalDemandes}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Hand className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Payées</p>
              <h3 className="text-2xl font-bold">{payees}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Non payées</p>
              <h3 className="text-2xl font-bold">{nonPayees}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};