/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Phone,
  Hand,
  User,
  Wallet,
  FileText,
  Bell,
  Check,
  X,
  Church,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/messe-services";
import { fetchDemandeMesseDetails } from "@/services/messe-services";

export default function DemandeMesseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const demandeMesseId = params?.id
    ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id, 10)
    : null;

  const [demandeMesse, setDemandeMesse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Types d'intention possibles pour les badges
  const intentionTypes = {
    "PRIÈRE DE REMERCIEMENT": "success",
    "PRIÈRE D'INTERCESSION": "blue",
    "PRIÈRE POUR LES DÉFUNTS": "destructive",
    "PRIÈRE DE DÉLIVRANCE": "warning",
    "PRIÈRE DE GUÉRISON": "purple",
  };

  // Charger les détails de la demande de messe
  useEffect(() => {
    const loadDemandeMesseDetails = async () => {
      if (!demandeMesseId) {
        setError("ID de demande de messe non valide");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchDemandeMesseDetails(demandeMesseId);
        setDemandeMesse(data);
      } catch (err) {
        console.error("Erreur lors du chargement des détails de la demande de messe:", err);

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
          setError("Demande de messe non trouvée.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDemandeMesseDetails();
  }, [demandeMesseId, router]);

  // Formater un numéro de téléphone: 0101020304 -> 01 01 02 03 04
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "Non renseigné";

    const cleaned = phone.replace(/\D/g, "");
    const groups = [];

    for (let i = 0; i < cleaned.length; i += 2) {
      groups.push(cleaned.slice(i, i + 2));
    }

    return groups.join(" ");
  };

  // Formater la date: 1747699200000 -> 20/05/2025
  const formatDate = (timestamp: string | number | Date) => {
    if (!timestamp) return "Non renseignée";

    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat("fr-FR").format(date);
    } catch (err) {
      console.error("Erreur lors du formatage de la date:", err);
      return "Date invalide";
    }
  };

  // Formater l'heure: 1747749600000 -> 14:00
  const formatTime = (timestamp: string | number | Date) => {
    if (!timestamp) return "Non renseignée";

    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (err) {
      console.error("Erreur lors du formatage de l'heure:", err);
      return "Heure invalide";
    }
  };

  // Formater la monnaie en FCFA
  const formatCurrency = (amount: string | number | bigint | null | undefined) => {
    if (amount === undefined || amount === null) return "0 FCFA";

    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Rendu du contenu en fonction de l'état
  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <Card className="bg-slate-50 border-slate-100">
            <CardHeader className="pb-3">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>

          <Card className="bg-slate-50 border-slate-100">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-1/3 mb-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (error) {
      return (
        <Card className="bg-red-50 border-red-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-700">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Retour
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!demandeMesse) {
      return (
        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-700">Demande de messe non trouvée</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-600">
              La demande de messe demandée n'existe pas ou a été supprimée.
            </p>
            <div className="mt-4">
              <Button variant="outline" onClick={() => router.back()}>
                Retour à la liste des demandes
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Déterminer la couleur du badge pour le statut de paiement
    const paymentStatusStyle = demandeMesse.est_payee ? "success" : "destructive";
    const paymentStatusText = demandeMesse.est_payee ? "Payée" : "Non payée";

    // Déterminer la couleur du badge pour l'intention
    const intentionStyle = intentionTypes[demandeMesse.intention] || "default";

    // Afficher les détails de la demande de messe
    return (
      <div className="space-y-6">
        {/* Informations générales */}
        <Card className="bg-slate-50 border-slate-100">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardDescription>
                  <span className="font-medium">Créée le:</span> {formatDate(demandeMesse.created_at)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Hand className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Intention
                  </p>
                  <div className="flex items-center mt-1">
                    <Badge variant={intentionStyle} className="font-medium">
                      {demandeMesse.intention}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Montant
                  </p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(demandeMesse.montant)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                  {demandeMesse.est_payee ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Statut du paiement
                  </p>
                  <div className="flex items-center mt-1">
                    <Badge variant={paymentStatusStyle} className="font-medium">
                      {paymentStatusText}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Informations sur la demande</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Demandeur
                      </p>
                      <p className="text-sm font-semibold">
                        {demandeMesse.demandeur}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Concerne
                      </p>
                      <p className="text-sm font-semibold">
                        {demandeMesse.concerne}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center mt-0.5">
                      <FileText className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Description
                      </p>
                      <p className="text-sm text-slate-800 whitespace-pre-wrap">
                        {demandeMesse.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Informations sur la messe</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                      <Church className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Libellé de la messe
                      </p>
                      <p className="text-sm font-semibold">
                        {demandeMesse.messe?.libelle || "Non spécifié"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Type: {demandeMesse.messe?.extras?.type_messe || "Non spécifié"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Date de la messe
                      </p>
                      <p className="text-sm font-semibold">
                        {formatDate(demandeMesse.messe?.date_de_debut)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-pink-100 flex items-center justify-center mt-0.5">
                      <Clock className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Horaire
                      </p>
                      <p className="text-sm font-semibold">
                        {formatTime(demandeMesse.messe?.extras?.heure_de_debut)} - {formatTime(demandeMesse.messe?.extras?.heure_de_fin)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations sur l'initiateur */}
        <Card className="bg-slate-50 border-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Informations sur l'initiateur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Nom complet
                  </p>
                  <p className="text-sm font-semibold">
                    {demandeMesse.initiateur?.prenoms} {demandeMesse.initiateur?.nom}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-pink-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Téléphone
                  </p>
                  <p className="text-sm font-semibold">
                    {formatPhoneNumber(demandeMesse.initiateur?.num_de_telephone)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      {/* Fil d'Ariane */}
      <div className="flex items-center mb-4 text-sm text-slate-500">
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

      {/* Titre et description */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Détails de la demande de messe
        </h1>
        <p className="text-slate-500">
          Informations détaillées sur la demande de messe et son statut
        </p>
      </div>

      {/* Contenu principal */}
      {renderContent()}
    </div>
  );
}