/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import {
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";
import AumonierModal from "@/components/modals/AumonierModal";
import ParrainModal from "@/components/modals/ParrainModal";
import ResponsableModal from "@/components/modals/ResponsableModal";


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

// Composants auxiliaires
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

const PersonneCard = ({
  personne,
  role,
  emptyMessage,
  actionButton,
}: {
  personne?: Personne | null;
  role: string;
  emptyMessage: string;
  actionButton?: React.ReactNode;
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
          {actionButton}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
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

          {actionButton && (
            <div className="mt-15 self-center">{actionButton}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function MouvementDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [mouvement, setMouvement] = useState<Mouvement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [aumonierModalOpen, setAumonierModalOpen] = useState(false);
  const [responsableModalOpen, setResponsableModalOpen] = useState(false);
  const [parrainModalOpen, setParrainModalOpen] = useState(false);

  const mouvementId = Number(params.id);

  const handleRoleAssigned = async () => {
    try {
      if (isNaN(mouvementId)) {
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

  useEffect(() => {
    const loadMouvementDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isNaN(mouvementId)) {
          throw new Error("ID du mouvement invalide");
        }

        const data = await fetchMouvementDetails(mouvementId);
        setMouvement(data);
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
          setError("Le mouvement ou l'association demandé n'existe pas.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadMouvementDetails();
  }, [mouvementId, router]);

  // Formatage de la monnaie
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Formatage de la date
  const formatDate = (dateString: string): string => {
    if (dateString === "now") return "Récemment";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch (err) {
      return "Date inconnue";
    }
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
          onClick={() => router.push("/mouvements")}
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

  // Si aucun mouvement n'est trouvé
  if (!mouvement) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.push("/mouvements")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Info className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Mouvement non trouvé</h2>
          <p className="text-slate-600 mb-6">
            Le mouvement ou l'association que vous recherchez n'existe pas ou a
            été supprimé.
          </p>
          <Button onClick={() => router.push("/dashboard/paroisse/m&a")}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

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
              Exporter
            </Button>
            <Button>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <Card className="p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6 space-y-4"
        >
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="details" className="whitespace-nowrap">
                <Info className="h-4 w-4 mr-2" />
                Détails
              </TabsTrigger>
              <TabsTrigger value="membres" className="whitespace-nowrap">
                <Users className="h-4 w-4 mr-2" />
                Membres
              </TabsTrigger>
              <TabsTrigger value="finances" className="whitespace-nowrap">
                <Wallet className="h-4 w-4 mr-2" />
                Finances
              </TabsTrigger>
              <TabsTrigger value="activites" className="whitespace-nowrap">
                <Calendar className="h-4 w-4 mr-2" />
                Événements
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
                      icon={<BookOpen className="h-4 w-4" />}
                      label="Nom"
                      value={mouvement.nom}
                    />
                    <InfoItem
                      icon={<Heart className="h-4 w-4" />}
                      label="Type"
                      value={mouvement.type}
                    />
                    <InfoItem
                      icon={<Clock className="h-4 w-4" />}
                      label="Date de création"
                      value={formatDate(mouvement.created_at)}
                    />
                    <InfoItem
                      icon={<Wallet className="h-4 w-4" />}
                      label="Solde actuel"
                      value={formatCurrency(mouvement.solde)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques rapides */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">Membres</span>
                      </div>
                      <span className="text-lg font-bold">0</span>{" "}
                      {/* Données fictives */}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <CalendarDays className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium">Activités</span>
                      </div>
                      <span className="text-lg font-bold">0</span>{" "}
                      {/* Données fictives */}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <Wallet className="h-4 w-4 text-amber-600" />
                        </div>
                        <span className="text-sm font-medium">
                          Transactions
                        </span>
                      </div>
                      <span className="text-lg font-bold">0</span>{" "}
                      {/* Données fictives */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Responsables */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Responsables
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PersonneCard
                  personne={mouvement.aumonier}
                  role="Aumônier"
                  emptyMessage="Aucun aumônier"
                  actionButton={
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 mx-auto"
                      onClick={() => setAumonierModalOpen(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {mouvement.aumonier ? "Changer" : "Assigner"}
                    </Button>
                  }
                />
                <PersonneCard
                  personne={mouvement.responsable}
                  role="Responsable"
                  emptyMessage="Aucun responsable"
                  actionButton={
                    <div className="w-full flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => setResponsableModalOpen(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {mouvement.responsable ? "Changer" : "Assigner"}
                      </Button>
                    </div>
                  }
                />

                <PersonneCard
                  personne={mouvement.parrain}
                  role="Parrain"
                  emptyMessage="Aucun parrain"
                  actionButton={
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 mx-auto"
                      onClick={() => setParrainModalOpen(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {mouvement.parrain ? "Changer" : "Assigner"}
                    </Button>
                  }
                />
              </div>
            </div>

            {/* Modaux */}
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
          </TabsContent>

          {/* Onglet Membres */}
          <TabsContent value="membres">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-16 w-16 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Aucun membre enregistré
                  </h3>
                  <p className="text-slate-500 max-w-md mb-6">
                    Ce mouvement n'a pas encore de membres enregistrés. Vous
                    pouvez commencer à ajouter des membres maintenant.
                  </p>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Ajouter des membres
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Finances */}
          <TabsContent value="finances">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Wallet className="h-16 w-16 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Aucune transaction enregistrée
                  </h3>
                  <p className="text-slate-500 max-w-md mb-6">
                    Ce mouvement n'a pas encore de transactions enregistrées.
                    Vous pouvez commencer à enregistrer des transactions
                    financières.
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="outline">Enregistrer une dépense</Button>
                    <Button>Enregistrer une recette</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Activités */}
          <TabsContent value="activites">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-16 w-16 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Aucune événement planifié
                  </h3>
                  <p className="text-slate-500 max-w-md mb-6">
                    Ce mouvement n'a pas encore d'activités planifiées. Vous
                    pouvez commencer à créer des événements.
                  </p>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Créer un événement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Paramètres */}
          {/* <TabsContent value="parametres">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Paramètres du mouvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Pencil className="h-4 w-4 mr-2" />
                    Modifier les informations
                  </Button>

                  <Button variant="outline" className="justify-start">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Gérer les responsables
                  </Button>

                  <Button variant="outline" className="justify-start">
                    <Building className="h-4 w-4 mr-2" />
                    Changer de chapelle
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Supprimer le mouvement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
        </Tabs>
      </Card>
    </div>
  );
}
