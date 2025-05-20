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
import ModifierMouvementForm from "@/components/forms/ModifierMouvementForm";
import DeleteConfirmationDialog from "@/components/forms/DeleteConfirmationDialog";
import { TYPES_MOUVEMENT } from "@/lib/constants";
// Types
interface Mouvement {
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
  
  // États pour les dialogues
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMouvement, setSelectedMouvement] = useState<Mouvement | null>(null);

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
  }, [router]);

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
  }, [searchQuery, typeFilter, mouvements]);

  // Formater la monnaie en FCFA
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Gérer le succès de la création
  const handleCreateSuccess = (newMouvement) => {
    // Ajouter le nouveau mouvement à la liste
    setMouvements((prevMouvements) => [
      newMouvement,
      ...prevMouvements,
    ]);
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

  // Rendu des mouvements
  const renderMouvements = () => {
    if (loading) {
      return Array(6)
        .fill(0)
        .map((_, index) => (
          <Card
            key={index}
            className="shadow-sm hover:shadow transition-shadow"
          >
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </CardContent>
          </Card>
        ));
    }

    if (error) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
          <XCircle className="h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Impossible de charger les données
          </h3>
          <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      );
    }

    if (filteredMouvements.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
          <Users className="h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aucun mouvement trouvé
          </h3>
          <p className="text-sm text-slate-500 max-w-md mb-4">
            {searchQuery || typeFilter !== "TOUS"
              ? "Aucun mouvement ou association ne correspond à vos critères de recherche."
              : "Aucun mouvement ou association n'est enregistré pour cette paroisse."}
          </p>
          {searchQuery || typeFilter !== "TOUS" ? (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("TOUS");
              }}
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
      );
    }

    return filteredMouvements.map((mouvement) => (
      <Card
        key={mouvement.id}
        className="shadow-sm hover:shadow transition-shadow h-full"
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{mouvement.nom}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEditModal(mouvement)}>
                  <Edit className="h-4 w-4 mr-2 text-blue-600" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => openDeleteModal(mouvement)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-sm">
              {formatCurrency(mouvement.solde)}
            </span>
          </div>
          {/* <div className="text-sm text-slate-500">
            {mouvement.responsable_id ? (
              <div className="flex items-center">
                <User className="h-3.5 w-3.5 mr-1 opacity-70" />
                <span>{mouvement.responsable_id} Responsable assigné</span>
              </div>
            ) : (
              <div className="flex items-center text-amber-600">
                <User className="h-3.5 w-3.5 mr-1 opacity-70" />
                <span>Sans responsable</span>
              </div>
            )}
          </div> */}
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() =>
              router.push(`/dashboard/paroisse/m&a/${mouvement.id}`)
            }
          >
            Voir les détails
          </Button>
        </CardFooter>
      </Card>
    ));
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
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

      {/* Statistiques */}
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
                  Solde total
                </p>
                <h3 className="text-2xl font-bold">
                  {formatCurrency(
                    mouvements.reduce((sum, m) => sum + m.solde, 0)
                  )}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-green-600" />
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

      {/* Filtres et recherche */}
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
        <div className="w-full md:w-64">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Filtrer par type" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-72 overflow-y-auto">
              {TYPES_MOUVEMENT_FILTER.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "TOUS" ? "Tous les types" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Mouvement
        </Button>
      </div>

      {/* Liste des mouvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {renderMouvements()}
      </div>

      {/* Dialog de confirmation de suppression */}
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

      {/* Dialog d'ajout de mouvement */}
      <Dialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      >
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg text-green-800 font-semibold flex items-center">
              Nouveau Mouvement ou Association
            </DialogTitle>
          </DialogHeader>
          
          <AjouterMouvementForm
            onClose={() => setShowAddDialog(false)}
            onSuccess={handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de modification de mouvement */}
      <Dialog 
        open={showEditDialog} 
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) {
            setSelectedMouvement(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg text-blue-800 font-semibold flex items-center">
              Modifier le mouvement
            </DialogTitle>
          </DialogHeader>
          
          {selectedMouvement && (
            <ModifierMouvementForm
              onClose={() => setShowEditDialog(false)}
              mouvementData={selectedMouvement}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}