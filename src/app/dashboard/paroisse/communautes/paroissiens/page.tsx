/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Download,
  XCircle,
  Edit,
  Mail,
  Phone,
  User,
  UserCheck,
  UserX,
  Calendar,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";
import { fetchParoissiens } from "@/services/parishioner-service";

// Importer le formulaire de modification des paroissiens
import ModifierParoissienForm from "@/components/forms/ModifierParoissienForm";

// Types
interface Paroissien {
  id: number;
  created_at: string;
  identifiant: string;
  nom: string;
  prenoms: string;
  genre: string;
  num_de_telephone: string;
  email: string;
  date_de_naissance: string;
  pays: string;
  nationalite: string;
  ville: string;
  commune: string;
  quartier: string;
  solde: number;
  est_abonne: boolean;
  date_de_fin_abonnement: number;
  statut: string;
  paroisse_id: number;
  chapelle_id: number | null;
  ceb_id: number | null;
  mouvementassociation_id: number | null;
  user_id: number | null;
  abonnement_id: number | null;
}

export default function ParoissiensPage() {
  const router = useRouter();
  const [paroissiens, setParoissiens] = useState<Paroissien[]>([]);
  const [filteredParoissiens, setFilteredParoissiens] = useState<Paroissien[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // États pour les dialogues
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedParoissien, setSelectedParoissien] =
    useState<Paroissien | null>(null);

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

  // Charger les paroissiens au montage du composant
  useEffect(() => {
    const loadParoissiens = async () => {
      setLoading(true);
      setError(null);

      try {
        const paroisseId = getUserParoisseId();
        if (!paroisseId) {
          throw new Error("ID de paroisse non disponible");
        }

        const data = await fetchParoissiens(paroisseId);
        setParoissiens(data);
        setFilteredParoissiens(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.error("Erreur lors du chargement des paroissiens:", err);
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
          setError("Aucun paroissien trouvé pour cette paroisse.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadParoissiens();
  }, [router]);

  // Filtrer les paroissiens selon la recherche
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredParoissiens(paroissiens);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const results = paroissiens.filter(
        (p) =>
          p.nom.toLowerCase().includes(query) ||
          p.prenoms.toLowerCase().includes(query) ||
          p.email?.toLowerCase().includes(query) ||
          p.num_de_telephone?.includes(query)
      );
      setFilteredParoissiens(results);
    }
    setCurrentPage(1);
    setTotalPages(Math.ceil(filteredParoissiens.length / itemsPerPage));
  }, [searchQuery, paroissiens]);

  // Calculer les paroissiens à afficher pour la pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredParoissiens.slice(startIndex, endIndex);
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

  // Formater les numéros de téléphone: 0101020304 -> 01 01 02 03 04
  const formatPhoneNumber = (phone: string | null | undefined): string => {
    if (!phone) return "Non renseigné";

    const cleaned = phone.replace(/\D/g, "");
    const groups = [];

    for (let i = 0; i < cleaned.length; i += 2) {
      groups.push(cleaned.slice(i, i + 2));
    }

    return groups.join(" ");
  };

  // Obtenir le badge de statut pour un paroissien
  const getStatusBadge = (statut: string) => {
    const statusMap: Record<
      string,
      {
        variant:
          | "default"
          | "success"
          | "secondary"
          | "outline"
          | "destructive";
        label: string;
      }
    > = {
      Baptisé: { variant: "default", label: "Baptisé" },
      Confirmé: { variant: "default", label: "Confirmé" },
      Marié: { variant: "default", label: "Marié à l'église" },
      Aucun: { variant: "outline", label: "Aucun" },
    };

    const status = statusMap[statut] || {
      variant: "outline",
      label: statut || "Aucun",
    };

    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  // Gérer le succès de la mise à jour
  const handleUpdateSuccess = (updatedParoissien: Paroissien) => {
    // Mettre à jour la liste des paroissiens
    setParoissiens((prevParoissiens) =>
      prevParoissiens.map((p) =>
        p.id === updatedParoissien.id ? updatedParoissien : p
      )
    );

    // Réinitialiser l'état
    setSelectedParoissien(null);
  };

  // Ouvrir le modal en mode édition
  const openEditModal = (paroissien: Paroissien) => {
    setSelectedParoissien(paroissien);
    setShowEditDialog(true);
  };

  // Naviguer vers la page de détails d'un paroissien
  const navigateToDetails = (paroissienId: number) => {
    router.push(`/dashboard/paroisse/communautes/paroissiens/${paroissienId}`);
  };

  // Rendu en cas de chargement
  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <Skeleton className="h-10 w-full sm:w-96" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>

            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-10" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Skeleton className="h-4 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rendu en cas d'erreur
  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Gestion des Paroissiens
            </h1>
            <p className="text-slate-500">
              Consultez et gérez les membres de votre paroisse
            </p>
          </div>
        </div>

        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-red-600 max-w-md mx-auto mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Gestion des Paroissiens
          </h1>
          <p className="text-slate-500">
            Consultez et gérez les membres de votre paroisse
          </p>
        </div>
      </div>

      <Card className="bg-slate-50 border-slate-100">
        <CardContent className="p-6">
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, prénom, email, téléphone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" title="Filtrer">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="Exporter">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Liste des paroissiens */}
          {filteredParoissiens.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Aucun paroissien trouvé
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                {searchQuery
                  ? "Aucun paroissien ne correspond à votre recherche."
                  : "Aucun paroissien n'est enregistré pour cette paroisse."}
              </p>
              {searchQuery ? (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Réinitialiser la recherche
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    router.push("/dashboard/paroisse/paroissiens/ajouter")
                  }
                >
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
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Email
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Téléphone
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Statut
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Abonnement
                    </th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageItems().map((paroissien) => (
                    <tr
                      key={paroissien.id}
                      className="border-b border-slate-100 hover:bg-slate-100 cursor-pointer"
                      onClick={() => navigateToDetails(paroissien.id)}
                    >
                      <td className="py-3 px-4">
                        <div className="text-sm text-slate-700">
                          {formatDate(paroissien.created_at)}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-xs text-slate-900">
                          {paroissien.nom} {paroissien.prenoms}
                        </div>
                        <div className="text-xs text-slate-500">
                          Né(e) le {formatDate(paroissien.date_de_naissance)}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {paroissien.email || (
                          <span className="text-slate-400">Non renseigné</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-700">
                        {formatPhoneNumber(paroissien.num_de_telephone)}
                      </td>

                      <td className="py-3 px-4">
                        {getStatusBadge(paroissien.statut)}
                      </td>

                      <td className="py-3 px-4">
                        {paroissien.est_abonne ? (
                          <Badge variant="success" className="bg-green-800">
                            {paroissien.abonnement?.intitule || "Abonné"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-500">
                            Aucun
                          </Badge>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div
                          className="inline-flex"
                          onClick={(e) => {
                            e.stopPropagation(); // Empêcher la navigation vers la page de détails
                          }}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => navigateToDetails(paroissien.id)}
                              >
                                <User className="h-4 w-4 mr-2 text-slate-500" />
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditModal(paroissien)}
                              >
                                <Edit className="h-4 w-4 mr-2 text-blue-600" />
                                Modifier
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredParoissiens.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredParoissiens.length
                )}{" "}
                sur {filteredParoissiens.length} paroissiens
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
        </CardContent>
      </Card>

      {/* Dialog de modification de paroissien */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) {
            setSelectedParoissien(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg text-blue-800 font-semibold flex items-center">
              <Edit className="h-5 w-5 mr-2 text-blue-600" />
              Modifier le paroissien
            </DialogTitle>
          </DialogHeader>

          {selectedParoissien && (
            <ModifierParoissienForm
              onClose={() => setShowEditDialog(false)}
              paroissienData={selectedParoissien}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
