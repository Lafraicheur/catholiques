/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Heart,
  Clock,
  Plus,
  ArrowLeft,
  Edit,
  Trash,
  ChevronRight,
  Flag,
  Home,
  Globe,
  Building,
  Coins,
  UserCheck,
  CreditCard,
  Wallet,
  Church,
  Mars,
  Venus,
  UserX,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";
import { fetchParoissienDetails } from "@/services/parishioner-service";


export default function ParoissienDetailPage() {
  const router = useRouter();
  const params = useParams();
  const paroissienId = params?.id
    ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id, 10)
    : null;

  type Paroissien = {
    id: number;
    prenoms: string;
    nom: string;
    date_de_naissance?: string;
    genre?: string;
    email?: string;
    num_de_telephone?: string;
    quartier?: string;
    commune?: string;
    ville?: string;
    pays?: string;
    statut?: string;
    est_abonne?: boolean;
    abonnement?: { intitule?: string };
    date_de_fin_abonnement?: number | null;
    paroisse?: { nom?: string };
    paroisse_id?: number | null;
    chapelle?: { nom?: string };
    chapelle_id?: number | null;
    ceb?: { nom?: string };
    ceb_id?: number | null;
    mouvementassociation?: { nom?: string };
    mouvementassociation_id?: number | null;
    photo?: {
      url?: string;
    };
    // Champs ajoutés pour la compatibilité avec ModifierParoissienForm
    nationalite?: string;
    abonnement_id?: number;
    statut_social?: string;
    mouvements?: string[];
    [key: string]: any;
  };

  const [paroissien, setParoissien] = useState<Paroissien | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Charger les détails du paroissien
  useEffect(() => {
    const loadParoissienDetails = async () => {
      if (!paroissienId) {
        setError("ID de paroissien non valide");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchParoissienDetails(paroissienId);
        setParoissien(data);
      } catch (err) {
        console.error(
          "Erreur lors du chargement des détails du paroissien:",
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
          setError("Paroissien non trouvé.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadParoissienDetails();
  }, [paroissienId, router]);

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

  // Obtenir le badge de statut pour un paroissien
  const getStatusBadge = (statut: string | undefined) => {
    const allowedVariants = [
      "default",
      "outline",
      "secondary",
      "destructive",
      "success",
    ] as const;
    type BadgeVariant = (typeof allowedVariants)[number];

    const statusMap: Record<string, { variant: BadgeVariant; label: string }> =
      {
        Baptisé: { variant: "default", label: "Baptisé" },
        Confirmé: { variant: "default", label: "Confirmé" },
        Marié: { variant: "default", label: "Marié à l'église" },
        Aucun: { variant: "outline", label: "Aucun" },
      };

    let status;
    if (typeof statut === "string" && statut in statusMap) {
      status = statusMap[statut];
    } else {
      status = {
        variant: "outline" as BadgeVariant,
        label: statut || "Aucun",
      };
    }

    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  // Gérer le succès de la mise à jour
  // const handleUpdateSuccess = (updatedParoissien: Paroissien) => {
  //   // Mettre à jour les données locales
  //   setParoissien(updatedParoissien);

  //   if (
  //     updatedParoissien &&
  //     typeof updatedParoissien === "object" &&
  //     "prenoms" in updatedParoissien &&
  //     "nom" in updatedParoissien
  //   ) {
  //     toast.success("Paroissien mis à jour avec succès", {
  //       description: `Les informations de "${updatedParoissien.prenoms} ${updatedParoissien.nom}" ont été mises à jour.`,
  //     });
  //   } else {
  //     toast.success("Paroissien mis à jour avec succès");
  //   }
  // };

  const handleUpdateSuccess = (updatedParoissien: any) => {
    // Mettre à jour les données locales avec conversion de type
    const convertedParoissien: Paroissien = {
      ...paroissien,
      ...updatedParoissien,
      // S'assurer que les champs requis sont présents
      id: updatedParoissien.paroissien_id || updatedParoissien.id,
    };

    setParoissien(convertedParoissien);

    if (
      updatedParoissien &&
      typeof updatedParoissien === "object" &&
      "prenoms" in updatedParoissien &&
      "nom" in updatedParoissien
    ) {
      toast.success("Paroissien mis à jour avec succès", {
        description: `Les informations de "${updatedParoissien.prenoms} ${updatedParoissien.nom}" ont été mises à jour.`,
      });
    } else {
      toast.success("Paroissien mis à jour avec succès");
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

    if (!paroissien) {
      return (
        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-700">
              Paroissien non trouvé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-600">
              Le paroissien demandé n'existe pas ou a été supprimé.
            </p>
            <div className="mt-4">
              <Button variant="outline" onClick={() => router.back()}>
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Afficher les détails du paroissien
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Photo de profil et informations principales */}
          <Card className="bg-slate-50 border-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Profil du paroissien
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Photo de profil */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {paroissien.photo?.url ? (
                      <div className="h-32 w-32 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src={paroissien.photo.url}
                          alt={`Photo de ${paroissien.prenoms} ${paroissien.nom}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // En cas d'erreur, masquer l'image et afficher l'avatar
                            const img = e.target as HTMLImageElement;
                            img.style.display = "none";
                            if (
                              img.parentElement &&
                              img.parentElement.nextElementSibling
                            ) {
                              (
                                img.parentElement
                                  .nextElementSibling as HTMLElement
                              ).style.display = "flex";
                            }
                          }}
                        />
                      </div>
                    ) : null}

                    {/* Avatar par défaut */}
                    <div
                      className={`h-32 w-32 rounded-lg border-4 border-white shadow-lg flex items-center justify-center ${
                        paroissien.photo?.url ? "hidden" : "flex"
                      } ${
                        paroissien.genre === "M"
                          ? "bg-gradient-to-br from-blue-100 to-blue-200"
                          : "bg-gradient-to-br from-pink-100 to-pink-200"
                      }`}
                    >
                      <span
                        className={`text-3xl font-bold ${
                          paroissien.genre === "M"
                            ? "text-blue-600"
                            : "text-pink-600"
                        }`}
                      >
                        {paroissien.prenoms.charAt(0)}
                        {paroissien.nom.charAt(0)}
                      </span>
                    </div>

                    {/* Badge de statut */}
                    <div className="absolute -bottom-2 -right-2">
                      {paroissien.est_abonne ? (
                        <div className="h-8 w-8 rounded-full bg-green-500 border-4 border-white flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-slate-400 border-4 border-white flex items-center justify-center">
                          <UserX className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations principales */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {paroissien.prenoms} {paroissien.nom}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          paroissien.genre === "M"
                            ? "bg-blue-100"
                            : "bg-pink-100"
                        }`}
                      >
                        {paroissien.genre === "M" ? (
                          <Mars className="h-3 w-3 text-blue-600" />
                        ) : (
                          <Venus className="h-3 w-3 text-pink-600" />
                        )}
                      </div>
                      <Badge
                        className={`px-2 py-1 font-normal text-xs ${
                          paroissien.genre === "M"
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-100"
                            : "bg-pink-50 text-pink-700 hover:bg-pink-50 border border-pink-100"
                        }`}
                      >
                        {paroissien.genre === "M" ? "Homme" : "Femme"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">
                        Date de naissance
                      </p>
                      <p className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        {formatDate(paroissien?.date_de_naissance)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">
                        Téléphone
                      </p>
                      <p className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-slate-400" />
                        {paroissien.num_de_telephone ? (
                          <a
                            href={`tel:${paroissien.num_de_telephone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {formatPhoneNumber(paroissien.num_de_telephone)}
                          </a>
                        ) : (
                          <span className="text-slate-400">Non renseigné</span>
                        )}
                      </p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-sm font-medium text-slate-500">
                        Adresse
                      </p>
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                        {[
                          paroissien.quartier,
                          paroissien.commune,
                          paroissien.ville,
                          paroissien.pays,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Adresse non renseignée"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations générales */}
          {/* <Card className="bg-slate-50 border-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Informations de contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Email</p>
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-slate-400" />
                    {paroissien.email ? (
                      <a
                        href={`mailto:${paroissien.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {paroissien.email}
                      </a>
                    ) : (
                      <span className="text-slate-400">Non renseigné</span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Sacrements - Section à préserver */}
          <Card className="bg-slate-50 border-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Livret de Baptême
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Cette section sera remplie ultérieurement avec les données de sacrements */}
                <div className="p-6 border border-dashed border-slate-200 rounded-md text-center">
                  <Heart className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-base font-medium text-slate-700 mb-1">
                    Sacrements
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mb-3">
                    Les informations sur les sacrements (baptême, communion,
                    confirmation, mariage) seront disponibles ici.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dons et contributions - Section à préserver */}
          <Card className="bg-slate-50 border-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Dons et contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-2 px-4 text-left text-sm font-medium text-slate-500">
                        Date
                      </th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-slate-500">
                        Type
                      </th>
                      <th className="py-2 px-4 text-right text-sm font-medium text-slate-500">
                        Montant
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Cette section sera remplie ultérieurement avec les données de dons */}
                    <tr>
                      <td colSpan={3} className="py-10 text-center">
                        <div className="p-6 border border-dashed border-slate-200 rounded-md text-center inline-flex flex-col items-center">
                          <Wallet className="h-10 w-10 text-slate-300 mb-2" />
                          <h3 className="text-base font-medium text-slate-700 mb-1">
                            Contributions financières
                          </h3>
                          <p className="text-sm text-slate-500 max-w-md mx-auto mb-3">
                            L'historique des dons et contributions du paroissien
                            sera affiché ici.
                          </p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-50 border-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Informations d'abonnement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Statut d'abonnement */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Statut d'abonnement
                  </p>
                  <div className="mt-1">
                    {paroissien.est_abonne ? (
                      <Badge variant="success" className="bg-purple-500">
                        {paroissien.abonnement?.intitule || "Abonné"}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Non abonné</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Date de fin d'abonnement */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Fin d'abonnement
                  </p>
                  <p className="text-sm font-semibold">
                    {paroissien?.date_de_fin_abonnement &&
                    paroissien?.date_de_fin_abonnement !== 0
                      ? formatDate(
                          new Date(
                            paroissien?.date_de_fin_abonnement
                          ).toISOString()
                        )
                      : "Non applicable"}
                  </p>
                </div>
              </div>

              {/* ID d'abonnement */}
            </CardContent>

            <Separator className="my-4" />

            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Affiliations
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Paroisse */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                  <Building className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Paroisse</p>
                  <p className="text-sm font-semibold">
                    {paroissien.paroisse?.nom ||
                      `ID: ${paroissien.paroisse_id || "Non assignée"}`}
                  </p>
                </div>
              </div>

              {/* Chapelle */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                  <Church className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Chapelle</p>
                  <p className="text-sm font-semibold">
                    {paroissien.chapelle?.nom ||
                      (paroissien.chapelle_id
                        ? `ID: ${paroissien.chapelle_id}`
                        : "Non assignée")}
                  </p>
                </div>
              </div>

              {/* CEB */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">CEB</p>
                  <p className="text-sm font-semibold">
                    {paroissien.ceb?.nom ||
                      (paroissien.ceb_id ? (
                        <Link
                          href={`/dashboard/paroisse/ceb/${paroissien.ceb_id}`}
                          className="text-blue-600 hover:underline"
                        >
                          ID: {paroissien.ceb_id}
                        </Link>
                      ) : (
                        "Non assignée"
                      ))}
                  </p>
                </div>
              </div>

              {/* Mouvement et Association */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Mouvement / Association
                  </p>
                  <p className="text-sm font-semibold">
                    {paroissien.mouvementassociation?.nom ||
                      (paroissien.mouvementassociation_id ? (
                        <Link
                          href={`/dashboard/paroisse/m&a/${paroissien.mouvementassociation_id}`}
                          className="text-green-600 hover:underline"
                        >
                          ID: {paroissien.mouvementassociation_id}
                        </Link>
                      ) : (
                        "Non assigné"
                      ))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
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

      {/* En-tête avec nom et actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">
            {paroissien?.prenoms} {paroissien?.nom}
          </h1>
          {paroissien && getStatusBadge(paroissien?.statut)}
        </div>
      </div>

      {/* Contenu principal */}
      {renderContent()}
    </div>
  );
}
