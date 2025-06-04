/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar,
  Heart,
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  Flag,
  Building,
  Home,
  Globe,
  FileText,
  AlertTriangle,
  Loader2,
  XCircle,
  ArrowLeft,
  Edit,
  Trash,
  Image,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import SacrementUnionDetailsSkeleton from "@/components/unions/SacrementUnionDetailsSkeleton";

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
  paroisse_id?: number;
}

// Type pour un sacrement d'union
interface SacrementUnion {
  motif_de_rejet: any;
  pere_celebrant: any;
  second_temoin: string;
  premier_temoin: string;
  marie_ou_mariee: ReactNode;
  paroissien: any;
  id: number;
  created_at: string;
  type: string;
  date: string;
  description: string;
  est_une_soumission?: boolean;
  statut: string;
  temoin_marie: string;
  temoin_mariee: string;
  celebrant_id: number;
  paroisse_id: number;
  chapelle_id: number | null;
  marie_id: number;
  mariee_id: number;
  images?: ImageFile[];
  celebrant?: Personne;
  marie?: Personne;
  mariee?: Personne;
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

// Composant InfoCard pour afficher des informations sur une personne
const InfoCard = ({
  title,
  person,
  icon,
}: {
  title: string;
  person: Personne | undefined;
  icon: React.ReactNode;
}) => {
  if (!person) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-slate-500">Informations non disponibles</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start">
          <User className="h-4 w-4 mt-1 mr-2 text-slate-400" />
          <div>
            <p className="font-medium">
              {person.prenoms} {person.nom}
            </p>
            {person.date_de_naissance && (
              <p className="text-sm text-slate-500">
                Né(e) le {formatDate(person.date_de_naissance)}
              </p>
            )}
          </div>
        </div>

        {person.num_de_telephone && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-slate-400" />
            <p>{person.num_de_telephone}</p>
          </div>
        )}

        {person.email && (
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-slate-400" />
            <p className="text-sm">{person.email}</p>
          </div>
        )}

        {person.pays && (
          <div className="flex items-start">
            <Globe className="h-4 w-4 mt-1 mr-2 text-slate-400" />
            <div>
              <p>{person.pays}</p>
              {person.nationalite && (
                <p className="text-sm text-slate-500">
                  Nationalité: {person.nationalite}
                </p>
              )}
            </div>
          </div>
        )}

        {(person.ville || person.commune || person.quartier) && (
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mt-1 mr-2 text-slate-400" />
            <div>
              {person.ville && <p>{person.ville}</p>}
              {person.commune && <p className="text-sm">{person.commune}</p>}
              {person.quartier && (
                <p className="text-sm text-slate-500">{person.quartier}</p>
              )}
            </div>
          </div>
        )}

        {person.statut && person.statut !== "Aucun" && (
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-slate-400" />
            <p>Statut: {person.statut}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
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
  const sacrementId = params?.id as string;

  const [sacrement, setSacrement] = useState<SacrementUnion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("informations");

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
        `https://api.cathoconnect.ci/api:HzF8fFua/sacrement-union/obtenir-un?sacrementunion_id=${sacrementId}`,
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
    if (sacrementId) {
      fetchSacrementDetails();
    }
  }, [sacrementId]);

  // Supprimer le sacrement
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-union/supprimer",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sacrement_id: sacrement?.id }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur API:", errorText);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      toast.success("Succès", {
        description: "Le sacrement d'union a été supprimé avec succès.",
      });

      // Rediriger vers la liste des sacrements
      router.push("/dashboard/paroisse/sacrements/unions");
    } catch (err: any) {
      console.error("Erreur lors de la suppression du sacrement:", err);
      toast.error("Erreur", {
        description: "Impossible de supprimer le sacrement d'union.",
      });
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  // Si chargement en cours
  if (loading) {
    return <SacrementUnionDetailsSkeleton />;
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
  } = getStatusDetails(sacrement.statut);

  // Déterminer si la date est passée
  const isDatePassed = new Date(sacrement.date) < new Date();

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
        <div className="flex flex-wrap gap-2">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
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
            {sacrement?.paroissien?.nom} {sacrement?.paroissien?.prenoms} &{" "}
            {sacrement?.marie_ou_mariee}{" "}
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
      </Card>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce sacrement d'union ? Cette
              action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteLoading}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4 mr-2" />
                  Supprimer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
