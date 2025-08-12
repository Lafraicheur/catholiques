// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { format } from "date-fns";
// import { fr } from "date-fns/locale";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ArrowLeft, Loader2, XCircle, AlertTriangle } from "lucide-react";
// import { toast } from "sonner";
// import {
//   ApiError,
//   AuthenticationError,
//   ForbiddenError,
//   NotFoundError,
// } from "@/services/api";

// // Import des composants séparés
// import { SacrementInfoCard } from "@/components/sacrement-details/SacrementInfoCard";
// import { PersonneInfoCard } from "@/components/sacrement-details/PersonneInfoCard";
// import { DocumentsGallery } from "@/components/sacrement-details/DocumentsGallery";
// import { ActionButtons } from "@/components/sacrement-details/ActionButtons";
// import { ValidationDialogs } from "@/components/sacrement-details/ValidationDialogs";

// // Types pour les fichiers d'images
// interface ImageFile {
//   path: string;
//   name: string;
//   url: string;
// }

// // Types pour les personnes
// interface Personne {
//   id: number;
//   created_at?: string;
//   nom: string;
//   prenoms: string;
//   genre?: string;
//   num_de_telephone: string;
//   email?: string;
//   date_de_naissance?: string;
//   pays?: string;
//   nationalite?: string;
//   ville?: string;
//   commune?: string;
//   quartier?: string;
//   statut?: string;
//   est_abonne?: boolean;
//   date_de_fin_abonnement?: number;
//   paroisse_id?: number;
//   chapelle_id?: number;
// }

// // Types pour les sacrements
// interface SacrementIndividuel {
//   id: number;
//   created_at: string;
//   type: string;
//   date: string;
//   description: string;
//   est_une_soumission: boolean;
//   statut: string;
//   motif_de_rejet?: string;
//   sacrement_id?: number;
//   celebrant_id: number;
//   paroisse_id: number;
//   chapelle_id: number | null;
//   paroissien_id: number;
//   parraintemoin_id?: number;
//   certificateur_id?: number;
//   images?: ImageFile[];
//   paroissien?: Personne;
//   celebrant?: Personne;
//   parrain?: Personne;
// }

// const formatDate = (dateString: string) => {
//   try {
//     const date = new Date(dateString);
//     return format(date, "d MMMM yyyy", { locale: fr });
//   } catch (error) {
//     return "Date inconnue";
//   }
// };

// const canPerformActions = (statut: string) => {
//   const normalized = statut.toUpperCase();

//   // Ne pas afficher les boutons si le statut est "VALIDÉ" ou "REJETÉ"
//   const blockedStatuses = [
//     "VALIDÉ",
//     "VALIDE",
//     "CONFIRMÉ",
//     "CONFIRME",
//     "REJETÉ",
//     "REJETE",
//   ];

//   return !blockedStatuses.includes(normalized);
// };

// // Composant Skeleton pour les détails du sacrement
// const SacrementDetailsLoadingSkeleton = () => {
//   return (
//     <div className="space-y-6">
//       {/* En-tête */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <div className="space-y-2">
//           <Skeleton className="h-10 w-20" /> {/* Bouton retour */}
//           <Skeleton className="h-8 w-80" /> {/* Titre */}
//           <Skeleton className="h-4 w-40" /> {/* Date de création */}
//         </div>
//         {/* Boutons d'action */}
//         <div className="flex gap-2">
//           <Skeleton className="h-10 w-24" />
//           <Skeleton className="h-10 w-20" />
//         </div>
//       </div>

//       {/* Carte principale du sacrement */}
//       <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
//         <div className="flex items-center gap-2 mb-4">
//           <Skeleton className="h-6 w-6 rounded-full" />
//           <Skeleton className="h-5 w-32" />
//         </div>
//         <Skeleton className="h-7 w-64" />
//         <Skeleton className="h-5 w-48" />

//         {/* Description */}
//         <div className="space-y-2 pt-4">
//           <Skeleton className="h-5 w-24" />
//           <div className="bg-slate-50 p-4 rounded-lg space-y-2">
//             <Skeleton className="h-4 w-full" />
//             <Skeleton className="h-4 w-3/4" />
//             <Skeleton className="h-4 w-1/2" />
//           </div>
//         </div>

//         {/* Détails du sacrement */}
//         <div className="space-y-2 pt-4">
//           <Skeleton className="h-5 w-40" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="flex justify-between px-4 py-2 bg-slate-50 rounded-md"
//               >
//                 <Skeleton className="h-4 w-32" />
//                 <Skeleton className="h-4 w-24" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Grille des cartes de personnes */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {[...Array(2)].map((_, cardIndex) => (
//           <div
//             key={cardIndex}
//             className="bg-white rounded-lg border border-slate-200 p-6 space-y-4"
//           >
//             <Skeleton className="h-6 w-48" />
//             <div className="flex items-center space-x-4">
//               <Skeleton className="w-16 h-16 rounded-full" />
//               <div className="space-y-2 flex-1">
//                 <Skeleton className="h-5 w-32" />
//                 <Skeleton className="h-4 w-28" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 gap-3">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="flex justify-between py-2">
//                   <Skeleton className="h-4 w-24" />
//                   <Skeleton className="h-4 w-32" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Galerie de documents */}
//       <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
//         <Skeleton className="h-6 w-40" />
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {[...Array(3)].map((_, i) => (
//             <Skeleton key={i} className="aspect-square rounded-md" />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function SacrementSoumissionDetailsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const id = params?.id ? Number(params.id) : 0;

//   const [sacrement, setSacrement] = useState<SacrementIndividuel | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // États pour les dialogs
//   const [showValidateDialog, setShowValidateDialog] = useState(false);
//   const [showRejectDialog, setShowRejectDialog] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [validationLoading, setValidationLoading] = useState(false);
//   const [rejectionLoading, setRejectionLoading] = useState(false);

//   // Récupérer les détails de la soumission
//   const fetchSacrementDetails = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("auth_token");

//       if (!token) {
//         throw new AuthenticationError("Token d'authentification non trouvé");
//       }

//       console.log(
//         `Récupération des détails pour l'ID: ${id}, type: INDIVIDUEL`
//       );

//       const url = `https://api.cathoconnect.ci/api:HzF8fFua/sacrement-soumission/obtenir-un?type=INDIVIDUEL&sacrement_id=${id}`;
//       console.log("URL de l'API:", url);

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("Statut de la réponse:", response.status);

//       const responseText = await response.text();
//       console.log("Réponse brute:", responseText);

//       if (!response.ok) {
//         const statusCode = response.status;
//         switch (statusCode) {
//           case 401:
//             throw new AuthenticationError("Vous n'êtes pas authentifié");
//           case 403:
//             throw new ForbiddenError("Vous n'avez pas les droits nécessaires");
//           case 404:
//             throw new NotFoundError("Soumission de sacrement non trouvée");
//           default:
//             throw new ApiError(`Erreur HTTP: ${statusCode}`, statusCode);
//         }
//       }

//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         console.error("Erreur lors du parsing JSON:", e);
//         throw new ApiError("Format de réponse invalide", 0);
//       }

//       console.log("Données reçues:", data);

//       // Gestion de différentes structures de réponse
//       if (data && data.individuel && data.individuel.length > 0) {
//         setSacrement(data.individuel[0]);
//       } else if (data && data.item) {
//         setSacrement(data.item);
//       } else if (Array.isArray(data) && data.length > 0) {
//         setSacrement(data[0]);
//       } else if (data && typeof data === "object" && data.id) {
//         setSacrement(data);
//       } else {
//         throw new NotFoundError(
//           "Soumission de sacrement non trouvée ou format de réponse inattendu"
//         );
//       }
//     } catch (err: any) {
//       console.error("Erreur lors du chargement des détails:", err);

//       let errorMessage =
//         "Une erreur est survenue lors du chargement des données.";

//       if (err instanceof AuthenticationError) {
//         errorMessage =
//           "Vous n'êtes pas authentifié. Veuillez vous reconnecter.";
//         router.push("/login");
//       } else if (err instanceof ForbiddenError) {
//         errorMessage =
//           "Vous n'avez pas les droits nécessaires pour accéder à cette ressource.";
//       } else if (err instanceof NotFoundError) {
//         errorMessage = "La soumission de sacrement demandée n'existe pas.";
//       } else if (err instanceof ApiError) {
//         errorMessage = err.message;
//       } else if (err instanceof Error) {
//         errorMessage = err.message;
//       }

//       setError(errorMessage);
//       toast.error("Erreur", {
//         description: "Impossible de charger les détails de la soumission.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchSacrementDetails();
//     }
//   }, [id]);

//   // Fonction pour valider la soumission
//   const confirmValidation = async () => {
//     setValidationLoading(true);
//     try {
//       const token = localStorage.getItem("auth_token");

//       if (!token) {
//         throw new AuthenticationError("Token d'authentification non trouvé");
//       }

//       const requestBody = {
//         sacrement_id: id,
//         type: "INDIVIDUEL",
//       };

//       console.log("Envoi de la requête de validation:", requestBody);

//       const response = await fetch(
//         "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-soumission/valider",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       console.log("Statut de la réponse:", response.status);

//       if (!response.ok) {
//         const statusCode = response.status;
//         let errorText;

//         try {
//           const errorData = await response.json();
//           errorText = JSON.stringify(errorData);
//           console.error("Détails de l'erreur:", errorData);
//         } catch (e) {
//           errorText = await response.text();
//           console.error("Texte d'erreur brut:", errorText);
//         }

//         switch (statusCode) {
//           case 400:
//             throw new ApiError(`Erreur de requête: ${errorText}`, 400);
//           case 401:
//             throw new AuthenticationError("Vous n'êtes pas authentifié");
//           case 403:
//             throw new ForbiddenError("Vous n'avez pas les droits nécessaires");
//           case 404:
//             throw new NotFoundError("Sacrement non trouvé");
//           default:
//             throw new ApiError(`Erreur HTTP: ${statusCode}`, statusCode);
//         }
//       }

//       const data = await response.json();
//       console.log("Réponse de validation:", data);

//       toast.success("Succès", {
//         description: "La soumission de sacrement a été validée avec succès.",
//       });

//       await fetchSacrementDetails();
//     } catch (err: any) {
//       console.error("Erreur lors de la validation de la soumission:", err);

//       let errorMessage = "Impossible de valider la soumission de sacrement.";

//       if (err instanceof AuthenticationError) {
//         errorMessage =
//           "Vous n'êtes pas authentifié. Veuillez vous reconnecter.";
//         router.push("/login");
//       } else if (err instanceof ForbiddenError) {
//         errorMessage =
//           "Vous n'avez pas les droits nécessaires pour cette action.";
//       } else if (err instanceof NotFoundError) {
//         errorMessage = "Le sacrement demandé n'existe pas.";
//       } else if (err instanceof ApiError) {
//         errorMessage = err.message;
//       } else if (err instanceof Error) {
//         errorMessage = err.message;
//       }

//       toast.error("Erreur", {
//         description: errorMessage,
//       });
//     } finally {
//       setValidationLoading(false);
//       setShowValidateDialog(false);
//     }
//   };

//   // Fonction pour rejeter la soumission
//   const confirmRejection = async () => {
//     if (!rejectionReason.trim()) {
//       toast.error("Erreur", {
//         description: "Veuillez fournir un motif de rejet.",
//       });
//       return;
//     }

//     setRejectionLoading(true);
//     try {
//       const token = localStorage.getItem("auth_token");

//       if (!token) {
//         throw new AuthenticationError("Token d'authentification non trouvé");
//       }

//       const requestBody = {
//         sacrement_id: id,
//         type: "INDIVIDUEL",
//         motif_de_rejet: rejectionReason,
//       };

//       console.log("Envoi de la requête de rejet:", requestBody);

//       const response = await fetch(
//         "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-soumission/rejeter",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       console.log("Statut de la réponse:", response.status);

//       if (!response.ok) {
//         const statusCode = response.status;
//         let errorText;

//         try {
//           const errorData = await response.json();
//           errorText = JSON.stringify(errorData);
//           console.error("Détails de l'erreur:", errorData);
//         } catch (e) {
//           errorText = await response.text();
//           console.error("Texte d'erreur brut:", errorText);
//         }

//         switch (statusCode) {
//           case 400:
//             throw new ApiError(`Erreur de requête: ${errorText}`, 400);
//           case 401:
//             throw new AuthenticationError("Vous n'êtes pas authentifié");
//           case 403:
//             throw new ForbiddenError("Vous n'avez pas les droits nécessaires");
//           case 404:
//             throw new NotFoundError("Sacrement non trouvé");
//           default:
//             throw new ApiError(`Erreur HTTP: ${statusCode}`, statusCode);
//         }
//       }

//       const data = await response.json();
//       console.log("Réponse de rejet:", data);

//       toast.success("Succès", {
//         description: "La soumission de sacrement a été rejetée avec succès.",
//       });

//       await fetchSacrementDetails();
//     } catch (err: any) {
//       console.error("Erreur lors du rejet de la soumission:", err);

//       let errorMessage = "Impossible de rejeter la soumission de sacrement.";

//       if (err instanceof AuthenticationError) {
//         errorMessage =
//           "Vous n'êtes pas authentifié. Veuillez vous reconnecter.";
//         router.push("/login");
//       } else if (err instanceof ForbiddenError) {
//         errorMessage =
//           "Vous n'avez pas les droits nécessaires pour cette action.";
//       } else if (err instanceof NotFoundError) {
//         errorMessage = "Le sacrement demandé n'existe pas.";
//       } else if (err instanceof ApiError) {
//         errorMessage = err.message;
//       } else if (err instanceof Error) {
//         errorMessage = err.message;
//       }

//       toast.error("Erreur", {
//         description: errorMessage,
//       });
//     } finally {
//       setRejectionLoading(false);
//       setShowRejectDialog(false);
//       setRejectionReason("");
//     }
//   };

//   // Gestionnaires pour les boutons d'action
//   const handleValidate = () => {
//     setShowValidateDialog(true);
//   };

//   const handleReject = () => {
//     setShowRejectDialog(true);
//   };

//   // États de chargement - REMPLACÉ PAR LE SKELETON
//   if (loading) {
//     return <SacrementDetailsLoadingSkeleton />;
//   }

//   // État d'erreur
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center p-12 text-center">
//         <XCircle className="h-12 w-12 text-red-400 mb-4" />
//         <h3 className="text-lg font-medium text-slate-900 mb-2">
//           Une erreur est survenue
//         </h3>
//         <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
//         <div className="flex gap-4">
//           <Button
//             variant="outline"
//             onClick={() =>
//               router.push("/dashboard/paroisse/sacrements/soumissions")
//             }
//           >
//             Retour
//           </Button>
//           <Button onClick={() => fetchSacrementDetails()}>Réessayer</Button>
//         </div>
//       </div>
//     );
//   }

//   // État sans données
//   if (!sacrement) {
//     return (
//       <div className="flex flex-col items-center justify-center p-12 text-center">
//         <AlertTriangle className="h-12 w-12 text-amber-400 mb-4" />
//         <h3 className="text-lg font-medium text-slate-900 mb-2">
//           Aucune donnée trouvée
//         </h3>
//         <p className="text-sm text-slate-500 max-w-md mb-4">
//           Impossible de trouver les détails de cette soumission de sacrement.
//         </p>
//         <Button
//           variant="outline"
//           onClick={() =>
//             router.push("/dashboard/paroisse/sacrements/soumissions")
//           }
//         >
//           Retour
//         </Button>
//       </div>
//     );
//   }

//   // Calculer si les actions sont possibles
//   const canShowActions = canPerformActions(sacrement.statut);

//   return (
//     <div className="space-y-6">
//       {/* En-tête avec bouton retour et actions */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <div>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => router.back()}
//             className="flex items-center mb-4"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Retour
//           </Button>
//           <h1 className="text-2xl font-bold text-slate-900">
//             Détails de la soumission de sacrement
//           </h1>
//           <div className="text-sm text-slate-500">
//             Créée le: {formatDate(sacrement.created_at)}
//           </div>
//         </div>

//         {/* Boutons d'action */}
//         <ActionButtons
//           canPerformActions={canShowActions}
//           onValidate={handleValidate}
//           onReject={handleReject}
//         />
//       </div>

//       {/* Section principale avec les informations du sacrement */}
//       <SacrementInfoCard sacrement={sacrement} />

//       {/* Grille avec les informations des personnes */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <PersonneInfoCard
//           title="Informations sur le célébrant"
//           personne={sacrement.celebrant || null}
//           emptyMessage="Aucun célébrant n'a été assigné à ce sacrement"
//         />

//         <PersonneInfoCard
//           title="Informations sur le paroissien"
//           personne={sacrement.paroissien || null}
//           emptyMessage="Aucune information disponible sur le paroissien"
//         />
//       </div>

//       {/* Informations sur le parrain/témoin si disponible */}
//       {sacrement.parrain && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <PersonneInfoCard
//             title="Informations sur le parrain/témoin"
//             personne={sacrement.parrain}
//           />
//         </div>
//       )}

//       {/* Galerie de documents */}
//       <DocumentsGallery images={sacrement.images || []} />

//       {/* Dialogues de validation et rejet */}
//       <ValidationDialogs
//         showValidateDialog={showValidateDialog}
//         showRejectDialog={showRejectDialog}
//         validationLoading={validationLoading}
//         rejectionLoading={rejectionLoading}
//         rejectionReason={rejectionReason}
//         onValidateDialogChange={setShowValidateDialog}
//         onRejectDialogChange={setShowRejectDialog}
//         onRejectionReasonChange={setRejectionReason}
//         onConfirmValidation={confirmValidation}
//         onConfirmRejection={confirmRejection}
//       />
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Loader2,
  XCircle,
  AlertTriangle,
  Calendar,
  AlignJustify,
  User,
  Phone,
  Mail,
  MapPin,
  UserCheck,
  ImageIcon,
  Church,
  MapPinIcon,
  CreditCard,
  Crown,
  UserPlus,
  Landmark,
} from "lucide-react";
import { toast } from "sonner";
import {
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";
import { ActionButtons } from "@/components/sacrement-details/ActionButtons";
import { ValidationDialogs } from "@/components/sacrement-details/ValidationDialogs";

// Types pour les fichiers d'images
interface ImageFile {
  url: string;
}

// Types pour les extras
interface SacrementExtras {
  nom_du_pere?: string;
  nom_de_la_mere?: string;
  nom_de_bapteme?: string;
  numero_de_bapteme?: string;
  statut_social?: string;
  fin_paiement?: number;
  debut_paiement?: number;
  [key: string]: any;
}

// Types pour les personnes
interface Personne {
  id: number;
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
  est_abonne?: boolean;
  date_de_fin_abonnement?: number;
  paroisse_id?: number;
  chapelle_id?: number;
}

// Types pour les sacrements mis à jour
interface SacrementIndividuel {
  id: number;
  created_at: number;
  type: string;
  date: number;
  est_une_soumission: boolean;
  statut: string;
  pere_celebrant: string | null;
  parrain_ou_temoin: string | null;
  paroisse: string;
  diocese: string;
  motif_de_rejet?: string | null;
  extras: SacrementExtras;
  sacrement_id?: number | null;
  certificateur_id?: number | null;
  paroissien_id: number;
  images?: ImageFile[];
  paroissien?: Personne;
}

const formatDate = (timestamp: number) => {
  try {
    const date = new Date(timestamp);
    return format(date, "d MMMM yyyy", { locale: fr });
  } catch (error) {
    return "Date inconnue";
  }
};

const canPerformActions = (statut: string) => {
  const normalized = statut.toUpperCase();
  const blockedStatuses = [
    "VALIDÉ",
    "VALIDE",
    "CONFIRMÉ",
    "CONFIRME",
    "REJETÉ",
    "REJETE",
  ];
  return !blockedStatuses.includes(normalized);
};

const getStatusDetails = (statut: string) => {
  const normalizedStatus = statut.toUpperCase();
  switch (normalizedStatus) {
    case "CONFIRMÉ":
    case "CONFIRME":
    case "VALIDÉ":
    case "VALIDE":
      return { label: "Validé", variant: "success" as const };
    case "EN ATTENTE":
    case "ATTENTE":
      return { label: "En attente", variant: "secondary" as const };
    case "REJETÉ":
    case "REJETE":
      return { label: "Rejeté", variant: "destructive" as const };
    default:
      return { label: statut, variant: "outline" as const };
  }
};

// Composant pour les informations du sacrement
function SacrementInfoCard({ sacrement }: { sacrement: SacrementIndividuel }) {
  const { label: statusLabel, variant: statusVariant } = getStatusDetails(
    sacrement.statut
  );

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">
              {sacrement.type}
            </Badge>
            <Badge variant={statusVariant} className="text-sm">
              {statusLabel}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-slate-700">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              <span className="font-medium">Date du sacrement:</span>
              <span className="ml-2">{formatDate(sacrement.date)}</span>
            </div>

            {sacrement.pere_celebrant && (
              <div className="flex items-center text-slate-700">
                <Crown className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-medium">Père célébrant:</span>
                <span className="ml-2">{sacrement.pere_celebrant}</span>
              </div>
            )}

            {sacrement.parrain_ou_temoin && (
              <div className="flex items-center text-slate-700">
                <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-medium">Parrain/Témoin:</span>
                <span className="ml-2">{sacrement.parrain_ou_temoin}</span>
              </div>
            )}

            <div className="flex items-center text-slate-700">
              <Church className="h-5 w-5 mr-2 text-blue-500" />
              <span className="font-medium">Paroisse:</span>
              <span className="ml-2">
                {sacrement.paroisse || "Non spécifiée"}
              </span>
            </div>

            {sacrement.diocese && (
              <div className="flex items-center text-slate-700">
                <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-medium">Diocèse:</span>
                <span className="ml-2">{sacrement.diocese}</span>
              </div>
            )}

            {sacrement.motif_de_rejet && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  <div>
                    <h4 className="font-medium text-red-700">
                      Motif de rejet:
                    </h4>
                    <p className="mt-1 text-red-600">
                      {sacrement.motif_de_rejet}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Composant pour les informations supplémentaires (extras)
function SacrementExtrasCard({
  extras,
  type,
}: {
  extras: SacrementExtras;
  type: string;
}) {
  const hasExtras = Object.keys(extras).length > 0;

  if (!hasExtras) return null;

  const renderExtraField = (key: string, value: any, label: string) => {
    if (!value && value !== 0) return null;

    return (
      <div
        key={key}
        className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0"
      >
        <span className="font-medium text-slate-600">{label}:</span>
        <span className="text-slate-900">{value}</span>
      </div>
    );
  };

  const getExtraFields = () => {
    const fields = [];

    // Champs communs
    if (extras.nom_du_pere) {
      fields.push(
        renderExtraField("nom_du_pere", extras.nom_du_pere, "Nom du père")
      );
    }
    if (extras.nom_de_la_mere) {
      fields.push(
        renderExtraField(
          "nom_de_la_mere",
          extras.nom_de_la_mere,
          "Nom de la mère"
        )
      );
    }
    if (extras.nom_de_bapteme) {
      fields.push(
        renderExtraField(
          "nom_de_bapteme",
          extras.nom_de_bapteme,
          "Nom de baptême"
        )
      );
    }
    if (extras.numero_de_bapteme) {
      fields.push(
        renderExtraField(
          "numero_de_bapteme",
          extras.numero_de_bapteme,
          "Numéro de baptême"
        )
      );
    }
    if (extras.statut_social) {
      fields.push(
        renderExtraField("statut_social", extras.statut_social, "Statut social")
      );
    }

    // Champs spécifiques au Denier de Culte
    if (type === "Denier De Culte") {
      if (extras.debut_paiement) {
        fields.push(
          renderExtraField(
            "debut_paiement",
            extras.debut_paiement,
            "Début de paiement"
          )
        );
      }
      if (extras.fin_paiement) {
        fields.push(
          renderExtraField(
            "fin_paiement",
            extras.fin_paiement,
            "Fin de paiement"
          )
        );
      }
    }

    return fields;
  };

  const extraFields = getExtraFields();

  if (extraFields.length === 0) return null;

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <AlignJustify className="h-5 w-5 mr-2 text-blue-500" />
        Informations complémentaires
      </h2>
      <div className="space-y-2">{extraFields}</div>
    </Card>
  );
}

// Composant pour les informations des personnes
function PersonneInfoCard({
  title,
  personne,
  emptyMessage = "Aucune information disponible",
}: {
  title: string;
  personne: Personne | null;
  emptyMessage?: string;
}) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {personne ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start">
              <User className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
              <div>
                <span className="font-medium">Nom complet:</span>
                <p className="mt-1">{`${personne.prenoms} ${personne.nom}`}</p>
              </div>
            </div>
            {personne.genre && (
              <div className="flex items-start">
                <UserCheck className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                <div>
                  <span className="font-medium">Genre:</span>
                  <p className="mt-1">
                    {personne.genre === "M" ? "Masculin" : "Féminin"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
              <div>
                <span className="font-medium">Téléphone:</span>
                <p className="mt-1">{personne.num_de_telephone}</p>
              </div>
            </div>

            {personne.statut && (
              <div className="flex items-start">
                <Landmark className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                <div>
                  <span className="font-medium">Statut:</span>
                  <p className="mt-1">
                    {" "}
                    <Badge variant="outline" className="text-sm">
                      {personne.statut}
                    </Badge>
                  </p>
                </div>
              </div>
            )}
          </div>

          {(personne.ville || personne.commune || personne.quartier) && (
            <div className="flex items-start mt-4">
              <MapPin className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
              <div>
                <span className="font-medium">Adresse:</span>
                <p className="mt-1">
                  {[
                    personne.quartier,
                    personne.commune,
                    personne.ville,
                    personne.pays,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 p-4 rounded-md text-slate-600 italic">
          {emptyMessage}
        </div>
      )}
    </Card>
  );
}

// Composant pour la galerie de documents
function DocumentsGallery({ images }: { images: ImageFile[] }) {
  if (!images || images.length === 0) {
    return null;
  }

  const getFileName = (url: string, index: number): string => {
    try {
      const urlParts = url.split("/");
      const filename = urlParts[urlParts.length - 1];
      return filename || `Image ${index + 1}`;
    } catch {
      return `Image ${index + 1}`;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Images jointes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => {
          const fileName = getFileName(image?.url, index);

          return (
            <div
              key={index}
              className="border rounded-md overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-3 border-b bg-slate-50">
                <div className="flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="font-medium truncate">{fileName}</span>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-video bg-slate-100 relative">
                  <img
                    src={image?.url}
                    alt={fileName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="aspect-video bg-slate-100 flex flex-col items-center justify-center p-4">
                            <div class="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                              </svg>
                            </div>
                            <p class="text-center text-slate-600 text-sm">Image non disponible</p>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Composant Skeleton pour les détails du sacrement
const SacrementDetailsLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Carte principale du sacrement */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-5 w-48" />

        <div className="space-y-2 pt-4">
          <Skeleton className="h-5 w-24" />
          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>

      {/* Grille des cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, cardIndex) => (
          <div
            key={cardIndex}
            className="bg-white rounded-lg border border-slate-200 p-6 space-y-4"
          >
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between py-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SacrementSoumissionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : 0;

  const [sacrement, setSacrement] = useState<SacrementIndividuel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les dialogs
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [validationLoading, setValidationLoading] = useState(false);
  const [rejectionLoading, setRejectionLoading] = useState(false);

  // Récupérer les détails de la soumission
  const fetchSacrementDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      console.log(
        `Récupération des détails pour l'ID: ${id}, type: INDIVIDUEL`
      );

      const url = `https://api.cathoconnect.ci/api:HzF8fFua/sacrement-soumission/obtenir-un?type=INDIVIDUEL&sacrement_id=${id}`;
      console.log("URL de l'API:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Statut de la réponse:", response.status);

      const responseText = await response.text();
      console.log("Réponse brute:", responseText);

      if (!response.ok) {
        const statusCode = response.status;
        switch (statusCode) {
          case 401:
            throw new AuthenticationError("Vous n'êtes pas authentifié");
          case 403:
            throw new ForbiddenError("Vous n'avez pas les droits nécessaires");
          case 404:
            throw new NotFoundError("Soumission de sacrement non trouvée");
          default:
            throw new ApiError(`Erreur HTTP: ${statusCode}`, statusCode);
        }
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Erreur lors du parsing JSON:", e);
        throw new ApiError("Format de réponse invalide", 0);
      }

      console.log("Données reçues:", data);

      // Gestion de la nouvelle structure de réponse
      if (data && data.item) {
        setSacrement(data.item);
      } else if (data && data.individuel && data.individuel.length > 0) {
        setSacrement(data.individuel[0]);
      } else if (Array.isArray(data) && data.length > 0) {
        setSacrement(data[0]);
      } else if (data && typeof data === "object" && data.id) {
        setSacrement(data);
      } else {
        throw new NotFoundError(
          "Soumission de sacrement non trouvée ou format de réponse inattendu"
        );
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement des détails:", err);

      let errorMessage =
        "Une erreur est survenue lors du chargement des données.";

      if (err instanceof AuthenticationError) {
        errorMessage =
          "Vous n'êtes pas authentifié. Veuillez vous reconnecter.";
        router.push("/login");
      } else if (err instanceof ForbiddenError) {
        errorMessage =
          "Vous n'avez pas les droits nécessaires pour accéder à cette ressource.";
      } else if (err instanceof NotFoundError) {
        errorMessage = "La soumission de sacrement demandée n'existe pas.";
      } else if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error("Erreur", {
        description: "Impossible de charger les détails de la soumission.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSacrementDetails();
    }
  }, [id]);

  // Fonction pour valider la soumission
  const confirmValidation = async () => {
    setValidationLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      const requestBody = {
        sacrement_id: id,
        type: "INDIVIDUEL",
      };

      console.log("Envoi de la requête de validation:", requestBody);

      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-soumission/valider",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Statut de la réponse:", response.status);

      if (!response.ok) {
        const statusCode = response.status;
        let errorText;

        try {
          const errorData = await response.json();
          errorText = JSON.stringify(errorData);
          console.error("Détails de l'erreur:", errorData);
        } catch (e) {
          errorText = await response.text();
          console.error("Texte d'erreur brut:", errorText);
        }

        switch (statusCode) {
          case 400:
            throw new ApiError(`Erreur de requête: ${errorText}`, 400);
          case 401:
            throw new AuthenticationError("Vous n'êtes pas authentifié");
          case 403:
            throw new ForbiddenError("Vous n'avez pas les droits nécessaires");
          case 404:
            throw new NotFoundError("Sacrement non trouvé");
          default:
            throw new ApiError(`Erreur HTTP: ${statusCode}`, statusCode);
        }
      }

      const data = await response.json();
      console.log("Réponse de validation:", data);

      toast.success("Succès", {
        description: "La soumission de sacrement a été validée avec succès.",
      });

      await fetchSacrementDetails();
    } catch (err: any) {
      console.error("Erreur lors de la validation de la soumission:", err);

      let errorMessage = "Impossible de valider la soumission de sacrement.";

      if (err instanceof AuthenticationError) {
        errorMessage =
          "Vous n'êtes pas authentifié. Veuillez vous reconnecter.";
        router.push("/login");
      } else if (err instanceof ForbiddenError) {
        errorMessage =
          "Vous n'avez pas les droits nécessaires pour cette action.";
      } else if (err instanceof NotFoundError) {
        errorMessage = "Le sacrement demandé n'existe pas.";
      } else if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error("Erreur", {
        description: errorMessage,
      });
    } finally {
      setValidationLoading(false);
      setShowValidateDialog(false);
    }
  };

  // Fonction pour rejeter la soumission
  const confirmRejection = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Erreur", {
        description: "Veuillez fournir un motif de rejet.",
      });
      return;
    }

    setRejectionLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      const requestBody = {
        sacrement_id: id,
        type: "INDIVIDUEL",
        motif_de_rejet: rejectionReason,
      };

      console.log("Envoi de la requête de rejet:", requestBody);

      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-soumission/rejeter",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Statut de la réponse:", response.status);

      if (!response.ok) {
        const statusCode = response.status;
        let errorText;

        try {
          const errorData = await response.json();
          errorText = JSON.stringify(errorData);
          console.error("Détails de l'erreur:", errorData);
        } catch (e) {
          errorText = await response.text();
          console.error("Texte d'erreur brut:", errorText);
        }

        switch (statusCode) {
          case 400:
            throw new ApiError(`Erreur de requête: ${errorText}`, 400);
          case 401:
            throw new AuthenticationError("Vous n'êtes pas authentifié");
          case 403:
            throw new ForbiddenError("Vous n'avez pas les droits nécessaires");
          case 404:
            throw new NotFoundError("Sacrement non trouvé");
          default:
            throw new ApiError(`Erreur HTTP: ${statusCode}`, statusCode);
        }
      }

      const data = await response.json();
      console.log("Réponse de rejet:", data);

      toast.success("Succès", {
        description: "La soumission de sacrement a été rejetée avec succès.",
      });

      await fetchSacrementDetails();
    } catch (err: any) {
      console.error("Erreur lors du rejet de la soumission:", err);

      let errorMessage = "Impossible de rejeter la soumission de sacrement.";

      if (err instanceof AuthenticationError) {
        errorMessage =
          "Vous n'êtes pas authentifié. Veuillez vous reconnecter.";
        router.push("/login");
      } else if (err instanceof ForbiddenError) {
        errorMessage =
          "Vous n'avez pas les droits nécessaires pour cette action.";
      } else if (err instanceof NotFoundError) {
        errorMessage = "Le sacrement demandé n'existe pas.";
      } else if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error("Erreur", {
        description: errorMessage,
      });
    } finally {
      setRejectionLoading(false);
      setShowRejectDialog(false);
      setRejectionReason("");
    }
  };

  // Gestionnaires pour les boutons d'action
  const handleValidate = () => {
    setShowValidateDialog(true);
  };

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  // États de chargement
  if (loading) {
    return <SacrementDetailsLoadingSkeleton />;
  }

  // État d'erreur
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <XCircle className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Une erreur est survenue
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() =>
              router.push("/dashboard/paroisse/sacrements/soumissions")
            }
          >
            Retour
          </Button>
          <Button onClick={() => fetchSacrementDetails()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  // État sans données
  if (!sacrement) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Aucune donnée trouvée
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-4">
          Impossible de trouver les détails de cette soumission de sacrement.
        </p>
        <Button
          variant="outline"
          onClick={() =>
            router.push("/dashboard/paroisse/sacrements/soumissions")
          }
        >
          Retour
        </Button>
      </div>
    );
  }

  // Calculer si les actions sont possibles
  const canShowActions = canPerformActions(sacrement.statut);

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton retour et actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">
            Détails de la soumission de sacrement
          </h1>
          <div className="text-sm text-slate-500">
            Créée le: {formatDate(sacrement.created_at)}
          </div>
        </div>

        {/* Boutons d'action */}
        {canShowActions && (
          <div className="flex gap-2">
            <Button
              onClick={handleValidate}
              className="bg-green-600 hover:bg-green-700"
              disabled={validationLoading}
            >
              {validationLoading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Valider
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectionLoading}
            >
              {rejectionLoading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Rejeter
            </Button>
          </div>
        )}
      </div>

      {/* Section principale avec les informations du sacrement */}
      <SacrementInfoCard sacrement={sacrement} />

      {/* Grille avec les informations des personnes et extras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonneInfoCard
          title="Informations sur le paroissien"
          personne={sacrement.paroissien || null}
          emptyMessage="Aucune information disponible sur le paroissien"
        />

        {/* Afficher les informations supplémentaires si elles existent */}
        <SacrementExtrasCard
          extras={sacrement.extras || {}}
          type={sacrement.type}
        />
      </div>

      {/* Galerie de documents */}
      <DocumentsGallery images={sacrement.images || []} />

      {/* Dialogues de validation et rejet */}
      <ValidationDialogs
        showValidateDialog={showValidateDialog}
        showRejectDialog={showRejectDialog}
        validationLoading={validationLoading}
        rejectionLoading={rejectionLoading}
        rejectionReason={rejectionReason}
        onValidateDialogChange={setShowValidateDialog}
        onRejectDialogChange={setShowRejectDialog}
        onRejectionReasonChange={setRejectionReason}
        onConfirmValidation={confirmValidation}
        onConfirmRejection={confirmRejection}
      />
    </div>
  );
}
