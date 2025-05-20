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
  }, [router]);

  // Filtrer les CEB selon la recherche
  useEffect(() => {
    let results = cebs;

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter((ceb) =>
        ceb.nom.toLowerCase().includes(query)
      );
    }

    setFilteredCebs(results);
  }, [searchQuery, cebs]);

  // Formater la monnaie en FCFA
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(amount);
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

  // Rendu des CEB
  const renderCebs = () => {
    if (loading) {
      return Array(6)
        .fill(0)
        .map((_, index) => (
          <Card
            key={index}
            className="shadow-sm hover:shadow transition-shadow bg-slate-50 border-slate-100"
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

    if (filteredCebs.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
          <Church className="h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aucune CEB trouvée
          </h3>
          <p className="text-sm text-slate-500 max-w-md mb-4">
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
      );
    }

    return filteredCebs.map((ceb) => (
      <Card
        key={ceb.id}
        className="shadow-sm hover:shadow transition-shadow h-full bg-slate-50 border-slate-100"
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{ceb.nom}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEditModal(ceb)}>
                  <Edit className="h-4 w-4 mr-2 text-blue-600" />
                  Modifier
                </DropdownMenuItem>
                {/* <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => openDeleteModal(ceb)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-sm">
              {formatCurrency(ceb.solde)}
            </span>
          </div>
          {/* <div className="text-sm text-slate-500">
            {ceb.president ? (
              <div className="flex items-center">
                <User className="h-3.5 w-3.5 mr-1 opacity-70" />
                <span>
                  {ceb.president.nom} {ceb.president.prenoms}
                </span>
              </div>
            ) : (
              <div className="flex items-center text-amber-600">
                <User className="h-3.5 w-3.5 mr-1 opacity-70" />
                <span>Sans président</span>
              </div>
            )}
          </div> */}
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => router.push(`/dashboard/paroisse/ceb/${ceb.id}`)}
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
                  {formatCurrency(
                    cebs.reduce((sum, c) => sum + c.solde, 0)
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
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle CEB
        </Button>
      </div>

      {/* Liste des CEB */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {renderCebs()}
      </div>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          {selectedCeb && (
            <DeleteCebConfirmation
              ceb={selectedCeb}
              onClose={() => setShowDeleteDialog(false)}
              onSuccess={handleDeleteSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog d'ajout de CEB */}
      <Dialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      >
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg text-green-800 font-semibold flex items-center">
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