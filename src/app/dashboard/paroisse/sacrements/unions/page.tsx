/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Import des composants séparés
import UnionStats from "@/components/unions/UnionStats";
import UnionSearchBar from "@/components/unions/UnionSearchBar";
import UnionTableContainer from "@/components/unions/UnionGrid";
import UnionEmptyState from "@/components/unions/UnionEmptyState";
import { UnionLoading, UnionError } from "@/components/unions/UnionLoadingError";
import UnionDeleteDialog from "@/components/unions/UnionDeleteDialog";

// Import des types et utilitaires
import { SacrementUnion, UnionTabValue } from "@/types/union";
import {
  getUserParoisseId,
  countUnions,
  formatDate,
} from "@/lib/union-utils";

export default function SacrementsUnionPage() {
  // États
  const [sacrements, setSacrements] = useState<SacrementUnion[]>([]);
  const [filteredSacrements, setFilteredSacrements] = useState<SacrementUnion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<UnionTabValue>("tous");
  
  // États pour la suppression
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSacrementId, setSelectedSacrementId] = useState<number | null>(null);

  // Récupérer les sacrements union depuis l'API
  const fetchSacrements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      const paroisse_id = getUserParoisseId();
      const response = await fetch(
        `https://api.cathoconnect.ci/api:HzF8fFua/sacrement-union/obtenir-tous?paroisse_id=${paroisse_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setSacrements(data.items || []);
      setFilteredSacrements(data.items || []);
    } catch (err: any) {
      console.error("Erreur lors du chargement des sacrements:", err);
      setError(err.message || "Une erreur est survenue lors du chargement des données.");
      toast.error("Erreur", {
        description: "Impossible de charger les sacrements d'union.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les sacrements selon la recherche et l'onglet actif
  useEffect(() => {
    let results = [...sacrements];

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (sacrement) =>
          (sacrement.marie?.nom && sacrement.marie.nom.toLowerCase().includes(query)) ||
          (sacrement.marie?.prenoms && sacrement.marie.prenoms.toLowerCase().includes(query)) ||
          (sacrement.mariee?.nom && sacrement.mariee.nom.toLowerCase().includes(query)) ||
          (sacrement.mariee?.prenoms && sacrement.mariee.prenoms.toLowerCase().includes(query)) ||
          (sacrement.description && sacrement.description.toLowerCase().includes(query)) ||
          formatDate(sacrement.date).toLowerCase().includes(query)
      );
    }

    // Filtrer par statut selon l'onglet actif
    if (activeTab !== "tous") {
      switch (activeTab) {
        case "en-attente":
          results = results.filter(
            (sacrement) => sacrement.statut.toUpperCase() === "EN ATTENTE"
          );
          break;
        case "confirmes":
          results = results.filter(
            (sacrement) => 
              sacrement.statut.toUpperCase() === "CONFIRMÉ" || 
              sacrement.statut.toUpperCase() === "CONFIRME" ||
              sacrement.statut.toUpperCase() === "VALIDÉ" || 
              sacrement.statut.toUpperCase() === "VALIDE"
          );
          break;
        case "rejete":
          results = results.filter(
            (sacrement) => 
              sacrement.statut.toUpperCase() === "REJETE" || 
              sacrement.statut.toUpperCase() === "REJETÉ"
          );
          break;
      }
    }

    // Trier par date (les plus récents en premier)
    results.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setFilteredSacrements(results);
  }, [searchQuery, activeTab, sacrements]);

  // Charger les données au montage
  useEffect(() => {
    fetchSacrements();
  }, []);

  // Gestion de la suppression
  const handleDeleteSacrement = (id: number) => {
    setSelectedSacrementId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedSacrementId) return;
    
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }
      
      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-union/supprimer",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sacrement_id: selectedSacrementId }),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur API:", errorText);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      toast.success("Succès", {
        description: "Le sacrement d'union a été supprimé avec succès.",
      });
      
      // Mettre à jour la liste des sacrements
      fetchSacrements();
    } catch (err: any) {
      console.error("Erreur lors de la suppression du sacrement:", err);
      toast.error("Erreur", {
        description: "Impossible de supprimer le sacrement d'union.",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedSacrementId(null);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Calculer les statistiques
  const counts = countUnions(sacrements);

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Gestion des Sacrements d'Union
        </h1>
      </div>

      {/* Statistiques */}
      <UnionStats counts={counts} />

      {/* Contenu principal */}
      <Card className="p-6">
        {/* Barre de recherche et actions */}
        <UnionSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalUnions={sacrements.length}
          onSuccess={fetchSacrements} onExportCSV={function (): void {
            throw new Error("Function not implemented.");
          } }        />

        {/* Onglets */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as UnionTabValue)}
          className="space-y-4"
        >
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="tous">Tous</TabsTrigger>
            <TabsTrigger value="en-attente">En attente</TabsTrigger>
            <TabsTrigger value="confirmes">Validé</TabsTrigger>
            <TabsTrigger value="rejete">Rejeté</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {/* États de chargement et d'erreur */}
            <UnionLoading loading={loading} />
            <UnionError error={error} onRetry={fetchSacrements} />

            {/* État vide */}
            {!loading && !error && filteredSacrements.length === 0 && (
              <UnionEmptyState
                searchQuery={searchQuery}
                onClearSearch={handleClearSearch}
              />
            )}

            {/* Tableau des sacrements */}
            {!loading && !error && filteredSacrements.length > 0 && (
              <UnionTableContainer
                sacrements={filteredSacrements}
                onDelete={handleDeleteSacrement}
              />
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Dialog de suppression */}
      <UnionDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
      />
    </div>
  );
}