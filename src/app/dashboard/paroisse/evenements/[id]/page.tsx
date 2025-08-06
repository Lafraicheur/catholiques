// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, SetStateAction } from "react";
// import { useRouter, useParams } from "next/navigation";
// import Link from "next/link";
// import {
//   Calendar,
//   Clock,
//   Target,
//   Eye,
//   EyeOff,
//   MapPin,
//   Building,
//   Users,
//   ArrowLeft,
//   Edit,
//   Pencil,
//   Tag,
//   FileText,
//   DollarSign,
//   Image as ImageIcon,
//   CheckCircle,
//   XCircle,
//   Activity,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { toast } from "sonner";
// import {
//   ApiError,
//   AuthenticationError,
//   ForbiddenError,
//   NotFoundError,
// } from "@/services/api";
// import { fetchEvenementDetails } from "@/services/evenement-services";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import EvenementEditModal from "@/components/forms/EvenementEditModal";

// // Importer les composants de formulaire

// export default function EvenementDetailsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const evenementId = params?.id
//     ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id, 10)
//     : null;

//   type EvenementImage = {
//     url: string;
//     name?: string;
//     [key: string]: any;
//   };

//   type EvenementType = {
//     libelle: string;
//     description?: string;
//     type: string;
//     est_actif: boolean;
//     date_de_debut?: number;
//     date_de_fin?: number;
//     diocese_id?: number;
//     paroisse_id?: number;
//     mouvementassociation_id?: number;
//     ceb_id?: number;
//     est_limite_par_echeance?: boolean;
//     solde: number;
//     solde_cible: number;
//     solde_est_visibe?: boolean;
//     type_visibilite_solde?: string;
//     extras?: Record<string, any>;
//     image?: EvenementImage | null;
//     [key: string]: any;
//   };

//   const [evenement, setEvenement] = useState<EvenementType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showEditDialog, setShowEditDialog] = useState(false);

//   // Charger les détails de l'événement
//   useEffect(() => {
//     const loadEvenementDetails = async () => {
//       if (!evenementId) {
//         setError("ID d'événement non valide");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         const data = await fetchEvenementDetails(evenementId);
//         setEvenement(data as EvenementType);
//       } catch (err) {
//         console.error(
//           "Erreur lors du chargement des détails de l'événement:",
//           err
//         );

//         if (err instanceof AuthenticationError) {
//           toast.error("Session expirée", {
//             description: "Veuillez vous reconnecter pour continuer.",
//           });
//           router.push("/login");
//         } else if (err instanceof ForbiddenError) {
//           setError(
//             "Vous n'avez pas les droits nécessaires pour accéder à cette ressource."
//           );
//         } else if (err instanceof NotFoundError) {
//           setError("Événement non trouvé.");
//         } else {
//           setError("Une erreur est survenue lors du chargement des données.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadEvenementDetails();
//   }, [evenementId, router]);

//   // Formater la date: timestamp -> 15/05/2023 15:30
//   const formatDate = (timestamp: number | undefined) => {
//     if (!timestamp) return "Non renseignée";

//     try {
//       return new Intl.DateTimeFormat("fr-FR", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       }).format(new Date(timestamp));
//     } catch (err) {
//       console.error("Erreur lors du formatage de la date:", err);
//       return "Date invalide";
//     }
//   };

//   // Formater la monnaie en FCFA
//   const formatCurrency = (
//     amount: string | number | bigint | null | undefined
//   ) => {
//     if (amount === undefined || amount === null) return "0 FCFA";

//     const numericAmount = typeof amount === "string" ? Number(amount) : amount;

//     return new Intl.NumberFormat("fr-FR", {
//       style: "currency",
//       currency: "XOF",
//       maximumFractionDigits: 0,
//     }).format(numericAmount as number | bigint);
//   };

//   // Obtenir la couleur du badge selon le type
//   const getTypeColor = (type: string) => {
//     switch (type) {
//       case "ACTIVITÉ":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "FORMATION":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "COLLECTE":
//         return "bg-purple-100 text-purple-800 border-purple-200";
//       case "CÉLÉBRATION":
//         return "bg-amber-100 text-amber-800 border-amber-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   // Calculer le pourcentage d'atteinte de l'objectif
//   const getProgressPercentage = () => {
//     if (!evenement?.solde_cible || evenement.solde_cible === 0) return 0;
//     return Math.min((evenement.solde / evenement.solde_cible) * 100, 100);
//   };

//   // Obtenir le nom de l'entité organisatrice
//   const getOrganisateur = () => {
//     if (evenement?.diocese_id) return "Diocèse";
//     if (evenement?.paroisse_id) return "Paroisse";
//     if (evenement?.mouvementassociation_id) return "Mouvement/Association";
//     if (evenement?.ceb_id) return "CEB";
//     return "Non défini";
//   };

//   // Gérer le succès de la mise à jour
//   const handleUpdateSuccess = (
//     updatedEvenement: SetStateAction<{
//       [key: string]: any;
//       libelle: string;
//       description?: string;
//       type: string;
//       est_actif: boolean;
//       date_de_debut?: number;
//       date_de_fin?: number;
//       diocese_id?: number;
//       paroisse_id?: number;
//       mouvementassociation_id?: number;
//       ceb_id?: number;
//       est_limite_par_echeance?: boolean;
//       solde: number;
//       solde_cible: number;
//       solde_est_visibe?: boolean;
//       type_visibilite_solde?: string;
//       extras?: Record<string, any>;
//       image?: { [key: string]: any; url: string; name?: string } | null;
//     } | null>
//   ) => {
//     setEvenement(updatedEvenement);
//     toast.success("Événement mis à jour avec succès", {
//       description: `Les informations de "${
//         updatedEvenement &&
//         typeof updatedEvenement !== "function" &&
//         updatedEvenement.libelle
//           ? updatedEvenement.libelle
//           : ""
//       }" ont été mises à jour.`,
//     });
//   };

//   // Rendu du contenu en fonction de l'état
//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="space-y-6">
//           <Card className="bg-slate-50 border-slate-100">
//             <CardHeader className="pb-3">
//               <Skeleton className="h-8 w-3/4 mb-2" />
//               <Skeleton className="h-4 w-1/2" />
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-3/4" />
//             </CardContent>
//           </Card>

//           <Card className="bg-slate-50 border-slate-100">
//             <CardHeader className="pb-3">
//               <Skeleton className="h-6 w-1/3 mb-2" />
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-3/4" />
//             </CardContent>
//           </Card>
//         </div>
//       );
//     }

//     if (error) {
//       return (
//         <Card className="bg-red-50 border-red-100">
//           <CardHeader className="pb-3">
//             <CardTitle className="text-red-700">Erreur</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-red-600">{error}</p>
//             <div className="mt-4 flex justify-between">
//               <Button variant="outline" onClick={() => router.back()}>
//                 Retour
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => window.location.reload()}
//               >
//                 Réessayer
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       );
//     }

//     if (!evenement) {
//       return (
//         <Card className="bg-amber-50 border-amber-100">
//           <CardHeader className="pb-3">
//             <CardTitle className="text-amber-700">
//               Événement non trouvé
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-amber-600">
//               L'événement demandé n'existe pas ou a été supprimé.
//             </p>
//             <div className="mt-4">
//               <Button variant="outline" onClick={() => router.back()}>
//                 Retour à la liste des événements
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       );
//     }

//     // Afficher les détails de l'événement
//     return (
//       <div className="space-y-6">
//         {/* Informations générales */}
//         <Card className="bg-slate-50 border-slate-100">
//           <CardHeader className="pb-3">
//             <div className="flex justify-between items-start">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-2">
//                   <CardTitle className="text-xl font-bold">
//                     {evenement.libelle}
//                   </CardTitle>
//                   <Badge className={getTypeColor(evenement.type)}>
//                     {evenement.type}
//                   </Badge>

//                   {evenement?.extras?.type_messe && (
//                     <Badge
//                       variant="outline"
//                       className="bg-green-50 text-green-700 border-green-200"
//                     >
//                       {evenement.extras.type_messe}
//                     </Badge>
//                   )}

//                   <Badge
//                     variant={evenement.est_actif ? "default" : "secondary"}
//                   >
//                     {evenement.est_actif ? (
//                       <>
//                         <CheckCircle className="h-3 w-3 mr-1" />
//                         Actif
//                       </>
//                     ) : (
//                       <>
//                         <XCircle className="h-3 w-3 mr-1" />
//                         Inactif
//                       </>
//                     )}
//                   </Badge>
//                 </div>
//                 {evenement.description && (
//                   <CardDescription className="text-sm text-slate-600">
//                     {evenement.description}
//                   </CardDescription>
//                 )}
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="text-blue-600 border-blue-200 hover:bg-blue-50"
//                 onClick={() => setShowEditDialog(true)}
//               >
//                 <Pencil className="h-3.5 w-3.5 mr-2" />
//                 Modifier
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="grid gap-4">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="flex items-center gap-3">
//                 <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
//                   <Calendar className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-slate-500">
//                     Date de début
//                   </p>
//                   <p className="text-sm font-semibold">
//                     {formatDate(evenement.date_de_debut)}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
//                   <Clock className="h-5 w-5 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-slate-500">
//                     Date de fin
//                   </p>
//                   <p className="text-sm font-semibold">
//                     {formatDate(evenement.date_de_fin)}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
//                   <DollarSign className="h-5 w-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-slate-500">
//                     Solde actuel
//                   </p>
//                   <p className="text-sm font-semibold">
//                     {formatCurrency(evenement.solde)}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
//                   <Activity className="h-5 w-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-slate-500">Statut</p>
//                   <Badge
//                     variant={evenement.est_actif ? "default" : "secondary"}
//                   >
//                     {evenement.est_actif ? "Actif" : "Inactif"}
//                   </Badge>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Système d'onglets pour Financier, Paramètres, Image */}
//         <Card className="bg-slate-50 border-slate-100">
//           <CardContent className="p-6">
//             <Tabs defaultValue="parametres" className="space-y-4">
//               <TabsList className="grid grid-cols-2 w-full">
//                 <TabsTrigger
//                   value="parametres"
//                   className="flex items-center justify-center"
//                 >
//                   <Tag className="h-4 w-4 mr-1" />
//                   Paramètres
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="image"
//                   className="flex items-center justify-center"
//                 >
//                   <ImageIcon className="h-4 w-4 mr-1" />
//                   Image
//                 </TabsTrigger>
//               </TabsList>

//               {/* Contenu de l'onglet Paramètres */}
//               <TabsContent value="parametres" className="pt-4">
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div className="flex items-center gap-3">
//                       <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
//                         <Activity className="h-5 w-5 text-green-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-slate-500">
//                           Statut
//                         </p>
//                         <Badge
//                           variant={
//                             evenement.est_actif ? "default" : "secondary"
//                           }
//                         >
//                           {evenement.est_actif ? "Actif" : "Inactif"}
//                         </Badge>
//                       </div>
//                     </div>

//                     {evenement.est_limite_par_echeance && (
//                       <div className="flex items-center gap-3">
//                         <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
//                           <Target className="h-5 w-5 text-amber-600" />
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium text-slate-500">
//                             Limité par échéance
//                           </p>
//                           <p className="text-sm font-semibold text-amber-600">
//                             Oui
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {evenement.solde_cible > 0 && (
//                       <div className="space-y-2">
//                         <div className="flex justify-between text-sm">
//                           <span className="text-slate-600">
//                             Progression vers l'objectif
//                           </span>
//                           <span className="font-medium">
//                             {getProgressPercentage().toFixed(1)}%
//                           </span>
//                         </div>
//                         <div className="w-full bg-slate-200 rounded-full h-2">
//                           <div
//                             className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                             style={{ width: `${getProgressPercentage()}%` }}
//                           ></div>
//                         </div>
//                         <div className="flex justify-between text-xs text-slate-500">
//                           <span>{formatCurrency(evenement.solde)}</span>
//                           <span>{formatCurrency(evenement.solde_cible)}</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* Contenu de l'onglet Image */}
//               <TabsContent value="image" className="pt-4">
//                 {evenement?.image ? (
//                   <div className="space-y-4">
//                     <div className="flex justify-center">
//                       <img
//                         src={evenement?.image?.url}
//                         alt={evenement?.image?.name}
//                         className="max-w-md max-h-64 object-cover rounded-lg border border-slate-200"
//                       />
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="p-8 text-center">
//                     <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//                     <h3 className="text-lg font-medium text-slate-900 mb-2">
//                       Aucune image
//                     </h3>
//                     <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
//                       Aucune image n'est associée à cet événement.
//                     </p>
//                     <Button variant="outline">
//                       <ImageIcon className="h-4 w-4 mr-2" />
//                       Ajouter une image
//                     </Button>
//                   </div>
//                 )}
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Fil d'Ariane */}
//       <div className="flex items-center mb-4 text-sm text-slate-500">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => router.back()}
//           className="flex items-center"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Retour
//         </Button>
//       </div>

//       {/* Titre et description */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-slate-900 mb-1">
//           Détails de l'événement
//         </h1>
//         <p className="text-slate-500">
//           Informations détaillées sur l'événement
//         </p>
//       </div>

//       {/* Contenu principal */}
//       {renderContent()}

//       {/* Modal de modification */}
//       <EvenementEditModal
//         isOpen={showEditDialog}
//         onClose={() => setShowEditDialog(false)}
//         evenement={evenement}
//         onSuccess={handleUpdateSuccess}
//       />
//     </div>
//   );
// }

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  Target,
  MapPin,
  Building,
  Users,
  ArrowLeft,
  Pencil,
  Tag,
  FileText,
  DollarSign,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Activity,
  User,
  CreditCard,
  Church,
  Phone,
  Mail,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";
import {
  fetchEvenementDetails,
  Evenement,
  isMesseEvent,
  isActiviteEvent,
  getCategorieColor,
} from "@/services/evenement-services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EvenementEditModal from "@/components/forms/EvenementEditModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EvenementDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const evenementId = params?.id
    ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id, 10)
    : null;

  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Charger les détails de l'événement
  useEffect(() => {
    const loadEvenementDetails = async () => {
      if (!evenementId) {
        setError("ID d'événement non valide");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchEvenementDetails(evenementId);
        console.log("📥 Données récupérées:", data);
        setEvenement(data);
      } catch (err) {
        console.error(
          "Erreur lors du chargement des détails de l'événement:",
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
          setError("Événement non trouvé.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadEvenementDetails();
  }, [evenementId, router]);

  // Formater la date: timestamp -> 15/05/2023
  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return "Non renseignée";

    try {
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(timestamp));
    } catch (err) {
      console.error("Erreur lors du formatage de la date:", err);
      return "Date invalide";
    }
  };

  // Formater l'heure : timestamp -> 15:30
  const formatTime = (timestamp: number | undefined) => {
    if (!timestamp) return "Non renseignée";

    try {
      return new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(timestamp));
    } catch (err) {
      console.error("Erreur lors du formatage de l'heure:", err);
      return "Heure invalide";
    }
  };

  // Formater la monnaie en FCFA
  const formatCurrency = (
    amount: string | number | bigint | null | undefined
  ) => {
    if (amount === undefined || amount === null) return "0 FCFA";

    const numericAmount = typeof amount === "string" ? Number(amount) : amount;

    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(numericAmount as number | bigint);
  };

  // Obtenir la couleur du badge selon le type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "ACTIVITÉ":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-50";
      case "MESSE":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-50";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-50";
    }
  };

  // Calculer le pourcentage d'atteinte de l'objectif
  const getProgressPercentage = () => {
    if (!evenement?.solde_cible || evenement.solde_cible === 0) return 0;
    return Math.min((evenement.solde / evenement.solde_cible) * 100, 100);
  };

  // Obtenir le nom de l'entité organisatrice
  const getOrganisateur = () => {
    if (evenement?.diocese_id) return "Diocèse";
    if (evenement?.paroisse_id) return "Paroisse";
    if (evenement?.mouvementassociation_id) return "Mouvement/Association";
    if (evenement?.ceb_id) return "CEB";
    return "Non défini";
  };

  // Gérer le succès de la mise à jour
  const handleUpdateSuccess = (updatedEvenement: any) => {
    setEvenement(updatedEvenement);
    toast.success("Événement mis à jour avec succès", {
      description: `Les informations de "${updatedEvenement?.libelle || ""}" ont été mises à jour.`,
    });
  };

  // Obtenir les initiales d'un participant pour l'avatar
  const getInitials = (nom: string, prenoms: string) => {
    const firstLetter = prenoms?.charAt(0)?.toUpperCase() || "";
    const lastLetter = nom?.charAt(0)?.toUpperCase() || "";
    return `${firstLetter}${lastLetter}`;
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
            <div className="mt-4 flex justify-between cursor-pointer">
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

    if (!evenement) {
      return (
        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-700">
              Événement non trouvé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-600">
              L'événement demandé n'existe pas ou a été supprimé.
            </p>
            <div className="mt-4 cursor-pointer">
              <Button variant="outline" onClick={() => router.back()}>
                Retour à la liste des événements
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Afficher les détails de l'événement
    return (
      <div className="space-y-6">
        {/* Informations générales */}
        <Card className="bg-slate-50 border-slate-100">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-3 mb-2">
                  <CardTitle className="text-xl font-bold">
                    {evenement.libelle}
                  </CardTitle>
                  <Badge className={getTypeColor(evenement.type)}>
                    {evenement.type}
                  </Badge>

                  {/* Badge pour type de messe */}
                  {isMesseEvent(evenement) && evenement.extras?.type_messe && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      <Church className="h-3 w-3 mr-1" />
                      {evenement.extras.type_messe}
                    </Badge>
                  )}

                  {/* Badge pour catégorie d'activité */}
                  {/* {isActiviteEvent(evenement) &&
                    evenement.extras?.categorie && (
                      <Badge
                        className={getCategorieColor(
                          evenement.extras.categorie
                        )}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {evenement.extras.categorie}
                      </Badge>
                    )} */}

                  {/* Badge gratuit/payant pour activités */}
                  {isActiviteEvent(evenement) && (
                    <Badge
                      variant={
                        evenement.extras?.est_gratuit ? "secondary" : "default"
                      }
                    >
                      {evenement.extras?.est_gratuit ? "Gratuit" : "Payant"}
                    </Badge>
                  )}

                  {/* Badge statut actif (si disponible) */}
                  {evenement.est_actif !== undefined && (
                    <Badge
                      variant={evenement.est_actif ? "default" : "secondary"}
                    >
                      {evenement.est_actif ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Actif
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactif
                        </>
                      )}
                    </Badge>
                  )}
                </div>
              </div>
              {/* <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => setShowEditDialog(true)}
              >
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Modifier
              </Button> */}
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date de début */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Date de début
                  </p>
                  <p className="text-sm font-semibold">
                    {formatDate(evenement.date_de_debut)}
                  </p>
                </div>
              </div>

              {/* Date de fin (si disponible) */}
              {evenement.date_de_fin && (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Date de fin
                    </p>
                    <p className="text-sm font-semibold">
                      {formatDate(evenement.date_de_fin)}
                    </p>
                  </div>
                </div>
              )}

              {/* Participants (pour les activités) */}
              {isActiviteEvent(evenement) && evenement.extras && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Participants
                      </p>
                      <p className="text-sm font-semibold">
                        {evenement.participants?.length || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Lieu</p>
                      <p className="text-sm font-semibold">
                        {evenement.extras.lieu}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                      <Tag className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Catégorie
                      </p>
                      <div className="text-sm font-semibold">
                        <Badge
                          className={getCategorieColor(
                            evenement.extras.categorie
                          )}
                        >
                          {evenement.extras.categorie}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Informations supplémentaires pour les messes */}
              {isMesseEvent(evenement) && evenement.extras && (
                <>
                  {/* Heure de début */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Heure de début
                      </p>
                      <p className="text-sm font-semibold">
                        {formatTime(evenement.extras.heure_de_debut)}
                      </p>
                    </div>
                  </div>

                  {/* Heure de fin */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Heure de fin
                      </p>
                      <p className="text-sm font-semibold">
                        {formatTime(evenement.extras.heure_de_fin)}
                      </p>
                    </div>
                  </div>

                  {/* Prix demande de messe */}
                  {evenement.extras.prix_demande_de_messe && (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Prix demande
                        </p>
                        <p className="text-sm font-semibold">
                          {formatCurrency(
                            evenement.extras.prix_demande_de_messe
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Détails spécifiques selon le type */}
        {isMesseEvent(evenement) ? (
          // Affichage direct pour les messes
          <Card className="bg-slate-50 border-slate-100">
            <CardHeader>
              <CardTitle className="text-lg">
                Descriptions de la messe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Détails spécifiques aux messes */}
                <CardDescription className="text-sm text-slate-600">
                  {evenement.description || "Aucune description fournie."}
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Système d'onglets pour les activités
          <Card className="bg-slate-50 border-slate-100">
            <CardContent className="p-6">
              <Tabs defaultValue="details" className="space-y-4">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger
                    value="details"
                    className="flex items-center justify-center cursor-pointer"
                  >
                    <Tag className="h-4 w-4 mr-1" />
                    Détails
                  </TabsTrigger>
                  <TabsTrigger
                    value="participants"
                    className="flex items-center justify-center cursor-pointer"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Participants ({evenement.participants?.length || 0})
                  </TabsTrigger>
                </TabsList>

                {/* Contenu de l'onglet Détails */}
                <TabsContent value="details" className="pt-4">
                  <div className="space-y-6">
                    {/* Détails spécifiques aux activités */}
                    {evenement.extras && (
                      <div className="space-y-6">
                        {/* Options tarifaires */}
                        {!evenement.extras.est_gratuit &&
                          evenement.extras.options &&
                          evenement.extras.options.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-slate-900">
                                Options tarifaires
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {evenement.extras.options.map(
                                  (option, index) => (
                                    <Card
                                      key={index}
                                      className="border border-slate-200"
                                    >
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <CreditCard className="h-4 w-4 text-blue-600" />
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-slate-900">
                                              {option.label}
                                            </p>
                                            <p className="text-lg font-bold text-blue-600">
                                              {formatCurrency(option.montant)}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    )}

                    {/* Barre de progression (si objectif défini) */}
                    {evenement.solde_cible && evenement.solde_cible > 0 && (
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">
                            Progression vers l'objectif
                          </span>
                          <span className="font-medium">
                            {getProgressPercentage().toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage()}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{formatCurrency(evenement.solde)}</span>
                          <span>{formatCurrency(evenement.solde_cible)}</span>
                        </div>
                      </div>
                    )}

                    {(evenement.description || evenement?.image?.url) && (
                      <div className="space-y-6 pt-4 border-t">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Description à gauche */}
                          {evenement.description && (
                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-slate-900">
                                Description
                              </h4>
                              <CardDescription className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                                {evenement.description}
                              </CardDescription>
                            </div>
                          )}

                          {/* Image à droite */}
                          {evenement?.image?.url && (
                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-slate-900">
                                Image de l'événement
                              </h4>
                              <div className="flex justify-center">
                                <img
                                  src={evenement.image.url}
                                  alt={evenement.libelle}
                                  className="max-w-full max-h-96 object-cover rounded-lg border border-slate-200 shadow-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Contenu de l'onglet Participants */}
                <TabsContent value="participants" className="pt-4">
                  <div className="space-y-6">
                    {evenement.participants &&
                    evenement.participants.length > 0 ? (
                      <>
                        {/* En-tête avec compteur */}
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-slate-900">
                            Liste des participants
                          </h4>
                          {/* Résumé total */}
                          <div className="flex justify-end">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 min-w-64">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-slate-600 mb-1 p-2">
                                    Total des contributions :
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-blue-600">
                                    {formatCurrency(
                                      evenement.participants.reduce(
                                        (sum, participant) =>
                                          sum +
                                          (participant?.option?.montant || 0),
                                        0
                                      )
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tableau dans un conteneur avec style */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-slate-200 bg-slate-50/50">
                                <TableHead className="font-semibold text-slate-700 py-4 px-6">
                                  Participant
                                </TableHead>
                                <TableHead className="font-semibold text-slate-700 py-4 px-6">
                                  Contact
                                </TableHead>
                                <TableHead className="font-semibold text-slate-700 py-4 px-6">
                                  Statut
                                </TableHead>
                                <TableHead className="font-semibold text-slate-700 py-4 px-6 text-right">
                                  Option / Montant
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {evenement.participants.map((participant) => (
                                <TableRow
                                  key={participant.id}
                                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-150"
                                >
                                  {/* Participant */}
                                  <TableCell className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-10 w-10 flex-shrink-0">
                                        <AvatarImage
                                          src={
                                            participant.paroissien.photo?.url
                                          }
                                          alt={`${participant.paroissien.prenoms} ${participant.paroissien.nom}`}
                                        />
                                        <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                                          {getInitials(
                                            participant.paroissien.nom,
                                            participant.paroissien.prenoms
                                          )}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <p className="font-medium text-slate-900 truncate">
                                            {participant.paroissien.prenoms}{" "}
                                            {participant.paroissien.nom}
                                          </p>
                                          {participant.paroissien.genre && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs flex-shrink-0"
                                            >
                                              {participant.paroissien.genre ===
                                              "M"
                                                ? "Homme"
                                                : "Femme"}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>

                                  {/* Contact */}
                                  <TableCell className="py-4 px-6">
                                    {participant.paroissien.num_de_telephone ? (
                                      <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Phone className="h-4 w-4 flex-shrink-0" />
                                        <span className="truncate">
                                          {
                                            participant.paroissien
                                              .num_de_telephone
                                          }
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-sm text-slate-400">
                                        -
                                      </span>
                                    )}
                                  </TableCell>

                                  {/* Statut */}
                                  <TableCell className="py-4 px-6">
                                    {participant.paroissien.statut ? (
                                      <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <UserCheck className="h-4 w-4 flex-shrink-0" />
                                        <span className="truncate">
                                          {participant.paroissien.statut}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-sm text-slate-400">
                                        -
                                      </span>
                                    )}
                                  </TableCell>

                                  {/* Option et montant */}
                                  <TableCell className="py-4 px-6 text-right">
                                    {participant.option ? (
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-900">
                                          {participant.option.label}
                                        </p>
                                        <p className="text-sm font-semibold text-blue-600">
                                          {formatCurrency(
                                            participant.option.montant
                                          )}
                                        </p>
                                      </div>
                                    ) : (
                                      <span className="text-sm text-slate-400">
                                        -
                                      </span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </>
                    ) : (
                      /* Aucun participant */
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="text-center py-16">
                          <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Users className="h-8 w-8 text-slate-400" />
                          </div>
                          <h4 className="text-lg font-medium text-slate-900 mb-2">
                            Aucun participant
                          </h4>
                          <p className="text-slate-500 max-w-md mx-auto">
                            Aucune inscription n'a encore été enregistrée pour
                            cette activité.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
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
          className="flex items-center cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      {/* Titre et description */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Détails de l'événement
        </h1>
        <p className="text-slate-500">
          Informations détaillées sur l'événement
        </p>
      </div>

      {/* Contenu principal */}
      {renderContent()}

      {/* Modal de modification */}
      {/* <EvenementEditModal
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        evenement={evenement}
        onSuccess={handleUpdateSuccess}
      /> */}
    </div>
  );
}
