// FluxFinanciersPage.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  MoreHorizontal,
  XCircle,
  Eye,
  ArrowUpRight,
  DollarSign,
  RefreshCcw,
  CreditCard,
  Wallet,
  CalendarX2,
  CalendarIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { endOfDay, format, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Types
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

// Interface pour les statistiques
interface CompteStatistiques {
  id: number;
  abonnement: number;
  demande_de_messe: number;
  denier_de_culte: number;
  quete: number;
  don: number;
}

// Constants
const TRANSACTION_TYPES = [
  "TOUT",
  "DÉPÔT",
  "RETRAIT",
  "AIDE",
  "DIME",
  "OFFRANDE",
  "TRANSFERT",
  "ABONNEMENT",
  "COTISATION",
  "DEMANDE DE MESSE",
  "DENIER DE CULTE",
  "DON",
  "PARTICIPATION",
  "QUÊTE",
];

const TRANSACTION_STATUS = ["TOUT", "EN ATTENTE", "SUCCÈS", "ECHEC"];

export default function FluxFinanciersPage() {
  const router = useRouter();
  const [fluxFinanciers, setFluxFinanciers] = useState<FluxFinancier[]>([]);
  const [filteredFluxFinanciers, setFilteredFluxFinanciers] = useState<
    FluxFinancier[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("TOUT");
  const [statusFilter, setStatusFilter] = useState("TOUT");
  // Remplacez les états de date existants
  // Add to existing state declarations
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const [stats, setStats] = useState<CompteStatistiques>({
    id: 0,
    abonnement: 0,
    demande_de_messe: 0,
    denier_de_culte: 0,
    quete: 0,
    don: 0,
  });

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

  useEffect(() => {
    const loadFluxFinanciers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem("auth_token");

        if (!token) {
          throw new AuthenticationError("Token d'authentification non trouvé");
        }

        // Récupérer l'ID de la paroisse (à ajuster selon votre système d'authentification)
        const paroisseId = getUserParoisseId();

        if (!paroisseId) {
          throw new AuthenticationError("ID de paroisse non trouvé");
        }

        // Appel à l'API pour récupérer les flux financiers
        const response = await fetch(
          `https://api.cathoconnect.ci/api:HzF8fFua/finances/obtenir-tous?paroisse_id=${paroisseId}`,
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
        setFluxFinanciers(data);
        setFilteredFluxFinanciers(data);
      } catch (err) {
        console.error("Erreur lors du chargement des flux financiers:", err);

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
          setError("Aucun flux financier trouvé.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadFluxFinanciers();
  }, [router]);

  // Ajoutez cette fonction dans votre useEffect initial ou créez un nouvel useEffect
  useEffect(() => {
    const loadStatistiques = async () => {
      try {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem("auth_token");

        if (!token) {
          throw new AuthenticationError("Token d'authentification non trouvé");
        }

        // Récupérer l'ID de la paroisse
        const paroisseId = getUserParoisseId();

        if (!paroisseId) {
          throw new AuthenticationError("ID de paroisse non trouvé");
        }

        // Appel à l'API pour récupérer les statistiques
        const response = await fetch(
          `https://api.cathoconnect.ci/api:HzF8fFua/finances/obtenir-comptes?paroisse_id=${paroisseId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          // Gérer les différents codes d'erreur (similaire à votre code existant)
          throw new Error("Erreur lors du chargement des statistiques");
        }

        const data = await response.json();
        setStats(data.item); // Assurez-vous que la structure correspond à la réponse de l'API
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques:", err);
        // Gérer l'erreur (affichage toast, reset des stats, etc.)
      }
    };

    loadStatistiques();
  }, []);

  // Filtrer les flux financiers
  useEffect(() => {
    let results = fluxFinanciers;

    // Filtrer par type de transaction
    if (typeFilter !== "TOUT") {
      results = results.filter((flux) => flux.type === typeFilter);
    }

    // Filtrer par statut
    if (statusFilter !== "TOUT") {
      results = results.filter((flux) => flux.statut === statusFilter);
    }

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

    setFilteredFluxFinanciers(results);
  }, [searchQuery, typeFilter, statusFilter, fluxFinanciers, dateFrom, dateTo]);

  // Calculer les statistiques


  // Formater la date
  const formatDate = (timestamp: number): string => {
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (err) {
      return "Date inconnue";
    }
  };

  // Formater le montant
  const formatMontant = (montant: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(montant);
  };

  // Obtenir la couleur du badge de statut
  const getStatusBadgeVariant = (statut: string) => {
    switch (statut) {
      case "SUCCÈS":
        return "bg-green-50 text-green-700 border border-green-100 hover:bg-green-50";
      case "EN ATTENTE":
        return "bg-yellow-50 text-yellow-700 border border-yellow-100 hover:bg-yellow-50";
      case "ECHEC":
        return "bg-red-50 text-red-700 border border-red-100 hover:bg-red-50";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-50";
    }
  };

  // Statistiques

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Flux Financiers
          </h1>
          <p className="text-slate-500">
            Gérez et suivez les transactions financières de la paroisse
          </p>
        </div>
      </div>

      {/* Statistiques */}
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total</p>
                <h3 className="text-2xl font-bold">
                  {formatMontant(
                    stats.abonnement +
                      stats.demande_de_messe +
                      stats.denier_de_culte +
                      stats.quete +
                      stats.don
                  )}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Abonnement</p>
                <h3 className="text-2xl font-bold">
                  {formatMontant(stats.abonnement)}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <RefreshCcw className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Demande Messe
                </p>
                <h3 className="text-2xl font-bold">
                  {formatMontant(stats.demande_de_messe)}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <CalendarX2 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Denier Culte
                </p>
                <h3 className="text-2xl font-bold">
                  {formatMontant(stats.denier_de_culte)}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Quête</p>
                <h3 className="text-2xl font-bold">
                  {formatMontant(stats.quete)}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher par référence, type, description ou initiateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filtre de type de transaction */}
        <div className="w-full">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Type de transaction" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_TYPES.map(
                (
                  type // Continuation of FluxFinanciersPage.tsx
                ) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre de statut */}
        <div className="w-full">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Statut" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_STATUS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateFrom && !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarX2 className="mr-2 h-4 w-4" />
                {dateFrom && dateTo ? (
                  `${format(dateFrom, "dd/MM/yyyy")} - ${format(dateTo, "dd/MM/yyyy")}`
                ) : (
                  <span>Trier par dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="flex flex-col space-y-2 p-2">
                <div className="flex items-center space-x-2">
                  <Label>Du</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarX2 className="mr-2 h-4 w-4" />
                        {dateFrom ? (
                          format(dateFrom, "dd/MM/yyyy")
                        ) : (
                          <span>Date de début</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center space-x-2">
                  <Label>Au</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarX2 className="mr-2 h-4 w-4" />
                        {dateTo ? (
                          format(dateTo, "dd/MM/yyyy")
                        ) : (
                          <span>Date de fin</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {(dateFrom || dateTo) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDateFrom(undefined);
                      setDateTo(undefined);
                    }}
                    className="w-full"
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Liste des flux financiers */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
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
      ) : filteredFluxFinanciers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
          <DollarSign className="h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aucun flux financier trouvé
          </h3>
          <p className="text-sm text-slate-500 max-w-md mb-4">
            {searchQuery || typeFilter !== "TOUT" || statusFilter !== "TOUT"
              ? "Aucun flux financier ne correspond à vos critères de recherche."
              : "Aucun flux financier n'est enregistré."}
          </p>
          {searchQuery ||
          typeFilter !== "TOUT" ||
          statusFilter !== "TOUT" ||
          dateFrom ||
          dateTo ? (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("TOUT");
                setStatusFilter("TOUT");
                setDateFrom(undefined);
                setDateTo(undefined);
              }}
            >
              Réinitialiser les filtres
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
          <Table className="w-full">
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-100 border-slate-200">
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Référence
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Initiateur
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Type
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Montant
                </TableHead>

                <TableHead className="font-semibold text-slate-600 py-3 px-4">
                  Statut
                </TableHead>
                <TableHead className="font-semibold text-slate-600 py-3 px-4 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFluxFinanciers.map((flux, index) => (
                <TableRow
                  key={flux.id}
                  className={`hover:bg-slate-50/80 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"} border-slate-200`}
                >
                  <TableCell className="text-slate-500 py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full mr-2"></div>
                      {formatDate(flux.created_at)}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium text-slate-900">
                    {flux.reference}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {flux.initiateur.prenoms} {flux.initiateur.nom}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      {flux.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium text-slate-900">
                    {formatMontant(flux.montant_avec_frais)}
                  </TableCell>

                  <TableCell className="py-3 px-4">
                    <Badge
                      className={`px-2 py-1 font-normal text-xs ${getStatusBadgeVariant(flux.statut)}`}
                    >
                      {flux.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-2 px-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center text-blue-600 hover:bg-blue-50 cursor-pointer"
                        onClick={() => {
                          // TODO: Implement view details
                          toast.info("Détails du flux", {
                            description: `Référence: ${flux.reference}`,
                          });
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
            Affichage de {filteredFluxFinanciers.length} flux financier(s) sur{" "}
            {fluxFinanciers.length} au total
          </div>
        </div>
      )}

      {/* Possibilité d'ajouter des dialogs pour des actions spécifiques si nécessaire */}
    </div>
  );
}
