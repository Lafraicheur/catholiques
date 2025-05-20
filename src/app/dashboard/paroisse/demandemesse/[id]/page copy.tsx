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
  Info,
  Users,
  Pencil,
  CircleUser,
  Loader2,
  XCircle,
  CalendarDays,
  PlusCircle,
  Settings,
  Mail,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  fetchDemandeMesseDetails
} from "@/services/messe-services";

// Composant InfoItem réutilisable
const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}) => {
  if (value === null || value === undefined) {
    value = "Non renseigné";
  }

  return (
    <div className="flex items-start space-x-3 py-2">
      <div className="text-slate-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};

// Composant PersonneCard réutilisable
const PersonneCard = ({
  personne,
  role,
  emptyMessage,
}: {
  personne?: any | null;
  role: string;
  emptyMessage: string;
}) => {
  if (!personne) {
    return (
      <Card className="bg-slate-50">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <CircleUser className="h-16 w-16 text-slate-300 mb-3" />
          <h3 className="font-medium text-slate-900 mb-1">{emptyMessage}</h3>
          <p className="text-sm text-slate-500 mb-4">
            Aucune personne n'est assignée à ce rôle actuellement.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-10">
        <div className="flex flex-col">
          <div className="flex items-start space-x-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {personne.prenoms?.[0]}
                {personne.nom?.[0]}
              </AvatarFallback>
              <AvatarImage src="" />
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium text-slate-900">
                {personne.prenoms} {personne.nom}
              </h3>
              <p className="text-sm text-slate-500 mb-3">{role}</p>

              {personne.email && (
                <div className="flex items-center space-x-2 text-sm mb-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{personne.email}</span>
                </div>
              )}

              {personne.num_de_telephone && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{personne.num_de_telephone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DemandeMesseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const demandeMesseId = params?.id
    ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id, 10)
    : null;

  const [demandeMesse, setDemandeMesse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");

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
      return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
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

  // État de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Erreur</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  // Si aucune demande de messe n'est trouvée
  if (!demandeMesse) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Info className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Demande de messe non trouvée</h2>
          <p className="text-slate-600 mb-6">
            La demande de messe que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Button onClick={() => router.push("/dashboard/messes/demandes")}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  // Déterminer la couleur du badge pour le statut de paiement
  const paymentStatusStyle = demandeMesse.est_payee ? "success" : "destructive";
  const paymentStatusText = demandeMesse.est_payee ? "Payée" : "Non payée";

  // Déterminer la couleur du badge pour l'intention
  const intentionStyle = intentionTypes[demandeMesse.intention] || "default";

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* En-tête avec navigation et actions */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          </div>

          <div className="flex space-x-3">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
          </div>
        </div>
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

      {/* Onglets */}
      <Card className="p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6 space-y-4"
        >
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="details" className="whitespace-nowrap">
                <Info className="h-4 w-4 mr-2" />
                Détails
              </TabsTrigger>
              <TabsTrigger value="messe" className="whitespace-nowrap">
                <Church className="h-4 w-4 mr-2" />
                Messe associée
              </TabsTrigger>
              <TabsTrigger value="initiateur" className="whitespace-nowrap">
                <User className="h-4 w-4 mr-2" />
                Initiateur
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Contenu de l'onglet "Détails" */}
          <TabsContent value="details" className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Informations générales
                  </CardTitle>
                  <Separator className="my-1" />
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoItem
                      icon={<Hand className="h-4 w-4" />}
                      label="Intention"
                      value={
                        <Badge variant={intentionStyle} className="font-medium">
                          {demandeMesse.intention}
                        </Badge>
                      }
                    />
                    <InfoItem
                      icon={<User className="h-4 w-4" />}
                      label="Demandeur"
                      value={demandeMesse.demandeur}
                    />
                    <InfoItem
                      icon={<User className="h-4 w-4" />}
                      label="Concerne"
                      value={demandeMesse.concerne}
                    />
                    <InfoItem
                      icon={<Wallet className="h-4 w-4" />}
                      label="Montant"
                      value={formatCurrency(demandeMesse.montant)}
                    />
                    <InfoItem
                      icon={<Clock className="h-4 w-4" />}
                      label="Date de création"
                      value={formatDate(demandeMesse.created_at)}
                    />
                    <InfoItem
                      icon={demandeMesse.est_payee ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      label="Statut du paiement"
                      value={
                        <Badge variant={paymentStatusStyle} className="font-medium">
                          {paymentStatusText}
                        </Badge>
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques rapides */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-slate-800">
                    {demandeMesse.description || "Aucune description disponible."}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contenu de l'onglet "Messe associée" */}
          <TabsContent value="messe" className="space-y-6">
            {!demandeMesse.messe ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Church className="h-16 w-16 text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Aucune messe associée
                    </h3>
                    <p className="text-slate-500 max-w-md mb-6">
                      Cette demande de messe n'est pas encore associée à une messe spécifique.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Informations sur la messe
                  </CardTitle>
                  <Separator className="my-1" />
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoItem
                      icon={<Church className="h-4 w-4" />}
                      label="Libellé"
                      value={demandeMesse.messe.libelle}
                    />
                    <InfoItem
                      icon={<Info className="h-4 w-4" />}
                      label="Type de messe"
                      value={demandeMesse.messe.extras?.type_messe || "Non spécifié"}
                    />
                    <InfoItem
                      icon={<Calendar className="h-4 w-4" />}
                      label="Date"
                      value={formatDate(demandeMesse.messe.date_de_debut)}
                    />
                    <InfoItem
                      icon={<Clock className="h-4 w-4" />}
                      label="Horaire"
                      value={`${formatTime(demandeMesse.messe.extras?.heure_de_debut)} - ${formatTime(demandeMesse.messe.extras?.heure_de_fin)}`}
                    />
                    {demandeMesse.messe.extras?.prix_demande_de_messe && (
                      <InfoItem
                        icon={<Wallet className="h-4 w-4" />}
                        label="Prix standard"
                        value={formatCurrency(demandeMesse.messe.extras.prix_demande_de_messe)}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Contenu de l'onglet "Initiateur" */}
          <TabsContent value="initiateur" className="space-y-6">
            {!demandeMesse.initiateur ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <User className="h-16 w-16 text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Aucun initiateur trouvé
                    </h3>
                    <p className="text-slate-500 max-w-md mb-6">
                      Les informations sur l'initiateur de cette demande ne sont pas disponibles.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PersonneCard
                  personne={demandeMesse.initiateur}
                  role="Initiateur de la demande"
                  emptyMessage="Aucun initiateur"
                />

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Informations complémentaires
                    </CardTitle>
                    <Separator className="my-1" />
                  </CardHeader>

                  <CardContent>
                    <InfoItem
                      icon={<Bell className="h-4 w-4" />}
                      label="ID Paroissien"
                      value={demandeMesse.paroissien_id || "Non attribué"}
                    />
                    <InfoItem
                      icon={<CalendarDays className="h-4 w-4" />}
                      label="Date de la demande"
                      value={formatDate(demandeMesse.created_at)}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}