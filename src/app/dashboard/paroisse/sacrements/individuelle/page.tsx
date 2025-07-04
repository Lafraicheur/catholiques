/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "sonner";

// // Import des composants séparés
// import SacrementStats from "@/components/sacrements/SacrementStats";
// import SacrementSearchBar from "@/components/sacrements/SacrementSearchBar";
// import SacrementTable from "@/components/sacrements/SacrementTable";
// import SacrementPagination from "@/components/sacrements/SacrementPagination";
// import SacrementEmptyState from "@/components/sacrements/SacrementEmptyState";
// import {
//   SacrementLoading,
//   SacrementError,
// } from "@/components/sacrements/SacrementLoadingError";
// import SacrementDeleteDialog from "@/components/sacrements/SacrementDeleteDialog";

// // Import des types et utilitaires
// import { SacrementIndividuel } from "@/types/sacrement";
// import {
//   getUserParoisseId,
//   getSacrementSoustypeDetails,
//   countSacrements,
//   exportSacrementsToCSV,
// } from "@/lib/sacrement-utils";

// export default function SacrementsIndividuelsPage() {
//   // États
//   const [sacrements, setSacrements] = useState<SacrementIndividuel[]>([]);
//   const [filteredSacrements, setFilteredSacrements] = useState<
//     SacrementIndividuel[]
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState("tous");

//   // États pour la pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);

//   // États pour la suppression
//   const [sacrementToDelete, setSacrementToDelete] = useState<number | null>(
//     null
//   );
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

//   // Récupérer les sacrements depuis l'API
//   const fetchSacrements = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("auth_token");
//       if (!token) {
//         throw new Error("Token d'authentification non trouvé");
//       }

//       const paroisse_id = getUserParoisseId();
//       if (!paroisse_id) {
//         throw new Error("ID de paroisse non trouvé");
//       }

//       const response = await fetch(
//         `https://api.cathoconnect.ci/api:HzF8fFua/sacrement-individuel/obtenir-tous?paroisse_id=${paroisse_id}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Erreur HTTP: ${response.status}`);
//       }

//       const data = await response.json();
//       setSacrements(data.items || []);
//       setFilteredSacrements(data.items || []);
//     } catch (err: any) {
//       console.error("Erreur lors du chargement des sacrements:", err);
//       setError(
//         err.message || "Une erreur est survenue lors du chargement des données."
//       );
//       toast.error("Erreur", {
//         description: "Impossible de charger les sacrements individuels.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filtrer les sacrements
//   useEffect(() => {
//     let results = [...sacrements];

//     // Filtrer par recherche
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase().trim();
//       results = results.filter(
//         (sacrement) =>
//           sacrement.soustype.toLowerCase().includes(query) ||
//           sacrement.description.toLowerCase().includes(query) ||
//           (sacrement.celebrant &&
//             `${sacrement.celebrant.prenoms} ${sacrement.celebrant.nom}`
//               .toLowerCase()
//               .includes(query))
//       );
//     }

//     // Filtrer par type selon l'onglet actif
//     if (activeTab !== "tous") {
//       results = results.filter(
//         (sacrement) =>
//           getSacrementSoustypeDetails(sacrement.soustype).category === activeTab
//       );
//     }

//     // Trier par date (les plus récents en premier)
//     results.sort(
//       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//     );

//     setFilteredSacrements(results);
//     setCurrentPage(1);
//     setTotalPages(Math.ceil(results.length / itemsPerPage));
//   }, [searchQuery, activeTab, sacrements, itemsPerPage]);

//   // Charger les données au montage
//   useEffect(() => {
//     fetchSacrements();
//   }, []);

//   // Obtenir les éléments de la page courante
//   const getCurrentPageItems = () => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return filteredSacrements.slice(startIndex, endIndex);
//   };

//   // Navigation de pagination
//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // Gestion de la suppression
//   const openDeleteDialog = (id: number) => {
//     setSacrementToDelete(id);
//     setShowDeleteDialog(true);
//   };

//   const handleDeleteSacrement = async () => {
//     if (!sacrementToDelete) return;

//     try {
//       const token = localStorage.getItem("auth_token");
//       if (!token) {
//         throw new Error("Token d'authentification non trouvé");
//       }

//       const response = await fetch(
//         "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-individuel/supprimer",
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ sacrement_id: sacrementToDelete }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Erreur HTTP: ${response.status}`);
//       }

//       await response.json();
//       toast.success("Succès", {
//         description: "Le sacrement a été supprimé avec succès.",
//       });

//       fetchSacrements();
//     } catch (err: any) {
//       console.error("Erreur lors de la suppression du sacrement:", err);
//       toast.error("Erreur", {
//         description: "Impossible de supprimer le sacrement.",
//       });
//     } finally {
//       setShowDeleteDialog(false);
//       setSacrementToDelete(null);
//     }
//   };

//   // Fonctions utilitaires
//   const handleExportCSV = () => {
//     exportSacrementsToCSV(filteredSacrements);
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//   };

//   // Calculer les statistiques
//   const counts = countSacrements(sacrements);
//   const totalSacrements = sacrements.length;

//   return (
//     <div className="space-y-6">
//       {/* En-tête de la page */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
//         <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
//           Gestion des Sacrements Individuels
//         </h1>
//       </div>

//       {/* Statistiques */}
//       <SacrementStats counts={counts} />

//       {/* Contenu principal */}
//       <Card className="p-6">
//         {/* Barre de recherche et actions */}
//         <SacrementSearchBar
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           totalSacrements={totalSacrements}
//           onExportCSV={handleExportCSV}
//           onSuccess={fetchSacrements}
//         />

//         {/* Onglets */}
//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="space-y-4"
//         >
//           <TabsList className="flex flex-wrap">
//             <TabsTrigger value="tous">Tous</TabsTrigger>
//             <TabsTrigger value="baptemes">Baptêmes</TabsTrigger>
//             <TabsTrigger value="firstcommunions">
//               Première Communion
//             </TabsTrigger>
//             <TabsTrigger value="professiondefoi">Profession de Foi</TabsTrigger>
//             <TabsTrigger value="sacrementdemalade">
//               Sacrement de Malade
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value={activeTab}>
//             {/* États de chargement et d'erreur */}
//             <SacrementLoading loading={loading} />
//             <SacrementError error={error} onRetry={fetchSacrements} />

//             {/* État vide */}
//             {!loading && !error && filteredSacrements.length === 0 && (
//               <SacrementEmptyState
//                 searchQuery={searchQuery}
//                 onClearSearch={handleClearSearch}
//               />
//             )}

//             {/* Tableau des sacrements */}
//             {!loading && !error && filteredSacrements.length > 0 && (
//               <>
//                 <SacrementTable
//                   sacrements={getCurrentPageItems()}
//                   onDelete={openDeleteDialog}
//                 />

//                 {/* Pagination */}
//                 {filteredSacrements.length > itemsPerPage && (
//                   <SacrementPagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     itemsPerPage={itemsPerPage}
//                     totalItems={filteredSacrements.length}
//                     onPreviousPage={goToPreviousPage}
//                     onNextPage={goToNextPage}
//                   />
//                 )}
//               </>
//             )}
//           </TabsContent>
//         </Tabs>
//       </Card>

//       {/* Dialog de suppression */}
//       <SacrementDeleteDialog
//         open={showDeleteDialog}
//         onOpenChange={setShowDeleteDialog}
//         onConfirm={handleDeleteSacrement}
//       />
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Import des composants modernisés
import SacrementStats from "@/components/sacrements/SacrementStats";
import SacrementSearchBar from "@/components/sacrements/SacrementSearchBar";
import SacrementTable from "@/components/sacrements/SacrementTable";
import SacrementPagination from "@/components/sacrements/SacrementPagination";
import SacrementEmptyState from "@/components/sacrements/SacrementEmptyState";
import SacrementDeleteDialog from "@/components/sacrements/SacrementDeleteDialog";

// Import des types et utilitaires
import { SacrementIndividuel } from "@/types/sacrement";
import {
  getUserParoisseId,
  getSacrementSoustypeDetails,
  countSacrements,
  exportSacrementsToCSV,
} from "@/lib/sacrement-utils";
import {
  SacrementsPageSkeleton,
  SacrementError,
} from "@/components/sacrements/SacrementsPageSkeleton";

export default function SacrementsIndividuelsPage() {
  // États
  const [sacrements, setSacrements] = useState<SacrementIndividuel[]>([]);
  const [filteredSacrements, setFilteredSacrements] = useState<
    SacrementIndividuel[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("tous");

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // États pour la suppression
  const [sacrementToDelete, setSacrementToDelete] = useState<number | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Récupérer les sacrements depuis l'API
  const fetchSacrements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      const paroisse_id = getUserParoisseId();
      if (!paroisse_id) {
        throw new Error("ID de paroisse non trouvé");
      }

      const response = await fetch(
        `https://api.cathoconnect.ci/api:HzF8fFua/sacrement-individuel/obtenir-tous?paroisse_id=${paroisse_id}`,
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
      setError(
        err.message || "Une erreur est survenue lors du chargement des données."
      );
      toast.error("Erreur", {
        description: "Impossible de charger les sacrements individuels.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les sacrements
  useEffect(() => {
    let results = [...sacrements];

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (sacrement) =>
          sacrement.soustype.toLowerCase().includes(query) ||
          sacrement.description.toLowerCase().includes(query) ||
          (sacrement.celebrant &&
            `${sacrement.celebrant.prenoms} ${sacrement.celebrant.nom}`
              .toLowerCase()
              .includes(query))
      );
    }

    // Filtrer par type selon l'onglet actif
    if (activeTab !== "tous") {
      results = results.filter(
        (sacrement) =>
          getSacrementSoustypeDetails(sacrement.soustype).category === activeTab
      );
    }

    // Trier par date (les plus récents en premier)
    results.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setFilteredSacrements(results);
    setCurrentPage(1);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
  }, [searchQuery, activeTab, sacrements, itemsPerPage]);

  // Charger les données au montage
  useEffect(() => {
    fetchSacrements();
  }, []);

  // Obtenir les éléments de la page courante
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSacrements.slice(startIndex, endIndex);
  };

  // Navigation de pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Gestion de la suppression
  const openDeleteDialog = (id: number) => {
    setSacrementToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteSacrement = async () => {
    if (!sacrementToDelete) return;

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-individuel/supprimer",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sacrement_id: sacrementToDelete }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      await response.json();
      toast.success("Succès", {
        description: "Le sacrement a été supprimé avec succès.",
      });

      fetchSacrements();
    } catch (err: any) {
      console.error("Erreur lors de la suppression du sacrement:", err);
      toast.error("Erreur", {
        description: "Impossible de supprimer le sacrement.",
      });
    } finally {
      setShowDeleteDialog(false);
      setSacrementToDelete(null);
    }
  };

  // Fonctions utilitaires
  const handleExportCSV = () => {
    exportSacrementsToCSV(filteredSacrements);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Calculer les statistiques
  const counts = countSacrements(sacrements);
  const totalSacrements = sacrements.length;

  if (loading) {
    return <SacrementsPageSkeleton />;
  }

  // Si erreur, afficher le composant d'erreur
  if (error) {
    return <SacrementError error={error} onRetry={fetchSacrements} />;
  }

  return (
    <div className="space-y-6">
      {/* En-tête moderne */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Sacrements Individuels
          </h1>
          <p className="text-slate-500">
            Gérez les sacrements individuels de votre paroisse
          </p>
        </div>
      </div>

      {/* Statistiques modernisées */}
      <SacrementStats counts={counts} />

      {/* Barre de recherche modernisée */}
      <SacrementSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalSacrements={totalSacrements}
        onExportCSV={handleExportCSV}
        onSuccess={fetchSacrements}
      />

      {/* Onglets modernisés */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Header avec onglets */}
          <div className="px-6 py-4 border-b border-slate-200">
            <TabsList className="h-12 p-1 bg-slate-100 rounded-xl grid w-full grid-cols-5">
              <TabsTrigger
                value="tous"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                Tous
              </TabsTrigger>
              <TabsTrigger
                value="baptemes"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <span className="mr-1">🕊️</span>
                Baptêmes
              </TabsTrigger>
              <TabsTrigger
                value="firstcommunions"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <span className="mr-1">🍞</span>
                Communion
              </TabsTrigger>
              <TabsTrigger
                value="professiondefoi"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <span className="mr-1">📿</span>
                Profession
              </TabsTrigger>
              <TabsTrigger
                value="sacrementdemalade"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <span className="mr-1">🙏</span>
                Malade
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            <TabsContent value={activeTab} className="mt-0">
              {/* État vide */}
              {!loading && !error && filteredSacrements.length === 0 && (
                <SacrementEmptyState
                  searchQuery={searchQuery}
                  onClearSearch={handleClearSearch}
                />
              )}

              {/* Tableau des sacrements */}
              {!loading && !error && filteredSacrements.length > 0 && (
                <>
                  <SacrementTable
                    sacrements={getCurrentPageItems()}
                    onDelete={openDeleteDialog}
                  />

                  {/* Pagination séparée si nécessaire */}
                  {filteredSacrements.length > itemsPerPage && (
                    <div className="mt-6">
                      <SacrementPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredSacrements.length}
                        onPreviousPage={goToPreviousPage}
                        onNextPage={goToNextPage}
                      />
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Dialog de suppression */}
      <SacrementDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteSacrement}
      />
    </div>
  );
}
