/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/flux-financiers/FluxFinancierFilters.tsx
import { useState } from "react";
import { Search, Filter, CalendarX2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FluxFinancierFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateFrom: Date | undefined;
  setDateFrom: (date: Date | undefined) => void;
  dateTo: Date | undefined;
  setDateTo: (date: Date | undefined) => void;
}

const TRANSACTION_TYPES = [
  "TOUT",
  "DÉPÔT",
  "RETRAIT",
  "AIDE",
  "DIME",
  "OFFRANDE",
  "TRANSFERT",
  "ABONNEMENT",
  "COTISATION",
  "DEMANDE DE MESSE",
  "DENIER DE CULTE",
  "DON",
  "PARTICIPATION",
  "QUÊTE",
];

const TRANSACTION_STATUS = ["TOUT", "EN ATTENTE", "SUCCÈS", "ECHEC"];

export default function FluxFinancierFilters({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: FluxFinancierFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* Première ligne : Barre de recherche seule */}
      <div className="w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher par référence, type, description ou initiateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>

      {/* Deuxième ligne : Filtres alignés avec hauteurs égales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtre de type de transaction */}
        <div className="flex flex-col">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-10">
              <div className="flex items-center w-full">
                <Filter className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" />
                <SelectValue placeholder="Type de transaction" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre de statut */}
        <div className="flex flex-col">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10">
              <div className="flex items-center w-full">
                <Filter className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" />
                <SelectValue placeholder="Statut" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_STATUS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre de dates */}
        <div className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-10 justify-start text-left font-normal w-full",
                  !dateFrom && !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarX2 className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {dateFrom && dateTo
                    ? `${format(dateFrom, "dd/MM/yyyy")} - ${format(dateTo, "dd/MM/yyyy")}`
                    : "Période"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="flex flex-col space-y-4 p-4">
                {/* Date de début */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date de début</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarX2 className="mr-2 h-4 w-4" />
                        {dateFrom ? (
                          format(dateFrom, "dd/MM/yyyy")
                        ) : (
                          <span>Sélectionner...</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Date de fin */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date de fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarX2 className="mr-2 h-4 w-4" />
                        {dateTo ? (
                          format(dateTo, "dd/MM/yyyy")
                        ) : (
                          <span>Sélectionner...</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Bouton de réinitialisation */}
                {(dateFrom || dateTo) && (
                  <div className="pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDateFrom(undefined);
                        setDateTo(undefined);
                      }}
                      className="w-full"
                    >
                      Réinitialiser les dates
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
