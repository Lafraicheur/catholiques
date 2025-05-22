/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Church,
  Search,
  Plus,
  FileText,
  Filter,
  Wallet,
  User,
  MoreHorizontal,
  XCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Hand,
  Clock,
  CalendarDays,
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import axios from "axios";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";

// Types
interface Initiateur {
  nom: string;
  prenoms: string;
  num_de_telephone: string;
}

interface Messe {
  id: number;
  created_at: string;
  libelle: string;
  type: string;
  date_de_debut: number;
  extras: Record<string, any>;
  paroisse_id: number;
}

interface DemandeMesse {
  id: number;
  created_at: string;
  demandeur: string;
  intention: string;
  concerne: string;
  description: string;
  est_payee: boolean;
  messe_id: number;
  paroisse_id: number;
  messe?: Messe;
  initiateur?: Initiateur;
}

// Service pour récupérer les demandes de messe
const fetchDemandesMesse = async (
  paroisseId: number
): Promise<DemandeMesse[]> => {
  const API_URL = "https://api.cathoconnect.ci/api:HzF8fFua";
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new AuthenticationError("Token d'authentification non trouvé");
  }

  try {
    const response = await axios.get(`${API_URL}/demandemesse/obtenir-tous`, {
      params: { paroisse_id: paroisseId },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return response.data.items || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.message || "Une erreur est survenue";

      switch (statusCode) {
        case 401:
          throw new AuthenticationError(errorMessage);
        case 403:
          throw new ForbiddenError(errorMessage);
        case 404:
          throw new NotFoundError(errorMessage);
        default:
          throw new Error(errorMessage);
      }
    }
    throw error;
  }
};

export default function DemandeMessePage() {
  const router = useRouter();
  const [demandes, setDemandes] = useState<DemandeMesse[]>([]);
  const [filteredDemandes, setFilteredDemandes] = useState<DemandeMesse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Filtres
  const [filtrePayee, setFiltrePayee] = useState<boolean | null>(null);

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

  // Charger les demandes de messe au montage du composant
  useEffect(() => {
    const loadDemandesMesse = async () => {
      setLoading(true);
      setError(null);

      try {
        const paroisseId = getUserParoisseId();
        if (!paroisseId) {
          throw new Error("ID de paroisse non disponible");
        }

        const data = await fetchDemandesMesse(paroisseId);
        setDemandes(data);
        setFilteredDemandes(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.error("Erreur lors du chargement des demandes de messe:", err);
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
          setError("Aucune demande de messe trouvée pour cette paroisse.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDemandesMesse();
  }, [router]);

  // Filtrer les demandes selon la recherche et le statut de paiement
  useEffect(() => {
    let results = demandes;

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (demande) =>
          demande.demandeur.toLowerCase().includes(query) ||
          demande.concerne.toLowerCase().includes(query) ||
          demande.intention.toLowerCase().includes(query) ||
          demande.description?.toLowerCase().includes(query)
      );
    }

    // Filtrer par statut de paiement
    if (filtrePayee !== null) {
      results = results.filter((demande) => demande.est_payee === filtrePayee);
    }

    setFilteredDemandes(results);
    setCurrentPage(1);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
  }, [searchQuery, filtrePayee, demandes, itemsPerPage]);

  // Calculer les demandes à afficher pour la pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDemandes.slice(startIndex, endIndex);
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

  // Formater la date: 2023-05-15 -> 15/05/2023
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

  // Formater la date à partir d'un timestamp pour les dates de messe
  const formatTimestamp = (timestamp: number | null | undefined): string => {
    if (!timestamp) return "Non programmée";

    try {
      // Ajuster si le timestamp est en secondes (10 chiffres ou moins)
      const adjustedTimestamp =
        String(timestamp).length <= 10
          ? timestamp * 1000 // En secondes, convertir en ms
          : timestamp; // Déjà en ms

      const date = new Date(adjustedTimestamp);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (err) {
      console.error("Erreur lors du formatage du timestamp:", err, timestamp);
      return "Date invalide";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Demandes de Messe
          </h1>
          <p className="text-slate-500">
            Consultez et gérez les demandes de messe de votre paroisse
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
                <h3 className="text-2xl font-bold">{demandes.length}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Hand className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Payées</p>
                <h3 className="text-2xl font-bold">
                  {demandes.filter((d) => d.est_payee).length}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Non payées</p>
                <h3 className="text-2xl font-bold">
                  {demandes.filter((d) => !d.est_payee).length}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et filtres */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher une demande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filtrePayee === true ? "default" : "outline"}
            onClick={() => setFiltrePayee(filtrePayee === true ? null : true)}
            className="cursor-pointer"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Payées
          </Button>
          <Button
            variant={filtrePayee === false ? "default" : "outline"}
            onClick={() => setFiltrePayee(filtrePayee === false ? null : false)}
            className="cursor-pointer"
          >
            <Clock className="h-4 w-4 mr-2" />
            Non payées
          </Button>
        </div>
      </div>

      {/* Liste des demandes */}
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
          ) : filteredDemandes.length === 0 ? (
            <div className="text-center py-12">
              <Hand className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Aucune demande de messe trouvée
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                {searchQuery || filtrePayee !== null
                  ? "Aucune demande ne correspond à vos critères de recherche."
                  : "Aucune demande n'est enregistrée pour cette paroisse."}
              </p>
              {searchQuery || filtrePayee !== null ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setFiltrePayee(null);
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Date de demande
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Initateur
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Demandeur
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Intention
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Concerne
                    </th>
                    <th className="py-3 px-5 text-left text-sm font-medium text-slate-500">
                      Statut
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                      Messe
                    </th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageItems().map((demande) => (
                    <tr
                      key={demande.id}
                      className="border-b border-slate-100 hover:bg-slate-100 cursor-pointer"
                      // onClick={() =>
                      //   router.push(
                      //     `/dashboard/paroisse/demandemesse/${demande.id}`
                      //   )
                      // }
                    >
                      <td className="py-3 px-4">
                        <div className="text-sm text-slate-700">
                          {formatDate(demande?.created_at)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-slate-700 whitespace-nowrap">
                          {demande?.initiateur?.prenoms} {demande?.initiateur?.nom}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-700 whitespace-nowrap">
                          {demande?.demandeur}
                        </div>
                        {/* {demande.initiateur && (
                          <div className="text-xs text-slate-500">
                            Par: {demande.initiateur.prenoms} {demande.initiateur.nom}
                          </div>
                        )} */}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-slate-700 whitespace-nowrap">
                          {demande?.intention}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-slate-700 whitespace-nowrap">
                          {demande?.concerne}
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        {demande?.est_payee ? (
                          <Badge
                            variant="success"
                            className="bg-green-100 text-green-800 hover:bg-green-200 text-xs whitespace-nowrap py-0.5 px-1.5 "
                          >
                            <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                            Payée
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 hover:bg-amber-200 text-[12px] whitespace-nowrap py-0.5 px-1.5"
                          >
                            <Clock className="h-2.5 w-2.5 mr-0.5" />
                            Non Payée
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-700">
                          {demande.messe?.libelle}
                        </div>
                        <div className="text-xs text-slate-500">
                          {demande.messe?.extras.type_messe}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/dashboard/paroisse/demandemesse/${demande.id}`
                              )
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
              {filteredDemandes.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredDemandes.length
                    )}{" "}
                    sur {filteredDemandes.length} demandes
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
    </div>
  );
}
