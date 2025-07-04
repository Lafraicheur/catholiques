// =============================================================================
// 5. COMPOSANT STATISTIQUES - components/StatistiquesCard.tsx
// =============================================================================
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Hand, CheckCircle, Clock } from "lucide-react";

// interface StatistiquesCardProps {
//   totalDemandes: number;
//   payees: number;
//   nonPayees: number;
// }

// export const StatistiquesCard: React.FC<StatistiquesCardProps> = ({
//   totalDemandes,
//   payees,
//   nonPayees,
// }) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-slate-500">Total</p>
//               <h3 className="text-2xl font-bold">{totalDemandes}</h3>
//             </div>
//             <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//               <Hand className="h-5 w-5 text-blue-600" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-slate-500">Payées</p>
//               <h3 className="text-2xl font-bold">{payees}</h3>
//             </div>
//             <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
//               <CheckCircle className="h-5 w-5 text-green-600" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-slate-500">Non payées</p>
//               <h3 className="text-2xl font-bold">{nonPayees}</h3>
//             </div>
//             <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
//               <Clock className="h-5 w-5 text-amber-600" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Hand, CheckCircle, Clock } from "lucide-react";

interface StatistiquesCardProps {
  totalDemandes: number;
  payees: number;
  nonPayees: number;
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
}: StatsCardProps) => {
  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-white transition-shadow duration-200">
      <CardContent className="p-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`h-12 w-12 rounded-xl ${iconBgColor} flex items-center justify-center flex-shrink-0`}
          >
            <div className={iconColor}>
              {icon}
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        </div>
        
        <div className="text-3xl font-bold text-slate-900">{value}</div>
      </CardContent>
    </Card>
  );
};

export const StatistiquesCard: React.FC<StatistiquesCardProps> = ({
  totalDemandes,
  payees,
  nonPayees,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatsCard
        title="Total des demandes"
        value={totalDemandes}
        icon={<Hand className="h-6 w-6" />}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />
      
      <StatsCard
        title="Demandes payées"
        value={payees}
        icon={<CheckCircle className="h-6 w-6" />}
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />
      
      <StatsCard
        title="Demandes non payées"
        value={nonPayees}
        icon={<Clock className="h-6 w-6" />}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
      />
    </div>
  );
};