/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";

// Import des composants séparés
import { SacrementInfoCard } from "@/components/sacrement-details/SacrementInfoCard";
import { PersonneInfoCard } from "@/components/sacrement-details/PersonneInfoCard";
import { DocumentsGallery } from "@/components/sacrement-details/DocumentsGallery";
import { ActionButtons } from "@/components/sacrement-details/ActionButtons";
import { ValidationDialogs } from "@/components/sacrement-details/ValidationDialogs";

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

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: fr });
  } catch (error) {
    return "Date inconnue";
  }
};

const canPerformActions = (statut: string) => {
  const normalized = statut.toUpperCase();

  // Ne pas afficher les boutons si le statut est "VALIDÉ" ou "REJETÉ"
  const blockedStatuses = [
    "VALIDÉ",
    "VALIDE",
    "CONFIRMÉ",
    "CONFIRME",
    "REJETÉ",
    "REJETE",
  ];

  return !blockedStatuses.includes(normalized);
};

// Composant Skeleton pour les détails du sacrement
const SacrementDetailsLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-20" /> {/* Bouton retour */}
          <Skeleton className="h-8 w-80" /> {/* Titre */}
          <Skeleton className="h-4 w-40" /> {/* Date de création */}
        </div>
        {/* Boutons d'action */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Carte principale du sacrement */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-5 w-48" />

        {/* Description */}
        <div className="space-y-2 pt-4">
          <Skeleton className="h-5 w-24" />
          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Détails du sacrement */}
        <div className="space-y-2 pt-4">
          <Skeleton className="h-5 w-40" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between px-4 py-2 bg-slate-50 rounded-md"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grille des cartes de personnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, cardIndex) => (
          <div
            key={cardIndex}
            className="bg-white rounded-lg border border-slate-200 p-6 space-y-4"
          >
            <Skeleton className="h-6 w-48" />
            <div className="flex items-center space-x-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between py-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Galerie de documents */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
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
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      console.log(
        `Récupération des détails pour l'ID: ${id}, type: INDIVIDUEL`
      );

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

      const responseText = await response.text();
      console.log("Réponse brute:", responseText);

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

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Erreur lors du parsing JSON:", e);
        throw new ApiError("Format de réponse invalide", 0);
      }

      console.log("Données reçues:", data);

      // Gestion de différentes structures de réponse
      if (data && data.individuel && data.individuel.length > 0) {
        setSacrement(data.individuel[0]);
      } else if (data && data.item) {
        setSacrement(data.item);
      } else if (Array.isArray(data) && data.length > 0) {
        setSacrement(data[0]);
      } else if (data && typeof data === "object" && data.id) {
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

      await fetchSacrementDetails();
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

      await fetchSacrementDetails();
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

  // Gestionnaires pour les boutons d'action
  const handleValidate = () => {
    setShowValidateDialog(true);
  };

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  // États de chargement - REMPLACÉ PAR LE SKELETON
  if (loading) {
    return <SacrementDetailsLoadingSkeleton />;
  }

  // État d'erreur
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

  // État sans données
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

  // Calculer si les actions sont possibles
  const canShowActions = canPerformActions(sacrement.statut);

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton retour et actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center mb-4"
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

        {/* Boutons d'action */}
        <ActionButtons
          canPerformActions={canShowActions}
          onValidate={handleValidate}
          onReject={handleReject}
        />
      </div>

      {/* Section principale avec les informations du sacrement */}
      <SacrementInfoCard sacrement={sacrement} />

      {/* Grille avec les informations des personnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonneInfoCard
          title="Informations sur le célébrant"
          personne={sacrement.celebrant || null}
          emptyMessage="Aucun célébrant n'a été assigné à ce sacrement"
        />

        <PersonneInfoCard
          title="Informations sur le paroissien"
          personne={sacrement.paroissien || null}
          emptyMessage="Aucune information disponible sur le paroissien"
        />
      </div>

      {/* Informations sur le parrain/témoin si disponible */}
      {sacrement.parrain && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonneInfoCard
            title="Informations sur le parrain/témoin"
            personne={sacrement.parrain}
          />
        </div>
      )}

      {/* Galerie de documents */}
      <DocumentsGallery images={sacrement.images || []} />

      {/* Dialogues de validation et rejet */}
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
    </div>
  );
}
