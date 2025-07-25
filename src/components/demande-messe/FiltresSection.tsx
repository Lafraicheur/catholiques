// =============================================================================
// 6. COMPOSANT FILTRES - components/FiltresSection.tsx
// =============================================================================
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Search,
  CheckCircle,
  Clock,
  Filter,
  XCircle,
  Download,
  Calendar,
  FileSpreadsheet,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DemandeMesse, MesseFilters } from "../../types/demandeMesse";
import { formatTimestamp, formatTime, formatDate } from "@/utils/emandeMesseUtils";

interface FiltresSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filtrePayee: boolean | null;
  setFiltrePayee: (filter: boolean | null) => void;
  messeFilters: MesseFilters;
  setMesseFilters: (filters: MesseFilters) => void;
  demandes: DemandeMesse[];
  exporting: boolean;
  filteredDemandes: DemandeMesse[];
  onResetFilters: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export const FiltresSection: React.FC<FiltresSectionProps> = ({
  searchQuery,
  setSearchQuery,
  filtrePayee,
  setFiltrePayee,
  messeFilters,
  setMesseFilters,
  demandes,
  exporting,
  filteredDemandes,
  onResetFilters,
  onExportExcel,
  onExportPDF,
}) => {
  const getUniqueMesseLibelles = (): string[] => {
    const libelles = demandes
      .map((d) => d.messe?.libelle)
      .filter((libelle): libelle is string => Boolean(libelle));
    return [...new Set(libelles)].sort();
  };

  const getUniqueDatesDebut = (): string[] => {
    const dates = demandes
      .map((d) => d.messe?.date_de_debut)
      .filter((date): date is number => Boolean(date))
      .map((timestamp) => formatTimestamp(timestamp));
    return [...new Set(dates)].sort();
  };

  const getUniqueHeuresFin = (): string[] => {
    const heures = demandes
      .map((d) => d.messe?.extras?.heure_de_fin)
      .filter((heure): heure is number => Boolean(heure))
      .map((timestamp) => formatTime(timestamp));
    return [...new Set(heures)].sort();
  };

  const hasActiveFilters = () => {
    return (
      searchQuery.trim() !== "" ||
      filtrePayee !== null ||
      messeFilters.libelle !== "" ||
      messeFilters.dateDebut !== "" ||
      messeFilters.heureFin !== ""
    );
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Ligne 1: Recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <Input
            placeholder="Rechercher une demande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-white border-slate-200 rounded-xl transition-all duration-200"
          />
        </div>
      </div>

      {/* Ligne 2: Filtres de messe */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Filter className="h-4 w-4" />
          Filtres messe:
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Select
            value={messeFilters.libelle || "ALL_LIBELLES"}
            onValueChange={(value) => {
              const newValue = value === "ALL_LIBELLES" ? "" : value;
              setMesseFilters({ ...messeFilters, libelle: newValue });
            }}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Libellé de messe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_LIBELLES">Tous les libellés</SelectItem>
              {getUniqueMesseLibelles().map((libelle) => (
                <SelectItem key={libelle} value={libelle}>
                  {libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={messeFilters.dateDebut || "ALL_DATES"}
            onValueChange={(value) => {
              const newValue = value === "ALL_DATES" ? "" : value;
              setMesseFilters({ ...messeFilters, dateDebut: newValue });
            }}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Date de début" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_DATES">Toutes les dates</SelectItem>
              {getUniqueDatesDebut().map((date) => (
                <SelectItem key={date} value={date}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {formatDate(date)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={messeFilters.heureFin || "ALL_HEURES"}
            onValueChange={(value) => {
              const newValue = value === "ALL_HEURES" ? "" : value;
              setMesseFilters({ ...messeFilters, heureFin: newValue });
            }}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Heure de fin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_HEURES">Toutes les heures</SelectItem>
              {getUniqueHeuresFin().map((heure) => (
                <SelectItem key={heure} value={heure}>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {heure}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {hasActiveFilters() && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="cursor-pointer text-slate-600"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
                disabled={exporting || filteredDemandes.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                {exporting ? "Exportation..." : "Exporter tout"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={onExportExcel}
                className="cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                Exporter en Excel
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onExportPDF}
                className="cursor-pointer"
              >
                <FileDown className="h-4 w-4 mr-2 text-red-600" />
                Exporter en PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
