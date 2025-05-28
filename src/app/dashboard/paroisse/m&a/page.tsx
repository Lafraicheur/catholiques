/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Calendar,
  Phone,
  Shield,
  Cross,
  Edit,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
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
  fetchMouvements,
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";

// Importer les nouveaux composants de formulaire
import AjouterMouvementForm from "@/components/forms/AjouterMouvementForm";
import DeleteConfirmationDialog from "@/components/forms/DeleteConfirmationDialog";
import { TYPES_MOUVEMENT } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Types
interface Mouvement {
  [x: string]: any;
  id: number;
  created_at: string;
  identifiant: string;
  nom: string;
  solde: number;
  type: string;
  responsable_id: number | null;
  parrain_id: number | null;
  aumonier_id: number | null;
  paroisse_id: number;
  chapelle_id: number | null;
}

// Types pour les filtres
const TYPES_MOUVEMENT_FILTER = ["TOUS", ...TYPES_MOUVEMENT];

export default function MouvementsAssociationsPage() {
  const router = useRouter();
  const [mouvements, setMouvements] = useState<Mouvement[]>([]);
  const [filteredMouvements, setFilteredMouvements] = useState<Mouvement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("TOUS");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // États pour les dialogues
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMouvement, setSelectedMouvement] = useState<Mouvement | null>(
    null
  );

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

  // Charger les mouvements au montage du composant
  useEffect(() => {
    const loadMouvements = async () => {
      setLoading(true);
      setError(null);

      try {
        const paroisseId = getUserParoisseId();
        if (!paroisseId) {
          throw new Error("ID de paroisse non disponible");
        }

        const data = await fetchMouvements(paroisseId);
        setMouvements(data);
        setFilteredMouvements(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.error("Erreur lors du chargement des mouvements:", err);
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
          setError(
            "Aucun mouvement ou association trouvé pour cette paroisse."
          );
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadMouvements();
  }, [router, itemsPerPage]);

  // Filtrer les mouvements selon la recherche et le type
  useEffect(() => {
    let results = mouvements;

    // Filtrer par type
    if (typeFilter !== "TOUS") {
      results = results.filter((mouv) => mouv.type === typeFilter);
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter((mouv) =>
        mouv.nom.toLowerCase().includes(query)
      );
    }

    setFilteredMouvements(results);
    setCurrentPage(1);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
  }, [searchQuery, typeFilter, mouvements, itemsPerPage]);

  // Calculer les mouvements à afficher pour la pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMouvements.slice(startIndex, endIndex);
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
  const handleCreateSuccess = (newMouvement) => {
    // Ajouter le nouveau mouvement à la liste
    setMouvements((prevMouvements) => [newMouvement, ...prevMouvements]);
  };

  // Gérer le succès de la mise à jour
  const handleUpdateSuccess = (updatedMouvement) => {
    // Remplacer le mouvement existant dans la liste
    setMouvements((prevMouvements) =>
      prevMouvements.map((m) =>
        m.id === updatedMouvement.id ? updatedMouvement : m
      )
    );
    // Réinitialiser les états
    setSelectedMouvement(null);
  };

  // Gérer le succès de la suppression
  const handleDeleteSuccess = (deletedId) => {
    // Filtrer le mouvement supprimé de la liste
    const updatedList = mouvements.filter((m) => m.id !== deletedId);
    setMouvements(updatedList);

    // Réinitialiser l'état
    setSelectedMouvement(null);
  };

  // Ouvrir le modal en mode édition
  const openEditModal = (mouvement) => {
    setSelectedMouvement(mouvement);
    setShowEditDialog(true);
  };

  // Ouvrir le modal en mode suppression
  const openDeleteModal = (mouvement) => {
    setSelectedMouvement(mouvement);
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
            Mouvements et Associations
          </h1>
          <p className="text-slate-500">
            Gérez les mouvements et associations de votre paroisse
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total</p>
                <h3 className="text-2xl font-bold">{mouvements.length}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Sans responsable
                </p>
                <h3 className="text-2xl font-bold">
                  {mouvements.filter((m) => !m.responsable_id).length}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <User className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher un mouvement ou une association..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full md:w-120">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <div className="flex items-center cursor-pointer">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Filtrer par type" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-72 overflow-y-auto">
              {TYPES_MOUVEMENT_FILTER.map((type) => (
                <SelectItem key={type} value={type} className="cursor-pointer">
                  {type === "TOUS" ? "TOUS LES TYPES" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAddModal} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Mouvement
        </Button>
      </div>

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
          <Button variant="outline" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      ) : filteredMouvements.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aucun mouvement trouvé
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            {searchQuery || typeFilter !== "TOUS"
              ? "Aucun mouvement ou association ne correspond à vos critères de recherche."
              : "Aucun mouvement ou association n'est enregistré pour cette paroisse."}
          </p>
          {searchQuery || typeFilter !== "TOUS" ? (
            <Button
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("TOUS");
              }}
              className="cursor-pointer"
            >
              Réinitialiser les filtres
            </Button>
          ) : (
            <Button onClick={openAddModal}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un mouvement
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
          <Table className="w-full">
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-100 border-slate-200">
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Date d'ajout
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Nom Complets
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Type
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Responsable
                </TableHead>
                <TableHead className="font-semibold text-center text-slate-600 py-3 px-4">
                  Total Membres
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4 text-right">
                  Détails
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {getCurrentPageItems().map((mouvement) => (
                <TableRow
                  key={mouvement.id}
                  className="hover:bg-slate-50/80 border-slate-200"
                >
                  <TableCell className="text-slate-500 py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full mr-2 " />
                      {formatDate(mouvement.created_at)}{" "}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium text-slate-900">
                    {mouvement.nom}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {mouvement.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {mouvement.responsable_id ? (
                      <div className="flex items-center text-sm">
                        <User className="h-3.5 w-3.5 mr-1 opacity-70" />
                        <span>
                          {mouvement.responsable.nom}{" "}
                          {mouvement.responsable.prenoms}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm">Aucun</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-medium">0</TableCell>
                  <TableCell className="text-right py-2 px-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center text-blue-600 hover:bg-blue-50 cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/paroisse/m&a/${mouvement.id}`)
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {currentPage} sur {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          {selectedMouvement && (
            <DeleteConfirmationDialog
              mouvement={selectedMouvement}
              onClose={() => setShowDeleteDialog(false)}
              onSuccess={handleDeleteSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center">
              Nouveau Mouvement ou Association
            </DialogTitle>
          </DialogHeader>
          <AjouterMouvementForm
            onClose={() => setShowAddDialog(false)}
            onSuccess={handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// <div className="container mx-auto py-6">
