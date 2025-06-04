/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  User,
  Mail,
  Phone,
  Calendar,
  Church,
  MapPin,
  Wallet,
  Pencil,
  Clock,
  BookOpen,
  Heart,
  FileText,
  Building,
  Info,
  CircleUser,
  Loader2,
  XCircle,
  UserPlus,
  CalendarDays,
  PlusCircle,
  Plus,
  Settings,
  Edit,
  ChevronRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";

import AumonierModal from "@/components/modals/AumonierModal";
import ParrainModal from "@/components/modals/ParrainModal";
import ResponsableModal from "@/components/modals/ResponsableModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ModifierMouvementForm from "@/components/forms/ModifierMouvementForm";

// Types
interface Personne {
  id: number;
  created_at: string;
  identifiant: string;
  nom: string;
  prenoms: string;
  genre?: string;
  num_de_telephone?: string;
  email?: string;
  date_de_naissance?: string;
  nationalite?: string;
  pays?: string;
  ville?: string;
  commune?: string;
  quartier?: string;
  solde?: number;
  statut?: string;
  fonction?: string;
  paroisse_id?: number;
  est_abonne?: boolean;
  date_de_fin_abonnement?: number;
  chapelle_id?: number;
  ceb_id?: number;
  mouvementassociation_id?: number;
  user_id?: number;
  abonnement_id?: number;
}

interface Paroisse {
  id: number;
  created_at: string;
  nom: string;
  pays: string;
  ville: string;
  quartier: string;
  statut: string;
  vicaires_id: number[];
  administrateur_id: number | null;
  cure_id: number | null;
  doyenne_id: number | null;
  vicariatsecteur_id: number | null;
  localisation: string;
}

interface Chapelle {
  id: number;
  created_at: string;
  nom: string;
  ville: string;
  quartier: string;
  compte_id: number | null;
  paroisse_id: number;
  localisation: string;
}

interface Mouvement {
  id: number;
  created_at: string;
  identifiant: string;
  nom: string;
  solde: number;
  type: string;
  responsable_id: number | null;
  parrain_id: number | null;
  aumonier_id: number | null;
  paroisse_id: number;
  chapelle_id: number | null;
  aumonier?: Personne;
  responsable?: Personne;
  parrain?: Personne;
  paroisse?: Paroisse;
  chapelle?: Chapelle;
  membres?: Personne[];
  evenements?: any[];
}

// Fonction pour récupérer les détails d'un mouvement
const fetchMouvementDetails = async (id: number): Promise<Mouvement> => {
  const API_URL = "https://api.cathoconnect.ci/api:HzF8fFua";
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new AuthenticationError("Token d'authentification non trouvé");
  }

  try {
    const response = await axios.get(
      `${API_URL}/mouvementassociation/obtenir-un`,
      {
        params: { mouvementassociation_id: id },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.item;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Une erreur est survenue";

      switch (statusCode) {
        case 401:
          throw new AuthenticationError(errorMessage);
        case 403:
          throw new ForbiddenError(errorMessage);
        case 404:
          throw new NotFoundError(errorMessage);
        default:
          throw new Error(errorMessage);
      }
    }
    throw error;
  }
};

export default function MouvementDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const mouvementId = params?.id
    ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id, 10)
    : null;

  const [mouvement, setMouvement] = useState<Mouvement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [aumonierModalOpen, setAumonierModalOpen] = useState(false);
  const [responsableModalOpen, setResponsableModalOpen] = useState(false);
  const [parrainModalOpen, setParrainModalOpen] = useState(false);

  // Charger les détails du mouvement
  useEffect(() => {
    const loadMouvementDetails = async () => {
      if (!mouvementId) {
        setError("ID du mouvement non valide");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchMouvementDetails(mouvementId);
        setMouvement(data);
      } catch (err) {
        console.error(
          "Erreur lors du chargement des détails du mouvement:",
          err
        );

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
          setError("Mouvement non trouvé.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadMouvementDetails();
  }, [mouvementId, router]);

  // Formatage d'un numéro de téléphone: 0101020304 -> 01 01 02 03 04
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "Non renseigné";

    const cleaned = phone.replace(/\D/g, "");
    const groups = [];

    for (let i = 0; i < cleaned.length; i += 2) {
      groups.push(cleaned.slice(i, i + 2));
    }

    return groups.join(" ");
  };

  // Formatage de la date: 2023-05-15 -> 15/05/2023
  const formatDate = (
    dateInput: string | Date | number | undefined | null
  ): string => {
    if (!dateInput) return "Date non renseignée";

    let date: Date;

    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "string" || typeof dateInput === "number") {
      date = new Date(dateInput);
    } else {
      return "Date invalide";
    }

    if (isNaN(date.getTime())) {
      return "Date invalide";
    }

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Formatage de la monnaie en FCFA
  const formatCurrency = (
    amount: string | number | bigint | null | undefined
  ) => {
    if (amount === undefined || amount === null) return "0 FCFA";

    const numericAmount = typeof amount === "string" ? Number(amount) : amount;

    if (isNaN(Number(numericAmount))) return "0 FCFA";

    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(numericAmount as number | bigint);
  };

  // Gérer le succès de la mise à jour
  const handleUpdateSuccess = (
    updatedMouvement: SetStateAction<Mouvement | null>
  ) => {
    setMouvement(updatedMouvement);
    toast.success("Mouvement mis à jour avec succès", {
      description: `Les informations de "${updatedMouvement && "nom" in updatedMouvement && updatedMouvement.nom ? updatedMouvement.nom : ""}" ont été mises à jour.`,
    });
  };

  // Gérer l'assignation d'un rôle
  const handleRoleAssigned = async () => {
    try {
      if (mouvementId === null || isNaN(mouvementId)) {
        throw new Error("ID du mouvement invalide");
      }

      const data = await fetchMouvementDetails(mouvementId);
      setMouvement(data);
      toast.success("Les données ont été mises à jour");
    } catch (err) {
      console.error("Erreur lors du rechargement des détails:", err);
      toast.error("Erreur lors du rafraîchissement des données");
    }
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

    if (!mouvement) {
      return (
        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-700">
              Mouvement non trouvé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-600">
              Le mouvement demandé n'existe pas ou a été supprimé.
            </p>
            <div className="mt-4">
              <Button variant="outline" onClick={() => router.back()}>
                Retour à la liste des mouvements
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Afficher les détails du mouvement
    return (
      <div className="space-y-6">
        {/* Informations générales */}
        <Card className="bg-slate-50 border-slate-100">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">
                  {mouvement.nom}
                </CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                onClick={() => setShowEditDialog(true)}
              >
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Date de création
                  </p>
                  <p className="text-sm font-semibold">
                    {formatDate(mouvement.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Type</p>
                  <p className="text-sm font-semibold">{mouvement.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Membres
                  </p>
                  <p className="text-sm font-semibold">
                    {mouvement.membres?.length || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Evenements
                  </p>
                  <p className="text-sm font-semibold">
                    {mouvement.evenements?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Système d'onglets pour Responsables, Membres, Événements */}
        <Card className="bg-slate-50 border-slate-100">
          <CardContent className="p-6">
            <Tabs defaultValue="responsables" className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger
                  value="responsables"
                  className="flex items-center justify-center"
                >
                  <User className="h-4 w-4 mr-1" />
                  Bureau
                </TabsTrigger>
                <TabsTrigger
                  value="membres"
                  className="flex items-center justify-center"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Membres
                </TabsTrigger>
                <TabsTrigger
                  value="evenements"
                  className="flex items-center justify-center"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Événements
                </TabsTrigger>
              </TabsList>

              {/* Contenu de l'onglet Responsables */}
              <TabsContent value="responsables" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Aumonier */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-md">Aumônier</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {mouvement.aumonier ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {mouvement.aumonier.prenoms?.[0]}
                                {mouvement.aumonier.nom?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {mouvement.aumonier.prenoms}{" "}
                                {mouvement.aumonier.nom}
                              </p>
                              <p className="text-sm text-slate-500">Aumônier</p>
                            </div>
                          </div>

                          {mouvement.aumonier.num_de_telephone && (
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-pink-100 flex items-center justify-center">
                                <Phone className="h-5 w-5 text-pink-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-500">
                                  Téléphone
                                </p>
                                <p className="text-sm font-semibold">
                                  {formatPhoneNumber(
                                    mouvement.aumonier.num_de_telephone
                                  )}
                                </p>
                              </div>
                            </div>
                          )}

                          {mouvement.aumonier.email && (
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center">
                                <Mail className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-500">
                                  Email
                                </p>
                                <p className="text-sm font-semibold">
                                  {mouvement.aumonier.email}
                                </p>
                              </div>
                            </div>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-4"
                            onClick={() => setAumonierModalOpen(true)}
                          >
                            <UserPlus className="h-3.5 w-3.5 mr-2" />
                            Changer l'aumônier
                          </Button>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-slate-900 mb-2">
                            Aucun responsable
                          </h3>
                          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                            Aucun aumônier assigné à ce mouvement.
                          </p>
                          <Button
                            onClick={() => setAumonierModalOpen(true)}
                            className="cursor-pointer"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Ajouter un responsable
                          </Button>
                        </div>
                        // <div className="p-4 bg-amber-50 rounded-md border border-amber-100">
                        //   <p className="text-sm text-center text-amber-600">
                        //     Aucun aumônier n'est assigné à ce mouvement.
                        //   </p>
                        //   <div className="flex justify-center mt-2">
                        //     <Button
                        //       size="sm"
                        //       variant="outline"
                        //       className="text-amber-600 border-amber-300 hover:bg-amber-100"
                        //       onClick={() => setAumonierModalOpen(true)}
                        //     >
                        //       <UserPlus className="h-3.5 w-3.5 mr-2" />
                        //       Assigner un aumônier
                        //     </Button>
                        //   </div>
                        // </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Responsable */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-md">Responsable</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {mouvement.responsable ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                {mouvement.responsable.prenoms?.[0]}
                                {mouvement.responsable.nom?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {mouvement.responsable.prenoms}{" "}
                                {mouvement.responsable.nom}
                              </p>
                              <p className="text-sm text-slate-500">
                                Responsable
                              </p>
                            </div>
                          </div>

                          {mouvement.responsable.num_de_telephone && (
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-pink-100 flex items-center justify-center">
                                <Phone className="h-5 w-5 text-pink-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-500">
                                  Téléphone
                                </p>
                                <p className="text-sm font-semibold">
                                  {formatPhoneNumber(
                                    mouvement.responsable.num_de_telephone
                                  )}
                                </p>
                              </div>
                            </div>
                          )}

                          {mouvement.responsable.email && (
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center">
                                <Mail className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-500">
                                  Email
                                </p>
                                <p className="text-sm font-semibold">
                                  {mouvement.responsable.email}
                                </p>
                              </div>
                            </div>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-4"
                            onClick={() => setResponsableModalOpen(true)}
                          >
                            <UserPlus className="h-3.5 w-3.5 mr-2" />
                            Changer le responsable
                          </Button>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-slate-900 mb-2">
                            Aucun responsable
                          </h3>
                          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                            Aucun responsable assigné à ce mouvement.
                          </p>
                          <Button
                            onClick={() => setResponsableModalOpen(true)}
                            className="cursor-pointer"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Ajouter un responsable
                          </Button>
                        </div>
                        // <div className="p-4 bg-amber-50 rounded-md border border-amber-100">
                        //   <p className="text-sm text-center text-amber-600">
                        //     Aucun responsable n'est assigné à ce mouvement.
                        //   </p>
                        //   <div className="flex justify-center mt-2">
                        //     <Button
                        //       size="sm"
                        //       variant="outline"
                        //       className="text-amber-600 border-amber-300 hover:bg-amber-100"
                        //       onClick={() => setResponsableModalOpen(true)}
                        //     >
                        //       <UserPlus className="h-3.5 w-3.5 mr-2" />
                        //       Assigner un responsable
                        //     </Button>
                        //   </div>
                        // </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Parrain */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-md">Parrain</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {mouvement.parrain ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-purple-100 text-purple-600">
                                {mouvement.parrain.prenoms?.[0]}
                                {mouvement.parrain.nom?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {mouvement.parrain.prenoms}{" "}
                                {mouvement.parrain.nom}
                              </p>
                              <p className="text-sm text-slate-500">Parrain</p>
                            </div>
                          </div>

                          {mouvement.parrain.num_de_telephone && (
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-pink-100 flex items-center justify-center">
                                <Phone className="h-5 w-5 text-pink-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-500">
                                  Téléphone
                                </p>
                                <p className="text-sm font-semibold">
                                  {formatPhoneNumber(
                                    mouvement.parrain.num_de_telephone
                                  )}
                                </p>
                              </div>
                            </div>
                          )}

                          {mouvement.parrain.email && (
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center">
                                <Mail className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-500">
                                  Email
                                </p>
                                <p className="text-sm font-semibold">
                                  {mouvement.parrain.email}
                                </p>
                              </div>
                            </div>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-4"
                            onClick={() => setParrainModalOpen(true)}
                          >
                            <UserPlus className="h-3.5 w-3.5 mr-2" />
                            Changer le parrain
                          </Button>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-slate-900 mb-2">
                            Aucun parrain
                          </h3>
                          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                            Aucun parrain assigné à ce mouvement.
                          </p>
                          <Button
                            onClick={() => setParrainModalOpen(true)}
                            className="cursor-pointer"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Ajouter un parrain
                          </Button>
                        </div>
                        // <div className="p-4 bg-amber-50 rounded-md border border-amber-100">
                        //   <p className="text-sm text-center text-amber-600">
                        //     Aucun parrain n'est assigné à ce mouvement.
                        //   </p>
                        //   <div className="flex justify-center mt-2">
                        //     <Button
                        //       size="sm"
                        //       variant="outline"
                        //       className="text-amber-600 border-amber-300 hover:bg-amber-100"
                        //       onClick={() => setParrainModalOpen(true)}
                        //     >
                        //       <UserPlus className="h-3.5 w-3.5 mr-2" />
                        //       Assigner un parrain
                        //     </Button>
                        //   </div>
                        // </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Contenu de l'onglet Membres */}
              <TabsContent value="membres" className="pt-4">
                {mouvement.membres && mouvement.membres.length > 0 ? (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                              Nom Complet
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                              Téléphone
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                              Email
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                              Statut
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {mouvement.membres.map((membre) => (
                            <tr
                              key={membre.id}
                              className="border-b border-slate-100 hover:bg-slate-50"
                            >
                              <td className="py-3 px-4 text-sm text-slate-600">
                                {membre.email || "Non renseigné"}
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="outline">
                                  {membre.statut || "Non défini"}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Ajouter un membre
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Aucun membre
                    </h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                      Ce mouvement n'a pas encore de membres enregistrés.
                    </p>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Ajouter des membres
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Contenu de l'onglet Événements */}
              <TabsContent value="evenements" className="pt-4">
                {mouvement.evenements && mouvement.evenements.length > 0 ? (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                              Titre
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                              Date
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                              Description
                            </th>
                            <th className="py-3 px-4 text-right text-sm font-medium text-slate-500">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {mouvement.evenements.map((evenement) => (
                            <tr
                              key={evenement.id}
                              className="border-b border-slate-100 hover:bg-slate-50"
                            >
                              <td className="py-3 px-4">
                                <div className="font-medium text-sm">
                                  {evenement.titre}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center text-sm text-slate-600">
                                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                                  {formatDate(evenement.date)}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm text-slate-600 max-w-xs truncate">
                                  {evenement.description}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4 text-slate-500" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un événement
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Aucun événement
                    </h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                      Ce mouvement n'a pas encore d'événements planifiés.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un événement
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6 ">
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
          Détails du mouvement
        </h1>
        <p className="text-slate-500">
          Informations détaillées sur le mouvement ou l'association
        </p>
      </div>

      {/* Contenu principal */}
      {renderContent()}

      {/* Dialog de modification */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg text-blue-800 font-semibold flex items-center">
              Modifier le mouvement
            </DialogTitle>
          </DialogHeader>

          {mouvement && (
            <ModifierMouvementForm
              onClose={() => setShowEditDialog(false)}
              mouvementData={mouvement}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modaux pour assigner des responsables */}
      {typeof mouvementId === "number" && (
        <>
          <AumonierModal
            isOpen={aumonierModalOpen}
            onClose={() => setAumonierModalOpen(false)}
            mouvementId={mouvementId}
            onAssigned={handleRoleAssigned}
          />

          <ResponsableModal
            isOpen={responsableModalOpen}
            onClose={() => setResponsableModalOpen(false)}
            mouvementId={mouvementId}
            onAssigned={handleRoleAssigned}
          />

          <ParrainModal
            isOpen={parrainModalOpen}
            onClose={() => setParrainModalOpen(false)}
            mouvementId={mouvementId}
            onAssigned={handleRoleAssigned}
          />
        </>
      )}
    </div>
  );
}
