/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Users,
  Building2,
  Crown,
  Church,
  Calendar,
  XCircle,
  Eye,
  Phone,
  Mail,
  Download,
  FileSpreadsheet,
  FileDown,
  Home,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  fetchVicariatDetails,
  VicariatDetails,
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/VicariatSecteur";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Fonctions utilitaires
const formatOrganisation = (organisation: any): string => {
  if (!organisation) return "N/A";

  if (typeof organisation === "string") return organisation;

  if (typeof organisation === "object") {
    const parts: string[] = [];

    if (organisation.vicaire_episcopal) {
      const vicaire = organisation.vicaire_episcopal;
      if (vicaire.nom && vicaire.prenoms) {
        parts.push(`Vicaire: ${vicaire.prenoms} ${vicaire.nom}`);
      }
    }

    if (organisation.cure_doyens && Array.isArray(organisation.cure_doyens)) {
      const cures = organisation.cure_doyens
        .map((cure: any) =>
          cure.nom && cure.prenoms
            ? `${cure.prenoms} ${cure.nom}`
            : "Non défini"
        )
        .join(", ");
      parts.push(`Curés doyens: ${cures}`);
    }

    return parts.length > 0 ? parts.join(" | ") : "Structure complexe";
  }

  return String(organisation);
};

const formatLocalisation = (localisation: any): string => {
  if (!localisation) return "Non spécifiée";

  if (typeof localisation === "string") return localisation;

  if (typeof localisation === "object") {
    if (localisation.type === "point" && localisation.data) {
      const { lng, lat } = localisation.data;
      return `Coordonnées: ${lat}°, ${lng}°`;
    }

    return "[Localisation géographique]";
  }

  return String(localisation);
};

const sanitizeForRender = (value: any): string | number => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (typeof value === "object") {
    if (value.type && value.data) {
      return formatLocalisation(value);
    }

    if (value.url) {
      return value.url;
    }

    if (value.nom) {
      return value.nom;
    }

    if (value.vicaire_episcopal || value.cure_doyens) {
      return formatOrganisation(value);
    }

    try {
      const keys = Object.keys(value);
      if (keys.length === 0) return "N/A";
      return `[Objet: ${keys.join(", ")}]`;
    } catch (error) {
      return "[Objet complexe]";
    }
  }

  return String(value);
};

const formatDate = (timestamp: string | number | null | undefined): string => {
  if (!timestamp) return "Non renseignée";

  try {
    const date = new Date(
      typeof timestamp === "string" ? parseInt(timestamp) : timestamp
    );

    if (isNaN(date.getTime())) {
      return "Date invalide";
    }

    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (err) {
    console.error("Erreur lors du formatage de la date:", err);
    return String(timestamp);
  }
};

// Interfaces
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

// Composants
const SafeStatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
}: StatsCardProps) => {
  const safeValue = sanitizeForRender(value);

  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-white transition-shadow duration-200">
      <CardContent className="p-y-1">
        {/* Header avec icône et menu */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`h-3 w-12 rounded-xl ${iconBgColor} flex items-center justify-center`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">{title}</h3>
        </div>
        {/* Valeur et tendance */}
        <div className="flex items-end justify-between">
          <div className="text-xl font-bold text-slate-900">{safeValue}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const SafeValue = ({
  children,
  className = "",
}: {
  children: any;
  className?: string;
}) => {
  const safeContent = sanitizeForRender(children);
  return <span className={className}>{safeContent}</span>;
};

// Composant pour la barre de recherche
const SearchBar = ({
  searchQuery,
  setSearchQuery,
  totalDoyennes,
  totalParoisses,
  onClearSearch,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalDoyennes: number;
  totalParoisses: number;
  onClearSearch: () => void;
}) => (
  <Card className="bg-white border-slate-200 mb-6">
    <CardContent className="p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Rechercher par nom, ville, quartier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>{totalDoyennes} doyenné(s)</span>
          <span>•</span>
          <span>{totalParoisses} paroisse(s)</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Composant pour la pagination
const PaginationControls = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPreviousPage,
  onNextPage,
  type,
}: {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  type: string;
}) => {
  if (totalItems <= itemsPerPage) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t border-slate-200 bg-slate-50/50">
      <div className="text-sm text-slate-500">
        Affichage de {startItem} à {endItem} sur {totalItems} {type}(s)
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="h-8 px-3 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="h-8 px-3 cursor-pointer"
        >
          Suivant <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

// Composant pour les onglets vides avec recherche
const EmptyTabContent = ({
  type,
  icon: Icon,
  searchQuery,
  onClearSearch,
}: {
  type: string;
  icon: React.ComponentType<any>;
  searchQuery: string;
  onClearSearch: () => void;
}) => (
  <div className="py-12 text-center">
    <Icon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
    {searchQuery ? (
      <>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Aucun résultat trouvé
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Aucun {type.toLowerCase()} ne correspond à votre recherche "
          {searchQuery}".
        </p>
        <Button variant="outline" onClick={onClearSearch} className="mx-auto">
          <X className="h-4 w-4 mr-2" />
          Effacer la recherche
        </Button>
      </>
    ) : (
      <>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Aucun {type.toLowerCase()} trouvé
        </h3>
        <p className="text-sm text-slate-500">
          Ce vicariat/secteur ne contient encore aucun {type.toLowerCase()}.
        </p>
      </>
    )}
  </div>
);

export default function VicariatDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const vicariatId = params?.id as string;

  const [vicariatDetails, setVicariatDetails] =
    useState<VicariatDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("organisation");

  // États pour la recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoyennes, setFilteredDoyennes] = useState<any[]>([]);
  const [filteredParoisses, setFilteredParoisses] = useState<any[]>([]);

  // États pour la pagination
  const [currentPageDoyennes, setCurrentPageDoyennes] = useState(1);
  const [currentPageParoisses, setCurrentPageParoisses] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPagesDoyennes, setTotalPagesDoyennes] = useState(1);
  const [totalPagesParoisses, setTotalPagesParoisses] = useState(1);

  // Charger les détails du vicariat au montage du composant
  useEffect(() => {
    const loadVicariatDetails = async () => {
      if (!vicariatId) {
        setError("ID du vicariat non spécifié");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchVicariatDetails(parseInt(vicariatId));
        console.log("📊 Données reçues:", data);
        setVicariatDetails(data);
      } catch (err) {
        console.error("Erreur lors du chargement des détails:", err);
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
          setError("Vicariat/secteur non trouvé.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadVicariatDetails();
  }, [vicariatId, router]);

  // Filtrer les données selon la recherche
  useEffect(() => {
    if (!vicariatDetails) return;

    const query = searchQuery.toLowerCase().trim();

    // Filtrer les doyennés
    let doyennesResults = [...vicariatDetails.doyennes];
    if (query) {
      doyennesResults = doyennesResults.filter((doyenne) =>
        doyenne.nom.toLowerCase().includes(query)
      );
    }
    setFilteredDoyennes(doyennesResults);
    setCurrentPageDoyennes(1);
    setTotalPagesDoyennes(Math.ceil(doyennesResults.length / itemsPerPage));

    // Filtrer les paroisses
    let paroissesResults = [...vicariatDetails.paroisses];
    if (query) {
      paroissesResults = paroissesResults.filter(
        (paroisse) =>
          paroisse.nom?.toLowerCase().includes(query) ||
          paroisse.ville?.toLowerCase().includes(query) ||
          paroisse.quartier?.toLowerCase().includes(query) ||
          paroisse.statut?.toLowerCase().includes(query)
      );
    }
    setFilteredParoisses(paroissesResults);
    setCurrentPageParoisses(1);
    setTotalPagesParoisses(Math.ceil(paroissesResults.length / itemsPerPage));
  }, [searchQuery, vicariatDetails, itemsPerPage]);

  // Obtenir les éléments de la page courante pour les doyennés
  const getCurrentDoyennesItems = () => {
    const startIndex = (currentPageDoyennes - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDoyennes.slice(startIndex, endIndex);
  };

  // Obtenir les éléments de la page courante pour les paroisses
  const getCurrentParoissesItems = () => {
    const startIndex = (currentPageParoisses - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredParoisses.slice(startIndex, endIndex);
  };

  // Navigation de pagination pour les doyennés
  const goToNextPageDoyennes = () => {
    if (currentPageDoyennes < totalPagesDoyennes) {
      setCurrentPageDoyennes(currentPageDoyennes + 1);
    }
  };

  const goToPreviousPageDoyennes = () => {
    if (currentPageDoyennes > 1) {
      setCurrentPageDoyennes(currentPageDoyennes - 1);
    }
  };

  // Navigation de pagination pour les paroisses
  const goToNextPageParoisses = () => {
    if (currentPageParoisses < totalPagesParoisses) {
      setCurrentPageParoisses(currentPageParoisses + 1);
    }
  };

  const goToPreviousPageParoisses = () => {
    if (currentPageParoisses > 1) {
      setCurrentPageParoisses(currentPageParoisses - 1);
    }
  };

  // Fonction pour nettoyer la recherche
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const formatExportDate = (): string => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Impossible de charger les données
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">{error}</p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" className="cursor-pointer" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  if (!vicariatDetails) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton retour */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-10 w-20 p-0 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              <SafeValue>{vicariatDetails.vicariat.nom}</SafeValue>
            </h1>
            <p className="text-slate-500">
              Détails du vicariat/secteur et de son organisation
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <SafeStatsCard
          title="Doyennés"
          value={filteredDoyennes.length}
          icon={<Building2 size={24} />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <SafeStatsCard
          title="Paroisses"
          value={filteredParoisses.length}
          icon={<Church size={24} />}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
      </div>

      {/* Barre de recherche */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalDoyennes={vicariatDetails.doyennes.length}
        totalParoisses={vicariatDetails.paroisses.length}
        onClearSearch={handleClearSearch}
      />

      {/* Onglets modernisés */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Header avec onglets */}
          <div className="px-6 py-4 border-b border-slate-200">
            <TabsList className="h-12 p-1 bg-slate-100 rounded-xl grid w-full grid-cols-3">
              <TabsTrigger
                value="organisation"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <Settings className="h-4 w-4 mr-2" />
                Organisation
              </TabsTrigger>
              <TabsTrigger
                value="doyennes"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Doyennés ({filteredDoyennes.length})
              </TabsTrigger>
              <TabsTrigger
                value="paroisses"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <Church className="h-4 w-4 mr-2" />
                Paroisses ({filteredParoisses.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Onglet Organisation */}
            <TabsContent value="organisation" className="mt-0">
              {!vicariatDetails.organisation ||
              typeof vicariatDetails.organisation !== "object" ? (
                <div className="py-12 text-center">
                  <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Aucune organisation définie
                  </h3>
                  <p className="text-sm text-slate-500">
                    Ce vicariat/secteur n'a pas encore d'organisation
                    structurée.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Vicaire Épiscopal */}
                  {vicariatDetails.organisation.vicaire_episcopal &&
                    vicariatDetails.organisation.vicaire_episcopal.nom &&
                    vicariatDetails.organisation.vicaire_episcopal.prenoms && (
                      <Card className="border-blue-200 bg-blue-50/30">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                              <Crown className="h-6 w-6 text-blue-700" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">
                                Vicaire Épiscopal
                              </h3>
                              <p className="text-sm text-slate-600">
                                Responsable du vicariat/secteur
                              </p>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <h4 className="text-xl font-bold text-slate-800 mb-2">
                              {
                                vicariatDetails.organisation.vicaire_episcopal
                                  .prenoms
                              }{" "}
                              {
                                vicariatDetails.organisation.vicaire_episcopal
                                  .nom
                              }
                            </h4>

                            {vicariatDetails.organisation.vicaire_episcopal
                              .num_de_telephone && (
                              <div className="flex items-center text-slate-600 mb-2">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>
                                  {
                                    vicariatDetails.organisation
                                      .vicaire_episcopal.num_de_telephone
                                  }
                                </span>
                              </div>
                            )}

                            {vicariatDetails.organisation.vicaire_episcopal
                              .email && (
                              <div className="flex items-center text-slate-600">
                                <Mail className="h-4 w-4 mr-2" />
                                <span>
                                  {
                                    vicariatDetails.organisation
                                      .vicaire_episcopal.email
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  {/* Curés Doyens */}
                  {vicariatDetails.organisation.cure_doyens &&
                    Array.isArray(vicariatDetails.organisation.cure_doyens) &&
                    vicariatDetails.organisation.cure_doyens.length > 0 && (
                      <Card className="border-green-200 bg-green-50/30">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                              <Users className="h-6 w-6 text-green-700" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">
                                Curés Doyens
                              </h3>
                              <p className="text-sm text-slate-600">
                                {
                                  vicariatDetails.organisation.cure_doyens
                                    .length
                                }{" "}
                                curé(s) doyen(s)
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vicariatDetails.organisation.cure_doyens.map(
                              (cure: any, index: number) => (
                                <div
                                  key={cure.id || index}
                                  className="bg-white rounded-lg p-4 border border-green-200"
                                >
                                  <div className="flex items-start">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                                      <User className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-bold text-slate-800 mb-1">
                                        {cure.prenoms} {cure.nom}
                                      </h4>

                                      {cure.num_de_telephone && (
                                        <div className="flex items-center text-sm text-slate-600 mb-1">
                                          <Phone className="h-3 w-3 mr-1" />
                                          <span>{cure.num_de_telephone}</span>
                                        </div>
                                      )}

                                      {cure.email && (
                                        <div className="flex items-center text-sm text-slate-600">
                                          <Mail className="h-3 w-3 mr-1" />
                                          <span>{cure.email}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  {/* Si aucune organisation */}
                  {(!vicariatDetails.organisation.vicaire_episcopal ||
                    !vicariatDetails.organisation.vicaire_episcopal.nom ||
                    !vicariatDetails.organisation.vicaire_episcopal.prenoms) &&
                    (!vicariatDetails.organisation.cure_doyens ||
                      !Array.isArray(
                        vicariatDetails.organisation.cure_doyens
                      ) ||
                      vicariatDetails.organisation.cure_doyens.length ===
                        0) && (
                      <div className="py-12 text-center">
                        <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                          Organisation incomplète
                        </h3>
                        <p className="text-sm text-slate-500">
                          Les informations d'organisation de ce vicariat/secteur
                          sont incomplètes.
                        </p>
                      </div>
                    )}
                </div>
              )}
            </TabsContent>

            {/* Onglet Doyennés */}
            <TabsContent value="doyennes" className="mt-0">
              {filteredDoyennes.length === 0 ? (
                <EmptyTabContent
                  type="Doyenné"
                  icon={Building2}
                  searchQuery={searchQuery}
                  onClearSearch={handleClearSearch}
                />
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-200 hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Nom du Doyenné
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Date de création
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentDoyennesItems().map((doyenne) => (
                        <TableRow
                          key={doyenne.id}
                          className="border-slate-200 hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <Building2 className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium text-slate-900">
                                <SafeValue>{doyenne.nom}</SafeValue>
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-4 text-slate-600">
                            {formatDate(doyenne.created_at)}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              onClick={() =>
                                router.push(
                                  `/dashboard/diocese/doyennes/${doyenne.id}`
                                )
                              }
                              title="Voir les détails du doyenné"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination pour les doyennés */}
                  <PaginationControls
                    currentPage={currentPageDoyennes}
                    totalPages={totalPagesDoyennes}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredDoyennes.length}
                    onPreviousPage={goToPreviousPageDoyennes}
                    onNextPage={goToNextPageDoyennes}
                    type="doyenné"
                  />
                </div>
              )}
            </TabsContent>

            {/* Onglet Paroisses */}
            <TabsContent value="paroisses" className="mt-0">
              {filteredParoisses.length === 0 ? (
                <EmptyTabContent
                  type="Paroisse"
                  icon={Church}
                  searchQuery={searchQuery}
                  onClearSearch={handleClearSearch}
                />
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-200 hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Nom de la Paroisse
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Localisation
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Statut
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Date de création
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentParoissesItems().map((paroisse) => (
                        <TableRow
                          key={paroisse.id}
                          className="border-slate-200 hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <Church className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <span className="font-medium text-slate-900">
                                  <SafeValue>
                                    {paroisse.nom || "Paroisse non défini"}
                                  </SafeValue>
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <div className="text-slate-600">
                              <div className="font-medium">
                                <SafeValue>{paroisse.ville}</SafeValue>
                              </div>
                              <div className="text-sm text-slate-500">
                                <SafeValue>{paroisse.quartier}</SafeValue>
                              </div>
                              {paroisse.localisation && (
                                <div className="text-xs text-slate-400 flex items-center mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <SafeValue>
                                    {formatLocalisation(paroisse.localisation)}
                                  </SafeValue>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <Badge
                              className={
                                paroisse.statut === "Paroisse"
                                  ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                  : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                              }
                            >
                              <SafeValue>{paroisse.statut}</SafeValue>
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 px-4 text-slate-600">
                            {formatDate(paroisse.created_at)}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              onClick={() =>
                                router.push(
                                  `/dashboard/diocese/paroisses/${paroisse.id}`
                                )
                              }
                              title="Voir les détails de la paroisse"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination pour les paroisses */}
                  <PaginationControls
                    currentPage={currentPageParoisses}
                    totalPages={totalPagesParoisses}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredParoisses.length}
                    onPreviousPage={goToPreviousPageParoisses}
                    onNextPage={goToNextPageParoisses}
                    type="paroisse"
                  />
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
