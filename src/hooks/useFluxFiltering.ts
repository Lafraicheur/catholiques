// hooks/useFluxFiltering.ts
import { useState, useEffect, useMemo } from "react";

interface FluxFinancier {
  id: number;
  created_at: number;
  reference: string;
  type: string;
  montant: number;
  frais: number;
  montant_avec_frais: number;
  description: string;
  motif: string;
  statut: string;
  solde_avant_beneficiaire: number;
  solde_apres_beneficiaire: number;
  initiateur_id: number;
  extras: Record<string, any>;
  initiateur: {
    id: number;
    nom: string;
    prenoms: string;
  };
}

export function useFluxFiltering(fluxFinanciers: FluxFinancier[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("TOUT");
  const [statusFilter, setStatusFilter] = useState("TOUT");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const filteredFluxFinanciers = useMemo(() => {
    let results = fluxFinanciers;

    // Filtrer par type de transaction
    if (typeFilter !== "TOUT") {
      results = results.filter((flux) => flux.type === typeFilter);
    }

    // Filtrer par statut
    if (statusFilter !== "TOUT") {
      results = results.filter((flux) => flux.statut === statusFilter);
    }

    // Filtrer par dates
    if (dateFrom && dateTo) {
      results = results.filter((flux) => {
        const fluxDate = new Date(flux.created_at);
        return fluxDate >= dateFrom && fluxDate <= dateTo;
      });
    }

    // Filtrer par recherche (référence, type, description, initiateur)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (flux) =>
          flux.reference.toLowerCase().includes(query) ||
          flux.type.toLowerCase().includes(query) ||
          flux.description.toLowerCase().includes(query) ||
          flux.initiateur.nom.toLowerCase().includes(query) ||
          flux.initiateur.prenoms.toLowerCase().includes(query)
      );
    }

    return results;
  }, [
    fluxFinanciers,
    searchQuery,
    typeFilter,
    statusFilter,
    dateFrom,
    dateTo,
  ]);

  const hasFilters = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      typeFilter !== "TOUT" ||
      statusFilter !== "TOUT" ||
      dateFrom !== undefined ||
      dateTo !== undefined
    );
  }, [searchQuery, typeFilter, statusFilter, dateFrom, dateTo]);

  const resetFilters = () => {
    setSearchQuery("");
    setTypeFilter("TOUT");
    setStatusFilter("TOUT");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return {
    filteredFluxFinanciers,
    hasFilters,
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
    resetFilters,
  };
}