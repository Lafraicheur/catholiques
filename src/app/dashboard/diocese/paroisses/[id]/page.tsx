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
  UserCheck,
  Settings,
  UserPlus,
  CheckCircle,
  XIcon,
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
  fetchParoisseDetails,
  ParoisseDetails,
  formatTimestamp,
  getFullName,
  formatLocalisation,
  formatGenre,
  formatStatutAbonnement,
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/ParoiseofDiocese";
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
  return formatTimestamp(timestamp);
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
  totalParoissiens,
  onClearSearch,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalParoissiens: number;
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
              placeholder="Rechercher par nom, prénom, téléphone..."
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
          <span>{totalParoissiens} paroissien(s)</span>
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
          Cette paroisse ne contient encore aucun {type.toLowerCase()}.
        </p>
      </>
    )}
  </div>
);

export default function ParoisseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const paroisseId = params?.id as string;

  const [paroisseDetails, setParoisseDetails] =
    useState<ParoisseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("organisation");

  // États pour la recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredParoissiens, setFilteredParoissiens] = useState<any[]>([]);

  // États pour la pagination
  const [currentPageParoissiens, setCurrentPageParoissiens] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPagesParoissiens, setTotalPagesParoissiens] = useState(1);

  // Charger les détails de la paroisse au montage du composant
  useEffect(() => {
    const loadParoisseDetails = async () => {
      if (!paroisseId) {
        setError("ID de la paroisse non spécifié");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchParoisseDetails(parseInt(paroisseId));
        console.log("📊 Données reçues:", data);
        setParoisseDetails(data);
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
          setError("Paroisse non trouvée.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadParoisseDetails();
  }, [paroisseId, router]);

  // Filtrer les données selon la recherche
  useEffect(() => {
    if (!paroisseDetails) return;

    const query = searchQuery.toLowerCase().trim();

    // Filtrer les paroissiens
    let paroissensResults = [...paroisseDetails.paroissiens];
    if (query) {
      paroissensResults = paroissensResults.filter(
        (paroissien) =>
          paroissien.nom?.toLowerCase().includes(query) ||
          paroissien.prenoms?.toLowerCase().includes(query) ||
          paroissien.num_de_telephone?.toLowerCase().includes(query) ||
          paroissien.statut?.toLowerCase().includes(query)
      );
    }
    setFilteredParoissiens(paroissensResults);
    setCurrentPageParoissiens(1);
    setTotalPagesParoissiens(
      Math.ceil(paroissensResults.length / itemsPerPage)
    );
  }, [searchQuery, paroisseDetails, itemsPerPage]);

  // Obtenir les éléments de la page courante pour les paroissiens
  const getCurrentParoissiensItems = () => {
    const startIndex = (currentPageParoissiens - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredParoissiens.slice(startIndex, endIndex);
  };

  // Navigation de pagination pour les paroissiens
  const goToNextPageParoissiens = () => {
    if (currentPageParoissiens < totalPagesParoissiens) {
      setCurrentPageParoissiens(currentPageParoissiens + 1);
    }
  };

  const goToPreviousPageParoissiens = () => {
    if (currentPageParoissiens > 1) {
      setCurrentPageParoissiens(currentPageParoissiens - 1);
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
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  if (!paroisseDetails) {
    return null;
  }

  // Calculer les statistiques
  const getStatistics = () => {
    const totalParoissiens = filteredParoissiens.length;
    const paroissensAbornes = paroisseDetails.paroissiens.filter(
      (p) => p.est_abonne
    ).length;
    const paroissiensBaptises = paroisseDetails.paroissiens.filter((p) =>
      p.statut?.toLowerCase().includes("baptis")
    ).length;

    return {
      totalParoissiens,
      paroissensAbornes,
      paroissiensBaptises,
    };
  };

  const stats = getStatistics();

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
              <SafeValue>{paroisseDetails.paroisse.nom}</SafeValue> ({paroisseDetails.paroisse.ville} {paroisseDetails.paroisse.quartier} )
            </h1>
            <p className="text-slate-500">
              Détails de la{" "}
              <Badge
                className={
                  paroisseDetails.paroisse.statut
                    ?.toLowerCase()
                    .includes("quasi")
                    ? "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200"
                    : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                }
              >
                {paroisseDetails.paroisse.statut}
              </Badge>
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SafeStatsCard
          title="Total Paroissiens"
          value={stats.totalParoissiens}
          icon={<Users size={24} />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <SafeStatsCard
          title="Abonnés"
          value={stats.paroissensAbornes}
          icon={<CheckCircle size={24} />}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />

        <SafeStatsCard
          title="Baptisés"
          value={stats.paroissiensBaptises}
          icon={<UserPlus size={24} />}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Barre de recherche */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalParoissiens={paroisseDetails.paroissiens.length}
        onClearSearch={handleClearSearch}
      />

      {/* Onglets modernisés */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Header avec onglets */}
          <div className="px-6 py-4 border-b border-slate-200">
            <TabsList className="h-12 p-1 bg-slate-100 rounded-xl grid w-full grid-cols-2">
              <TabsTrigger
                value="organisation"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <Settings className="h-4 w-4 mr-2" />
                Organisation
              </TabsTrigger>
              <TabsTrigger
                value="paroissiens"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <Users className="h-4 w-4 mr-2" />
                Paroissiens ({filteredParoissiens.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Onglet Organisation */}
            <TabsContent value="organisation" className="mt-0">
              {!paroisseDetails.organisation ||
              typeof paroisseDetails.organisation !== "object" ? (
                <div className="py-12 text-center">
                  <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Aucune organisation définie
                  </h3>
                  <p className="text-sm text-slate-500">
                    Cette paroisse n'a pas encore d'organisation structurée.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Curé */}
                  {paroisseDetails.organisation.cure && (
                    <Card className="border-blue-200 bg-blue-50/30">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <Crown className="h-6 w-6 text-blue-700" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                              Curé
                            </h3>
                            <p className="text-sm text-slate-600">
                              Responsable de la paroisse
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <h4 className="text-xl font-bold text-slate-800 mb-2">
                            {getFullName(paroisseDetails.organisation.cure)}
                          </h4>

                          {paroisseDetails.organisation.cure
                            .num_de_telephone && (
                            <div className="flex items-center text-slate-600 mb-2">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>
                                {
                                  paroisseDetails.organisation.cure
                                    .num_de_telephone
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Vicaires */}
                  {paroisseDetails.organisation.vicaires &&
                    Array.isArray(paroisseDetails.organisation.vicaires) &&
                    paroisseDetails.organisation.vicaires.length > 0 && (
                      <Card className="border-green-200 bg-green-50/30">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                              <Users className="h-6 w-6 text-green-700" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">
                                Vicaires
                              </h3>
                              <p className="text-sm text-slate-600">
                                {paroisseDetails.organisation.vicaires.length}{" "}
                                vicaire(s)
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {paroisseDetails.organisation.vicaires.map(
                              (vicaire: any, index: number) => (
                                <div
                                  key={vicaire.id || index}
                                  className="bg-white rounded-lg p-4 border border-green-200"
                                >
                                  <div className="flex items-start">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                                      <User className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-bold text-slate-800 mb-1">
                                        {getFullName(vicaire)}
                                      </h4>

                                      {vicaire.num_de_telephone && (
                                        <div className="flex items-center text-sm text-slate-600 mb-1">
                                          <Phone className="h-3 w-3 mr-1" />
                                          <span>
                                            {vicaire.num_de_telephone}
                                          </span>
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
                  {(!paroisseDetails.organisation.cure ||
                    !paroisseDetails.organisation.cure.nom) &&
                    (!paroisseDetails.organisation.vicaires ||
                      !Array.isArray(paroisseDetails.organisation.vicaires) ||
                      paroisseDetails.organisation.vicaires.length === 0) && (
                      <div className="py-12 text-center">
                        <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                          Organisation incomplète
                        </h3>
                        <p className="text-sm text-slate-500">
                          Les informations d'organisation de cette paroisse sont
                          incomplètes.
                        </p>
                      </div>
                    )}
                </div>
              )}
            </TabsContent>

            {/* Onglet Paroissiens */}
            <TabsContent value="paroissiens" className="mt-0">
              {filteredParoissiens.length === 0 ? (
                <EmptyTabContent
                  type="Paroissien"
                  icon={Users}
                  searchQuery={searchQuery}
                  onClearSearch={handleClearSearch}
                />
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-200 hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Paroissien
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Contact
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Genre
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Statut
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Abonnement
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentParoissiensItems().map((paroissien) => (
                        <TableRow
                          key={paroissien.id}
                          className="border-slate-200 hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3">
                                {paroissien.photo?.url ? (
                                  <img
                                    src={paroissien.photo.url}
                                    alt={`${paroissien.prenoms} ${paroissien.nom}`}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white font-medium text-sm">
                                    {paroissien.prenoms?.[0]?.toUpperCase()}
                                    {paroissien.nom?.[0]?.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className="font-medium text-slate-900">
                                  {paroissien.prenoms} {paroissien.nom}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="py-3 px-4">
                            <div className="flex items-center text-slate-600">
                              <Phone className="h-4 w-4 mr-2 text-slate-400" />
                              <span>
                                {paroissien.num_de_telephone || "Non renseigné"}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="py-3 px-4">
                            <Badge
                              className={
                                paroissien.genre === "M"
                                  ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                  : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
                              }
                            >
                              {formatGenre(paroissien.genre)}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-3 px-4">
                            <Badge
                              className={
                                paroissien.statut
                                  ?.toLowerCase()
                                  .includes("baptis")
                                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                  : paroissien.statut === "Aucun"
                                    ? "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                              }
                            >
                              {paroissien.statut || "Non défini"}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-3 px-4">
                            <div className="flex items-center">
                              {paroissien.est_abonne ? (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  <div>
                                    <span className="font-medium">Abonné</span>
                                    {paroissien.date_de_fin_abonnement && (
                                      <div className="text-xs text-slate-500">
                                        Jusqu'au{" "}
                                        {new Date(
                                          paroissien.date_de_fin_abonnement
                                        ).toLocaleDateString("fr-FR")}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center text-slate-500">
                                  <XIcon className="h-4 w-4 mr-2" />
                                  <span>Non abonné</span>
                                </div>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              onClick={() =>
                                router.push(
                                  `/dashboard/diocese/paroisses/paroissiens/${paroissien.id}`
                                )
                              }
                              title="Voir les détails du paroissien"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination pour les paroissiens */}
                  <PaginationControls
                    currentPage={currentPageParoissiens}
                    totalPages={totalPagesParoissiens}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredParoissiens.length}
                    onPreviousPage={goToPreviousPageParoissiens}
                    onNextPage={goToNextPageParoissiens}
                    type="paroissien"
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
