/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  User,
  ChevronLeft,
  Loader2,
  XCircle,
  CheckCircle,
  AlignJustify,
  Phone,
  Mail,
  MapPin,
  UserCheck,
  Image as ImageIcon,
  AlertTriangle,
  Info,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";

// Types pour les fichiers d'images
interface ImageFile {
  path: string;
  name: string;
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
  chapelle_id?: number;
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
  motif_de_rejet?: string;
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
  parrain?: Personne;
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

// Obtenir les détails du statut
const getStatusDetails = (statut: string) => {
  const normalizedStatus = statut.toUpperCase();

  switch (normalizedStatus) {
    case "CONFIRMÉ":
    case "CONFIRME":
    case "VALIDÉ":
    case "VALIDE":
      return { label: "Confirmé", variant: "success" as const };
    case "EN PRÉPARATION":
    case "EN PREPARATION":
    case "PREPARATION":
      return { label: "En préparation", variant: "secondary" as const };
    case "EN ATTENTE":
    case "ATTENTE":
      return { label: "En attente", variant: "warning" as const };
    case "REJETÉ":
    case "REJETE":
      return { label: "Rejeté", variant: "destructive" as const };
    case "TERMINÉ":
    case "TERMINE":
      return { label: "Terminé", variant: "default" as const };
    default:
      return { label: statut, variant: "outline" as const };
  }
};

export default function SacrementSoumissionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : 0;

  const [sacrement, setSacrement] = useState<SacrementIndividuel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les dialogs
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [validationLoading, setValidationLoading] = useState(false);
  const [rejectionLoading, setRejectionLoading] = useState(false);

  // Récupérer les détails de la soumission
  const fetchSacrementDetails = async () => {
    setLoading(true);
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      // Obtenir l'ID de la paroisse (nécessaire pour certaines API)
      const userProfileStr = localStorage.getItem("user_profile");
      let paroisse_id = "1"; // Valeur par défaut

      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        paroisse_id = userProfile.paroisse_id || "1";
      }

      console.log(
        `Tentative de récupération des détails pour l'ID: ${id}, type: INDIVIDUEL`
      );

      // Appel à l'API avec un logging amélioré
      const url = `https://api.cathoconnect.ci/api:HzF8fFua/sacrement-soumission/obtenir-un?type=INDIVIDUEL&sacrement_id=${id}`;
      console.log("URL de l'API:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Statut de la réponse:", response.status);

      // Récupérer le texte brut de la réponse pour le débogage
      const responseText = await response.text();
      console.log("Réponse brute:", responseText);

      // Si la réponse n'est pas OK, traiter l'erreur
      if (!response.ok) {
        const statusCode = response.status;

        switch (statusCode) {
          case 401:
            throw new AuthenticationError("Vous n'êtes pas authentifié");
          case 403:
            throw new ForbiddenError("Vous n'avez pas les droits nécessaires");
          case 404:
            throw new NotFoundError("Soumission de sacrement non trouvée");
          default:
            throw new ApiError(`Erreur HTTP: ${statusCode}`, statusCode);
        }
      }

      // Essayer de parser la réponse comme JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Erreur lors du parsing JSON:", e);
        throw new ApiError("Format de réponse invalide", 0);
      }

      console.log("Données reçues:", data);

      // Vérifier différentes structures possibles pour la réponse
      if (data && data.individuel && data.individuel.length > 0) {
        setSacrement(data.individuel[0]);
      } else if (data && data.item) {
        // L'API retourne peut-être directement l'objet dans "item"
        setSacrement(data.item);
      } else if (Array.isArray(data) && data.length > 0) {
        // L'API retourne peut-être directement un tableau
        setSacrement(data[0]);
      } else if (data && typeof data === "object" && data.id) {
        // L'API retourne peut-être directement l'objet sacrement
        setSacrement(data);
      } else {
        throw new NotFoundError(
          "Soumission de sacrement non trouvée ou format de réponse inattendu"
        );
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement des détails:", err);

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
        errorMessage = "La soumission de sacrement demandée n'existe pas.";
      } else if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error("Erreur", {
        description: "Impossible de charger les détails de la soumission.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSacrementDetails();
    }
  }, [id]);

  // Fonction pour valider la soumission
  const confirmValidation = async () => {
    setValidationLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      // Construire le corps de la requête
      const requestBody = {
        sacrement_id: id,
        type: "INDIVIDUEL",
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

      // Redirection vers la liste des soumissions
      router.push("/dashboard/paroisse/sacrements/soumissions");
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
    }
  };

  // Fonction pour rejeter la soumission
  const confirmRejection = async () => {
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

      // Construire le corps de la requête
      const requestBody = {
        sacrement_id: id,
        type: "INDIVIDUEL",
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

      // Redirection vers la liste des soumissions
      router.push("/dashboard/paroisse/sacrements/soumissions");
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
      setRejectionReason("");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <XCircle className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Une erreur est survenue
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() =>
              router.push("/dashboard/paroisse/sacrements/soumissions")
            }
          >
            Retour
          </Button>
          <Button onClick={() => fetchSacrementDetails()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  if (!sacrement) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Aucune donnée trouvée
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-4">
          Impossible de trouver les détails de cette soumission de sacrement.
        </p>
        <Button
          variant="outline"
          onClick={() =>
            router.push("/dashboard/paroisse/sacrements/soumissions")
          }
        >
          Retour
        </Button>
      </div>
    );
  }

  const { label: statusLabel, variant: statusVariant } = getStatusDetails(
    sacrement.statut
  );
  const isDatePassed = new Date(sacrement.date) < new Date();
  const canPerformActions =
    sacrement.statut !== "REJETE" && sacrement.statut !== "VALIDE";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">
            Détails de la soumission de sacrement
          </h1>
          <div className="text-sm text-slate-500">
            Créée le: {formatDate(sacrement.created_at)}
          </div>
        </div>

        {canPerformActions && (
          <div className="flex gap-2">
            <Button
              variant="success"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setShowValidateDialog(true)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Valider
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowRejectDialog(true)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </Button>
          </div>
        )}
      </div>

      {/* Card principale avec les informations du sacrement */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {sacrement.type}
                </Badge>
                <Badge variant={statusVariant} className="text-sm">
                  {statusLabel}
                </Badge>
                {isDatePassed && (
                  <Badge variant="outline" className="text-sm">
                    Date passée
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-slate-700">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="font-medium">Date prévue:</span>
                  <span className="ml-2">{formatDate(sacrement.date)}</span>
                </div>

                <div className="flex items-start text-slate-700">
                  <AlignJustify className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="mt-1">
                      {sacrement.description || "Aucune description fournie"}
                    </p>
                  </div>
                </div>

                {sacrement.motif_de_rejet && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                      <div>
                        <h4 className="font-medium text-red-700">
                          Motif de rejet:
                        </h4>
                        <p className="mt-1 text-red-600">
                          {sacrement.motif_de_rejet}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Informations sur le célébrant */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Informations sur le célébrant
          </h2>
          {sacrement.celebrant ? (
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                <div>
                  <span className="font-medium">Nom complet:</span>
                  <p className="mt-1">{`${sacrement.celebrant.prenoms} ${sacrement.celebrant.nom}`}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                <div>
                  <span className="font-medium">Téléphone:</span>
                  <p className="mt-1">{sacrement.celebrant.num_de_telephone}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-md text-slate-600 italic">
              Aucun célébrant n'a été assigné à ce sacrement
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations sur le paroissien */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Informations sur le paroissien
          </h2>
          {sacrement.paroissien ? (
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                <div>
                  <span className="font-medium">Nom complet:</span>
                  <p className="mt-1">{`${sacrement.paroissien.prenoms} ${sacrement.paroissien.nom}`}</p>
                </div>
              </div>

              {/* Grille avec 2 colonnes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sacrement.paroissien.genre && (
                  <div className="flex items-start">
                    <UserCheck className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                    <div>
                      <span className="font-medium">Genre:</span>
                      <p className="mt-1">
                        {sacrement.paroissien.genre === "M"
                          ? "Masculin"
                          : "Féminin"}
                      </p>
                    </div>
                  </div>
                )}

                {sacrement.paroissien.date_de_naissance && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                    <div>
                      <span className="font-medium">Date de naissance:</span>
                      <p className="mt-1">
                        {formatDate(sacrement.paroissien.date_de_naissance)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                  <div>
                    <span className="font-medium">Téléphone:</span>
                    <p className="mt-1">
                      {sacrement.paroissien.num_de_telephone}
                    </p>
                  </div>
                </div>

                {sacrement.paroissien.email && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                    <div>
                      <span className="font-medium">Email:</span>
                      <p className="mt-1">{sacrement.paroissien.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {(sacrement.paroissien.ville ||
                sacrement.paroissien.commune ||
                sacrement.paroissien.quartier) && (
                <div className="flex items-start mt-4">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                  <div>
                    <span className="font-medium">Adresse:</span>
                    <p className="mt-1">
                      {[
                        sacrement.paroissien.quartier,
                        sacrement.paroissien.commune,
                        sacrement.paroissien.ville,
                        sacrement.paroissien.pays,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-md text-slate-600 italic">
              Aucune information disponible sur le paroissien
            </div>
          )}
        </Card>
        {/* Informations sur le parrain/témoin */}
        {sacrement.parrain && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Informations sur le parrain/témoin
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                <div>
                  <span className="font-medium">Nom complet:</span>
                  <p className="mt-1">{`${sacrement.parrain.prenoms} ${sacrement.parrain.nom}`}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sacrement.parrain.genre && (
                  <div className="flex items-start">
                    <UserCheck className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                    <div>
                      <span className="font-medium">Genre:</span>
                      <p className="mt-1">
                        {sacrement.parrain.genre === "M"
                          ? "Masculin"
                          : "Féminin"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                  <div>
                    <span className="font-medium">Téléphone:</span>
                    <p className="mt-1">{sacrement.parrain.num_de_telephone}</p>
                  </div>
                </div>

                {sacrement.parrain.email && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                    <div>
                      <span className="font-medium">Email:</span>
                      <p className="mt-1">{sacrement.parrain.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {(sacrement.parrain.ville ||
                sacrement.parrain.commune ||
                sacrement.parrain.quartier) && (
                <div className="flex items-start mt-4">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                  <div>
                    <span className="font-medium">Adresse:</span>
                    <p className="mt-1">
                      {[
                        sacrement.parrain.quartier,
                        sacrement.parrain.commune,
                        sacrement.parrain.ville,
                        sacrement.parrain.pays,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Images jointes si disponibles */}
      {sacrement.images && sacrement.images.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Documents joints</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sacrement.images.map((image, index) => (
              <div
                key={index}
                className="border rounded-md overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-3 border-b bg-slate-50">
                  <div className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="font-medium truncate">{image.name}</span>
                  </div>
                </div>

                {/* Aperçu du document */}
                <div className="relative">
                  {/* Vérifier si c'est une image en se basant sur l'extension du fichier */}
                  {/\.(jpg|jpeg|png|gif|webp)$/i.test(image.name) ? (
                    <div className="aspect-video bg-slate-100 relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/assets/images/document-fallback.png";
                          e.currentTarget.alt = "Aperçu non disponible";
                        }}
                      />
                    </div>
                  ) : /\.(pdf)$/i.test(image.name) ? (
                    <div className="aspect-video bg-slate-100 relative">
                      <object
                        data={image.url}
                        type="application/pdf"
                        className="w-full h-full"
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-red-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <p className="text-center text-slate-600 text-sm">
                            Le PDF ne peut pas être affiché.
                            <a
                              href={image.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Cliquez ici pour l'ouvrir
                            </a>
                          </p>
                        </div>
                      </object>
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-100 flex flex-col items-center justify-center p-4">
                      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-blue-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-center text-slate-600 text-sm">
                        Document
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-3 flex justify-between items-center bg-white">
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    Ouvrir
                  </a>
                  <a
                    href={image.url}
                    download={image.name}
                    className="text-slate-600 hover:text-slate-800 text-sm flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Télécharger
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Dialog de confirmation de validation */}
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

      {/* Dialog de confirmation de rejet */}
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
            <Textarea
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
    </div>
  );
}
