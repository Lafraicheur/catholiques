/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/flux-financiers/FluxFinancierFilters.tsx
import { useState } from "react";
import { Search, Filter, CalendarX2, XCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  const hasActiveFilters = () => {
    return (
      searchQuery.trim() !== "" ||
      typeFilter !== "TOUT" ||
      statusFilter !== "TOUT" ||
      dateFrom ||
      dateTo
    );
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setTypeFilter("TOUT");
    setStatusFilter("TOUT");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="mb-8">
      {/* Section filtres avancés */}
      <Card className="border-0 shadow-sm bg-white transition-shadow duration-200">
        <CardContent className="py-6 px-6">
          <div className="space-y-6">
            {/* Filtres */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Recherche */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  placeholder="Rechercher par référence, type, description ou initiateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-10 bg-white border-slate-200 rounded-xl transition-all duration-200"
                />
              </div>
              {/* Filtre de type */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-10 w-50 bg-white border-slate-200 rounded-xl transition-all duration-200">
                  <SelectValue placeholder="Type de transaction" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg rounded-xl">
                  {TRANSACTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="rounded-lg">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtre de statut */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 w-35 bg-white border-slate-200 rounded-xl transition-all duration-200">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg rounded-xl">
                  {TRANSACTION_STATUS.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="rounded-lg"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtre de période */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-10 justify-start text-left font-normal w-full bg-white border-slate-200 rounded-xl transition-all duration-200",
                      !dateFrom && !dateTo && "text-slate-500"
                    )}
                  >
                    <CalendarX2 className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {dateFrom && dateTo
                        ? `${format(dateFrom, "dd/MM/yyyy")} - ${format(dateTo, "dd/MM/yyyy")}`
                        : dateFrom
                          ? `Du ${format(dateFrom, "dd/MM/yyyy")}`
                          : dateTo
                            ? `Jusqu'au ${format(dateTo, "dd/MM/yyyy")}`
                            : "Sélectionner une période"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white border-slate-200 shadow-lg rounded-xl"
                  align="end"
                >
                  <div className="p-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <CalendarX2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-slate-900">
                        Sélectionner une période
                      </h4>
                    </div>

                    {/* Calendriers pour date de début et fin */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700">
                          Date de début
                        </Label>
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          numberOfMonths={1}
                          className="rounded-lg border border-slate-200 shadow-sm"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700">
                          Date de fin
                        </Label>
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          numberOfMonths={1}
                          className="rounded-lg border border-slate-200 shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    {(dateFrom || dateTo) && (
                      <div className="pt-4 border-t border-slate-200 flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDateFrom(undefined);
                            setDateTo(undefined);
                          }}
                          className="flex-1 h-9 bg-white border-slate-200 hover:bg-slate-50 rounded-xl transition-all duration-200"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Réinitialiser
                        </Button>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Actions globales */}
            {hasActiveFilters() && (
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="text-sm text-slate-600">
                  {
                    [
                      searchQuery && "recherche",
                      typeFilter !== "TOUT" && "type",
                      statusFilter !== "TOUT" && "statut",
                      (dateFrom || dateTo) && "période",
                    ].filter(Boolean).length
                  }{" "}
                  filtre(s) actif(s)
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetAllFilters}
                  className="h-9 px-4 bg-white border-slate-200 hover:bg-slate-50 rounded-xl transition-all duration-200"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Tout réinitialiser
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
