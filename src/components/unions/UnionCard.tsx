/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/unions/UnionTable.tsx
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

const variantClasses: Record<string, string> = {
  success: "bg-green-500 text-white",
  warning: "bg-yellow-400 text-black",
  danger: "bg-red-500 text-white",
  info: "bg-blue-400 text-white",
  default: "bg-gray-300 text-gray-800",
  secondary: "bg-gray-500 text-white",
  primary: "bg-blue-600 text-white",
  outline: "border border-gray-400 text-gray-700",
};

// Obtenir les détails du statut
const getStatusDetails = (statut: string) => {
  const normalized = statut.toUpperCase();

  if (["CONFIRMÉ", "CONFIRME", "VALIDÉ", "VALIDE"].includes(normalized)) {
    return { label: "Validé", variant: "success" as const };
  }

  if (["EN ATTENTE", "ATTENTE"].includes(normalized)) {
    return { label: "En attente", variant: "warning" as const };
  }

  if (["REJETÉ", "REJETE"].includes(normalized)) {
    return { label: "Rejeté", variant: "danger" as const };
  }

  return { label: statut, variant: "outline" as const };
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Couple</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Détails</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sacrements.map((sacrement) => {
            const { label, variant } = getStatusDetails(sacrement.statut);
            const badgeClass = `${variantClasses[variant]} text-xs px-2 py-0.5 rounded`;

            return (
              <TableRow key={sacrement.id}>
                {/* Date */}
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatDate(sacrement.date)}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Type */}
                <TableCell>{sacrement.type}</TableCell>

                {/* Couple */}
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-1.5 text-blue-500 flex-shrink-0" />
                    <div className="flex flex-col space-y-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium truncate">
                          {sacrement?.paroissien?.nom}{" "}
                          {sacrement?.paroissien?.prenoms}
                        </span>
                        <span className="text-slate-400">&</span>
                        <span className="font-medium truncate">
                          {sacrement?.marie_ou_mariee}
                        </span>
                      </div>
                      {/* Témoins en petite taille */}
                      {(sacrement.temoin_marie || sacrement.temoin_mariee) && (
                        <div className="text-xs text-muted-foreground">
                          Témoins: {sacrement.temoin_marie || "N/A"} •{" "}
                          {sacrement.temoin_mariee || "N/A"}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Statut */}
                <TableCell>
                  <Badge className={badgeClass}>{label}</Badge>
                </TableCell>

                {/* Description */}
                <TableCell>
                  <div className="text-sm max-w-xs">
                    {sacrement.description ? (
                      <span className="line-clamp-2">
                        {sacrement.description.length > 100
                          ? `${sacrement.description.substring(0, 100)}...`
                          : sacrement.description}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Aucune description
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-right py-2 px-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center text-blue-600 hover:bg-blue-50 cursor-pointer"
                      onClick={() => onView(sacrement.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
