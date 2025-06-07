/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import React from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  Download,
  Edit,
  FileText,
  Heart,
  Loader2,
  MapPin,
  Printer,
  Trash2,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ModifierSacrementIndividuelForm from "@/components/forms/ModifierSacrementIndividuelForm";

// Types
interface SacrementIndividuel {
  id: number;
  created_at: string;
  type: string;
  soustype: string;
  date: string;
  description: string;
  celebrant_id: number;
  paroisse_id: number;
  chapelle_id: number | null;
  certificateur_id: number | null;
  celebrant?: {
    id: number;
    nom: string;
    prenoms: string;
  };
  chapelle?: {
    id: number;
    nom: string;
  };
}

// Formatage de la date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    return "Date inconnue";
  }
};

// Extraire le statut à partir de la date
const extractStatut = (sacrement: SacrementIndividuel) => {
  const dateObj = new Date(sacrement.date);
  const now = new Date();

  if (dateObj < now) return "terminé";
  if (dateObj.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000)
    return "confirmé";
  if (dateObj.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000)
    return "en préparation";
  return "demande reçue";
};

// Détails du soustype de sacrement
const getSacrementSoustypeDetails = (soustype: string) => {
  const soustypeLC = soustype.toLowerCase();

  if (soustypeLC.includes("baptême") || soustypeLC === "Baptême") {
    return {
      label: "Baptême",
      variant: "default" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
    };
  } else if (soustypeLC.includes("Première Communion")) {
    return {
      label: "Première Communion",
      variant: "success" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
    };
  } else if (soustypeLC.includes("Profession de Foi")) {
    return {
      label: "Profession De Foi",
      variant: "secondary" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
    };
  } else if (soustypeLC.includes("Sacrement de Malade")) {
    return {
      label: "Sacrement de Malade",
      variant: "outline" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
    };
  } else {
    return {
      label: soustype,
      variant: "default" as const,
      icon: <Heart className="h-4 w-4 mr-1" />,
    };
  }
};

// Détails du statut
const getStatusDetails = (statut: string) => {
  switch (statut) {
    case "confirmé":
      return { label: "Confirmé", variant: "success" as const };
    case "en préparation":
      return { label: "En préparation", variant: "secondary" as const };
    case "demande reçue":
      return { label: "Demande reçue", variant: "outline" as const };
    case "terminé":
      return { label: "Terminé", variant: "default" as const };
    default:
      return { label: statut, variant: "outline" as const };
  }
};

// Fonction pour extraire le nom de la personne concernée depuis la description
const extractPersonne = (sacrement: SacrementIndividuel) => {
  // Chercher un nom dans la description
  const personneMatch = sacrement.description.match(
    /(?:pour|de|à)\s+([^.,;]+)/i
  );
  if (personneMatch) {
    return personneMatch[1].trim();
  }

  // Si aucun match, retourner un placeholder
  return "Participant(e)";
};

export default function SacrementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [sacrement, setSacrement] = useState<SacrementIndividuel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingInProgress, setDeletingInProgress] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const sacrementId = Number(params.id);

  // Récupérer les détails du sacrement
  const fetchSacrementDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      const response = await fetch(
        `https://api.cathoconnect.ci/api:HzF8fFua/sacrement-individuel/obtenir-un?sacrement_id=${sacrementId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setSacrement(data.item);
    } catch (error) {
      console.error("Erreur lors du chargement des détails:", error);
      setError("Impossible de charger les détails du sacrement.");
      toast.error("Erreur", {
        description: "Impossible de charger les détails du sacrement.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSacrementDetails();
  }, [sacrementId]);

  // Supprimer le sacrement
  const handleDelete = async () => {
    setDeletingInProgress(true);
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-individuel/supprimer",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sacrement_id: sacrementId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      toast.success("Succès", {
        description: "Le sacrement a été supprimé avec succès.",
      });

      // Rediriger vers la liste des sacrements
      router.push("/dashboard/paroisse/sacrements/individuelle");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur", {
        description: "Impossible de supprimer le sacrement.",
      });
    } finally {
      setDeletingInProgress(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  if (error || !sacrement) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <XCircle className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Une erreur est survenue
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-4">
          {error || "Impossible de trouver le sacrement demandé."}
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
    );
  }

  const statut = extractStatut(sacrement);
  const { label: statusLabel, variant: statusVariant } =
    getStatusDetails(statut);
  const {
    label: typeLabel,
    variant: typeVariant,
    icon: typeIcon,
  } = getSacrementSoustypeDetails(sacrement.soustype);
  const personne = extractPersonne(sacrement);

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation et actions */}
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Détails du sacrement
          </h1>
        </div>
        <div className="flex gap-2">
          <ModifierSacrementIndividuelForm
            sacrement={sacrement}
            onSuccess={fetchSacrementDetails}
          />
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" /> Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce sacrement ? Cette action
                  est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deletingInProgress}
                >
                  {deletingInProgress ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    "Supprimer"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Badges d'information */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={typeVariant}
          className="flex items-center text-sm px-2.5 py-0.5"
        >
          {typeIcon} {typeLabel}
        </Badge>
        {/* <Badge variant={statusVariant} className="text-sm px-2.5 py-0.5">
          {statusLabel}
        </Badge> */}
      </div>

      {/* Carte principale d'informations */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date */}
          <div className="flex flex-col md:flex-row gap-1 md:gap-6">
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex items-center text-sm font-semibold text-slate-600">
                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                Date du sacrement
              </div>
              <p className="text-lg">{formatDate(sacrement.date)}</p>
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex items-center text-sm font-semibold text-slate-600">
                <User className="h-4 w-4 mr-2 text-slate-400" />
                Célébrant
              </div>
              <p className="text-lg">
                {sacrement.celebrant
                  ? `${sacrement.celebrant.prenoms} ${sacrement.celebrant.nom}`
                  : `ID: ${sacrement.celebrant_id}`}
              </p>
            </div>
          </div>

          <Separator />          

          {/* Description complète */}
          <div className="space-y-2">
            <div className="flex items-center text-sm font-semibold text-slate-600">
              <FileText className="h-4 w-4 mr-2 text-slate-400" />
              Description
            </div>
            <div className="bg-slate-50 p-4 rounded-md">
              <p className="whitespace-pre-line">{sacrement.description}</p>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="text-xs text-slate-400 pt-4">
            <p>
              Créé le: {new Date(sacrement.created_at).toLocaleString("fr-FR")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section des documents et actions supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Documents */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-slate-600">
                Téléchargez ou imprimez les documents liés à ce sacrement.
              </p>

              <div className="mt-4 space-y-3">
                <Button
                  className="w-full justify-start"
                  onClick={generateCertificate}
                >
                  <Download className="h-4 w-4 mr-2" /> Générer un certificat
                </Button>

                <label htmlFor="document-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center w-full border-2 border-dashed border-slate-300 rounded-md h-20 bg-slate-50 hover:bg-slate-100 transition-colors">
                    {uploadingFile ? (
                      <div className="flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-slate-400 mr-2" />
                        <span className="text-sm text-slate-500">
                          Chargement...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-5 w-5 text-slate-400 mb-1" />
                        <span className="text-sm text-slate-500">
                          Ajouter un document
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    id="document-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Actions rapides */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={generateCertificate}
            >
              <Printer className="h-4 w-4 mr-2" /> Imprimer le certificat
            </Button>

            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" /> Planifier un suivi
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => {
                toast.success("Notification envoyée", {
                  description: "Le notificateur a été informé du sacrement.",
                });
              }}
            >
              <User className="h-4 w-4 mr-2" /> Notifier le responsable
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
