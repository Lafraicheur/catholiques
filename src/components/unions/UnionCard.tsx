/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/unions/UnionTable.tsx
// import { Calendar, Eye, Trash2, Users, Heart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { SacrementUnion } from "@/types/union";
// import { formatDate } from "@/lib/union-utils";

// const variantClasses: Record<string, string> = {
//   success: "bg-green-500 text-white",
//   warning: "bg-yellow-400 text-black",
//   danger: "bg-red-500 text-white",
//   info: "bg-blue-400 text-white",
//   default: "bg-gray-300 text-gray-800",
//   secondary: "bg-gray-500 text-white",
//   primary: "bg-blue-600 text-white",
//   outline: "border border-gray-400 text-gray-700",
// };

// // Obtenir les détails du statut
// const getStatusDetails = (statut: string) => {
//   const normalized = statut.toUpperCase();

//   if (["CONFIRMÉ", "CONFIRME", "VALIDÉ", "VALIDE"].includes(normalized)) {
//     return { label: "Validé", variant: "success" as const };
//   }

//   if (["EN ATTENTE", "ATTENTE"].includes(normalized)) {
//     return { label: "En attente", variant: "warning" as const };
//   }

//   if (["REJETÉ", "REJETE"].includes(normalized)) {
//     return { label: "Rejeté", variant: "danger" as const };
//   }

//   return { label: statut, variant: "outline" as const };
// };

// interface UnionTableProps {
//   sacrements: SacrementUnion[];
//   onDelete: (id: number) => void;
//   onView: (id: number) => void;
// }

// export default function UnionTable({
//   sacrements,
//   onDelete,
//   onView,
// }: UnionTableProps) {
//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Date</TableHead>
//             <TableHead>Type</TableHead>
//             <TableHead>Couple</TableHead>
//             <TableHead>Statut</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead className="text-right">Détails</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {sacrements.map((sacrement) => {
//             const { label, variant } = getStatusDetails(sacrement.statut);
//             const badgeClass = `${variantClasses[variant]} text-xs px-2 py-0.5 rounded`;

//             return (
//               <TableRow key={sacrement.id}>
//                 {/* Date */}
//                 <TableCell>
//                   <div className="flex items-center text-sm">
//                     <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
//                     <div className="flex flex-col">
//                       <span className="font-medium">
//                         {formatDate(sacrement.date)}
//                       </span>
//                     </div>
//                   </div>
//                 </TableCell>

//                 {/* Type */}
//                 <TableCell>{sacrement.type}</TableCell>

//                 {/* Couple */}
//                 <TableCell>
//                   <div className="flex items-center text-sm">
//                     <Users className="h-4 w-4 mr-1.5 text-blue-500 flex-shrink-0" />
//                     <div className="flex flex-col space-y-1 min-w-0">
//                       <div className="flex items-center space-x-1">
//                         <span className="font-medium truncate">
//                           {sacrement?.paroissien?.nom}{" "}
//                           {sacrement?.paroissien?.prenoms}
//                         </span>
//                         <span className="text-slate-400">&</span>
//                         <span className="font-medium truncate">
//                           {sacrement?.marie_ou_mariee}
//                         </span>
//                       </div>
//                       {/* Témoins en petite taille */}
//                       {(sacrement.temoin_marie || sacrement.temoin_mariee) && (
//                         <div className="text-xs text-muted-foreground">
//                           Témoins: {sacrement.temoin_marie || "N/A"} •{" "}
//                           {sacrement.temoin_mariee || "N/A"}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </TableCell>

//                 {/* Statut */}
//                 <TableCell>
//                   <Badge className={badgeClass}>{label}</Badge>
//                 </TableCell>

//                 {/* Description */}
//                 <TableCell>
//                   <div className="text-sm max-w-xs">
//                     {sacrement.description ? (
//                       <span className="line-clamp-2">
//                         {sacrement.description.length > 100
//                           ? `${sacrement.description.substring(0, 100)}...`
//                           : sacrement.description}
//                       </span>
//                     ) : (
//                       <span className="text-muted-foreground italic">
//                         Aucune description
//                       </span>
//                     )}
//                   </div>
//                 </TableCell>

//                 <TableCell className="text-right py-2 px-4">
//                   <div className="flex justify-end gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="flex items-center text-blue-600 hover:bg-blue-50 cursor-pointer"
//                       onClick={() => onView(sacrement.id)}
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

import { Calendar, Eye, Trash2, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { SacrementUnion } from "@/types/union";
import { formatDate } from "@/lib/union-utils";

// Obtenir les détails du statut avec style OnTask
const getStatusBadge = (statut: string) => {
  const normalized = statut.toUpperCase();

  if (["CONFIRMÉ", "CONFIRME", "VALIDÉ", "VALIDE"].includes(normalized)) {
    return (
      <Badge className="px-3 py-1 font-medium text-sm rounded-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
        <span className="mr-1">💒</span>
        Validé
      </Badge>
    );
  }

  if (["EN ATTENTE", "ATTENTE"].includes(normalized)) {
    return (
      <Badge className="px-3 py-1 font-medium text-sm rounded-full bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
        <span className="mr-1">⏳</span>
        En attente
      </Badge>
    );
  }

  if (["REJETÉ", "REJETE"].includes(normalized)) {
    return (
      <Badge className="px-3 py-1 font-medium text-sm rounded-full bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
        <span className="mr-1">💔</span>
        Rejeté
      </Badge>
    );
  }

  return (
    <Badge className="px-3 py-1 font-medium text-sm rounded-full bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100">
      {statut}
    </Badge>
  );
};

interface UnionTableProps {
  sacrements: SacrementUnion[];
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export default function UnionTable({
  sacrements,
  onDelete,
  onView,
}: UnionTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header du tableau */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Sacrements d'Union
          </h3>
          <div className="text-sm text-slate-500">
            {sacrements.length} résultat{sacrements.length > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-slate-200 hover:bg-transparent">
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Date
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Couple
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Type
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Statut
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-left">
              Description
            </TableHead>
            <TableHead className="font-semibold text-slate-700 py-4 px-6 text-right">
              Détails
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sacrements.map((sacrement) => (
            <TableRow
              key={sacrement.id}
              className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150"
            >
              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full opacity-60" />
                  <span className="text-slate-600 font-medium">
                    {formatDate(sacrement.date)}
                  </span>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="flex items-center">
                  <div className="flex items-center mr-3">
                    {/* Avatar couple */}
                    <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-pink-600">
                        {sacrement?.paroissien?.prenoms?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center -ml-2 border-2 border-white">
                      <span className="text-xs font-semibold text-blue-600">
                        {String(sacrement?.marie_ou_mariee).charAt(0) || "?"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center font-medium text-slate-900 text-sm">
                      <span className="truncate">
                        {sacrement?.paroissien?.nom}{" "}
                        {sacrement?.paroissien?.prenoms}
                      </span>
                      <Heart className="h-3 w-3 mx-2 text-pink-500" />
                      <span className="truncate">
                        {sacrement?.marie_ou_mariee}
                      </span>
                    </div>
                    {(sacrement.temoin_marie || sacrement.temoin_mariee) && (
                      <div className="text-xs text-slate-500 mt-1">
                        Témoins: {sacrement.temoin_marie || "N/A"} •{" "}
                        {sacrement.temoin_mariee || "N/A"}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6">
                <Badge className="px-3 py-1 font-medium text-sm rounded-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                  {sacrement.type}
                </Badge>
              </TableCell>

              <TableCell className="py-4 px-6">
                {getStatusBadge(sacrement.statut)}
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="text-sm text-slate-700 max-w-xs">
                  {sacrement.description ? (
                    <span className="line-clamp-2">
                      {sacrement.description.length > 100
                        ? `${sacrement.description.substring(0, 100)}...`
                        : sacrement.description}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">
                      Aucune description
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell className="py-4 px-6 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
                  onClick={() => onView(sacrement.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
