/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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

export default function CebDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const cebId = params?.id ? parseInt(params.id, 10) : null;

  const [ceb, setCeb] = useState(null);
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

        const data = await fetchCebDetails(cebId);
        setCeb(data);
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
  const formatPhoneNumber = (phone) => {
    if (!phone) return "Non renseigné";

    const cleaned = phone.replace(/\D/g, "");
    const groups = [];

    for (let i = 0; i < cleaned.length; i += 2) {
      groups.push(cleaned.slice(i, i + 2));
    }

    return groups.join(" ");
  };

  // Formater la date: 2023-05-15 -> 15/05/2023
  const formatDate = (dateString) => {
    if (!dateString) return "Non renseignée";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR").format(date);
    } catch (err) {
      console.error("Erreur lors du formatage de la date:", err);
      return dateString;
    }
  };

  // Formater la monnaie en FCFA
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "0 FCFA";

    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Gérer le succès de la mise à jour
  const handleUpdateSuccess = (updatedCeb) => {
    // Mettre à jour les données locales
    setCeb(updatedCeb);
    toast.success("CEB mise à jour avec succès", {
      description: `Les informations de "${updatedCeb.nom}" ont été mises à jour.`,
    });
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
                  <p className="text-sm font-semibold">{ceb.membres?.length}</p>
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
                    {ceb.evenements?.length}
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
                {ceb.president ? (
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
                            {ceb.president.nom} {ceb.president.prenoms}
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
                            {formatPhoneNumber(ceb.president.num_de_telephone)}
                          </p>
                        </div>
                      </div>

                      {ceb.president.email && (
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              Email
                            </p>
                            <p className="text-sm font-semibold">
                              {ceb.president.email}
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
                            ceb.president.quartier,
                            ceb.president.commune,
                            ceb.president.ville,
                            ceb.president.pays,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Non renseignée"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 rounded-md border border-amber-100">
                    <p className="text-sm text-center text-amber-600">
                      Aucun président n'est assigné à cette CEB.
                    </p>
                    <div className="flex justify-center mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-amber-600 border-amber-300 hover:bg-amber-100"
                        onClick={() => setShowNominerPresidentDialog(true)}
                      >
                        <UserPlus className="h-3.5 w-3.5 mr-2" />
                        Nommer un président
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Contenu de l'onglet Membres */}
              <TabsContent value="membres" className="pt-4">
                {ceb.membres && ceb.membres.length > 0 ? (
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
                      Cette CEB n'a pas encore de membres enregistrés.
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
              cebData={ceb}
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
              cebId={ceb.id}
              onClose={() => setShowNominerPresidentDialog(false)}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
