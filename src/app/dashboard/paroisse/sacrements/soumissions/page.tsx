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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar,
  Heart,
  User,
  Users,
  Loader2,
  XCircle,
  Search,
  Download,
  CheckCircle,
  Info,
  AlertTriangle,
  ExternalLink,
  Filter,
  ChevronRight,
  Eye,
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
  access: string;
  path: string;
  name: string;
  type: string;
  size: number;
  mime: string;
  meta: any;
  url: string;
}

// Types pour les personnes
interface Personne {
  id: number;
  created_at?: string;
  nom: string;
  prenoms: string;
  genre?: string;
  num_de_telephone: string;
  email?: string;
  date_de_naissance?: string;
  pays?: string;
  nationalite?: string;
  ville?: string;
  commune?: string;
  quartier?: string;
  statut?: string;
  est_abonne?: boolean;
  date_de_fin_abonnement?: number;
  paroisse_id?: number;
}

// Types pour les sacrements
interface SacrementIndividuel {
  id: number;
  created_at: string;
  type: string;
  date: string;
  description: string;
  est_une_soumission: boolean;
  statut: string;
  sacrement_id?: number;
  celebrant_id: number;
  paroisse_id: number;
  chapelle_id: number | null;
  paroissien_id: number;
  parraintemoin_id?: number;
  certificateur_id?: number;
  images?: ImageFile[];
  paroissien?: Personne;
  celebrant?: Personne;
}

interface SacrementUnion {
  id: number;
  created_at: string;
  type: string;
  date: string;
  description: string;
  est_une_soumission: boolean;
  statut: string;
  temoin_marie?: string;
  temoin_mariee?: string;
  celebrant_id: number;
  paroisse_id: number;
  chapelle_id: number | null;
  marie_id: number;
  mariee_id: number;
  images?: ImageFile[];
  celebrant?: Personne;
  marie?: Personne;
  mariee?: Personne;
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
    return { label: "Confirmé", variant: "success" as const };
  }

  if (
    ["EN PRÉPARATION", "EN PREPARATION", "PREPARATION"].includes(normalized)
  ) {
    return { label: "En préparation", variant: "secondary" as const };
  }

  if (["EN ATTENTE", "ATTENTE"].includes(normalized)) {
    return { label: "En attente", variant: "warning" as const };
  }

  if (["TERMINÉ", "TERMINE"].includes(normalized)) {
    return { label: "Terminé", variant: "default" as const };
  }

  if (["REJETÉ", "REJETE"].includes(normalized)) {
    return { label: "Rejeté", variant: "danger" as const };
  }

  return { label: statut, variant: "outline" as const };
};

// Fonction pour gérer les erreurs API
function handleApiError(error: unknown): never {
  // Vérifier si c'est une erreur Axios
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status || 500;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Une erreur est survenue";

    // Gérer les différents codes d'erreur
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
    // Pour les erreurs JavaScript standard
    throw new ApiError(error.message, 500);
  } else {
    // Pour tout autre type d'erreur
    throw new ApiError("Une erreur inconnue est survenue", 500);
  }
}

// Composant pour afficher un élément de la liste des sacrements individuels
// Remplacer le composant SacrementIndividuelItem par une ligne de tableau
// Remplacer le composant SacrementIndividuelItem par une ligne de tableau
const SacrementIndividuelItem = ({
  sacrement,
  onValidate,
  onDetails,
  onReject,
}: {
  sacrement: SacrementIndividuel;
  onValidate: (id: number) => void;
  onDetails: (id: number, type: "individuel") => void;
  onReject: (id: number) => void;
}) => {
  const { label, variant } = getStatusDetails(sacrement.statut);
  const badgeClass = `${variantClasses[variant]} text-xs px-2 py-0.5 rounded`;

  // Déterminer si la date est passée
  const isDatePassed = new Date(sacrement.date) < new Date();

  return (
    <tr className="border-b border-gray-100 hover:bg-slate-50">
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className="flex items-center text-xs px-2 py-0.5"
          >
            {sacrement.type}
          </Badge>
          <Badge className={badgeClass}>{label}</Badge>
          {/* {isDatePassed && (
            <Badge variant="outline" className="text-xs">
              Passé
            </Badge>
          )} */}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-1.5 text-slate-400" />
          <span>{formatDate(sacrement.date)}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1.5 text-blue-500" />
          <span className="font-medium">
            {sacrement.paroissien?.nom
              ? `${sacrement.paroissien?.prenoms} ${sacrement.paroissien?.nom}`
              : "Paroissien"}
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
        <div className="flex items-center space-x-2">
          {sacrement.statut !== "REJETE" && sacrement.statut !== "VALIDE" && (
            <>
              <Button
                variant="success"
                size="sm"
                className="text-xs h-8 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onValidate(sacrement.id)}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Valider
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="text-xs h-8 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => onReject(sacrement.id)}
              >
                <XCircle className="h-3 w-3 mr-1" />
                Rejeter
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center px-2 h-8"
            onClick={() => onDetails(sacrement.id, "individuel")}
          >
            <Eye className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

// Composant pour afficher un élément de la liste des sacrements union
const SacrementUnionItem = ({
  sacrement,
  onValidate,
  onDetails,
  onReject,
}: {
  sacrement: SacrementUnion;
  onValidate: (id: number, type: string) => void;
  onDetails: (id: number, type: string) => void;
  onReject: (id: number, type: string) => void;
}) => {
  const { label, variant } = getStatusDetails(sacrement.statut);
  const badgeClass = `${variantClasses[variant]} text-xs px-2 py-0.5 rounded`;

  // Déterminer si la date est passée
  const isDatePassed = new Date(sacrement.date) < new Date();

  return (
    <tr className="border-b border-gray-100 hover:bg-slate-50">
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className="flex items-center text-xs px-2 py-0.5"
          >
            <Heart className="h-3 w-3 mr-1" /> {sacrement.type}
          </Badge>
          <Badge variant={variant} className="text-xs px-2 py-0.5">
            {label}
          </Badge>
          {/* {isDatePassed && (
            <Badge variant="outline" className="text-xs">
              Passé
            </Badge>
          )} */}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-1.5 text-slate-400" />
          <span>{formatDate(sacrement.date)}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1.5 text-blue-500" />
          <span className="font-medium">
            {sacrement.marie?.nom
              ? `${sacrement.marie?.prenoms} ${sacrement.marie?.nom} &`
              : "Marié & "}
            {sacrement.mariee?.nom
              ? ` ${sacrement.mariee?.prenoms} ${sacrement.mariee?.nom}`
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
        <div className="flex items-center space-x-2">
          {sacrement.statut !== "REJETE" && sacrement.statut !== "VALIDE" && (
            <>
              <Button
                variant="success"
                size="sm"
                className="text-xs h-8 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onValidate(sacrement.id, "union")}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Valider
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="text-xs h-8 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => onReject(sacrement.id, "union")}
              >
                <XCircle className="h-3 w-3 mr-1" />
                Rejeter
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center px-2 h-8"
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
  const [filteredIndividuels, setFilteredIndividuels] = useState<
    SacrementIndividuel[]
  >([]);
  const [filteredUnions, setFilteredUnions] = useState<SacrementUnion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("individuel");
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [selectedSacrementId, setSelectedSacrementId] = useState<number | null>(
    null
  );
  const [validationLoading, setValidationLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionLoading, setRejectionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedSacrementType, setSelectedSacrementType] = useState<
    string | null
  >(null);

  // Récupérer les soumissions de sacrements depuis l'API
  const fetchSoumissions = async () => {
    setLoading(true);
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      // Obtenir l'ID de la paroisse
      const userProfileStr = localStorage.getItem("user_profile");
      let paroisse_id = "1"; // Valeur par défaut

      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        paroisse_id = userProfile.paroisse_id || "1";
      }

      // Appel à l'API
      const response = await fetch(
        `https://api.cathoconnect.ci/api:HzF8fFua/sacrement-soumission/obtenir-tous?paroisse_id=${paroisse_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const statusCode = response.status;
        const errorText = await response.text();

        switch (statusCode) {
          case 401:
            throw new AuthenticationError("Vous n'êtes pas authentifié");
          case 403:
            throw new ForbiddenError("Vous n'avez pas les droits nécessaires");
          case 404:
            throw new NotFoundError("Ressource non trouvée");
          default:
            throw new ApiError(`Erreur HTTP: ${statusCode}`, statusCode);
        }
      }

      const data = await response.json();
      setSacrements({
        individuel: data.individuel || [],
        union: data.union || [],
      });
      setFilteredIndividuels(data.individuel || []);
      setFilteredUnions(data.union || []);
    } catch (err: any) {
      console.error("Erreur lors du chargement des soumissions:", err);

      let errorMessage =
        "Une erreur est survenue lors du chargement des données.";

      if (err instanceof AuthenticationError) {
        errorMessage =
          "Vous n'êtes pas authentifié. Veuillez vous reconnecter.";
        router.push("/login");
      } else if (err instanceof ForbiddenError) {
        errorMessage =
          "Vous n'avez pas les droits nécessaires pour accéder à cette ressource.";
      } else if (err instanceof NotFoundError) {
        errorMessage = "La ressource demandée n'existe pas.";
      } else if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error("Erreur", {
        description: "Impossible de charger les soumissions de sacrements.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoumissions();
  }, []);

  // Filtrer les sacrements selon la recherche
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      // Filtrer les sacrements individuels
      const individuels = sacrements.individuel.filter(
        (sacrement) =>
          (sacrement.paroissien?.nom &&
            sacrement.paroissien.nom.toLowerCase().includes(query)) ||
          (sacrement.paroissien?.prenoms &&
            sacrement.paroissien.prenoms.toLowerCase().includes(query)) ||
          (sacrement.description &&
            sacrement.description.toLowerCase().includes(query)) ||
          sacrement.type.toLowerCase().includes(query) ||
          formatDate(sacrement.date).toLowerCase().includes(query)
      );

      // Filtrer les sacrements d'union
      const unions = sacrements.union.filter(
        (sacrement) =>
          (sacrement.marie?.nom &&
            sacrement.marie.nom.toLowerCase().includes(query)) ||
          (sacrement.marie?.prenoms &&
            sacrement.marie.prenoms.toLowerCase().includes(query)) ||
          (sacrement.mariee?.nom &&
            sacrement.mariee.nom.toLowerCase().includes(query)) ||
          (sacrement.mariee?.prenoms &&
            sacrement.mariee.prenoms.toLowerCase().includes(query)) ||
          (sacrement.description &&
            sacrement.description.toLowerCase().includes(query)) ||
          sacrement.type.toLowerCase().includes(query) ||
          formatDate(sacrement.date).toLowerCase().includes(query)
      );

      setFilteredIndividuels(individuels);
      setFilteredUnions(unions);
    } else {
      // Pas de recherche, afficher tous les sacrements
      setFilteredIndividuels(sacrements.individuel);
      setFilteredUnions(sacrements.union);
    }
  }, [searchQuery, sacrements]);

  // Ouvrir le dialogue de validation
  const handleValidateSacrement = (
    id: number,
    type: "individuel" | "union"
  ) => {
    setSelectedSacrementId(id);
    setSelectedSacrementType(type);
    setShowValidateDialog(true);
  };
  // Naviguer vers la page de détails
  const handleViewDetails = (id: number, type: "individuel" | "union") => {
    if (type === "individuel") {
      router.push(`/dashboard/paroisse/sacrements/soumissions/${id}`);
    } else {
      router.push(`/dashboard/paroisse/sacrements/unions/${id}`);
    }
  };

  // Confirmer la validation
  const confirmValidation = async () => {
    if (!selectedSacrementId) return;

    setValidationLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      // Déterminer le type en fonction de l'onglet actif
      // S'assurer que le type est exactement "INDIVIDUEL" ou "UNION"
      const sacrementType = activeTab === "individuel" ? "INDIVIDUEL" : "UNION";

      // Construire le corps de la requête
      const requestBody = {
        sacrement_id: selectedSacrementId,
        type: sacrementType,
      };

      console.log("Envoi de la requête de validation:", requestBody);

      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-soumission/valider",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Statut de la réponse:", response.status);

      // Si la réponse n'est pas OK, essayer de lire le corps de la réponse pour plus d'informations
      if (!response.ok) {
        const statusCode = response.status;
        let errorText;

        try {
          const errorData = await response.json();
          errorText = JSON.stringify(errorData);
          console.error("Détails de l'erreur:", errorData);
        } catch (e) {
          errorText = await response.text();
          console.error("Texte d'erreur brut:", errorText);
        }

        switch (statusCode) {
          case 400:
            throw new ApiError(`Erreur de requête: ${errorText}`, 400);
          case 401:
            throw new AuthenticationError("Vous n'êtes pas authentifié");
          case 403:
            throw new ForbiddenError("Vous n'avez pas les droits nécessaires");
          case 404:
            throw new NotFoundError("Sacrement non trouvé");
          default:
            throw new ApiError(`Erreur HTTP: ${statusCode}`, statusCode);
        }
      }

      const data = await response.json();
      console.log("Réponse de validation:", data);

      toast.success("Succès", {
        description: "La soumission de sacrement a été validée avec succès.",
      });

      // Mettre à jour la liste des soumissions
      fetchSoumissions();
    } catch (err: any) {
      console.error("Erreur lors de la validation de la soumission:", err);

      let errorMessage = "Impossible de valider la soumission de sacrement.";

      if (err instanceof AuthenticationError) {
        errorMessage =
          "Vous n'êtes pas authentifié. Veuillez vous reconnecter.";
        router.push("/login");
      } else if (err instanceof ForbiddenError) {
        errorMessage =
          "Vous n'avez pas les droits nécessaires pour cette action.";
      } else if (err instanceof NotFoundError) {
        errorMessage = "Le sacrement demandé n'existe pas.";
      } else if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error("Erreur", {
        description: errorMessage,
      });
    } finally {
      setValidationLoading(false);
      setShowValidateDialog(false);
      setSelectedSacrementId(null);
    }
  };

  const handleRejectSacrement = (id: number, type: "individuel" | "union") => {
    setSelectedSacrementId(id);
    setSelectedSacrementType(type);
    setRejectionReason("");
    setShowRejectDialog(true);
  };

  // Confirmer le rejet
  const confirmRejection = async () => {
    if (!selectedSacrementId) return;

    // Vérifier que le motif de rejet est fourni
    if (!rejectionReason.trim()) {
      toast.error("Erreur", {
        description: "Veuillez fournir un motif de rejet.",
      });
      return;
    }

    setRejectionLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      // Déterminer le type en fonction de l'onglet actif
      // S'assurer que le type est exactement "INDIVIDUEL" ou "UNION"
      const sacrementType = activeTab === "individuel" ? "INDIVIDUEL" : "UNION";

      // Construire le corps de la requête
      const requestBody = {
        sacrement_id: selectedSacrementId,
        type: sacrementType,
        motif_de_rejet: rejectionReason,
      };

      console.log("Envoi de la requête de rejet:", requestBody);

      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-soumission/rejeter",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Statut de la réponse:", response.status);

      // Si la réponse n'est pas OK, essayer de lire le corps de la réponse pour plus d'informations
      if (!response.ok) {
        const statusCode = response.status;
        let errorText;

        try {
          const errorData = await response.json();
          errorText = JSON.stringify(errorData);
          console.error("Détails de l'erreur:", errorData);
        } catch (e) {
          errorText = await response.text();
          console.error("Texte d'erreur brut:", errorText);
        }

        switch (statusCode) {
          case 400:
            throw new ApiError(`Erreur de requête: ${errorText}`, 400);
          case 401:
            throw new AuthenticationError("Vous n'êtes pas authentifié");
          case 403:
            throw new ForbiddenError("Vous n'avez pas les droits nécessaires");
          case 404:
            throw new NotFoundError("Sacrement non trouvé");
          default:
            throw new ApiError(`Erreur HTTP: ${statusCode}`, statusCode);
        }
      }

      const data = await response.json();
      console.log("Réponse de rejet:", data);

      toast.success("Succès", {
        description: "La soumission de sacrement a été rejetée avec succès.",
      });

      // Mettre à jour la liste des soumissions
      fetchSoumissions();
    } catch (err: any) {
      console.error("Erreur lors du rejet de la soumission:", err);

      let errorMessage = "Impossible de rejeter la soumission de sacrement.";

      if (err instanceof AuthenticationError) {
        errorMessage =
          "Vous n'êtes pas authentifié. Veuillez vous reconnecter.";
        router.push("/login");
      } else if (err instanceof ForbiddenError) {
        errorMessage =
          "Vous n'avez pas les droits nécessaires pour cette action.";
      } else if (err instanceof NotFoundError) {
        errorMessage = "Le sacrement demandé n'existe pas.";
      } else if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error("Erreur", {
        description: errorMessage,
      });
    } finally {
      setRejectionLoading(false);
      setShowRejectDialog(false);
      setSelectedSacrementId(null);
      setRejectionReason("");
    }
  };

  // Fonction pour exporter les données en CSV
  const exportToCSV = () => {
    // Déterminer les données à exporter selon l'onglet actif
    const dataToExport =
      activeTab === "individuel" ? filteredIndividuels : filteredUnions;

    // Créer les en-têtes du CSV
    let csvContent = "";

    if (activeTab === "individuel") {
      csvContent = "ID,Type,Date,Paroissien,Statut,Description\n";

      // Ajouter les données
      filteredIndividuels.forEach((sacrement) => {
        const paroissien = sacrement.paroissien
          ? `${sacrement.paroissien.prenoms} ${sacrement.paroissien.nom}`
          : "Non spécifié";

        // Échapper les virgules et les guillemets dans la description
        const safeDescription = sacrement.description
          ? sacrement.description.replace(/"/g, '""')
          : "";

        csvContent += `${sacrement.id},"${sacrement.type}","${sacrement.date}","${paroissien}","${sacrement.statut}","${safeDescription}"\n`;
      });
    } else {
      csvContent = "ID,Type,Date,Marié,Mariée,Statut,Description\n";

      // Ajouter les données
      filteredUnions.forEach((sacrement) => {
        const marie = sacrement.marie
          ? `${sacrement.marie.prenoms} ${sacrement.marie.nom}`
          : "Non spécifié";
        const mariee = sacrement.mariee
          ? `${sacrement.mariee.prenoms} ${sacrement.mariee.nom}`
          : "Non spécifié";

        // Échapper les virgules et les guillemets dans la description
        const safeDescription = sacrement.description
          ? sacrement.description.replace(/"/g, '""')
          : "";

        csvContent += `${sacrement.id},"${sacrement.type}","${sacrement.date}","${marie}","${mariee}","${sacrement.statut}","${safeDescription}"\n`;
      });
    }

    // Créer un Blob et télécharger
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `soumissions_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-2">
            <User className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Sacrements Individuels
          </p>
          <p className="text-2xl font-bold">{counts.individuel}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Sacrements d'Union
          </p>
          <p className="text-2xl font-bold">{counts.union}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Total des Soumissions
          </p>
          <p className="text-2xl font-bold">{counts.total}</p>
        </Card>
      </div>

      {/* Conseils pour les utilisateurs */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <Info className="h-8 w-8 text-blue-500 mr-4 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-lg text-blue-800 mb-2">
              À propos des soumissions de sacrements
            </h3>
            <p className="text-blue-700 mb-3">
              Les soumissions sont des demandes de sacrements qui ont été
              envoyées par les paroissiens via l'application mobile ou le site
              web. Après validation, elles seront converties en sacrements
              officiels dans le système.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Validation
                </h4>
                <p className="text-sm text-blue-700">
                  En validant une soumission, vous confirmez que la demande est
                  légitime et que le sacrement peut être ajouté au calendrier
                  paroissial.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                  Vérification
                </h4>
                <p className="text-sm text-blue-700">
                  Avant de valider, vérifiez attentivement les informations
                  fournies et contactez le demandeur si nécessaire pour obtenir
                  des précisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold">
            Soumissions en attente de validation
          </h2>
          <div className="flex flex-wrap gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              title="Exporter en CSV"
              onClick={exportToCSV}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
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
          {/* Onglet Sacrements Individuels */}
          <TabsContent value="individuel">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                <span className="ml-3 text-slate-500">
                  Chargement des soumissions...
                </span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <XCircle className="h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Une erreur est survenue
                </h3>
                <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
                <Button onClick={() => fetchSoumissions()}>Réessayer</Button>
              </div>
            ) : filteredIndividuels.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-lg">
                <User className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Aucune soumission trouvée
                </h3>
                <p className="text-sm text-slate-500 max-w-md mb-4">
                  {searchQuery
                    ? "Aucune soumission ne correspond à votre recherche."
                    : "Aucune soumission de sacrement individuel n'est en attente pour le moment."}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Effacer la recherche
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        Type/Statut
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        Paroissien
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIndividuels.map((sacrement) => (
                      <SacrementIndividuelItem
                        key={sacrement.id}
                        sacrement={sacrement}
                        onValidate={handleValidateSacrement}
                        onDetails={(id) => handleViewDetails(id, "individuel")}
                        onReject={handleRejectSacrement} // Il faudra ajouter cette fonction
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* Onglet Sacrements d'Union */}
          <TabsContent value="union">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                <span className="ml-3 text-slate-500">
                  Chargement des soumissions...
                </span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <XCircle className="h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Une erreur est survenue
                </h3>
                <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
                <Button onClick={() => fetchSoumissions()}>Réessayer</Button>
              </div>
            ) : filteredUnions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-lg">
                <Users className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Aucune soumission trouvée
                </h3>
                <p className="text-sm text-slate-500 max-w-md mb-4">
                  {searchQuery
                    ? "Aucune soumission ne correspond à votre recherche."
                    : "Aucune soumission de sacrement d'union n'est en attente pour le moment."}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Effacer la recherche
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        Type/Statut
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        Couple
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUnions.map((sacrement) => (
                      <SacrementUnionItem
                        key={sacrement.id}
                        sacrement={sacrement}
                        onValidate={handleValidateSacrement}
                        onDetails={(id) => handleViewDetails(id, "union")}
                        onReject={handleRejectSacrement} // Il faudra ajouter cette fonction
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Dialog de confirmation de validation */}
      {selectedSacrementId && (
        <Dialog open={showValidateDialog} onOpenChange={setShowValidateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la validation</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir valider cette soumission de sacrement ?
                Une fois validée, elle sera convertie en sacrement officiel et
                apparaîtra dans les listes correspondantes.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowValidateDialog(false)}
                disabled={validationLoading}
              >
                Annuler
              </Button>
              <Button
                variant="default"
                onClick={confirmValidation}
                disabled={validationLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {validationLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validation en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Valider
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de confirmation de rejet */}
      {/* Dialog de confirmation de rejet */}
      {selectedSacrementId && (
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer le rejet</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir rejeter cette soumission de sacrement ?
                Cette action est définitive et le paroissien devra soumettre une
                nouvelle demande si nécessaire.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <label
                htmlFor="rejectionReason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Motif du rejet <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejectionReason"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Veuillez préciser la raison du rejet..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Ce message sera communiqué au paroissien pour l'informer de la
                raison du rejet.
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
                disabled={rejectionLoading}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={confirmRejection}
                disabled={rejectionLoading || !rejectionReason.trim()}
              >
                {rejectionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rejet en cours...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
