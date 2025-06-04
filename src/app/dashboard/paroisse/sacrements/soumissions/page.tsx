/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Heart,
  User,
  Users,
  Loader2,
  XCircle,
  Search,
  AlertTriangle,
  Eye,
  BookOpenText,
} from "lucide-react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";

// Types pour les fichiers d'images
interface ImageFile {
  url: string;
}

// Types pour les personnes
interface Personne {
  id: number;
  nom: string;
  prenoms: string;
  statut?: string;
  paroisse_id: number;
  genre?: string;
  num_de_telephone?: string;
}

// Types pour les sacrements
interface SacrementIndividuel {
  id: number;
  created_at: string;
  type: string;
  date: string;
  est_une_soumission: boolean;
  statut: string;
  pere_celebrant?: string;
  parrain_ou_temoin?: string;
  motif_de_rejet?: string;
  paroisse?: string;
  paroissien_id: number;
  images?: ImageFile[];
  paroissien?: Personne;
}

interface SacrementUnion {
  id: number;
  created_at: string;
  type: string;
  date: string;
  description?: string;
  est_une_soumission: boolean;
  statut: string;
  motif_de_rejet?: string;
  marie_ou_mariee?: string;
  premier_temoin?: string;
  second_temoin?: string;
  pere_celebrant?: string;
  paroissien_id: number;
  images?: ImageFile[];
  paroissien?: Personne;
}

interface SoumissionsResponse {
  individuel: SacrementIndividuel[];
  union: SacrementUnion[];
}

// Fonctions utilitaires
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: fr });
  } catch (error) {
    return "Date inconnue";
  }
};

const variantClasses: Record<string, string> = {
  success: "bg-green-500 text-white",
  warning: "bg-yellow-400 text-black",
  danger: "bg-red-500 text-white",
  info: "bg-blue-400 text-white",
  default: "bg-gray-300 text-gray-800",
  secondary: "bg-gray-500 text-white",
  primary: "bg-blue-600 text-white",
  outline: "border border-gray-400 text-gray-700",
};

// Obtenir les détails du statut
const getStatusDetails = (statut: string) => {
  const normalized = statut.toUpperCase();

  if (["CONFIRMÉ", "CONFIRME", "VALIDÉ", "VALIDE"].includes(normalized)) {
    return { label: "Validé", variant: "success" as const };
  }

  if (["EN ATTENTE", "ATTENTE"].includes(normalized)) {
    return { label: "En attente", variant: "warning" as const };
  }

  if (["REJETÉ", "REJETE"].includes(normalized)) {
    return { label: "Rejeté", variant: "danger" as const };
  }

  return { label: statut, variant: "outline" as const };
};

// Fonction pour gérer les erreurs API
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status || 500;
    const data = axiosError.response?.data;
    const errorMessage =
      (data && typeof data === "object" && "message" in data
        ? (data as { message?: string }).message
        : undefined) ||
      axiosError.message ||
      "Une erreur est survenue";

    switch (statusCode) {
      case 400:
        throw new ApiError(errorMessage, 400);
      case 401:
        throw new AuthenticationError(errorMessage);
      case 403:
        throw new ForbiddenError(errorMessage);
      case 404:
        throw new NotFoundError(errorMessage);
      case 429:
        throw new ApiError(errorMessage, 429);
      default:
        throw new ApiError(errorMessage, statusCode);
    }
  } else if (error instanceof Error) {
    throw new ApiError(error.message, 500);
  } else {
    throw new ApiError("Une erreur inconnue est survenue", 500);
  }
}

// Composant pour afficher un élément de la liste des sacrements individuels
const SacrementIndividuelItem = ({
  sacrement,
  onDetails,
}: {
  sacrement: SacrementIndividuel;
  onDetails: (id: number, type: "individuel") => void;
}) => {
  const { label, variant } = getStatusDetails(sacrement.statut);
  const badgeClass = `${variantClasses[variant]} text-xs px-2 py-0.5 rounded`;

  return (
    <tr className="border-b border-gray-100 hover:bg-slate-50">
      <td className="py-3 px-4">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-1.5 text-slate-400" />
          <span>{formatDate(sacrement.date)}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        {sacrement.paroisse && (
          <p className="text-sm text-slate-600 line-clamp-1">
            {sacrement.paroisse}
          </p>
        )}
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className="flex items-center text-xs px-2 py-0.5"
          >
            {sacrement.type}
          </Badge>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge className={badgeClass}>{label}</Badge>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center px-3 h-8 cursor-pointer"
            onClick={() => onDetails(sacrement.id, "individuel")}
          >
            <Eye className="h-3 w-3 mr-1" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

// Composant pour afficher un élément de la liste des sacrements union
const SacrementUnionItem = ({
  sacrement,
  onDetails,
}: {
  sacrement: SacrementUnion;
  onDetails: (id: number, type: string) => void;
}) => {
  const { label, variant } = getStatusDetails(sacrement.statut);
  const badgeClass = `${variantClasses[variant]} text-xs px-2 py-0.5 rounded`;

  return (
    <tr className="border-b border-gray-100 hover:bg-slate-50">
      <td className="py-3 px-4">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-1.5 text-slate-400" />
          <span>{formatDate(sacrement.date)}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className="flex items-center text-xs px-2 py-0.5"
          >
            <Heart className="h-3 w-3 mr-1" /> {sacrement.type}
          </Badge>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1.5 text-blue-500" />
          <span className="font-medium">
            {sacrement.paroissien?.nom
              ? `${sacrement.paroissien?.prenoms} ${sacrement.paroissien?.nom} &`
              : "Marié & "}
            {sacrement?.marie_ou_mariee
              ? ` ${sacrement.marie_ou_mariee}`
              : " Mariée"}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        {sacrement.description && (
          <p className="text-sm text-slate-600 line-clamp-1">
            {sacrement.description.substring(0, 60)}
            {sacrement.description.length > 60 ? "..." : ""}
          </p>
        )}
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge className={badgeClass}>{label}</Badge>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center px-3 h-8 cursor-pointer"
            onClick={() => onDetails(sacrement.id, "union")}
          >
            <Eye className="h-3 w-3 mr-1" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

// Page principale
export default function SacrementsSoumissionPage() {
  const router = useRouter();
  const [sacrements, setSacrements] = useState<SoumissionsResponse>({
    individuel: [],
    union: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numeroParoissien, setNumeroParoissien] = useState("");
  const [paroissienTrouve, setParoissienTrouve] = useState<Personne | null>(
    null
  );
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("individuel");

  // Charger les données sauvegardées au montage du composant
  useEffect(() => {
    const savedNumero = localStorage.getItem("search_numero_paroissien");
    const savedSacrements = localStorage.getItem("search_sacrements");
    const savedParoissien = localStorage.getItem("search_paroissien_trouve");
    const savedShowResults = localStorage.getItem("search_show_results");
    const savedActiveTab = localStorage.getItem("search_active_tab");

    if (savedNumero) {
      setNumeroParoissien(savedNumero);
    }

    if (savedSacrements) {
      try {
        const parsedSacrements = JSON.parse(savedSacrements);
        setSacrements(parsedSacrements);
      } catch (error) {
        console.error(
          "Erreur lors du parsing des sacrements sauvegardés:",
          error
        );
      }
    }

    if (savedParoissien) {
      try {
        const parsedParoissien = JSON.parse(savedParoissien);
        setParoissienTrouve(parsedParoissien);
      } catch (error) {
        console.error(
          "Erreur lors du parsing du paroissien sauvegardé:",
          error
        );
      }
    }

    if (savedShowResults === "true") {
      setShowResults(true);
    }

    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
    }
  }, []);

  // Sauvegarder les données dans localStorage quand elles changent
  useEffect(() => {
    if (numeroParoissien) {
      localStorage.setItem("search_numero_paroissien", numeroParoissien);
    }
  }, [numeroParoissien]);

  useEffect(() => {
    if (sacrements.individuel.length > 0 || sacrements.union.length > 0) {
      localStorage.setItem("search_sacrements", JSON.stringify(sacrements));
    }
  }, [sacrements]);

  useEffect(() => {
    if (paroissienTrouve) {
      localStorage.setItem(
        "search_paroissien_trouve",
        JSON.stringify(paroissienTrouve)
      );
    }
  }, [paroissienTrouve]);

  useEffect(() => {
    localStorage.setItem("search_show_results", showResults.toString());
  }, [showResults]);

  useEffect(() => {
    localStorage.setItem("search_active_tab", activeTab);
  }, [activeTab]);

  // Rechercher les soumissions d'un paroissien spécifique
  const rechercherSoumissions = async () => {
    if (!numeroParoissien.trim()) {
      toast.error("Erreur", {
        description: "Veuillez saisir un numéro de paroissien.",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setShowResults(false);

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      // Nettoyer le numéro de paroissien (enlever espaces, caractères spéciaux)
      const cleanNumero = numeroParoissien.trim().replace(/\s+/g, "");

      console.log("Recherche pour le numéro:", cleanNumero);

      // Construire l'URL avec le paramètre
      const url = new URL(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-soumission/obtenir-tous"
      );
      url.searchParams.append("numero_paroissien", cleanNumero);

      console.log("URL de la requête:", url.toString());

      // Appel à l'API avec le numéro de paroissien
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Statut de la réponse:", response.status);

      if (!response.ok) {
        const statusCode = response.status;
        let errorData;
        let errorText;

        try {
          // Essayer de lire la réponse JSON d'abord
          errorData = await response.json();
          errorText = errorData.message || JSON.stringify(errorData);
          console.error("Erreur détaillée:", errorData);
        } catch (e) {
          // Si ce n'est pas du JSON, lire en texte
          errorText = await response.text();
          console.error("Texte d'erreur brut:", errorText);
        }

        switch (statusCode) {
          case 400:
            console.error("Erreur 400 - Détails:", errorText);
            // Peut-être que le numéro de paroissien n'existe pas ou est mal formaté
            throw new ApiError(
              `Le numéro de paroissien "${cleanNumero}" semble invalide. Vérifiez le format.`,
              400
            );
          case 401:
            throw new AuthenticationError("Vous n'êtes pas authentifié");
          case 403:
            throw new ForbiddenError("Vous n'avez pas les droits nécessaires");
          case 404:
            throw new NotFoundError(
              "Paroissien non trouvé ou aucune soumission"
            );
          default:
            throw new ApiError(
              `Erreur HTTP: ${statusCode} - ${errorText}`,
              statusCode
            );
        }
      }

      const data = await response.json();

      // Vérifier si des soumissions ont été trouvées
      const totalSoumissions =
        (data.individuel?.length || 0) + (data.union?.length || 0);

      if (totalSoumissions === 0) {
        setError("Aucune soumission trouvée pour ce paroissien.");
        setSacrements({ individuel: [], union: [] });
        setParoissienTrouve(null);
        setShowResults(false);
      } else {
        setSacrements({
          individuel: data.individuel || [],
          union: data.union || [],
        });

        // Extraire les infos du paroissien depuis les soumissions
        const premiereSoumission = data.individuel?.[0] || data.union?.[0];
        if (premiereSoumission?.paroissien) {
          setParoissienTrouve(premiereSoumission.paroissien);
        }
        setShowResults(true);

        toast.success("Succès", {
          description: `${totalSoumissions} soumission(s) trouvée(s) pour ce paroissien.`,
        });
      }
    } catch (err: any) {
      console.error("Erreur lors de la recherche des soumissions:", err);

      let errorMessage = "Une erreur est survenue lors de la recherche.";

      if (err instanceof AuthenticationError) {
        errorMessage =
          "Vous n'êtes pas authentifié. Veuillez vous reconnecter.";
        router.push("/login");
      } else if (err instanceof ForbiddenError) {
        errorMessage =
          "Vous n'avez pas les droits nécessaires pour accéder à cette ressource.";
      } else if (err instanceof NotFoundError) {
        errorMessage =
          "Aucun paroissien trouvé avec ce numéro ou aucune soumission disponible.";
      } else if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setShowResults(false);
      setSacrements({ individuel: [], union: [] });
      setParoissienTrouve(null);

      // Nettoyer le localStorage en cas d'erreur
      localStorage.removeItem("search_sacrements");
      localStorage.removeItem("search_paroissien_trouve");
      localStorage.removeItem("search_show_results");

      toast.error("Erreur", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Gérer la recherche avec Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      rechercherSoumissions();
    }
  };

  // Réinitialiser la recherche
  const resetRecherche = () => {
    setNumeroParoissien("");
    setSacrements({ individuel: [], union: [] });
    setParoissienTrouve(null);
    setShowResults(false);
    setError(null);

    // Nettoyer le localStorage
    localStorage.removeItem("search_numero_paroissien");
    localStorage.removeItem("search_sacrements");
    localStorage.removeItem("search_paroissien_trouve");
    localStorage.removeItem("search_show_results");
    localStorage.removeItem("search_active_tab");
  };

  // Naviguer vers la page de détails
  const handleViewDetails = (id: number, type: "individuel" | "union") => {
    if (type === "individuel") {
      router.push(`/dashboard/paroisse/sacrements/soumissions/individuelle/${id}`);
    } else {
      router.push(`/dashboard/paroisse/sacrements/soumissions/union/${id}`);
    }
  };

  // Compter les soumissions
  const countSoumissions = () => {
    return {
      individuel: sacrements.individuel.length,
      union: sacrements.union.length,
      total: sacrements.individuel.length + sacrements.union.length,
    };
  };

  const counts = countSoumissions();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Soumissions de Sacrements
        </h1>
      </div>

      {/* Section de recherche */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Rechercher un paroissien</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Entrez le numéro du paroissien..."
                className="pl-10"
                value={numeroParoissien}
                onChange={(e) => setNumeroParoissien(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={rechercherSoumissions}
                disabled={loading || !numeroParoissien.trim()}
                className="cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Recherche...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </>
                )}
              </Button>
              {(showResults || error) && (
                <Button
                  variant="outline"
                  onClick={resetRecherche}
                  className="text-slate-600"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>

          {/* Affichage des informations du paroissien trouvé */}
          {paroissienTrouve && showResults && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <BookOpenText className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <h3 className="font-medium text-blue-900">
                    {paroissienTrouve.prenoms} {paroissienTrouve.nom}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Téléphone: {paroissienTrouve.num_de_telephone}
                    {` | Genre: ${paroissienTrouve.genre}`}{" "}
                    {` | Statut: ${paroissienTrouve.statut}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Affichage des erreurs */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <h3 className="font-medium text-red-900">Aucun résultat</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Section des résultats - Visible seulement si des soumissions sont trouvées */}
      {showResults && !error && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold">
              Soumissions trouvées ({counts.total})
            </h2>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="individuel" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Individuels ({counts.individuel})
              </TabsTrigger>
              <TabsTrigger value="union" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Unions ({counts.union})
              </TabsTrigger>
            </TabsList>

            {/* Onglet Sacrements Individuels */}
            <TabsContent value="individuel">
              {sacrements.individuel.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-lg">
                  <User className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Aucun sacrement individuel
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md">
                    Ce paroissien n'a aucune soumission de sacrement individuel.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-600">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">
                          Paroisse
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">
                          Statut
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">
                          Détails
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sacrements.individuel.map((sacrement) => (
                        <SacrementIndividuelItem
                          key={sacrement.id}
                          sacrement={sacrement}
                          onDetails={(id) =>
                            handleViewDetails(id, "individuel")
                          }
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            {/* Onglet Sacrements d'Union */}
            <TabsContent value="union">
              {sacrements.union.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-lg">
                  <Heart className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Aucun sacrement d'union
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md">
                    Ce paroissien n'a aucune soumission de sacrement d'union.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-600">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">
                          Couple
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">
                          Description
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">
                          Statut
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">
                          Détails
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sacrements.union.map((sacrement) => (
                        <SacrementUnionItem
                          key={sacrement.id}
                          sacrement={sacrement}
                          onDetails={(id) => handleViewDetails(id, "union")}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
}
