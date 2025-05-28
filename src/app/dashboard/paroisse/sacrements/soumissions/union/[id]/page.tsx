/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Heart,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Image,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { ActionButtons } from "@/components/sacrement-details/ActionButtons";
import { ValidationDialogs } from "@/components/sacrement-details/ValidationDialogs";
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

// Type pour un sacrement d'union
interface SacrementUnion {
  id: number;
  created_at: string;
  type: string;
  date: string;
  description: string;
  est_une_soumission?: boolean;
  motif_de_rejet?: string;
  marie_ou_mariee?: string;
  premier_temoin?:string;
  second_temoin?:string;
  pere_celebrant?:string;
  statut: string;
  images?: ImageFile[];
  paroissien?:ParoissienTrouve;
}

interface ParoissienTrouve {
  id: number;
  nom: string;
  prenoms: string;
  genre: string;
  num_de_telephone: string;
  paroisse_id: number;
  statut: string;
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


// Composant pour la galerie d'images
const ImageGallery = ({ images }: { images: ImageFile[] | undefined }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 rounded-lg">
        <Image className="h-12 w-12 mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-square overflow-hidden rounded-md border border-slate-200"
        >
          <img
            src={image.url}
            alt={image.name || `Image ${index + 1}`}
            className="object-cover w-full h-full hover:scale-105 transition-transform"
          />
          <a
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-slate-100"
            title="Voir l'image en taille réelle"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      ))}
    </div>
  );
};

// Page principale de détails du sacrement d'union
export default function SacrementUnionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : 0;

  const [sacrement, setSacrement] = useState<SacrementUnion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("informations");
  // États pour les dialogs
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [validationLoading, setValidationLoading] = useState(false);
  const [rejectionLoading, setRejectionLoading] = useState(false);

  // Récupérer les données du sacrement d'union
  const fetchSacrementDetails = async () => {
    setLoading(true);
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      // Appel à l'API
      const response = await fetch(
        `https://api.cathoconnect.ci/api:HzF8fFua/sacrement-soumission/obtenir-un?type=UNION&sacrement_id=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Ce sacrement d'union n'existe pas");
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setSacrement(data.item || null);
    } catch (err: any) {
      console.error("Erreur lors du chargement du sacrement:", err);
      setError(
        err.message || "Une erreur est survenue lors du chargement des données."
      );
      toast.error("Erreur", {
        description: "Impossible de charger les détails du sacrement d'union.",
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

      const requestBody = {
        sacrement_id: id,
        type: "UNION",
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

      const requestBody = {
        sacrement_id: id,
        type: "UNION",
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

  const handleValidate = () => {
    setShowValidateDialog(true);
  };

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  // Si chargement en cours
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  // Si erreur
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <XCircle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-xl font-medium text-slate-900 mb-2">
          Une erreur est survenue
        </h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/paroisse/sacrements/unions")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
          <Button onClick={() => fetchSacrementDetails()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  // Si aucun sacrement trouvé
  if (!sacrement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-12 w-12 text-amber-400 mb-4" />
        <h2 className="text-xl font-medium text-slate-900 mb-2">
          Sacrement non trouvé
        </h2>
        <p className="text-slate-500 mb-6">
          Ce sacrement d'union n'existe pas ou n'est plus disponible.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>
    );
  }

  // Obtenir les détails du statut pour l'affichage
  const { label, variant } = getStatusDetails(sacrement.statut);
  const badgeClass = `${variantClasses[variant]} text-xs px-2 py-0.5 rounded`;
  const {
    label: statusLabel,
    variant: statusVariant,
    color: statusColor,
  } = getStatusDetails(sacrement.statut);

  // Déterminer si la date est passée
  const isDatePassed = new Date(sacrement.date) < new Date();

  const canPerformActions =
    sacrement.statut !== "REJETE" && sacrement.statut !== "VALIDE";

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          &nbsp; &nbsp;
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Détails du Sacrement d'Union
          </h1>
        </div>
        <ActionButtons
          canPerformActions={canPerformActions}
          onValidate={handleValidate}
          onReject={handleReject}
        />
      </div>

      {/* Carte principale avec les informations essentielles */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="secondary" className="flex items-center">
              <Heart className="h-3 w-3 mr-1" /> {sacrement.type}
            </Badge>
            <Badge className={badgeClass}>{label}</Badge>
          </div>
          <CardTitle className="text-2xl flex items-center">
            {sacrement?.paroissien?.nom} {sacrement?.paroissien?.prenoms} & {sacrement?.marie_ou_mariee}{" "}
          </CardTitle>
          <CardDescription className="flex items-center text-base">
            <Calendar className="h-4 w-4 mr-1.5" />
            Le {formatDate(sacrement.date)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="informations">Informations</TabsTrigger>
              {sacrement.images && sacrement.images.length > 0 && (
                <TabsTrigger value="images">
                  Images ({sacrement.images.length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="informations" className="space-y-6">
              {/* Description */}
              {sacrement.description && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Description</h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="whitespace-pre-line">
                      {sacrement.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Détails supplémentaires */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Détails du sacrement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between px-4 py-2 bg-slate-50 rounded-md">
                      <span className="text-slate-600">
                        Date d'enregistrement:
                      </span>
                      <span className="font-medium">
                        {formatDate(sacrement.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-2 bg-slate-50 rounded-md">
                      <span className="text-slate-600">Type:</span>
                      <span className="font-medium">{sacrement.type}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2 bg-slate-50 rounded-md">
                      <span className="text-slate-600">Statut:</span>
                      <span className={`font-medium ${variantClasses}`}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between px-4 py-2 bg-slate-50 rounded-md">
                      <span className="text-slate-600">Témoin du marié:</span>
                      <span className="font-medium">
                        {sacrement?.premier_temoin || "Non spécifié"}
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-2 bg-slate-50 rounded-md">
                      <span className="text-slate-600">
                        Témoin de la mariée:
                      </span>
                      <span className="font-medium">
                        {sacrement?.second_temoin || "Non spécifié"}
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-2 bg-slate-50 rounded-md">
                      <span className="text-slate-600">Père Célébrant:</span>
                      <span className="font-medium">
                        {sacrement?.pere_celebrant
                          ? `${sacrement?.pere_celebrant}`
                          : "Non spécifié"}
                      </span>
                    </div>
                  </div>
                  {sacrement?.motif_de_rejet && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                        <div>
                          <h4 className="font-medium text-red-700">
                            Motif de rejet:
                          </h4>
                          <p className="mt-1 text-red-600">
                            {sacrement?.motif_de_rejet}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {sacrement.images && sacrement.images.length > 0 && (
              <TabsContent value="images">
                <ImageGallery images={sacrement.images} />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
        <ValidationDialogs
          showValidateDialog={showValidateDialog}
          showRejectDialog={showRejectDialog}
          validationLoading={validationLoading}
          rejectionLoading={rejectionLoading}
          rejectionReason={rejectionReason}
          onValidateDialogChange={setShowValidateDialog}
          onRejectDialogChange={setShowRejectDialog}
          onRejectionReasonChange={setRejectionReason}
          onConfirmValidation={confirmValidation}
          onConfirmRejection={confirmRejection}
        />
      </Card>
    </div>
  );
}
