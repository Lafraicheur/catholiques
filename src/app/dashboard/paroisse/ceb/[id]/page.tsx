/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Church,
  Calendar,
  Wallet,
  User,
  Phone,
  Mail,
  Map,
  Flag,
  ArrowLeft,
  Edit,
  Clock,
  Users,
  Home,
  Pencil,
  ChevronRight,
  Building,
  UserPlus,
  Plus,
  Calendar1,
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";
import { fetchCebDetails } from "@/services/ceb-services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importer les composants de formulaire
import ModifierCebForm from "@/components/forms/ModifierCebForm";
import NominerPresidentForm from "@/components/forms/NominerPresidentForm";

// Types harmonisés avec ceux du ModifierCebForm
interface President {
  id: number;
  nom: string;
  prenoms: string;
  num_de_telephone: string;
  email?: string;
  quartier?: string;
  commune?: string;
  ville?: string;
  pays?: string;
}

interface Membre {
  id: number;
  nom: string;
  prenoms: string;
  num_de_telephone?: string;
  email?: string;
  statut?: string;
}

interface Evenement {
  id: number;
  titre: string;
  date: string;
  description?: string;
}

// Type Ceb complet et harmonisé
interface Ceb {
  id: number;
  created_at: string;
  identifiant: string;
  nom: string;
  solde: number;
  paroisse_id: number;
  chapelle_id: number | null;
  president_id: number | null;
  president?: President | null;
  membres?: Membre[];
  evenements?: Evenement[];
}

export default function CebDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const cebId = params?.id
    ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id, 10)
    : null;

  const [ceb, setCeb] = useState<Ceb | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNominerPresidentDialog, setShowNominerPresidentDialog] =
    useState(false);

  // Charger les détails de la CEB
  useEffect(() => {
    const loadCebDetails = async () => {
      if (!cebId) {
        setError("ID de CEB non valide");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = (await fetchCebDetails(cebId)) as Ceb;

        // Transformer les données pour correspondre au type Ceb complet
        const transformedCeb: Ceb = {
          id: data.id,
          created_at: data.created_at || new Date().toISOString(),
          identifiant: data.identifiant || `CEB-${data.id}`,
          nom: data.nom,
          solde: data.solde || 0,
          paroisse_id: data.paroisse_id || 0,
          chapelle_id: data.chapelle_id || null,
          president_id: data.president_id || null,
          president: data.president
            ? {
                id: data.president.id || 0,
                nom: data.president.nom,
                prenoms: data.president.prenoms,
                num_de_telephone: data.president.num_de_telephone || "",
                email: data.president.email,
                quartier: data.president.quartier,
                commune: data.president.commune,
                ville: data.president.ville,
                pays: data.president.pays,
              }
            : null,
          membres: data.membres || [],
          evenements: data.evenements || [],
        };

        setCeb(transformedCeb);
      } catch (err) {
        console.error("Erreur lors du chargement des détails de la CEB:", err);

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
          setError("CEB non trouvée.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadCebDetails();
  }, [cebId, router]);

  // Formater un numéro de téléphone: 0101020304 -> 01 01 02 03 04
  const formatPhoneNumber = (phone: string | undefined) => {
    if (!phone) return "Non renseigné";

    const cleaned = phone.replace(/\D/g, "");
    const groups = [];

    for (let i = 0; i < cleaned.length; i += 2) {
      groups.push(cleaned.slice(i, i + 2));
    }

    return groups.join(" ");
  };

  // Formater la date: 2023-05-15 -> 15/05/2023
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

  // Formater la monnaie en FCFA
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

  // Gérer le succès de la mise à jour avec le bon type
  const handleUpdateSuccess = (updatedCeb: Ceb) => {
    // Mettre à jour les données locales
    setCeb(updatedCeb);
    toast.success("CEB mise à jour avec succès", {
      description: `Les informations de "${updatedCeb.nom}" ont été mises à jour.`,
    });
  };

  // Gérer le succès de la nomination du président
  const handleNominationSuccess = (updatedCeb: any) => {
    // Transformer les données pour correspondre au type Ceb
    const transformedCeb: Ceb = {
      ...ceb!,
      president_id: updatedCeb.president_id,
      president: updatedCeb.president,
    };

    setCeb(transformedCeb);
    // toast.success("Président nommé avec succès", {
    //   description: `${updatedCeb.president?.nom} ${updatedCeb.president?.prenoms} a été nommé président.`,
    // });
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

    if (!ceb) {
      return (
        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-700">CEB non trouvée</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-600">
              La CEB demandée n'existe pas ou a été supprimée.
            </p>
            <div className="mt-4">
              <Button variant="outline" onClick={() => router.back()}>
                Retour à la liste des CEB
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Afficher les détails de la CEB
    return (
      <div className="space-y-6">
        {/* Informations générales */}
        <Card className="bg-slate-50 border-slate-100">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">{ceb.nom}</CardTitle>
                {/* <p className="text-sm text-slate-500 mt-1">
                  Identifiant: {ceb.identifiant}
                </p> */}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => setShowEditDialog(true)}
              >
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar1 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Date de création
                  </p>
                  <p className="text-sm font-semibold">
                    {formatDate(ceb.created_at)}
                  </p>
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
                    {ceb.membres?.length || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Solde</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(ceb.solde)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Événements
                  </p>
                  <p className="text-sm font-semibold">
                    {ceb?.evenements?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Système d'onglets pour Président, Membres, Événements */}
        <Card className="bg-slate-50 border-slate-100">
          <CardContent className="p-6">
            <Tabs defaultValue="president" className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger
                  value="president"
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

              {/* Contenu de l'onglet Président */}
              <TabsContent value="president" className="pt-4">
                {ceb?.president ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            Nom complet
                          </p>
                          <p className="text-sm font-semibold">
                            {ceb?.president?.nom} {ceb?.president?.prenoms}
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
                            {formatPhoneNumber(
                              ceb?.president?.num_de_telephone
                            )}
                          </p>
                        </div>
                      </div>

                      {ceb?.president?.email && (
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              Email
                            </p>
                            <p className="text-sm font-semibold">
                              {ceb?.president?.email}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                        <Map className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Adresse
                        </p>
                        <p className="text-sm font-semibold">
                          {[
                            ceb?.president?.quartier,
                            ceb?.president?.commune,
                            ceb?.president?.ville,
                            ceb?.president?.pays,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Non renseignée"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Aucun président
                    </h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                      Cette CEB n'a pas encore de président enregistré.
                    </p>

                    <Button
                      onClick={() => setShowNominerPresidentDialog(true)}
                      className="cursor-pointer"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Nommer un président
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Contenu de l'onglet Membres */}
              <TabsContent value="membres" className="pt-4">
                <div className="space-y-6">
                  {ceb.membres && ceb.membres.length > 0 ? (
                    <>
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                              {ceb.membres.map((membre) => (
                                <tr
                                  key={membre.id}
                                  className="border-b border-slate-100 hover:bg-slate-50"
                                >
                                  <td className="py-3 px-4">
                                    <div className="font-medium text-sm">
                                      {membre.prenoms} {membre.nom}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-sm text-slate-600">
                                    {formatPhoneNumber(membre.num_de_telephone)}
                                  </td>
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
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">
                        Aucun membre
                      </h3>
                      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                        Cette CEB n'a pas encore de membres enregistrés.
                      </p>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Ajouter des membres
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Contenu de l'onglet Événements */}
              <TabsContent value="evenements" className="pt-4">
                {ceb.evenements && ceb.evenements.length > 0 ? (
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
                          {ceb.evenements.map((evenement) => (
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
                                  {formatDate(evenement?.date)}
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
                      Cette CEB n'a pas encore d'événements planifiés.
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
          Détails de la CEB
        </h1>
        <p className="text-slate-500">
          Informations détaillées sur la communauté ecclésiale de base
        </p>
      </div>

      {/* Contenu principal */}
      {renderContent()}

      {/* Dialog de modification */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center">
              Modifier la CEB
            </DialogTitle>
          </DialogHeader>

          {ceb && (
            <ModifierCebForm
              onClose={() => setShowEditDialog(false)}
              cebData={{
                ...ceb,
                president:
                  ceb.president && ceb.president !== null
                    ? {
                        id: ceb.president.id,
                        nom: ceb.president.nom,
                        prenoms: ceb.president.prenoms,
                        num_de_telephone: ceb.president.num_de_telephone,
                      }
                    : undefined,
              }}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de nomination de président */}
      <Dialog
        open={showNominerPresidentDialog}
        onOpenChange={setShowNominerPresidentDialog}
      >
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-amber-600" />
              Nommer un président
            </DialogTitle>
          </DialogHeader>

          {ceb && (
            <NominerPresidentForm
              cebId={String(ceb.id)}
              onClose={() => setShowNominerPresidentDialog(false)}
              onSuccess={handleNominationSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
