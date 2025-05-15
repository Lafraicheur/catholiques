// NonParoissiensPage.jsx - Version mise à jour
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  XCircle,
  Edit,
  Phone,
  User,
  Venus,
  Mars,
  UserPlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ApiError,
} from "@/services/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Importer les formulaires séparés
import AjouterNonParoissienForm from "@/components/forms/AjouterNonParoissienForm";
import ModifierNonParoissienForm from "@/components/forms/ModifierNonParoissienForm";
import SupprimerNonParoissienConfirmation from "@/components/forms/SupprimerNonParoissienConfirmation";
import ConvertirEnParoissienForm from "@/components/forms/ConvertirEnParoissienForm";

// Types
interface NonParoissien {
  id: number;
  created_at: string;
  nom: string;
  prenom: string;
  genre: "M" | "F";
  num_de_telephone: string;
}

export default function NonParoissiensPage() {
  const router = useRouter();
  const [nonParoissiens, setNonParoissiens] = useState<NonParoissien[]>([]);
  const [filteredNonParoissiens, setFilteredNonParoissiens] = useState<
    NonParoissien[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("TOUS");

  // États pour les dialogues
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [selectedNonParoissien, setSelectedNonParoissien] =
    useState<NonParoissien | null>(null);

  useEffect(() => {
    const loadNonParoissiens = async () => {
      setLoading(true);
      setError(null);

      try {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem("auth_token");

        if (!token) {
          throw new AuthenticationError("Token d'authentification non trouvé");
        }

        // Appel à l'API pour récupérer la liste des non-paroissiens
        const response = await fetch(
          "https://api.cathoconnect.ci/api:HzF8fFua/nonparoissien/obtenir-tous",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          // Gérer les différents codes d'erreur
          if (response.status === 401) {
            throw new AuthenticationError("Session expirée");
          } else if (response.status === 403) {
            throw new ForbiddenError("Accès refusé");
          } else if (response.status === 404) {
            throw new NotFoundError("Ressource non trouvée");
          } else if (response.status === 429) {
            throw new ApiError(
              "Trop de requêtes, veuillez réessayer plus tard",
              429
            );
          } else {
            throw new ApiError(
              "Erreur lors du chargement des données",
              response.status
            );
          }
        }

        const data = await response.json();
        setNonParoissiens(data);
        setFilteredNonParoissiens(data);
      } catch (err) {
        console.error("Erreur lors du chargement des non-paroissiens:", err);

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
          setError("Aucun non-paroissien trouvé.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadNonParoissiens();
  }, [router]);

  // Filtrer les non-paroissiens selon la recherche et le genre
  useEffect(() => {
    let results = nonParoissiens;

    // Filtrer par genre
    if (genreFilter !== "TOUS") {
      results = results.filter((np) => np.genre === genreFilter);
    }

    // Filtrer par recherche (nom, prénom ou téléphone)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (np) =>
          np.nom.toLowerCase().includes(query) ||
          np.prenom.toLowerCase().includes(query) ||
          np.num_de_telephone?.includes(query)
      );
    }

    setFilteredNonParoissiens(results);
  }, [searchQuery, genreFilter, nonParoissiens]);

  // Formatage de la date
  const formatDate = (dateString: string): string => {
    if (dateString === "now") return "Récemment";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch (err) {
      return "Date inconnue";
    }
  };

  // Formater le numéro pour l'affichage (XX XX XX XX XX)
  const formatPhoneDisplay = (phone: string) => {
    if (!phone) return "";
    const groups = [];
    for (let i = 0; i < phone.length; i += 2) {
      groups.push(phone.slice(i, i + 2));
    }
    return groups.join(" ");
  };

  // Gérer le succès de l'ajout
  const handleCreateSuccess = (newNonParoissien) => {
    // Ajouter le nouveau non-paroissien à la liste
    setNonParoissiens((prevList) => [newNonParoissien, ...prevList]);
  };

  // Gérer le succès de la modification
  const handleUpdateSuccess = (updatedNonParoissien) => {
    // Mettre à jour la liste
    setNonParoissiens((prevList) =>
      prevList.map((item) =>
        item.id === updatedNonParoissien.id ? updatedNonParoissien : item
      )
    );
    // Réinitialiser l'état
    setSelectedNonParoissien(null);
  };

  // Gérer le succès de la suppression
  const handleDeleteSuccess = (deletedId) => {
    // Mettre à jour la liste
    setNonParoissiens((prevList) =>
      prevList.filter((item) => item.id !== deletedId)
    );
    // Réinitialiser l'état
    setSelectedNonParoissien(null);
  };

  // Gérer le succès de la conversion
  const handleConvertSuccess = (convertedId) => {
    // Mettre à jour la liste
    setNonParoissiens((prevList) =>
      prevList.filter((item) => item.id !== convertedId)
    );
    // Réinitialiser l'état
    setSelectedNonParoissien(null);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Non-Paroissiens
          </h1>
          <p className="text-slate-500">
            Gérez les personnes non inscrites à la paroisse
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
                <h3 className="text-2xl font-bold">{nonParoissiens.length}</h3>
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
                <p className="text-sm font-medium text-slate-500">Hommes</p>
                <h3 className="text-2xl font-bold">
                  {nonParoissiens.filter((np) => np.genre === "M").length}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Mars className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Femmes</p>
                <h3 className="text-2xl font-bold">
                  {nonParoissiens.filter((np) => np.genre === "F").length}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                <Venus className="h-5 w-5 text-pink-600" />
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
            placeholder="Rechercher par nom, prénom ou téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Genre" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TOUS">Tous</SelectItem>
              <SelectItem value="M">Hommes</SelectItem>
              <SelectItem value="F">Femmes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau
        </Button>
      </div>

      {/* Liste des non-paroissiens */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
          <XCircle className="h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Impossible de charger les données
          </h3>
          <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      ) : filteredNonParoissiens.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
          <Users className="h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aucun non-paroissien trouvé
          </h3>
          <p className="text-sm text-slate-500 max-w-md mb-4">
            {searchQuery || genreFilter !== "TOUS"
              ? "Aucun non-paroissien ne correspond à vos critères de recherche."
              : "Aucun non-paroissien n'est enregistré."}
          </p>
          {searchQuery || genreFilter !== "TOUS" ? (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setGenreFilter("TOUS");
              }}
            >
              Réinitialiser les filtres
            </Button>
          ) : (
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un non-paroissien
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
          <Table className="w-full">
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-100 border-slate-200">
                <TableHead className="font-semibold text-slate-600 py-3 px-4 w-[180px]">
                  Date de Création
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Nom & Prénom
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4 w-[100px]">
                  Genre
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Téléphone
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4 w-[100px] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNonParoissiens.map((np, index) => (
                <TableRow
                  key={np.id}
                  className={`hover:bg-slate-50/80 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"} border-slate-200`}
                >
                  <TableCell className="text-slate-500 py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      {formatDate(np.created_at)}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium text-slate-900">
                          {np.prenom} {np.nom}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          np.genre === "M" ? "bg-blue-100" : "bg-pink-100"
                        }`}
                      >
                        {np.genre === "M" ? (
                          <Mars className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Venus className="h-4 w-4 text-pink-600" />
                        )}
                      </div>

                      <Badge
                        className={`px-2 py-1 font-normal text-xs ${
                          np.genre === "M"
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-100"
                            : "bg-pink-50 text-pink-700 hover:bg-pink-50 border border-pink-100"
                        }`}
                      >
                        {np.genre === "M" ? "Homme" : "Femme"}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 px-4">
                    {np.num_de_telephone ? (
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 text-slate-400 mr-2" />
                        <span className="font-medium">
                          {formatPhoneDisplay(np.num_de_telephone)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm italic">
                        Non renseigné
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-right py-2 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-slate-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedNonParoissien(np);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2 text-blue-600" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedNonParoissien(np);
                            setShowConvertDialog(true);
                          }}
                        >
                          <UserPlus className="h-4 w-4 mr-2 text-green-600" />
                          Convertir en paroissien
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedNonParoissien(np);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
            Affichage de {filteredNonParoissiens.length} non-paroissien(s) sur{" "}
            {nonParoissiens.length} au total
          </div>
        </div>
      )}

      {/* Dialog d'ajout */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px] w-[92vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2 text-green-600" />
              Ajouter un non-paroissien
            </DialogTitle>
          </DialogHeader>

          <AjouterNonParoissienForm
            onClose={() => setShowAddDialog(false)}
            onSuccess={handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) {
            setSelectedNonParoissien(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] w-[92vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center">
              <Edit className="h-5 w-5 mr-2 text-blue-600" />
              Modifier un non-paroissien
            </DialogTitle>
          </DialogHeader>

          {selectedNonParoissien && (
            <ModifierNonParoissienForm
              nonParoissien={selectedNonParoissien}
              onClose={() => setShowEditDialog(false)}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) {
            setSelectedNonParoissien(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          {selectedNonParoissien && (
            <SupprimerNonParoissienConfirmation
              nonParoissien={selectedNonParoissien}
              onClose={() => setShowDeleteDialog(false)}
              onSuccess={handleDeleteSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de conversion en paroissien */}
      <Dialog
        open={showConvertDialog}
        onOpenChange={(open) => {
          setShowConvertDialog(open);
          if (!open) {
            setSelectedNonParoissien(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] w-[92vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-green-600" />
              Convertir en paroissien
            </DialogTitle>
          </DialogHeader>

          {selectedNonParoissien && (
            <ConvertirEnParoissienForm
              nonParoissien={selectedNonParoissien}
              onClose={() => setShowConvertDialog(false)}
              onSuccess={handleConvertSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
