/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Church,
  Users,
  Search,
  Plus,
  FileText,
  Filter,
  Wallet,
  User,
  MoreHorizontal,
  XCircle,
  Edit,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";
import { fetchCebs } from "@/services/ceb-services";

// Importer les composants de formulaire
import AjouterCebForm from "@/components/forms/AjouterCebForm";
import ModifierCebForm from "@/components/forms/ModifierCebForm";
import DeleteCebConfirmation from "@/components/forms/DeleteCebConfirmation";

// Types
interface Ceb {
  id: number;
  created_at: string;
  identifiant: string;
  nom: string;
  solde: number;
  paroisse_id: number;
  chapelle_id: number | null;
  president_id: number | null;
  president?: {
    id: number;
    nom: string;
    prenoms: string;
    num_de_telephone: string;
    // Autres champs du président...
  };
}

export default function CebsPage() {
  const router = useRouter();
  const [cebs, setCebs] = useState<Ceb[]>([]);
  const [filteredCebs, setFilteredCebs] = useState<Ceb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // États pour les dialogues
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCeb, setSelectedCeb] = useState<Ceb | null>(null);

  // Récupérer l'ID de la paroisse à partir du localStorage
  const getUserParoisseId = (): number => {
    try {
      const userProfileStr = localStorage.getItem("user_profile");
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        return userProfile.paroisse_id || 0;
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du profil:", err);
    }
    return 0;
  };

  // Charger les CEB au montage du composant
  useEffect(() => {
    const loadCebs = async () => {
      setLoading(true);
      setError(null);

      try {
        const paroisseId = getUserParoisseId();
        if (!paroisseId) {
          throw new Error("ID de paroisse non disponible");
        }

        const data = await fetchCebs(paroisseId);
        setCebs(data);
        setFilteredCebs(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.error("Erreur lors du chargement des CEB:", err);
        if (err instanceof AuthenticationError) {
          toast.error("Session expirée", {
            description: "Veuillez vous reconnecter pour continuer.",
          });
          router.push("/login");
        } else if (err instanceof ForbiddenError) {
          setError(
            "Vous n'avez pas les droits nécessaires pour accéder à cette ressource."
          );
        } else if (err instanceof NotFoundError) {
          setError("Aucune CEB trouvée pour cette paroisse.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadCebs();
  }, [router, itemsPerPage]);

  // Filtrer les CEB selon la recherche
  useEffect(() => {
    let results = cebs;

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter((ceb) => ceb.nom.toLowerCase().includes(query));
    }

    setFilteredCebs(results);
    setCurrentPage(1);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
  }, [searchQuery, cebs, itemsPerPage]);

  // Calculer les CEB à afficher pour la pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCebs.slice(startIndex, endIndex);
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

  // Formater la monnaie en FCFA
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Formater les dates: 2023-05-15 -> 15/05/2023
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Non renseignée";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR").format(date);
    } catch (err) {
      console.error("Erreur lors du formatage de la date:", err);
      return dateString;
    }
  };

  // Gérer le succès de la création
  const handleCreateSuccess = (newCeb) => {
    // Ajouter la nouvelle CEB à la liste
    setCebs((prevCebs) => [newCeb, ...prevCebs]);
  };

  // Gérer le succès de la mise à jour
  const handleUpdateSuccess = (updatedCeb) => {
    // Remplacer la CEB existante dans la liste
    setCebs((prevCebs) =>
      prevCebs.map((c) => (c.id === updatedCeb.id ? updatedCeb : c))
    );
    // Réinitialiser l'état
    setSelectedCeb(null);
  };

  // Gérer le succès de la suppression
  const handleDeleteSuccess = (deletedId) => {
    // Filtrer la CEB supprimée de la liste
    const updatedList = cebs.filter((c) => c.id !== deletedId);
    setCebs(updatedList);

    // Réinitialiser l'état
    setSelectedCeb(null);
  };

  // Ouvrir le modal en mode édition
  const openEditModal = (ceb) => {
    setSelectedCeb(ceb);
    setShowEditDialog(true);
  };

  // Ouvrir le modal en mode suppression
  const openDeleteModal = (ceb) => {
    setSelectedCeb(ceb);
    setShowDeleteDialog(true);
  };

  // Ouvrir le modal en mode création
  const openAddModal = () => {
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Communautés Ecclésiales de Base (CEB)
          </h1>
          <p className="text-slate-500">
            Gérez les communautés ecclésiales de base de votre paroisse
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total</p>
                <h3 className="text-2xl font-bold">{cebs.length}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Church className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Solde total
                </p>
                <h3 className="text-2xl font-bold">
                  {formatCurrency(cebs.reduce((sum, c) => sum + c.solde, 0))}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Sans président
                </p>
                <h3 className="text-2xl font-bold">
                  {cebs.filter((c) => !c.president_id).length}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <User className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et bouton d'ajout */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher une CEB..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openAddModal} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle CEB
        </Button>
      </div>

      {/* Liste des CEB */}
      <Card className="bg-slate-50 border-slate-100">
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-4">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-10" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Impossible de charger les données
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                {error}
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Réessayer
              </Button>
            </div>
          ) : filteredCebs.length === 0 ? (
            <div className="text-center py-12">
              <Church className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Aucune CEB trouvée
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                {searchQuery
                  ? "Aucune CEB ne correspond à vos critères de recherche."
                  : "Aucune CEB n'est enregistrée pour cette paroisse."}
              </p>
              {searchQuery ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                  }}
                >
                  Réinitialiser la recherche
                </Button>
              ) : (
                <Button onClick={openAddModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une CEB
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Date d'ajout
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Nom
                    </th>
                    {/* <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Solde
                    </th> */}
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Président
                    </th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageItems().map((ceb) => (
                    <tr
                      key={ceb.id}
                      className="border-b border-slate-100 hover:bg-slate-100 cursor-pointer"
                      // onClick={() =>
                      //   router.push(`/dashboard/paroisse/ceb/${ceb.id}`)
                      // }
                    >
                      <td className="py-3 px-4">
                        <div className="text-sm text-slate-700">
                          {formatDate(ceb.created_at)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">
                          {ceb.nom}
                        </div>
                      </td>
                      {/* <td className="py-3 px-4">
                        <div className="font-medium text-sm">
                          {formatCurrency(ceb.solde)}
                        </div>
                      </td> */}
                      <td className="py-3 px-4">
                        {ceb.president ? (
                          <div className="flex items-center text-sm">
                            <User className="h-3.5 w-3.5 mr-1 opacity-70" />
                            <span>
                              {ceb.president.nom} {ceb.president.prenoms}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600 text-sm">
                            <User className="h-3.5 w-3.5 mr-1 opacity-70" />
                            <span>Sans président</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex cursor-pointer">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={() =>
                              router.push(`/dashboard/paroisse/ceb/${ceb.id}`)
                            }
                          >
                            <Eye className="h-4 w-4 text-slate-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {filteredCebs.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
                    {Math.min(currentPage * itemsPerPage, filteredCebs.length)}{" "}
                    sur {filteredCebs.length} CEB
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'ajout de CEB */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center">
              Nouvelle Communauté Ecclésiale de Base
            </DialogTitle>
          </DialogHeader>

          <AjouterCebForm
            onClose={() => setShowAddDialog(false)}
            onSuccess={handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de modification de CEB */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) {
            setSelectedCeb(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg text-blue-800 font-semibold flex items-center">
              Modifier la CEB
            </DialogTitle>
          </DialogHeader>

          {selectedCeb && (
            <ModifierCebForm
              onClose={() => setShowEditDialog(false)}
              cebData={selectedCeb}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
