// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import {
//   ArrowLeft,
//   MapPin,
//   Users,
//   Building2,
//   Crown,
//   Church,
//   Calendar,
//   XCircle,
//   Eye,
//   Phone,
//   Mail,
//   Download,
//   FileSpreadsheet,
//   FileDown,
//   Home,
//   Search,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   UserCheck,
//   Settings,
//   UserPlus,
//   CheckCircle,
//   XIcon,
//   Plus,
//   Edit,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import {
//   fetchParoisseDetails,
//   ParoisseDetails,
//   formatTimestamp,
//   getFullName,
//   formatLocalisation,
//   formatGenre,
//   formatStatutAbonnement,
//   nommerCure,
//   ApiError,
//   AuthenticationError,
//   ForbiddenError,
//   NotFoundError,
// } from "@/services/ParoiseofDiocese";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// // Fonctions utilitaires
// const sanitizeForRender = (value: any): string | number => {
//   if (value === null || value === undefined) {
//     return "N/A";
//   }

//   if (
//     typeof value === "string" ||
//     typeof value === "number" ||
//     typeof value === "boolean"
//   ) {
//     return String(value);
//   }

//   if (typeof value === "object") {
//     if (value.type && value.data) {
//       return formatLocalisation(value);
//     }

//     if (value.url) {
//       return value.url;
//     }

//     if (value.nom) {
//       return value.nom;
//     }

//     try {
//       const keys = Object.keys(value);
//       if (keys.length === 0) return "N/A";
//       return `[Objet: ${keys.join(", ")}]`;
//     } catch (error) {
//       return "[Objet complexe]";
//     }
//   }

//   return String(value);
// };

// const formatDate = (timestamp: string | number | null | undefined): string => {
//   return formatTimestamp(timestamp);
// };

// // Interfaces
// interface StatsCardProps {
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   iconBgColor: string;
//   iconColor: string;
// }

// // Composants
// const SafeStatsCard = ({
//   title,
//   value,
//   icon,
//   iconBgColor,
//   iconColor,
// }: StatsCardProps) => {
//   const safeValue = sanitizeForRender(value);

//   return (
//     <Card className="relative overflow-hidden border-0 shadow-sm bg-white transition-shadow duration-200">
//       <CardContent className="p-y-1">
//         {/* Header avec icône et menu */}
//         <div className="flex items-center gap-3 mb-4">
//           <div
//             className={`h-3 w-12 rounded-xl ${iconBgColor} flex items-center justify-center`}
//           >
//             <div className={iconColor}>{icon}</div>
//           </div>
//           <h3 className="text-sm font-medium text-slate-600 mb-2">{title}</h3>
//         </div>
//         {/* Valeur et tendance */}
//         <div className="flex items-end justify-between">
//           <div className="text-xl font-bold text-slate-900">{safeValue}</div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const SafeValue = ({
//   children,
//   className = "",
// }: {
//   children: any;
//   className?: string;
// }) => {
//   const safeContent = sanitizeForRender(children);
//   return <span className={className}>{safeContent}</span>;
// };

// // Composant pour la barre de recherche
// const SearchBar = ({
//   searchQuery,
//   setSearchQuery,
//   totalParoissiens,
//   onClearSearch,
// }: {
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   totalParoissiens: number;
//   onClearSearch: () => void;
// }) => (
//   <Card className="bg-white border-slate-200 mb-6">
//     <CardContent className="p-6">
//       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//         <div className="flex-1 max-w-md">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <Input
//               type="text"
//               placeholder="Rechercher par nom, prénom, téléphone..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 pr-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
//             />
//             {searchQuery && (
//               <button
//                 onClick={onClearSearch}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-slate-600"
//               >
//                 <X size={16} />
//               </button>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center gap-4 text-sm text-slate-500">
//           <span>{totalParoissiens} paroissien(s)</span>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

// // Composant pour la pagination
// const PaginationControls = ({
//   currentPage,
//   totalPages,
//   itemsPerPage,
//   totalItems,
//   onPreviousPage,
//   onNextPage,
//   type,
// }: {
//   currentPage: number;
//   totalPages: number;
//   itemsPerPage: number;
//   totalItems: number;
//   onPreviousPage: () => void;
//   onNextPage: () => void;
//   type: string;
// }) => {
//   if (totalItems <= itemsPerPage) return null;

//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   return (
//     <div className="flex items-center justify-between px-2 py-4 border-t border-slate-200 bg-slate-50/50">
//       <div className="text-sm text-slate-500">
//         Affichage de {startItem} à {endItem} sur {totalItems} {type}(s)
//       </div>
//       <div className="flex items-center gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={onPreviousPage}
//           disabled={currentPage === 1}
//           className="h-8 px-3 cursor-pointer"
//         >
//           <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={onNextPage}
//           disabled={currentPage === totalPages}
//           className="h-8 px-3 cursor-pointer"
//         >
//           Suivant <ChevronRight className="h-4 w-4 ml-1" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// // Composant pour les onglets vides avec recherche
// const EmptyTabContent = ({
//   type,
//   icon: Icon,
//   searchQuery,
//   onClearSearch,
// }: {
//   type: string;
//   icon: React.ComponentType<any>;
//   searchQuery: string;
//   onClearSearch: () => void;
// }) => (
//   <div className="py-12 text-center">
//     <Icon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//     {searchQuery ? (
//       <>
//         <h3 className="text-lg font-medium text-slate-900 mb-2">
//           Aucun résultat trouvé
//         </h3>
//         <p className="text-sm text-slate-500 mb-4">
//           Aucun {type.toLowerCase()} ne correspond à votre recherche "
//           {searchQuery}".
//         </p>
//         <Button variant="outline" onClick={onClearSearch} className="mx-auto">
//           <X className="h-4 w-4 mr-2" />
//           Effacer la recherche
//         </Button>
//       </>
//     ) : (
//       <>
//         <h3 className="text-lg font-medium text-slate-900 mb-2">
//           Aucun {type.toLowerCase()} trouvé
//         </h3>
//         <p className="text-sm text-slate-500">
//           Cette paroisse ne contient encore aucun {type.toLowerCase()}.
//         </p>
//       </>
//     )}
//   </div>
// );

// export default function ParoisseDetailsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const paroisseId = params?.id as string;

//   const [paroisseDetails, setParoisseDetails] =
//     useState<ParoisseDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [exporting, setExporting] = useState(false);
//   const [activeTab, setActiveTab] = useState("organisation");

//   // États pour la recherche
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredParoissiens, setFilteredParoissiens] = useState<any[]>([]);

//   // États pour la pagination
//   const [currentPageParoissiens, setCurrentPageParoissiens] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [totalPagesParoissiens, setTotalPagesParoissiens] = useState(1);

//   // États pour la nomination
//   const [isNominationDialogOpen, setIsNominationDialogOpen] = useState(false);
//   const [serviteurId, setServiteurId] = useState("");
//   const [isNominating, setIsNominating] = useState(false);

//   // Charger les détails de la paroisse au montage du composant
//   useEffect(() => {
//     const loadParoisseDetails = async () => {
//       if (!paroisseId) {
//         setError("ID de la paroisse non spécifié");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const data = await fetchParoisseDetails(parseInt(paroisseId));
//         console.log("📊 Données reçues:", data);
//         setParoisseDetails(data);
//       } catch (err) {
//         console.error("Erreur lors du chargement des détails:", err);
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
//           setError("Paroisse non trouvée.");
//         } else {
//           setError("Une erreur est survenue lors du chargement des données.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadParoisseDetails();
//   }, [paroisseId, router]);

//   // Filtrer les données selon la recherche
//   useEffect(() => {
//     if (!paroisseDetails) return;

//     const query = searchQuery.toLowerCase().trim();

//     // Filtrer les paroissiens
//     let paroissensResults = [...paroisseDetails.paroissiens];
//     if (query) {
//       paroissensResults = paroissensResults.filter(
//         (paroissien) =>
//           paroissien.nom?.toLowerCase().includes(query) ||
//           paroissien.prenoms?.toLowerCase().includes(query) ||
//           paroissien.num_de_telephone?.toLowerCase().includes(query) ||
//           paroissien.statut?.toLowerCase().includes(query)
//       );
//     }
//     setFilteredParoissiens(paroissensResults);
//     setCurrentPageParoissiens(1);
//     setTotalPagesParoissiens(
//       Math.ceil(paroissensResults.length / itemsPerPage)
//     );
//   }, [searchQuery, paroisseDetails, itemsPerPage]);

//   // Obtenir les éléments de la page courante pour les paroissiens
//   const getCurrentParoissiensItems = () => {
//     const startIndex = (currentPageParoissiens - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return filteredParoissiens.slice(startIndex, endIndex);
//   };

//   // Navigation de pagination pour les paroissiens
//   const goToNextPageParoissiens = () => {
//     if (currentPageParoissiens < totalPagesParoissiens) {
//       setCurrentPageParoissiens(currentPageParoissiens + 1);
//     }
//   };

//   const goToPreviousPageParoissiens = () => {
//     if (currentPageParoissiens > 1) {
//       setCurrentPageParoissiens(currentPageParoissiens - 1);
//     }
//   };

//   // Fonction pour nettoyer la recherche
//   const handleClearSearch = () => {
//     setSearchQuery("");
//   };

//   const formatExportDate = (): string => {
//     return new Intl.DateTimeFormat("fr-FR", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(new Date());
//   };

//   // Fonction pour nommer un curé
//   const handleNommerCure = async () => {
//     if (!serviteurId || !paroisseId) {
//       toast.error("Erreur", {
//         description: "Veuillez sélectionner un serviteur valide.",
//       });
//       return;
//     }

//     try {
//       setIsNominating(true);

//       const paroisseUpdated = await nommerCure(
//         parseInt(paroisseId),
//         parseInt(serviteurId)
//       );

//       // Recharger les détails de la paroisse pour voir les changements
//       const updatedDetails = await fetchParoisseDetails(parseInt(paroisseId));
//       setParoisseDetails(updatedDetails);

//       toast.success("Nomination réussie", {
//         description: "Le curé a été nommé avec succès pour cette paroisse.",
//       });

//       // Fermer le dialog et réinitialiser
//       setIsNominationDialogOpen(false);
//       setServiteurId("");
//     } catch (err) {
//       console.error("Erreur lors de la nomination:", err);

//       if (err instanceof AuthenticationError) {
//         toast.error("Session expirée", {
//           description: "Veuillez vous reconnecter pour continuer.",
//         });
//         router.push("/login");
//       } else if (err instanceof ForbiddenError) {
//         toast.error("Accès refusé", {
//           description:
//             "Vous n'avez pas les droits pour effectuer cette nomination.",
//         });
//       } else {
//         toast.error("Erreur de nomination", {
//           description: "Une erreur est survenue lors de la nomination du curé.",
//         });
//       }
//     } finally {
//       setIsNominating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center gap-4 mb-6">
//           <Skeleton className="h-10 w-10 rounded-lg" />
//           <div>
//             <Skeleton className="h-8 w-64 mb-2" />
//             <Skeleton className="h-4 w-48" />
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {Array(3)
//             .fill(0)
//             .map((_, index) => (
//               <Card key={index}>
//                 <CardContent className="p-6">
//                   <Skeleton className="h-12 w-12 rounded-xl mb-4" />
//                   <Skeleton className="h-6 w-32 mb-2" />
//                   <Skeleton className="h-8 w-16" />
//                 </CardContent>
//               </Card>
//             ))}
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//         <h3 className="text-lg font-medium text-slate-900 mb-2">
//           Impossible de charger les données
//         </h3>
//         <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">{error}</p>
//         <div className="flex gap-2 justify-center">
//           <Button
//             variant="outline"
//             className="cursor-pointer"
//             onClick={() => router.back()}
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Retour
//           </Button>
//           <Button onClick={() => window.location.reload()}>Réessayer</Button>
//         </div>
//       </div>
//     );
//   }

//   if (!paroisseDetails) {
//     return null;
//   }

//   // Calculer les statistiques
//   const getStatistics = () => {
//     const totalParoissiens = filteredParoissiens.length;
//     const paroissensAbornes = paroisseDetails.paroissiens.filter(
//       (p: { est_abonne: any }) => p.est_abonne
//     ).length;
//     const paroissiensBaptises = paroisseDetails.paroissiens.filter(
//       (p: { statut: string }) => p.statut?.toLowerCase().includes("baptis")
//     ).length;

//     return {
//       totalParoissiens,
//       paroissensAbornes,
//       paroissiensBaptises,
//     };
//   };

//   const stats = getStatistics();

//   return (
//     <div className="space-y-6">
//       {/* Header avec bouton retour */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="outline"
//             onClick={() => router.back()}
//             className="h-10 w-20 p-0 cursor-pointer"
//           >
//             <ArrowLeft className="h-4 w-4" /> Retour
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 mb-1">
//               <SafeValue>{paroisseDetails.paroisse.nom}</SafeValue> (
//               {paroisseDetails.paroisse.ville}{" "}
//               {paroisseDetails.paroisse.quartier} )
//             </h1>
//             <p className="text-slate-500">
//               Détails de la
//               <Badge
//                 className={
//                   paroisseDetails.paroisse.statut
//                     ?.toLowerCase()
//                     .includes("quasi")
//                     ? "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200"
//                     : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
//                 }
//               >
//                 {paroisseDetails.paroisse.statut}
//               </Badge>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <SafeStatsCard
//           title="Total Paroissiens"
//           value={stats.totalParoissiens}
//           icon={<Users size={24} />}
//           iconBgColor="bg-blue-50"
//           iconColor="text-blue-600"
//         />

//         <SafeStatsCard
//           title="Abonnés"
//           value={stats.paroissensAbornes}
//           icon={<CheckCircle size={24} />}
//           iconBgColor="bg-green-50"
//           iconColor="text-green-600"
//         />

//         <SafeStatsCard
//           title="Baptisés"
//           value={stats.paroissiensBaptises}
//           icon={<UserPlus size={24} />}
//           iconBgColor="bg-purple-50"
//           iconColor="text-purple-600"
//         />
//       </div>

//       {/* Barre de recherche */}
//       <SearchBar
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         totalParoissiens={paroisseDetails.paroissiens.length}
//         onClearSearch={handleClearSearch}
//       />

//       {/* Onglets modernisés */}
//       <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           {/* Header avec onglets */}
//           <div className="px-6 py-4 border-b border-slate-200">
//             <TabsList className="h-12 p-1 bg-slate-100 rounded-xl grid w-full grid-cols-2">
//               <TabsTrigger
//                 value="organisation"
//                 className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
//               >
//                 <Settings className="h-4 w-4 mr-2" />
//                 Organisation
//               </TabsTrigger>
//               <TabsTrigger
//                 value="paroissiens"
//                 className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
//               >
//                 <Users className="h-4 w-4 mr-2" />
//                 Paroissiens ({filteredParoissiens.length})
//               </TabsTrigger>
//             </TabsList>
//           </div>

//           {/* Contenu des onglets */}
//           <div className="p-6">
//             {/* Onglet Organisation */}
//             <TabsContent value="organisation" className="mt-0">
//               {!paroisseDetails.organisation ||
//               typeof paroisseDetails.organisation !== "object" ? (
//                 <div className="py-12 text-center">
//                   <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//                   <h3 className="text-lg font-medium text-slate-900 mb-2">
//                     Aucune organisation définie
//                   </h3>
//                   <p className="text-sm text-slate-500">
//                     Cette paroisse n'a pas encore d'organisation structurée.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   {/* Curé */}
//                   {paroisseDetails.organisation.cure ? (
//                     <Card className="border-blue-200 bg-blue-50/30">
//                       <CardContent className="p-6">
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="flex items-center">
//                             <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
//                               <Crown className="h-6 w-6 text-blue-700" />
//                             </div>
//                             <div>
//                               <h3 className="text-lg font-semibold text-slate-900">
//                                 Curé
//                               </h3>
//                               <p className="text-sm text-slate-600">
//                                 Responsable de la paroisse
//                               </p>
//                             </div>
//                           </div>

//                           {/* Bouton pour changer de curé */}
//                           <Dialog
//                             open={isNominationDialogOpen}
//                             onOpenChange={setIsNominationDialogOpen}
//                           >
//                             <DialogTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="h-8"
//                               >
//                                 <Edit className="h-4 w-4 mr-2" />
//                                 Changer
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent className="sm:max-w-md">
//                               <DialogHeader>
//                                 <DialogTitle>
//                                   Nommer un nouveau curé
//                                 </DialogTitle>
//                                 <DialogDescription>
//                                   Sélectionnez un serviteur pour le nommer comme
//                                   curé de cette paroisse.
//                                 </DialogDescription>
//                               </DialogHeader>
//                               <div className="grid gap-4 py-4">
//                                 <div className="grid gap-2">
//                                   <Label htmlFor="serviteur_id">
//                                     ID du Serviteur
//                                   </Label>
//                                   <Input
//                                     id="serviteur_id"
//                                     type="number"
//                                     placeholder="Entrez l'ID du serviteur"
//                                     value={serviteurId}
//                                     onChange={(e) =>
//                                       setServiteurId(e.target.value)
//                                     }
//                                     className="w-full"
//                                   />
//                                   <p className="text-xs text-slate-500">
//                                     Vous devez connaître l'ID du serviteur à
//                                     nommer.
//                                   </p>
//                                 </div>
//                               </div>
//                               <DialogFooter>
//                                 <Button
//                                   variant="outline"
//                                   onClick={() => {
//                                     setIsNominationDialogOpen(false);
//                                     setServiteurId("");
//                                   }}
//                                   disabled={isNominating}
//                                 >
//                                   Annuler
//                                 </Button>
//                                 <Button
//                                   onClick={handleNommerCure}
//                                   disabled={!serviteurId || isNominating}
//                                   className="bg-blue-600 hover:bg-blue-700"
//                                 >
//                                   {isNominating ? "Nomination..." : "Nommer"}
//                                 </Button>
//                               </DialogFooter>
//                             </DialogContent>
//                           </Dialog>
//                         </div>

//                         <div className="bg-white rounded-lg p-4 border border-blue-200">
//                           <h4 className="text-xl font-bold text-slate-800 mb-2">
//                             {getFullName(paroisseDetails.organisation.cure)}
//                           </h4>

//                           {paroisseDetails.organisation.cure
//                             .num_de_telephone && (
//                             <div className="flex items-center text-slate-600 mb-2">
//                               <Phone className="h-4 w-4 mr-2" />
//                               <span>
//                                 {
//                                   paroisseDetails.organisation.cure
//                                     .num_de_telephone
//                                 }
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ) : (
//                     // Affichage quand il n'y a pas de curé
//                     <Card className="border-gray-200 bg-gray-50/30">
//                       <CardContent className="p-6">
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="flex items-center">
//                             <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
//                               <Crown className="h-6 w-6 text-gray-500" />
//                             </div>
//                             <div>
//                               <h3 className="text-lg font-semibold text-slate-900">
//                                 Curé
//                               </h3>
//                               <p className="text-sm text-slate-600">
//                                 Aucun curé assigné
//                               </p>
//                             </div>
//                           </div>

//                           {/* Bouton pour nommer un curé */}
//                           <Dialog
//                             open={isNominationDialogOpen}
//                             onOpenChange={setIsNominationDialogOpen}
//                           >
//                             <DialogTrigger asChild>
//                               <Button
//                                 size="sm"
//                                 className="h-8 bg-blue-600 hover:bg-blue-700"
//                               >
//                                 <Plus className="h-4 w-4 mr-2" />
//                                 Nommer
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent className="sm:max-w-md">
//                               <DialogHeader>
//                                 <DialogTitle>Nommer un curé</DialogTitle>
//                                 <DialogDescription>
//                                   Sélectionnez un serviteur pour le nommer comme
//                                   curé de cette paroisse.
//                                 </DialogDescription>
//                               </DialogHeader>
//                               <div className="grid gap-4 py-4">
//                                 <div className="grid gap-2">
//                                   <Label htmlFor="serviteur_id">
//                                     ID du Serviteur
//                                   </Label>
//                                   <Input
//                                     id="serviteur_id"
//                                     type="number"
//                                     placeholder="Entrez l'ID du serviteur"
//                                     value={serviteurId}
//                                     onChange={(e) =>
//                                       setServiteurId(e.target.value)
//                                     }
//                                     className="w-full"
//                                   />
//                                   <p className="text-xs text-slate-500">
//                                     Vous devez connaître l'ID du serviteur à
//                                     nommer.
//                                   </p>
//                                 </div>
//                               </div>
//                               <DialogFooter>
//                                 <Button
//                                   variant="outline"
//                                   onClick={() => {
//                                     setIsNominationDialogOpen(false);
//                                     setServiteurId("");
//                                   }}
//                                   disabled={isNominating}
//                                 >
//                                   Annuler
//                                 </Button>
//                                 <Button
//                                   onClick={handleNommerCure}
//                                   disabled={!serviteurId || isNominating}
//                                   className="bg-blue-600 hover:bg-blue-700"
//                                 >
//                                   {isNominating ? "Nomination..." : "Nommer"}
//                                 </Button>
//                               </DialogFooter>
//                             </DialogContent>
//                           </Dialog>
//                         </div>

//                         <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
//                           <p className="text-slate-500">
//                             Cette paroisse n'a pas encore de curé assigné.
//                           </p>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   )}

//                   {/* Vicaires */}
//                   {paroisseDetails.organisation.vicaires &&
//                     Array.isArray(paroisseDetails.organisation.vicaires) &&
//                     paroisseDetails.organisation.vicaires.length > 0 && (
//                       <Card className="border-green-200 bg-green-50/30">
//                         <CardContent className="p-6">
//                           <div className="flex items-center mb-4">
//                             <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
//                               <Users className="h-6 w-6 text-green-700" />
//                             </div>
//                             <div>
//                               <h3 className="text-lg font-semibold text-slate-900">
//                                 Vicaires
//                               </h3>
//                               <p className="text-sm text-slate-600">
//                                 {paroisseDetails.organisation.vicaires.length}{" "}
//                                 vicaire(s)
//                               </p>
//                             </div>
//                           </div>

//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {paroisseDetails.organisation.vicaires.map(
//                               (vicaire: any, index: number) => (
//                                 <div
//                                   key={vicaire.id || index}
//                                   className="bg-white rounded-lg p-4 border border-green-200"
//                                 >
//                                   <div className="flex items-start">
//                                     <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
//                                       <User className="h-5 w-5 text-green-700" />
//                                     </div>
//                                     <div className="flex-1">
//                                       <h4 className="font-bold text-slate-800 mb-1">
//                                         {getFullName(vicaire)}
//                                       </h4>

//                                       {vicaire.num_de_telephone && (
//                                         <div className="flex items-center text-sm text-slate-600 mb-1">
//                                           <Phone className="h-3 w-3 mr-1" />
//                                           <span>
//                                             {vicaire.num_de_telephone}
//                                           </span>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </div>
//                               )
//                             )}
//                           </div>
//                         </CardContent>
//                       </Card>
//                     )}

//                   {/* Si aucune organisation */}
//                   {!paroisseDetails.organisation.cure &&
//                     (!paroisseDetails.organisation.vicaires ||
//                       !Array.isArray(paroisseDetails.organisation.vicaires) ||
//                       paroisseDetails.organisation.vicaires.length === 0) && (
//                       <div className="py-12 text-center">
//                         <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//                         <h3 className="text-lg font-medium text-slate-900 mb-2">
//                           Organisation incomplète
//                         </h3>
//                         <p className="text-sm text-slate-500 mb-4">
//                           Cette paroisse n'a pas encore d'organisation
//                           structurée.
//                         </p>
//                         <Dialog
//                           open={isNominationDialogOpen}
//                           onOpenChange={setIsNominationDialogOpen}
//                         >
//                           <DialogTrigger asChild>
//                             <Button className="bg-blue-600 hover:bg-blue-700">
//                               <Plus className="h-4 w-4 mr-2" />
//                               Nommer un curé
//                             </Button>
//                           </DialogTrigger>
//                           <DialogContent className="sm:max-w-md">
//                             <DialogHeader>
//                               <DialogTitle>Nommer un curé</DialogTitle>
//                               <DialogDescription>
//                                 Sélectionnez un serviteur pour le nommer comme
//                                 curé de cette paroisse.
//                               </DialogDescription>
//                             </DialogHeader>
//                             <div className="grid gap-4 py-4">
//                               <div className="grid gap-2">
//                                 <Label htmlFor="serviteur_id">
//                                   ID du Serviteur
//                                 </Label>
//                                 <Input
//                                   id="serviteur_id"
//                                   type="number"
//                                   placeholder="Entrez l'ID du serviteur"
//                                   value={serviteurId}
//                                   onChange={(e) =>
//                                     setServiteurId(e.target.value)
//                                   }
//                                   className="w-full"
//                                 />
//                                 <p className="text-xs text-slate-500">
//                                   Vous devez connaître l'ID du serviteur à
//                                   nommer.
//                                 </p>
//                               </div>
//                             </div>
//                             <DialogFooter>
//                               <Button
//                                 variant="outline"
//                                 onClick={() => {
//                                   setIsNominationDialogOpen(false);
//                                   setServiteurId("");
//                                 }}
//                                 disabled={isNominating}
//                               >
//                                 Annuler
//                               </Button>
//                               <Button
//                                 onClick={handleNommerCure}
//                                 disabled={!serviteurId || isNominating}
//                                 className="bg-blue-600 hover:bg-blue-700"
//                               >
//                                 {isNominating ? "Nomination..." : "Nommer"}
//                               </Button>
//                             </DialogFooter>
//                           </DialogContent>
//                         </Dialog>
//                       </div>
//                     )}
//                 </div>
//               )}
//             </TabsContent>

//             {/* Onglet Paroissiens */}
//             <TabsContent value="paroissiens" className="mt-0">
//               {filteredParoissiens.length === 0 ? (
//                 <EmptyTabContent
//                   type="Paroissien"
//                   icon={Users}
//                   searchQuery={searchQuery}
//                   onClearSearch={handleClearSearch}
//                 />
//               ) : (
//                 <div className="overflow-hidden rounded-lg border border-slate-200">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="border-slate-200 hover:bg-transparent">
//                         <TableHead className="font-semibold text-slate-700 py-3 px-4">
//                           Paroissien
//                         </TableHead>
//                         <TableHead className="font-semibold text-slate-700 py-3 px-4">
//                           Contact
//                         </TableHead>
//                         <TableHead className="font-semibold text-slate-700 py-3 px-4">
//                           Genre
//                         </TableHead>
//                         <TableHead className="font-semibold text-slate-700 py-3 px-4">
//                           Statut
//                         </TableHead>
//                         <TableHead className="font-semibold text-slate-700 py-3 px-4">
//                           Abonnement
//                         </TableHead>
//                         <TableHead className="font-semibold text-slate-700 py-3 px-4 text-right">
//                           Actions
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {getCurrentParoissiensItems().map((paroissien) => (
//                         <TableRow
//                           key={paroissien.id}
//                           className="border-slate-200 hover:bg-slate-50/50 transition-colors"
//                         >
//                           <TableCell className="py-3 px-4">
//                             <div className="flex items-center">
//                               <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3">
//                                 {paroissien.photo?.url ? (
//                                   <img
//                                     src={paroissien.photo.url}
//                                     alt={`${paroissien.prenoms} ${paroissien.nom}`}
//                                     className="h-10 w-10 rounded-full object-cover"
//                                   />
//                                 ) : (
//                                   <span className="text-white font-medium text-sm">
//                                     {paroissien.prenoms?.[0]?.toUpperCase()}
//                                     {paroissien.nom?.[0]?.toUpperCase()}
//                                   </span>
//                                 )}
//                               </div>
//                               <div>
//                                 <span className="font-medium text-slate-900">
//                                   {paroissien.prenoms} {paroissien.nom}
//                                 </span>
//                               </div>
//                             </div>
//                           </TableCell>

//                           <TableCell className="py-3 px-4">
//                             <div className="flex items-center text-slate-600">
//                               <Phone className="h-4 w-4 mr-2 text-slate-400" />
//                               <span>
//                                 {paroissien.num_de_telephone || "Non renseigné"}
//                               </span>
//                             </div>
//                           </TableCell>

//                           <TableCell className="py-3 px-4">
//                             <Badge
//                               className={
//                                 paroissien.genre === "M"
//                                   ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
//                                   : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
//                               }
//                             >
//                               {formatGenre(paroissien.genre)}
//                             </Badge>
//                           </TableCell>

//                           <TableCell className="py-3 px-4">
//                             <Badge
//                               className={
//                                 paroissien.statut
//                                   ?.toLowerCase()
//                                   .includes("baptis")
//                                   ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
//                                   : paroissien.statut === "Aucun"
//                                     ? "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
//                                     : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
//                               }
//                             >
//                               {paroissien.statut || "Non défini"}
//                             </Badge>
//                           </TableCell>

//                           <TableCell className="py-3 px-4">
//                             <div className="flex items-center">
//                               {paroissien.est_abonne ? (
//                                 <div className="flex items-center text-green-600">
//                                   <CheckCircle className="h-4 w-4 mr-2" />
//                                   <div>
//                                     <span className="font-medium">Abonné</span>
//                                     {paroissien.date_de_fin_abonnement && (
//                                       <div className="text-xs text-slate-500">
//                                         Jusqu'au{" "}
//                                         {new Date(
//                                           paroissien.date_de_fin_abonnement
//                                         ).toLocaleDateString("fr-FR")}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <div className="flex items-center text-slate-500">
//                                   <XIcon className="h-4 w-4 mr-2" />
//                                   <span>Non abonné</span>
//                                 </div>
//                               )}
//                             </div>
//                           </TableCell>

//                           <TableCell className="py-3 px-4 text-right">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
//                               onClick={() =>
//                                 router.push(
//                                   `/dashboard/diocese/paroissiens/${paroissien.id}`
//                                 )
//                               }
//                               title="Voir les détails du paroissien"
//                             >
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>

//                   {/* Pagination pour les paroissiens */}
//                   <PaginationControls
//                     currentPage={currentPageParoissiens}
//                     totalPages={totalPagesParoissiens}
//                     itemsPerPage={itemsPerPage}
//                     totalItems={filteredParoissiens.length}
//                     onPreviousPage={goToPreviousPageParoissiens}
//                     onNextPage={goToNextPageParoissiens}
//                     type="paroissien"
//                   />
//                 </div>
//               )}
//             </TabsContent>
//           </div>
//         </Tabs>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import {
//   ArrowLeft,
//   MapPin,
//   Users,
//   Building2,
//   Crown,
//   Church,
//   Calendar,
//   XCircle,
//   Eye,
//   Phone,
//   Mail,
//   Download,
//   FileSpreadsheet,
//   FileDown,
//   Home,
//   Search,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   UserCheck,
//   Settings,
//   UserPlus,
//   CheckCircle,
//   XIcon,
//   Plus,
//   Edit,
//   Star,
//   Activity,
//   MoreVertical, // AJOUT
//   Trash2, // AJOUT
//   Loader2, // AJOUT
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import {
//   fetchParoisseDetails,
//   ParoisseDetails,
//   formatTimestamp,
//   getFullName,
//   formatLocalisation,
//   formatGenre,
//   formatStatutAbonnement,
//   formatTypeMouvement,
//   formatTypeEvenement,
//   nommerCure,
//   affecterVicaire,
//   ApiError,
//   AuthenticationError,
//   ForbiddenError,
//   NotFoundError,
//   ValidationError, // AJOUT
//   Mouvement,
//   Ceb,
//   Evenement,
//   Vicaire,
//   getTotalResponsables,
// } from "@/services/ParoiseofDiocese";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// // Fonctions utilitaires
// const sanitizeForRender = (value: any): string | number => {
//   if (value === null || value === undefined) {
//     return "N/A";
//   }

//   if (
//     typeof value === "string" ||
//     typeof value === "number" ||
//     typeof value === "boolean"
//   ) {
//     return String(value);
//   }

//   if (typeof value === "object") {
//     // Gestion spécifique des objets de localisation
//     if (value.type && value.data && value.data.lat && value.data.lng) {
//       return `${value.data.lat.toFixed(5)}, ${value.data.lng.toFixed(5)}`;
//     }

//     if (value.url) {
//       return value.url;
//     }

//     if (value.nom) {
//       return value.nom;
//     }

//     try {
//       const keys = Object.keys(value);
//       if (keys.length === 0) return "N/A";
//       return `[Objet: ${keys.join(", ")}]`;
//     } catch (error) {
//       return "[Objet complexe]";
//     }
//   }

//   return String(value);
// };

// const formatDate = (timestamp: string | number | null | undefined): string => {
//   return formatTimestamp(timestamp);
// };

// // Interfaces
// interface StatsCardProps {
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   iconBgColor: string;
//   iconColor: string;
// }

// // Composants
// const SafeStatsCard = ({
//   title,
//   value,
//   icon,
//   iconBgColor,
//   iconColor,
// }: StatsCardProps) => {
//   const safeValue = sanitizeForRender(value);

//   return (
//     <Card className="relative overflow-hidden border-0 shadow-sm bg-card transition-shadow duration-200">
//       <CardContent className="p-y-1">
//         <div className="flex items-center gap-3 mb-4">
//           <div
//             className={`h-3 w-12 rounded-xl ${iconBgColor} flex items-center justify-center`}
//           >
//             <div className={iconColor}>{icon}</div>
//           </div>
//           <h3 className="text-sm font-medium text-muted-foreground mb-2">
//             {title}
//           </h3>
//         </div>
//         <div className="flex items-end justify-between">
//           <div className="text-xl font-bold text-card-foreground">
//             {safeValue}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const SafeValue = ({
//   children,
//   className = "",
// }: {
//   children: any;
//   className?: string;
// }) => {
//   const safeContent = sanitizeForRender(children);
//   return <span className={className}>{safeContent}</span>;
// };

// // Composant pour la barre de recherche
// const SearchBar = ({
//   searchQuery,
//   setSearchQuery,
//   totalItems,
//   onClearSearch,
//   placeholder = "Rechercher...",
// }: {
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   totalItems: number;
//   onClearSearch: () => void;
//   placeholder?: string;
// }) => (
//   <Card className="bg-white border-slate-200 mb-6">
//     <CardContent className="p-6">
//       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//         <div className="flex-1 max-w-md">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <Input
//               type="text"
//               placeholder={placeholder}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 pr-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
//             />
//             {searchQuery && (
//               <button
//                 onClick={onClearSearch}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-slate-600"
//               >
//                 <X size={16} />
//               </button>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center gap-4 text-sm text-slate-500">
//           <span>{totalItems} élément(s)</span>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

// // Composant pour la pagination
// const PaginationControls = ({
//   currentPage,
//   totalPages,
//   itemsPerPage,
//   totalItems,
//   onPreviousPage,
//   onNextPage,
//   type,
// }: {
//   currentPage: number;
//   totalPages: number;
//   itemsPerPage: number;
//   totalItems: number;
//   onPreviousPage: () => void;
//   onNextPage: () => void;
//   type: string;
// }) => {
//   if (totalItems <= itemsPerPage) return null;

//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   return (
//     <div className="flex items-center justify-between px-2 py-4 border-t border-slate-200 bg-slate-50/50">
//       <div className="text-sm text-slate-500">
//         Affichage de {startItem} à {endItem} sur {totalItems} {type}(s)
//       </div>
//       <div className="flex items-center gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={onPreviousPage}
//           disabled={currentPage === 1}
//           className="h-8 px-3 cursor-pointer"
//         >
//           <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={onNextPage}
//           disabled={currentPage === totalPages}
//           className="h-8 px-3 cursor-pointer"
//         >
//           Suivant <ChevronRight className="h-4 w-4 ml-1" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// // Composant pour les onglets vides avec recherche
// const EmptyTabContent = ({
//   type,
//   icon: Icon,
//   searchQuery,
//   onClearSearch,
// }: {
//   type: string;
//   icon: React.ComponentType<any>;
//   searchQuery: string;
//   onClearSearch: () => void;
// }) => (
//   <div className="py-12 text-center">
//     <Icon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//     {searchQuery ? (
//       <>
//         <h3 className="text-lg font-medium text-slate-900 mb-2">
//           Aucun résultat trouvé
//         </h3>
//         <p className="text-sm text-slate-500 mb-4">
//           Aucun {type.toLowerCase()} ne correspond à votre recherche "
//           {searchQuery}".
//         </p>
//         <Button variant="outline" onClick={onClearSearch} className="mx-auto">
//           <X className="h-4 w-4 mr-2" />
//           Effacer la recherche
//         </Button>
//       </>
//     ) : (
//       <>
//         <h3 className="text-lg font-medium text-slate-900 mb-2">
//           Aucun {type.toLowerCase()} trouvé
//         </h3>
//         <p className="text-sm text-slate-500">
//           Cette paroisse ne contient encore aucun {type.toLowerCase()}.
//         </p>
//       </>
//     )}
//   </div>
// );

// export default function ParoisseDetailsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const paroisseId = params?.id as string;

//   const [paroisseDetails, setParoisseDetails] =
//     useState<ParoisseDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState("organisation");

//   // États pour la recherche
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredParoissiens, setFilteredParoissiens] = useState<any[]>([]);
//   const [filteredMouvements, setFilteredMouvements] = useState<Mouvement[]>([]);
//   const [filteredCebs, setFilteredCebs] = useState<Ceb[]>([]);
//   const [filteredEvenements, setFilteredEvenements] = useState<Evenement[]>([]);

//   // États pour la pagination
//   const [currentPageParoissiens, setCurrentPageParoissiens] = useState(1);
//   const [currentPageMouvements, setCurrentPageMouvements] = useState(1);
//   const [currentPageCebs, setCurrentPageCebs] = useState(1);
//   const [currentPageEvenements, setCurrentPageEvenements] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // États pour la nomination
//   const [isNominationDialogOpen, setIsNominationDialogOpen] = useState(false);
//   const [serviteurId, setServiteurId] = useState("");
//   const [isNominating, setIsNominating] = useState(false);

//   // États pour l'affectation d'un vicaire
//   const [isVicaireDialogOpen, setIsVicaireDialogOpen] = useState(false);
//   const [vicaireServiteurId, setVicaireServiteurId] = useState("");
//   const [isAffectingVicaire, setIsAffectingVicaire] = useState(false);

//   // Charger les détails de la paroisse au montage du composant
//   useEffect(() => {
//     const loadParoisseDetails = async () => {
//       if (!paroisseId) {
//         setError("ID de la paroisse non spécifié");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const data = await fetchParoisseDetails(parseInt(paroisseId));
//         console.log("📊 Données reçues:", data);
//         setParoisseDetails(data);
//       } catch (err) {
//         console.error("Erreur lors du chargement des détails:", err);
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
//           setError("Paroisse non trouvée.");
//         } else {
//           setError("Une erreur est survenue lors du chargement des données.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadParoisseDetails();
//   }, [paroisseId, router]);

//   // Filtrer les données selon la recherche
//   useEffect(() => {
//     if (!paroisseDetails) return;

//     const query = searchQuery.toLowerCase().trim();

//     // Filtrer les paroissiens
//     let paroissensResults = [...paroisseDetails.paroissiens];
//     if (query) {
//       paroissensResults = paroissensResults.filter(
//         (paroissien) =>
//           paroissien.nom?.toLowerCase().includes(query) ||
//           paroissien.prenoms?.toLowerCase().includes(query) ||
//           paroissien.num_de_telephone?.toLowerCase().includes(query) ||
//           paroissien.statut?.toLowerCase().includes(query)
//       );
//     }
//     setFilteredParoissiens(paroissensResults);

//     // Filtrer les mouvements
//     let mouvementsResults = [...paroisseDetails.mouvements];
//     if (query) {
//       mouvementsResults = mouvementsResults.filter(
//         (mouvement) =>
//           mouvement.nom?.toLowerCase().includes(query) ||
//           mouvement.type?.toLowerCase().includes(query) ||
//           mouvement.identifiant?.toLowerCase().includes(query) ||
//           getFullName(mouvement.responsable)?.toLowerCase().includes(query) ||
//           getFullName(mouvement.aumonier)?.toLowerCase().includes(query)
//       );
//     }
//     setFilteredMouvements(mouvementsResults);

//     // Filtrer les CEBs
//     let cebsResults = [...paroisseDetails.cebs];
//     if (query) {
//       cebsResults = cebsResults.filter(
//         (ceb) =>
//           ceb.nom?.toLowerCase().includes(query) ||
//           ceb.identifiant?.toLowerCase().includes(query) ||
//           getFullName(ceb.president)?.toLowerCase().includes(query)
//       );
//     }
//     setFilteredCebs(cebsResults);

//     // Filtrer les événements
//     let evenementsResults = [...paroisseDetails.evenements];
//     if (query) {
//       evenementsResults = evenementsResults.filter(
//         (evenement) =>
//           evenement.libelle?.toLowerCase().includes(query) ||
//           evenement.type?.toLowerCase().includes(query)
//       );
//     }
//     setFilteredEvenements(evenementsResults);

//     // Réinitialiser les pages
//     setCurrentPageParoissiens(1);
//     setCurrentPageMouvements(1);
//     setCurrentPageCebs(1);
//     setCurrentPageEvenements(1);
//   }, [searchQuery, paroisseDetails]);

//   // Fonction pour nettoyer la recherche
//   const handleClearSearch = () => {
//     setSearchQuery("");
//   };

//   // Fonction pour nommer un curé
//   const handleNommerCure = async () => {
//     if (!serviteurId || !paroisseId) {
//       toast.error("Erreur", {
//         description: "Veuillez sélectionner un serviteur valide.",
//       });
//       return;
//     }

//     try {
//       setIsNominating(true);

//       await nommerCure(parseInt(paroisseId), parseInt(serviteurId));

//       // Recharger les détails de la paroisse pour voir les changements
//       const updatedDetails = await fetchParoisseDetails(parseInt(paroisseId));
//       setParoisseDetails(updatedDetails);

//       toast.success("Nomination réussie", {
//         description: "Le curé a été nommé avec succès pour cette paroisse.",
//       });

//       // Fermer le dialog et réinitialiser
//       setIsNominationDialogOpen(false);
//       setServiteurId("");
//     } catch (err) {
//       console.error("Erreur lors de la nomination:", err);

//       if (err instanceof AuthenticationError) {
//         toast.error("Session expirée", {
//           description: "Veuillez vous reconnecter pour continuer.",
//         });
//         router.push("/login");
//       } else if (err instanceof ForbiddenError) {
//         toast.error("Accès refusé", {
//           description:
//             "Vous n'avez pas les droits pour effectuer cette nomination.",
//         });
//       } else {
//         toast.error("Erreur de nomination", {
//           description: "Une erreur est survenue lors de la nomination du curé.",
//         });
//       }
//     } finally {
//       setIsNominating(false);
//     }
//   };

//   // Fonction pour affecter un vicaire
//   const handleAffecterVicaire = async () => {
//     if (!vicaireServiteurId || !paroisseId) {
//       toast.error("Erreur", {
//         description: "Veuillez sélectionner un serviteur valide.",
//       });
//       return;
//     }

//     try {
//       setIsAffectingVicaire(true);

//       await affecterVicaire(parseInt(paroisseId), parseInt(vicaireServiteurId));

//       // Recharger les détails de la paroisse pour voir les changements
//       const updatedDetails = await fetchParoisseDetails(parseInt(paroisseId));
//       setParoisseDetails(updatedDetails);

//       toast.success("Affectation réussie", {
//         description: "Le vicaire a été affecté avec succès à cette paroisse.",
//       });

//       // Fermer le dialog et réinitialiser
//       setIsVicaireDialogOpen(false);
//       setVicaireServiteurId("");
//     } catch (err) {
//       console.error("Erreur lors de l'affectation:", err);

//       if (err instanceof AuthenticationError) {
//         toast.error("Session expirée", {
//           description: "Veuillez vous reconnecter pour continuer.",
//         });
//         router.push("/login");
//       } else if (err instanceof ForbiddenError) {
//         toast.error("Accès refusé", {
//           description:
//             "Vous n'avez pas les droits pour effectuer cette affectation.",
//         });
//       } else if (err instanceof ValidationError) {
//         toast.error("Données invalides", {
//           description: "Les données fournies ne sont pas valides.",
//         });
//       } else {
//         toast.error("Erreur d'affectation", {
//           description:
//             "Une erreur est survenue lors de l'affectation du vicaire.",
//         });
//       }
//     } finally {
//       setIsAffectingVicaire(false);
//     }
//   };

//   // Fonctions de pagination
//   const getPaginatedItems = (items: any[], currentPage: number) => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return items.slice(startIndex, endIndex);
//   };

//   const getTotalPages = (totalItems: number) => {
//     return Math.ceil(totalItems / itemsPerPage);
//   };

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center gap-4 mb-6">
//           <Skeleton className="h-10 w-10 rounded-lg" />
//           <div>
//             <Skeleton className="h-8 w-64 mb-2" />
//             <Skeleton className="h-4 w-48" />
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {Array(4)
//             .fill(0)
//             .map((_, index) => (
//               <Card key={index}>
//                 <CardContent className="p-6">
//                   <Skeleton className="h-12 w-12 rounded-xl mb-4" />
//                   <Skeleton className="h-6 w-32 mb-2" />
//                   <Skeleton className="h-8 w-16" />
//                 </CardContent>
//               </Card>
//             ))}
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//         <h3 className="text-lg font-medium text-slate-900 mb-2">
//           Impossible de charger les données
//         </h3>
//         <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">{error}</p>
//         <div className="flex gap-2 justify-center">
//           <Button
//             variant="outline"
//             className="cursor-pointer"
//             onClick={() => router.back()}
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Retour
//           </Button>
//           <Button onClick={() => window.location.reload()}>Réessayer</Button>
//         </div>
//       </div>
//     );
//   }

//   if (!paroisseDetails) {
//     return null;
//   }

//   // Calculer les statistiques
//   const getStatistics = () => {
//     const totalParoissiens = paroisseDetails.paroissiens.length;
//     const paroissensAbornes = paroisseDetails.paroissiens.filter(
//       (p) => p.est_abonne
//     ).length;
//     const paroissiensBaptises = paroisseDetails.paroissiens.filter((p) =>
//       p.statut?.toLowerCase().includes("baptis")
//     ).length;
//     const totalMouvements = paroisseDetails.mouvements.length;
//     const totalCebs = paroisseDetails.cebs.length;
//     const totalEvenements = paroisseDetails.evenements.length;

//     return {
//       totalParoissiens,
//       paroissensAbornes,
//       paroissiensBaptises,
//       totalMouvements,
//       totalCebs,
//       totalEvenements,
//     };
//   };

//   const stats = getStatistics();

//   return (
//     <div className="space-y-6">
//       {/* Header avec bouton retour */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="outline"
//             onClick={() => router.back()}
//             className="h-10 w-20 p-0 cursor-pointer"
//           >
//             <ArrowLeft className="h-4 w-4" /> Retour
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 mb-1">
//               <SafeValue>{paroisseDetails.paroisse.nom}</SafeValue>
//             </h1>
//             {/* Correction : Utiliser div au lieu de p pour éviter l'erreur d'imbrication */}
//             <div className="text-slate-500 flex items-center gap-2">
//               <span>
//                 <SafeValue>{paroisseDetails.paroisse.quartier}</SafeValue>,{" "}
//                 <SafeValue>{paroisseDetails.paroisse.ville}</SafeValue>
//               </span>
//               <span>•</span>
//               <Badge
//                 className={
//                   paroisseDetails.paroisse.statut
//                     ?.toLowerCase()
//                     .includes("quasi")
//                     ? "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200"
//                     : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
//                 }
//               >
//                 {paroisseDetails.paroisse.statut}
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <SafeStatsCard
//           title="Total Paroissiens"
//           value={stats.totalParoissiens}
//           icon={<Users size={24} />}
//           iconBgColor="bg-blue-50"
//           iconColor="text-blue-600"
//         />

//         <SafeStatsCard
//           title="Mouvements"
//           value={stats.totalMouvements}
//           icon={<Star size={24} />}
//           iconBgColor="bg-green-50"
//           iconColor="text-green-600"
//         />

//         <SafeStatsCard
//           title="CEBs"
//           value={stats.totalCebs}
//           icon={<Building2 size={24} />}
//           iconBgColor="bg-purple-50"
//           iconColor="text-purple-600"
//         />

//         <SafeStatsCard
//           title="Événements"
//           value={stats.totalEvenements}
//           icon={<Activity size={24} />}
//           iconBgColor="bg-orange-50"
//           iconColor="text-orange-600"
//         />
//       </div>

//       {/* Barre de recherche */}
//       <SearchBar
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         totalItems={
//           activeTab === "paroissiens"
//             ? filteredParoissiens.length
//             : activeTab === "mouvements"
//               ? filteredMouvements.length
//               : activeTab === "cebs"
//                 ? filteredCebs.length
//                 : activeTab === "evenements"
//                   ? filteredEvenements.length
//                   : 0
//         }
//         onClearSearch={handleClearSearch}
//         placeholder={
//           activeTab === "paroissiens"
//             ? "Rechercher par nom, prénom, téléphone..."
//             : activeTab === "mouvements"
//               ? "Rechercher par nom, type, responsable..."
//               : activeTab === "cebs"
//                 ? "Rechercher par nom, identifiant..."
//                 : activeTab === "evenements"
//                   ? "Rechercher par libellé, type..."
//                   : "Rechercher..."
//         }
//       />

//       {/* Onglets modernisés */}
//       <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           {/* Header avec onglets */}
//           <div className="px-6 py-4 border-b border-slate-200">
//             <TabsList className="h-12 p-1 bg-slate-100 rounded-xl grid w-full grid-cols-5">
//               <TabsTrigger
//                 value="organisation"
//                 className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
//               >
//                 <Settings className="h-4 w-4 mr-2" />
//                 Organisation
//               </TabsTrigger>
//               <TabsTrigger
//                 value="paroissiens"
//                 className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
//               >
//                 <Users className="h-4 w-4 mr-2" />
//                 Paroissiens ({filteredParoissiens.length})
//               </TabsTrigger>
//               <TabsTrigger
//                 value="mouvements"
//                 className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
//               >
//                 <Star className="h-4 w-4 mr-2" />
//                 Mouvements ({filteredMouvements.length})
//               </TabsTrigger>
//               <TabsTrigger
//                 value="cebs"
//                 className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
//               >
//                 <Building2 className="h-4 w-4 mr-2" />
//                 CEBs ({filteredCebs.length})
//               </TabsTrigger>
//               <TabsTrigger
//                 value="evenements"
//                 className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
//               >
//                 <Activity className="h-4 w-4 mr-2" />
//                 Événements ({filteredEvenements.length})
//               </TabsTrigger>
//             </TabsList>
//           </div>

//           {/* Contenu des onglets */}
//           <div className="p-6">
//             {/* Onglet Organisation */}
//             <TabsContent value="organisation" className="mt-0">
//               <div className="space-y-6">
//                 {/* Structure d'organisation */}
//                 {paroisseDetails.organisation ? (
//                   <div className="space-y-6">
//                     {/* Curé */}
//                     {paroisseDetails.organisation.cure ? (
//                       <Card className="border-blue-200 bg-blue-50/30">
//                         <CardContent className="p-6">
//                           <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center">
//                               <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
//                                 <Crown className="h-6 w-6 text-blue-700" />
//                               </div>
//                               <div>
//                                 <h3 className="text-lg font-semibold text-slate-900">
//                                   Curé
//                                 </h3>
//                                 <p className="text-sm text-slate-600">
//                                   Responsable de la paroisse
//                                 </p>
//                               </div>
//                             </div>

//                             {/* Bouton pour changer de curé */}
//                             <Dialog
//                               open={isNominationDialogOpen}
//                               onOpenChange={setIsNominationDialogOpen}
//                             >
//                               <DialogTrigger asChild>
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   className="h-8 cursor-pointer"
//                                 >
//                                   <Edit className="h-4 w-4 mr-2" />
//                                   Changer
//                                 </Button>
//                               </DialogTrigger>
//                               <DialogContent className="sm:max-w-md">
//                                 <DialogHeader>
//                                   <DialogTitle className="flex items-center gap-2">
//                                     <Crown className="h-5 w-5 text-blue-500" />
//                                     Nommer un nouveau curé
//                                   </DialogTitle>
//                                   <DialogDescription>
//                                     Sélectionnez un serviteur pour le nommer
//                                     comme curé de cette paroisse.
//                                   </DialogDescription>
//                                 </DialogHeader>
//                                 <div className="grid gap-4 py-4">
//                                   <div className="grid gap-2">
//                                     <Label htmlFor="serviteur_id">
//                                       ID du Serviteur
//                                     </Label>
//                                     <Input
//                                       id="serviteur_id"
//                                       type="number"
//                                       placeholder="Entrez l'ID du serviteur"
//                                       value={serviteurId}
//                                       onChange={(e) =>
//                                         setServiteurId(e.target.value)
//                                       }
//                                       className="w-full"
//                                       disabled={isNominating}
//                                     />
//                                     <p className="text-xs text-slate-500">
//                                       Vous devez connaître l'ID du serviteur à
//                                       nommer.
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <DialogFooter>
//                                   <Button
//                                     variant="outline"
//                                     onClick={() => {
//                                       setIsNominationDialogOpen(false);
//                                       setServiteurId("");
//                                     }}
//                                     disabled={isNominating}
//                                   >
//                                     Annuler
//                                   </Button>
//                                   <Button
//                                     onClick={handleNommerCure}
//                                     disabled={!serviteurId || isNominating}
//                                     className="bg-blue-600 hover:bg-blue-700"
//                                   >
//                                     {isNominating ? (
//                                       <>
//                                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                         Nomination...
//                                       </>
//                                     ) : (
//                                       "Nommer"
//                                     )}
//                                   </Button>
//                                 </DialogFooter>
//                               </DialogContent>
//                             </Dialog>
//                           </div>

//                           <div className="bg-white rounded-lg p-4 border border-blue-200">
//                             <h4 className="text-xl font-bold text-slate-800 mb-2">
//                               {getFullName(paroisseDetails.organisation.cure)}
//                             </h4>

//                             {paroisseDetails.organisation.cure
//                               .num_de_telephone && (
//                               <div className="flex items-center text-slate-600 mb-2">
//                                 <Phone className="h-4 w-4 mr-2" />
//                                 <span>
//                                   {
//                                     paroisseDetails.organisation.cure
//                                       .num_de_telephone
//                                   }
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ) : (
//                       // Affichage quand il n'y a pas de curé
//                       <Card className="border-gray-200 bg-gray-50/30">
//                         <CardContent className="p-6">
//                           <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center">
//                               <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
//                                 <Crown className="h-6 w-6 text-gray-500" />
//                               </div>
//                               <div>
//                                 <h3 className="text-lg font-semibold text-slate-900">
//                                   Curé
//                                 </h3>
//                                 <p className="text-sm text-slate-600">
//                                   Aucun curé assigné
//                                 </p>
//                               </div>
//                             </div>

//                             {/* Bouton pour nommer un curé */}
//                             <Dialog
//                               open={isNominationDialogOpen}
//                               onOpenChange={setIsNominationDialogOpen}
//                             >
//                               <DialogTrigger asChild>
//                                 <Button
//                                   size="sm"
//                                   className="h-8 bg-blue-600 hover:bg-blue-700"
//                                 >
//                                   <Plus className="h-4 w-4 mr-2" />
//                                   Nommer
//                                 </Button>
//                               </DialogTrigger>
//                               <DialogContent className="sm:max-w-md">
//                                 <DialogHeader>
//                                   <DialogTitle className="flex items-center gap-2">
//                                     <Crown className="h-5 w-5 text-blue-500" />
//                                     Nommer un curé
//                                   </DialogTitle>
//                                   <DialogDescription>
//                                     Sélectionnez un serviteur pour le nommer
//                                     comme curé de cette paroisse.
//                                   </DialogDescription>
//                                 </DialogHeader>
//                                 <div className="grid gap-4 py-4">
//                                   <div className="grid gap-2">
//                                     <Label htmlFor="serviteur_id_empty">
//                                       ID du Serviteur
//                                     </Label>
//                                     <Input
//                                       id="serviteur_id_empty"
//                                       type="number"
//                                       placeholder="Entrez l'ID du serviteur"
//                                       value={serviteurId}
//                                       onChange={(e) =>
//                                         setServiteurId(e.target.value)
//                                       }
//                                       className="w-full"
//                                       disabled={isNominating}
//                                     />
//                                     <p className="text-xs text-slate-500">
//                                       Vous devez connaître l'ID du serviteur à
//                                       nommer.
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <DialogFooter>
//                                   <Button
//                                     variant="outline"
//                                     onClick={() => {
//                                       setIsNominationDialogOpen(false);
//                                       setServiteurId("");
//                                     }}
//                                     disabled={isNominating}
//                                   >
//                                     Annuler
//                                   </Button>
//                                   <Button
//                                     onClick={handleNommerCure}
//                                     disabled={!serviteurId || isNominating}
//                                     className="bg-blue-600 hover:bg-blue-700"
//                                   >
//                                     {isNominating ? (
//                                       <>
//                                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                         Nomination...
//                                       </>
//                                     ) : (
//                                       "Nommer"
//                                     )}
//                                   </Button>
//                                 </DialogFooter>
//                               </DialogContent>
//                             </Dialog>
//                           </div>

//                           <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
//                             <p className="text-slate-500">
//                               Cette paroisse n'a pas encore de curé assigné.
//                             </p>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     )}

//                     {/* Vicaires - SECTION MISE À JOUR */}
//                     {paroisseDetails.organisation.vicaires &&
//                     Array.isArray(paroisseDetails.organisation.vicaires) &&
//                     paroisseDetails.organisation.vicaires.length > 0 ? (
//                       <Card className="border-green-200 bg-green-50/30">
//                         <CardContent className="p-6">
//                           <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center">
//                               <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
//                                 <Users className="h-6 w-6 text-green-700" />
//                               </div>
//                               <div>
//                                 <h3 className="text-lg font-semibold text-slate-900">
//                                   Vicaires
//                                 </h3>
//                                 <p className="text-sm text-slate-600">
//                                   {paroisseDetails.organisation.vicaires.length}{" "}
//                                   vicaire(s)
//                                 </p>
//                               </div>
//                             </div>

//                             {/* Bouton pour ajouter un vicaire */}
//                             <Dialog
//                               open={isVicaireDialogOpen}
//                               onOpenChange={setIsVicaireDialogOpen}
//                             >
//                               <DialogTrigger asChild>
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   className="h-8"
//                                 >
//                                   <Plus className="h-4 w-4 mr-2" />
//                                   Ajouter
//                                 </Button>
//                               </DialogTrigger>
//                               <DialogContent className="sm:max-w-md">
//                                 <DialogHeader>
//                                   <DialogTitle className="flex items-center gap-2">
//                                     <Users className="h-5 w-5 text-green-600" />
//                                     Affecter un vicaire
//                                   </DialogTitle>
//                                   <DialogDescription>
//                                     Sélectionnez un serviteur pour l'affecter
//                                     comme vicaire à cette paroisse.
//                                   </DialogDescription>
//                                 </DialogHeader>
//                                 <div className="grid gap-4 py-4">
//                                   <div className="grid gap-2">
//                                     <Label htmlFor="vicaire_serviteur_id">
//                                       ID du Serviteur
//                                     </Label>
//                                     <Input
//                                       id="vicaire_serviteur_id"
//                                       type="number"
//                                       placeholder="Entrez l'ID du serviteur"
//                                       value={vicaireServiteurId}
//                                       onChange={(e) =>
//                                         setVicaireServiteurId(e.target.value)
//                                       }
//                                       className="w-full"
//                                       disabled={isAffectingVicaire}
//                                     />
//                                     <p className="text-xs text-slate-500">
//                                       Vous devez connaître l'ID du serviteur à
//                                       affecter comme vicaire.
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <DialogFooter>
//                                   <Button
//                                     variant="outline"
//                                     onClick={() => {
//                                       setIsVicaireDialogOpen(false);
//                                       setVicaireServiteurId("");
//                                     }}
//                                     disabled={isAffectingVicaire}
//                                   >
//                                     Annuler
//                                   </Button>
//                                   <Button
//                                     onClick={handleAffecterVicaire}
//                                     disabled={
//                                       !vicaireServiteurId || isAffectingVicaire
//                                     }
//                                     className="bg-green-600 hover:bg-green-700"
//                                   >
//                                     {isAffectingVicaire ? (
//                                       <>
//                                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                         Affectation...
//                                       </>
//                                     ) : (
//                                       <>Affecter</>
//                                     )}
//                                   </Button>
//                                 </DialogFooter>
//                               </DialogContent>
//                             </Dialog>
//                           </div>

//                           <div className="bg-white rounded-lg p-4 border border-green-200">
//                             {paroisseDetails.organisation.vicaires.map(
//                               (vicaire: any, index: number) => (
//                                 <div key={vicaire.id || index}>
//                                   <h4 className="text-xl font-bold text-slate-800 mb-2">
//                                     {getFullName(vicaire)}
//                                   </h4>

//                                   {vicaire.num_de_telephone && (
//                                     <div className="flex items-center text-slate-600 mb-2">
//                                       <Phone className="h-3 w-3 mr-1" />
//                                       <span>{vicaire.num_de_telephone}</span>
//                                     </div>
//                                   )}
//                                 </div>
//                               )
//                             )}
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ) : (
//                       // Section pour ajouter des vicaires quand il n'y en a pas
//                       <Card className="border-green-200 bg-green-50/30">
//                         <CardContent className="p-6">
//                           <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center">
//                               <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
//                                 <Users className="h-6 w-6 text-green-700" />
//                               </div>
//                               <div>
//                                 <h3 className="text-lg font-semibold text-slate-900">
//                                   Vicaires
//                                 </h3>
//                                 <p className="text-sm text-slate-600">
//                                   Aucun vicaire assigné
//                                 </p>
//                               </div>
//                             </div>

//                             {/* Bouton pour ajouter le premier vicaire */}
//                             <Dialog
//                               open={isVicaireDialogOpen}
//                               onOpenChange={setIsVicaireDialogOpen}
//                             >
//                               <DialogTrigger asChild>
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   className="h-8 cursor-pointer"
//                                 >
//                                   <Edit className="h-4 w-4 mr-2" />
//                                   Changer
//                                 </Button>
//                               </DialogTrigger>
//                               <DialogContent className="sm:max-w-md">
//                                 <DialogHeader>
//                                   <DialogTitle className="flex items-center gap-2">
//                                     <Users className="h-5 w-5 text-green-600" />
//                                     Affecter un vicaire
//                                   </DialogTitle>
//                                   <DialogDescription>
//                                     Sélectionnez un serviteur pour l'affecter
//                                     comme vicaire à cette paroisse.
//                                   </DialogDescription>
//                                 </DialogHeader>
//                                 <div className="grid gap-4 py-4">
//                                   <div className="grid gap-2">
//                                     <Label htmlFor="vicaire_serviteur_id_empty">
//                                       ID du Serviteur
//                                     </Label>
//                                     <Input
//                                       id="vicaire_serviteur_id_empty"
//                                       type="number"
//                                       placeholder="Entrez l'ID du serviteur"
//                                       value={vicaireServiteurId}
//                                       onChange={(e) =>
//                                         setVicaireServiteurId(e.target.value)
//                                       }
//                                       className="w-full"
//                                       disabled={isAffectingVicaire}
//                                     />
//                                     <p className="text-xs text-slate-500">
//                                       Vous devez connaître l'ID du serviteur à
//                                       affecter comme vicaire.
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <DialogFooter>
//                                   <Button
//                                     variant="outline"
//                                     onClick={() => {
//                                       setIsVicaireDialogOpen(false);
//                                       setVicaireServiteurId("");
//                                     }}
//                                     disabled={isAffectingVicaire}
//                                   >
//                                     Annuler
//                                   </Button>
//                                   <Button
//                                     onClick={handleAffecterVicaire}
//                                     disabled={
//                                       !vicaireServiteurId || isAffectingVicaire
//                                     }
//                                     className="bg-green-600 hover:bg-green-700"
//                                   >
//                                     {isAffectingVicaire ? (
//                                       <>
//                                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                         Affectation...
//                                       </>
//                                     ) : (
//                                       <>Affecter</>
//                                     )}
//                                   </Button>
//                                 </DialogFooter>
//                               </DialogContent>
//                             </Dialog>
//                           </div>

//                           <div className="bg-white rounded-lg p-6 border border-green-200 text-center">
//                             <Users className="h-8 w-8 text-slate-300 mx-auto mb-3" />
//                             <p className="text-slate-500 mb-4">
//                               Cette paroisse n'a pas encore de vicaires
//                               assignés.
//                             </p>
//                             <p className="text-xs text-slate-400">
//                               Cliquez sur "Ajouter" pour affecter un vicaire à
//                               cette paroisse.
//                             </p>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     )}
//                   </div>
//                 ) : (
//                   // Cas où il n'y a pas d'organisation du tout
//                   <div className="py-12 text-center">
//                     <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//                     <h3 className="text-lg font-medium text-slate-900 mb-2">
//                       Aucune organisation définie
//                     </h3>
//                     <p className="text-sm text-slate-500 mb-4">
//                       Cette paroisse n'a pas encore d'organisation structurée.
//                     </p>
//                     <div className="flex gap-2 justify-center">
//                       <Dialog
//                         open={isNominationDialogOpen}
//                         onOpenChange={setIsNominationDialogOpen}
//                       >
//                         <DialogTrigger asChild>
//                           <Button className="bg-blue-600 hover:bg-blue-700">
//                             <Plus className="h-4 w-4 mr-2" />
//                             Nommer un curé
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-md">
//                           <DialogHeader>
//                             <DialogTitle className="flex items-center gap-2">
//                               <Crown className="h-5 w-5 text-gray-500" />
//                               Nommer un curé
//                             </DialogTitle>
//                             <DialogDescription>
//                               Sélectionnez un serviteur pour le nommer comme
//                               curé de cette paroisse.
//                             </DialogDescription>
//                           </DialogHeader>
//                           <div className="grid gap-4 py-4">
//                             <div className="grid gap-2">
//                               <Label htmlFor="serviteur_id_no_org">
//                                 ID du Serviteur
//                               </Label>
//                               <Input
//                                 id="serviteur_id_no_org"
//                                 type="number"
//                                 placeholder="Entrez l'ID du serviteur"
//                                 value={serviteurId}
//                                 onChange={(e) => setServiteurId(e.target.value)}
//                                 className="w-full"
//                                 disabled={isNominating}
//                               />
//                               <p className="text-xs text-slate-500">
//                                 Vous devez connaître l'ID du serviteur à nommer.
//                               </p>
//                             </div>
//                           </div>
//                           <DialogFooter>
//                             <Button
//                               variant="outline"
//                               onClick={() => {
//                                 setIsNominationDialogOpen(false);
//                                 setServiteurId("");
//                               }}
//                               disabled={isNominating}
//                             >
//                               Annuler
//                             </Button>
//                             <Button
//                               onClick={handleNommerCure}
//                               disabled={!serviteurId || isNominating}
//                               className="bg-blue-600 hover:bg-blue-700"
//                             >
//                               {isNominating ? (
//                                 <>
//                                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                   Nomination...
//                                 </>
//                               ) : (
//                                 "Nommer"
//                               )}
//                             </Button>
//                           </DialogFooter>
//                         </DialogContent>
//                       </Dialog>

//                       <Dialog
//                         open={isVicaireDialogOpen}
//                         onOpenChange={setIsVicaireDialogOpen}
//                       >
//                         <DialogTrigger asChild>
//                           <Button
//                             variant="outline"
//                             className="border-green-600 text-green-600 hover:bg-green-50"
//                           >
//                             <Plus className="h-4 w-4 mr-2" />
//                             Affecter un vicaire
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-md">
//                           <DialogHeader>
//                             <DialogTitle className="flex items-center gap-2">
//                               <Users className="h-5 w-5 text-green-600" />
//                               Affecter un vicaire
//                             </DialogTitle>
//                             <DialogDescription>
//                               Sélectionnez un serviteur pour l'affecter comme
//                               vicaire à cette paroisse.
//                             </DialogDescription>
//                           </DialogHeader>
//                           <div className="grid gap-4 py-4">
//                             <div className="grid gap-2">
//                               <Label htmlFor="vicaire_serviteur_id_no_org">
//                                 ID du Serviteur
//                               </Label>
//                               <Input
//                                 id="vicaire_serviteur_id_no_org"
//                                 type="number"
//                                 placeholder="Entrez l'ID du serviteur"
//                                 value={vicaireServiteurId}
//                                 onChange={(e) =>
//                                   setVicaireServiteurId(e.target.value)
//                                 }
//                                 className="w-full"
//                                 disabled={isAffectingVicaire}
//                               />
//                               <p className="text-xs text-slate-500">
//                                 Vous devez connaître l'ID du serviteur à
//                                 affecter comme vicaire.
//                               </p>
//                             </div>
//                           </div>
//                           <DialogFooter>
//                             <Button
//                               variant="outline"
//                               onClick={() => {
//                                 setIsVicaireDialogOpen(false);
//                                 setVicaireServiteurId("");
//                               }}
//                               disabled={isAffectingVicaire}
//                             >
//                               Annuler
//                             </Button>
//                             <Button
//                               onClick={handleAffecterVicaire}
//                               disabled={
//                                 !vicaireServiteurId || isAffectingVicaire
//                               }
//                               className="bg-green-600 hover:bg-green-700"
//                             >
//                               {isAffectingVicaire ? (
//                                 <>
//                                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                   Affectation...
//                                 </>
//                               ) : (
//                                 <>
//                                   <Plus className="h-4 w-4 mr-2" />
//                                   Affecter
//                                 </>
//                               )}
//                             </Button>
//                           </DialogFooter>
//                         </DialogContent>
//                       </Dialog>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </TabsContent>

//             {/* Onglet Paroissiens */}
//             <TabsContent value="paroissiens" className="mt-0">
//               {filteredParoissiens.length === 0 ? (
//                 <EmptyTabContent
//                   type="Paroissien"
//                   icon={Users}
//                   searchQuery={searchQuery}
//                   onClearSearch={handleClearSearch}
//                 />
//               ) : (
//                 <div className="overflow-hidden rounded-lg border border-slate-200">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="border-slate-200 hover:bg-transparent">
//                         <TableHead className="font-semibold text-slate-700 py-3 px-4">
//                           Paroissien
//                         </TableHead>
//                         <TableHead className="font-semibold text-slate-700 py-3 px-4">
//                           Contact
//                         </TableHead>
//                         <TableHead className="font-semibold text-slate-700 py-3 px-4">
//                           Genre
//                         </TableHead>
//                         <TableHead className="font-semibold text-slate-700 py-3 px-4">
//                           Statut
//                         </TableHead>
//                         <TableHead className="font-semibold text-slate-700 py-3 px-4">
//                           Abonnement
//                         </TableHead>
//                         {/* <TableHead className="font-semibold text-slate-700 py-3 px-4 text-right">
//                           Actions
//                         </TableHead> */}
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {getPaginatedItems(
//                         filteredParoissiens,
//                         currentPageParoissiens
//                       ).map((paroissien) => (
//                         <TableRow
//                           key={paroissien.id}
//                           className="border-slate-200 hover:bg-slate-50/50 transition-colors"
//                         >
//                           <TableCell className="py-3 px-4">
//                             <div className="flex items-center">
//                               <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3">
//                                 {paroissien.photo?.url ? (
//                                   <img
//                                     src={paroissien.photo.url}
//                                     alt={`${paroissien.prenoms} ${paroissien.nom}`}
//                                     className="h-10 w-10 rounded-full object-cover"
//                                   />
//                                 ) : (
//                                   <span className="text-white font-medium text-sm">
//                                     {paroissien.prenoms?.[0]?.toUpperCase()}
//                                     {paroissien.nom?.[0]?.toUpperCase()}
//                                   </span>
//                                 )}
//                               </div>
//                               <div>
//                                 <span className="font-medium text-slate-900">
//                                   {paroissien.prenoms} {paroissien.nom}
//                                 </span>
//                               </div>
//                             </div>
//                           </TableCell>

//                           <TableCell className="py-3 px-4">
//                             <div className="flex items-center text-slate-600">
//                               <Phone className="h-4 w-4 mr-2 text-slate-400" />
//                               <span>
//                                 {paroissien.num_de_telephone || "Non renseigné"}
//                               </span>
//                             </div>
//                           </TableCell>

//                           <TableCell className="py-3 px-4">
//                             <Badge
//                               className={
//                                 paroissien.genre === "M"
//                                   ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
//                                   : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
//                               }
//                             >
//                               {formatGenre(paroissien.genre)}
//                             </Badge>
//                           </TableCell>

//                           <TableCell className="py-3 px-4">
//                             <Badge
//                               className={
//                                 paroissien.statut
//                                   ?.toLowerCase()
//                                   .includes("baptis")
//                                   ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
//                                   : paroissien.statut === "Aucun"
//                                     ? "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
//                                     : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
//                               }
//                             >
//                               {paroissien.statut || "Non défini"}
//                             </Badge>
//                           </TableCell>

//                           <TableCell className="py-3 px-4">
//                             <div className="flex items-center">
//                               {paroissien.est_abonne ? (
//                                 <div className="flex items-center text-green-600">
//                                   <CheckCircle className="h-4 w-4 mr-2" />
//                                   <div>
//                                     <span className="font-medium">Abonné</span>
//                                     {paroissien.date_de_fin_abonnement && (
//                                       <div className="text-xs text-slate-500">
//                                         Jusqu'au{" "}
//                                         {new Date(
//                                           paroissien.date_de_fin_abonnement
//                                         ).toLocaleDateString("fr-FR")}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <div className="flex items-center text-slate-500">
//                                   <XIcon className="h-4 w-4 mr-2" />
//                                   <span>Non abonné</span>
//                                 </div>
//                               )}
//                             </div>
//                           </TableCell>

//                           {/* <TableCell className="py-3 px-4 text-right">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
//                               onClick={() =>
//                                 router.push(
//                                   `/dashboard/diocese/paroissiens/${paroissien.id}`
//                                 )
//                               }
//                               title="Voir les détails du paroissien"
//                             >
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                           </TableCell> */}
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>

//                   {/* Pagination pour les paroissiens */}
//                   <PaginationControls
//                     currentPage={currentPageParoissiens}
//                     totalPages={getTotalPages(filteredParoissiens.length)}
//                     itemsPerPage={itemsPerPage}
//                     totalItems={filteredParoissiens.length}
//                     onPreviousPage={() =>
//                       setCurrentPageParoissiens((prev) => prev - 1)
//                     }
//                     onNextPage={() =>
//                       setCurrentPageParoissiens((prev) => prev + 1)
//                     }
//                     type="paroissien"
//                   />
//                 </div>
//               )}
//             </TabsContent>

//             {/* Onglet Mouvements */}
//             <TabsContent value="mouvements" className="mt-0">
//               {filteredMouvements.length === 0 ? (
//                 <EmptyTabContent
//                   type="Mouvement"
//                   icon={Star}
//                   searchQuery={searchQuery}
//                   onClearSearch={handleClearSearch}
//                 />
//               ) : (
//                 <div className="space-y-4">
//                   {getPaginatedItems(
//                     filteredMouvements,
//                     currentPageMouvements
//                   ).map((mouvement) => (
//                     <Card
//                       key={mouvement.id}
//                       className="border-green-200 bg-green-50/30"
//                     >
//                       <CardContent className="p-6">
//                         <div className="flex items-start justify-between">
//                           <div className="flex items-start">
//                             <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4 mt-1">
//                               <Star className="h-6 w-6 text-green-700" />
//                             </div>
//                             <div className="flex-1">
//                               <div className="flex items-center gap-3 mb-2">
//                                 <h3 className="text-lg font-semibold text-slate-900">
//                                   {mouvement.nom}
//                                 </h3>
//                                 <Badge className="bg-green-100 text-green-800 border-green-200">
//                                   {formatTypeMouvement(mouvement.type)}
//                                 </Badge>
//                               </div>

//                               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                 {mouvement.responsable && (
//                                   <div>
//                                     <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
//                                       Responsable
//                                     </label>
//                                     <div className="mt-1">
//                                       <p className="font-medium text-slate-900">
//                                         {getFullName(mouvement.responsable)}
//                                       </p>
//                                       {mouvement.responsable
//                                         .num_de_telephone && (
//                                         <div className="flex items-center text-sm text-slate-600 mt-1">
//                                           <Phone className="h-3 w-3 mr-1" />
//                                           <span>
//                                             {
//                                               mouvement.responsable
//                                                 .num_de_telephone
//                                             }
//                                           </span>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}

//                                 {mouvement.aumonier && (
//                                   <div>
//                                     <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
//                                       Aumônier
//                                     </label>
//                                     <div className="mt-1">
//                                       <p className="font-medium text-slate-900">
//                                         {getFullName(mouvement.aumonier)}
//                                       </p>
//                                       {mouvement.aumonier.num_de_telephone && (
//                                         <div className="flex items-center text-sm text-slate-600 mt-1">
//                                           <Phone className="h-3 w-3 mr-1" />
//                                           <span>
//                                             {
//                                               mouvement.aumonier
//                                                 .num_de_telephone
//                                             }
//                                           </span>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}

//                                 {mouvement.parrain && (
//                                   <div>
//                                     <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
//                                       Parrain
//                                     </label>
//                                     <div className="mt-1">
//                                       <p className="font-medium text-slate-900">
//                                         {getFullName(mouvement.parrain)}
//                                       </p>
//                                       {mouvement.parrain.num_de_telephone && (
//                                         <div className="flex items-center text-sm text-slate-600 mt-1">
//                                           <Phone className="h-3 w-3 mr-1" />
//                                           <span>
//                                             {mouvement.parrain.num_de_telephone}
//                                           </span>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>

//                               <div className="mt-4 pt-4 border-t border-green-200">
//                                 <p className="text-xs text-slate-500">
//                                   Créé le {formatDate(mouvement.created_at)}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}

//                   {/* Pagination pour les mouvements */}
//                   <PaginationControls
//                     currentPage={currentPageMouvements}
//                     totalPages={getTotalPages(filteredMouvements.length)}
//                     itemsPerPage={itemsPerPage}
//                     totalItems={filteredMouvements.length}
//                     onPreviousPage={() =>
//                       setCurrentPageMouvements((prev) => prev - 1)
//                     }
//                     onNextPage={() =>
//                       setCurrentPageMouvements((prev) => prev + 1)
//                     }
//                     type="mouvement"
//                   />
//                 </div>
//               )}
//             </TabsContent>

//             {/* Onglet CEBs */}
//             <TabsContent value="cebs" className="mt-0">
//               {filteredCebs.length === 0 ? (
//                 <EmptyTabContent
//                   type="CEB"
//                   icon={Building2}
//                   searchQuery={searchQuery}
//                   onClearSearch={handleClearSearch}
//                 />
//               ) : (
//                 <div className="space-y-4">
//                   {getPaginatedItems(filteredCebs, currentPageCebs).map(
//                     (ceb) => (
//                       <Card
//                         key={ceb.id}
//                         className="border-purple-200 bg-purple-50/30"
//                       >
//                         <CardContent className="p-6">
//                           <div className="flex items-start">
//                             <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4 mt-1">
//                               <Building2 className="h-6 w-6 text-purple-700" />
//                             </div>
//                             <div className="flex-1">
//                               <h3 className="text-lg font-semibold text-slate-900 mb-2">
//                                 {ceb.nom}
//                               </h3>

//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {ceb.president && (
//                                   <div>
//                                     <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
//                                       Président
//                                     </label>
//                                     <div className="mt-1">
//                                       <p className="font-medium text-slate-900">
//                                         {getFullName(ceb.president)}
//                                       </p>
//                                       {ceb.president.num_de_telephone && (
//                                         <div className="flex items-center text-sm text-slate-600 mt-1">
//                                           <Phone className="h-3 w-3 mr-1" />
//                                           <span>
//                                             {ceb.president.num_de_telephone}
//                                           </span>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>

//                               <div className="mt-4 pt-4 border-t border-purple-200">
//                                 <p className="text-xs text-slate-500">
//                                   Créé le {formatDate(ceb.created_at)}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     )
//                   )}

//                   {/* Pagination pour les CEBs */}
//                   <PaginationControls
//                     currentPage={currentPageCebs}
//                     totalPages={getTotalPages(filteredCebs.length)}
//                     itemsPerPage={itemsPerPage}
//                     totalItems={filteredCebs.length}
//                     onPreviousPage={() =>
//                       setCurrentPageCebs((prev) => prev - 1)
//                     }
//                     onNextPage={() => setCurrentPageCebs((prev) => prev + 1)}
//                     type="CEB"
//                   />
//                 </div>
//               )}
//             </TabsContent>

//             {/* Onglet Événements */}
//             <TabsContent value="evenements" className="mt-0">
//               {filteredEvenements.length === 0 ? (
//                 <EmptyTabContent
//                   type="Événement"
//                   icon={Activity}
//                   searchQuery={searchQuery}
//                   onClearSearch={handleClearSearch}
//                 />
//               ) : (
//                 <div className="space-y-4">
//                   {getPaginatedItems(
//                     filteredEvenements,
//                     currentPageEvenements
//                   ).map((evenement) => (
//                     <Card
//                       key={evenement.id}
//                       className="border-orange-200 bg-orange-50/30"
//                     >
//                       <CardContent className="p-6">
//                         <div className="flex items-start">
//                           <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mr-4 mt-1">
//                             <Activity className="h-6 w-6 text-orange-700" />
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-start justify-between mb-3">
//                               <div>
//                                 <h3 className="text-lg font-semibold text-slate-900 mb-2">
//                                   {evenement.libelle}
//                                 </h3>
//                                 <div className="flex items-center gap-2 mb-2">
//                                   <Badge className="bg-orange-100 text-orange-800 border-orange-200">
//                                     {formatTypeEvenement(evenement.type)}
//                                   </Badge>
//                                   <Badge
//                                     className={
//                                       evenement.est_actif
//                                         ? "bg-green-100 text-green-800 border-green-200"
//                                         : "bg-gray-100 text-gray-800 border-gray-200"
//                                     }
//                                   >
//                                     {evenement.est_actif ? "Actif" : "Inactif"}
//                                   </Badge>
//                                 </div>
//                               </div>
//                               {evenement.image?.url && (
//                                 <img
//                                   src={evenement.image.url}
//                                   alt={evenement.libelle}
//                                   className="h-16 w-16 rounded-lg object-cover"
//                                 />
//                               )}
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                               <div>
//                                 <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
//                                   Date de début
//                                 </label>
//                                 <p className="font-medium text-slate-900 mt-1">
//                                   {formatDate(evenement.date_de_debut)}
//                                 </p>
//                               </div>
//                               <div>
//                                 <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
//                                   Date de fin
//                                 </label>
//                                 <p className="font-medium text-slate-900 mt-1">
//                                   {formatDate(evenement.date_de_fin)}
//                                 </p>
//                               </div>
//                             </div>

//                             {evenement.est_limite_par_echeance && (
//                               <div className="mb-4">
//                                 <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
//                                   <Calendar className="h-3 w-3 mr-1" />
//                                   Limité par échéance
//                                 </Badge>
//                               </div>
//                             )}

//                             <div className="pt-4 border-t border-orange-200">
//                               <p className="text-xs text-slate-500">
//                                 Créé le {formatDate(evenement.created_at)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}

//                   {/* Pagination pour les événements */}
//                   <PaginationControls
//                     currentPage={currentPageEvenements}
//                     totalPages={getTotalPages(filteredEvenements.length)}
//                     itemsPerPage={itemsPerPage}
//                     totalItems={filteredEvenements.length}
//                     onPreviousPage={() =>
//                       setCurrentPageEvenements((prev) => prev - 1)
//                     }
//                     onNextPage={() =>
//                       setCurrentPageEvenements((prev) => prev + 1)
//                     }
//                     type="événement"
//                   />
//                 </div>
//               )}
//             </TabsContent>
//           </div>
//         </Tabs>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Users,
  Building2,
  Crown,
  Church,
  Calendar,
  XCircle,
  Eye,
  Phone,
  Mail,
  Download,
  FileSpreadsheet,
  FileDown,
  Home,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  UserCheck,
  Settings,
  UserPlus,
  CheckCircle,
  XIcon,
  Plus,
  Edit,
  Star,
  Activity,
  MoreVertical,
  Trash2,
  Loader2,
  List,
  Filter,
  CalendarDays,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  fetchParoisseDetails,
  ParoisseDetails,
  formatTimestamp,
  getFullName,
  formatLocalisation,
  formatGenre,
  formatStatutAbonnement,
  formatTypeMouvement,
  formatTypeEvenement,
  nommerCure,
  affecterVicaire,
  ApiError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  Mouvement,
  Ceb,
  Evenement,
  Vicaire,
  getTotalResponsables,
} from "@/services/ParoiseofDiocese";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Interface pour les événements compatibles avec le calendrier
interface APIEvent {
  id: number;
  libelle: string;
  type: string;
  date_de_debut: number;
  date_de_fin?: number;
  est_actif: boolean;
  est_limite_par_echeance?: boolean;
  image?: { url: string };
  extras: Record<string, any>;
  created_at: string | number;
}

// Composant DatePicker intégré
interface DatePickerProps {
  events: APIEvent[];
  moisActuel: number;
  anneeActuelle: number;
  filtreType: string;
  selectedDates: number[];
  onDatesChange: (dates: number[]) => void;
  loading?: boolean;
  className?: string;
  allowPastDates?: boolean;
  showNavigation?: boolean;
  monthNames?: string[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: APIEvent) => void;
  onMonthChange?: (month: number, year: number) => void;
}

interface CalendarDay {
  date: number | null;
  timestamp: number;
  isToday: boolean;
  isSelected: boolean;
  isPast: boolean;
  isSelectable: boolean;
  events: APIEvent[];
}

// Utilitaires pour le calendrier
const normalizeTimestamp = (timestamp: number): number => {
  return timestamp; // Pas besoin de conversion, déjà en millisecondes
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const isPastOrToday = (date: Date, today: Date): boolean => {
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  return dateOnly <= todayOnly;
};

const filterEventsForDay = (
  events: APIEvent[],
  targetDate: Date,
  filtreType: string
): APIEvent[] => {
  return events.filter((event) => {
    if (filtreType !== "tous" && event.type !== filtreType) {
      return false;
    }

    try {
      const timestamp = normalizeTimestamp(event.date_de_debut);
      const eventDate = new Date(timestamp);
      return isSameDay(eventDate, targetDate);
    } catch (error) {
      console.error("Erreur lors du filtrage des événements:", error, event);
      return false;
    }
  });
};

// Fonction pour obtenir la couleur selon le type d'événement
const getEventTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    messe: "bg-blue-500 hover:bg-blue-600",
    formation: "bg-green-500 hover:bg-green-600",
    celebration: "bg-purple-500 hover:bg-purple-600",
    reunion: "bg-orange-500 hover:bg-orange-600",
    mariage: "bg-pink-500 hover:bg-pink-600",
    bapteme: "bg-cyan-500 hover:bg-cyan-600",
    funeral: "bg-gray-500 hover:bg-gray-600",
    default: "bg-slate-500 hover:bg-slate-600",
  };
  return colors[type?.toLowerCase()] || colors.default;
};

const getEventTypeBgColor = (type: string): string => {
  const colors: Record<string, string> = {
    messe: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    formation:
      "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    celebration:
      "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
    reunion:
      "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
    mariage: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
    bapteme: "bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200",
    funeral: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
    default: "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200",
  };
  return colors[type?.toLowerCase()] || colors.default;
};

// Formatage des types d'événements
const formatEventTypeForCalendar = (type: string): string => {
  const types: Record<string, string> = {
    messe: "Messe",
    formation: "Formation",
    celebration: "Célébration",
    reunion: "Réunion",
    mariage: "Mariage",
    bapteme: "Baptême",
    funeral: "Funérailles",
  };
  return types[type?.toLowerCase()] || type;
};

// Composant de navigation du calendrier
const CalendarNavigation = ({
  moisActuel,
  anneeActuelle,
  onMonthChange,
  monthNames,
}: {
  moisActuel: number;
  anneeActuelle: number;
  onMonthChange?: (month: number, year: number) => void;
  monthNames?: string[];
}) => {
  const moisNoms = monthNames || [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const handlePrevMonth = () => {
    const newMonth = moisActuel === 0 ? 11 : moisActuel - 1;
    const newYear = moisActuel === 0 ? anneeActuelle - 1 : anneeActuelle;
    onMonthChange?.(newMonth, newYear);
  };

  const handleNextMonth = () => {
    const newMonth = moisActuel === 11 ? 0 : moisActuel + 1;
    const newYear = moisActuel === 11 ? anneeActuelle + 1 : anneeActuelle;
    onMonthChange?.(newMonth, newYear);
  };

  const goToToday = () => {
    const today = new Date();
    onMonthChange?.(today.getMonth(), today.getFullYear());
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevMonth}
          className="h-9 w-9 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {moisNoms[moisActuel]} {anneeActuelle}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextMonth}
          className="h-9 w-9 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* <h2 className="text-xl font-semibold text-slate-900">
        {moisNoms[moisActuel]} {anneeActuelle}
      </h2> */}

      <Button variant="outline" size="sm" onClick={goToToday} className="h-9">
        Aujourd'hui
      </Button>
    </div>
  );
};

// Modal pour les détails des événements d'un jour
const EventDetailsModal = ({
  isOpen,
  onClose,
  selectedDay,
  onEventClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: CalendarDay | null;
  onEventClick?: (event: APIEvent) => void;
}) => {
  if (!selectedDay) return null;

  const dateStr = new Date(selectedDay.timestamp).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-500" />
            Événements du {dateStr}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedDay.events.map((event) => (
              <Card
                key={event.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent
                  className="p-4"
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900 text-sm">
                          {event.libelle}
                        </h3>
                        <Badge
                          className={`${getEventTypeBgColor(event.type)} text-xs`}
                        >
                          {formatEventTypeForCalendar(event.type)}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-slate-600">
                        {/* {event?.date_de_debut && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">
                              {new Date(
                                normalizeTimestamp(event.date_de_debut)
                              ).toLocaleString("fr-FR")}
                            </span>
                          </div>
                        )} */}
                        {event?.extras?.heure_de_debut && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">
                              {new Date(
                                normalizeTimestamp(event.extras?.heure_de_debut)
                              ).toLocaleString("fr-FR")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedDay.events.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <CalendarDays className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p>Aucun événement prévu pour cette date.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Skeleton pour le calendrier
const CalendarSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <div className="w-9 h-9 bg-gray-200 rounded animate-pulse" />
        <div className="w-9 h-9 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="w-40 h-6 bg-gray-200 rounded animate-pulse" />
      <div className="w-20 h-9 bg-gray-200 rounded animate-pulse" />
    </div>

    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="h-8 bg-gray-200 rounded animate-pulse" />
      ))}

      {Array.from({ length: 35 }).map((_, index) => (
        <div
          key={index}
          className="h-20 sm:h-24 bg-gray-200 border border-slate-200 animate-pulse rounded"
        />
      ))}
    </div>
  </div>
);

// Composant DatePicker
function DatePicker({
  events,
  moisActuel,
  anneeActuelle,
  filtreType,
  selectedDates,
  onDatesChange,
  loading = false,
  className = "",
  allowPastDates = false,
  showNavigation = true,
  monthNames,
  onDateClick,
  onEventClick,
  onMonthChange,
}: DatePickerProps) {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Générer les jours du calendrier
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];

    const nbJoursDansMois = new Date(
      anneeActuelle,
      moisActuel + 1,
      0
    ).getDate();
    const premierJourDuMois = new Date(anneeActuelle, moisActuel, 1).getDay();
    const premierJourAjuste =
      premierJourDuMois === 0 ? 6 : premierJourDuMois - 1;

    // Jours vides avant le début du mois
    for (let i = 0; i < premierJourAjuste; i++) {
      days.push({
        date: null,
        timestamp: 0,
        isToday: false,
        isSelected: false,
        isPast: false,
        isSelectable: false,
        events: [],
      });
    }

    // Jours du mois
    for (let jour = 1; jour <= nbJoursDansMois; jour++) {
      const currentDate = new Date(anneeActuelle, moisActuel, jour);
      const timestamp = currentDate.getTime();
      const isPastDate = isPastOrToday(currentDate, today);
      const isSelectableDate = allowPastDates || !isPastDate;

      days.push({
        date: jour,
        timestamp,
        isToday: isSameDay(currentDate, today),
        isSelected: selectedDates.includes(timestamp),
        isPast: isPastDate,
        isSelectable: isSelectableDate,
        events: filterEventsForDay(events, currentDate, filtreType),
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const joursDelaSemaine = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Gérer le clic sur un jour avec des événements
  const handleDayClick = (day: CalendarDay) => {
    if (day.events.length > 0) {
      setSelectedDay(day);
      setShowEventDetails(true);
    }

    if (day.isSelectable && onDateClick) {
      onDateClick(new Date(day.timestamp));
    }
  };

  // Gérer le clic sur un événement
  const handleEventClick = (event: APIEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event);
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <CalendarSkeleton />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Navigation */}
      {showNavigation && (
        <CalendarNavigation
          moisActuel={moisActuel}
          anneeActuelle={anneeActuelle}
          onMonthChange={onMonthChange}
          monthNames={monthNames}
        />
      )}

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-1 bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* En-têtes des jours de la semaine */}
        {joursDelaSemaine.map((jour, index) => (
          <div
            key={index}
            className="text-center font-semibold py-3 text-slate-700 text-sm bg-slate-50 border-b border-slate-200"
          >
            <span className="hidden sm:inline">{jour}</span>
            <span className="sm:hidden">{jour.slice(0, 1)}</span>
          </div>
        ))}

        {/* Cases du calendrier */}
        {calendarDays.map((day, index) => {
          if (day.date === null) {
            return (
              <div
                key={`empty-${index}`}
                className="h-20 sm:h-28 bg-slate-50 border-b border-slate-200"
              />
            );
          }

          const dayClasses = `
            h-20 sm:h-28 p-2 border-b border-slate-200 overflow-hidden relative transition-all duration-200
            ${day.isToday ? "bg-blue-50 border-blue-200" : "bg-white"}
            ${day.isSelected ? "ring-2 ring-blue-500 ring-inset" : ""}
            ${!day.isSelectable ? "bg-slate-100 opacity-60" : ""}
            ${day.isSelectable ? "cursor-pointer hover:bg-slate-50" : "cursor-not-allowed"}
            ${day.events.length > 0 ? "hover:shadow-md" : ""}
          `;

          return (
            <div
              key={`day-${day.date}`}
              className={dayClasses}
              onClick={() => handleDayClick(day)}
              title={
                !day.isSelectable
                  ? "Cette date ne peut pas être sélectionnée"
                  : day.events.length > 0
                    ? `${day.events.length} événement(s) - Cliquer pour voir les détails`
                    : undefined
              }
            >
              {/* Numéro du jour */}
              <div className="flex items-center justify-between mb-1">
                <div
                  className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                    day.isToday
                      ? "bg-blue-500 text-white"
                      : day.isSelected
                        ? "bg-blue-400 text-white"
                        : !day.isSelectable
                          ? "text-slate-400"
                          : "text-slate-700"
                  }`}
                >
                  {day.date}
                </div>

                {/* Badge nombre d'événements */}
                {/* {day.events.length > 0 && (
                  <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {day.events.length}
                  </div>
                )} */}
              </div>

              {/* Événements du jour - mode compact */}
              <div className="space-y-1">
                {day.events.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => handleEventClick(event, e)}
                    className={`
                      text-xs p-1 rounded cursor-pointer truncate transition-all
                      ${getEventTypeColor(event.type)} text-white
                      ${!day.isSelectable ? "opacity-70" : "hover:scale-105"}
                    `}
                    title={`${event.libelle} - ${formatEventTypeForCalendar(event.type)}`}
                  >
                    {event.libelle}
                  </div>
                ))}

                {/* Indicateur pour plus d'événements */}
                {day.events.length > 2 && (
                  <div className="text-xs text-center text-slate-600 bg-slate-100 rounded px-1 py-0.5">
                    +{day.events.length - 2}
                  </div>
                )}
              </div>

              {/* Indicateur de date non sélectionnable */}
              {!day.isSelectable && !day.isToday && (
                <div className="absolute top-1 right-1">
                  <span className="text-lg">🚫</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Message si aucun événement dans le mois */}
      {events.length === 0 && (
        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
          <CalendarDays className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <div className="text-sm">Aucun événement pour cette période.</div>
        </div>
      )}

      {/* Modal pour les détails des événements */}
      <EventDetailsModal
        isOpen={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        selectedDay={selectedDay}
        onEventClick={onEventClick}
      />
    </div>
  );
}

// Hook pour gérer l'état du calendrier
function useCalendarState(
  initialMonth: number = new Date().getMonth(),
  initialYear: number = new Date().getFullYear()
) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedEvent, setSelectedEvent] = useState<APIEvent | null>(null);

  const setMonth = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  return {
    currentMonth,
    currentYear,
    viewMode,
    selectedEvent,
    setViewMode,
    setSelectedEvent,
    setMonth,
  };
}

// Fonctions utilitaires existantes
const sanitizeForRender = (value: any): string | number => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (typeof value === "object") {
    if (value.type && value.data && value.data.lat && value.data.lng) {
      return `${value.data.lat.toFixed(5)}, ${value.data.lng.toFixed(5)}`;
    }

    if (value.url) {
      return value.url;
    }

    if (value.nom) {
      return value.nom;
    }

    try {
      const keys = Object.keys(value);
      if (keys.length === 0) return "N/A";
      return `[Objet: ${keys.join(", ")}]`;
    } catch (error) {
      return "[Objet complexe]";
    }
  }

  return String(value);
};

const formatDate = (timestamp: string | number | null | undefined): string => {
  return formatTimestamp(timestamp);
};

// Interfaces
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

// Composants existants
const SafeStatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
}: StatsCardProps) => {
  const safeValue = sanitizeForRender(value);

  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-card transition-shadow duration-200">
      <CardContent className="p-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`h-3 w-12 rounded-xl flex items-center justify-center`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {title}
          </h3>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-xl font-bold text-card-foreground">
            {safeValue}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SafeValue = ({
  children,
  className = "",
}: {
  children: any;
  className?: string;
}) => {
  const safeContent = sanitizeForRender(children);
  return <span className={className}>{safeContent}</span>;
};

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  totalItems,
  onClearSearch,
  placeholder = "Rechercher...",
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalItems: number;
  onClearSearch: () => void;
  placeholder?: string;
}) => (
  <Card className="bg-white border-slate-200 mb-6">
    <CardContent className="p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>{totalItems} élément(s)</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const PaginationControls = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPreviousPage,
  onNextPage,
  type,
}: {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  type: string;
}) => {
  if (totalItems <= itemsPerPage) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t border-slate-200 bg-slate-50/50">
      <div className="text-sm text-slate-500">
        Affichage de {startItem} à {endItem} sur {totalItems} {type}(s)
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="h-8 px-3 cursor-pointer"
        >
          {" "}
          <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="h-8 px-3 cursor-pointer"
        >
          Suivant <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

const EmptyTabContent = ({
  type,
  icon: Icon,
  searchQuery,
  onClearSearch,
}: {
  type: string;
  icon: React.ComponentType<any>;
  searchQuery: string;
  onClearSearch: () => void;
}) => (
  <div className="py-12 text-center">
    <Icon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
    {searchQuery ? (
      <>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Aucun résultat trouvé
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Aucun {type.toLowerCase()} ne correspond à votre recherche "
          {searchQuery}".
        </p>
        <Button variant="outline" onClick={onClearSearch} className="mx-auto">
          <X className="h-4 w-4 mr-2" />
          Effacer la recherche
        </Button>
      </>
    ) : (
      <>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Aucun {type.toLowerCase()} trouvé
        </h3>
        <p className="text-sm text-slate-500">
          Cette paroisse ne contient encore aucun {type.toLowerCase()}.
        </p>
      </>
    )}
  </div>
);

export default function ParoisseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const paroisseId = params?.id as string;

  const [paroisseDetails, setParoisseDetails] =
    useState<ParoisseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("organisation");

  // États pour la recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredParoissiens, setFilteredParoissiens] = useState<any[]>([]);
  const [filteredMouvements, setFilteredMouvements] = useState<Mouvement[]>([]);
  const [filteredCebs, setFilteredCebs] = useState<Ceb[]>([]);
  const [filteredEvenements, setFilteredEvenements] = useState<Evenement[]>([]);

  // États pour la pagination
  const [currentPageParoissiens, setCurrentPageParoissiens] = useState(1);
  const [currentPageMouvements, setCurrentPageMouvements] = useState(1);
  const [currentPageCebs, setCurrentPageCebs] = useState(1);
  const [currentPageEvenements, setCurrentPageEvenements] = useState(1);
  const [itemsPerPage] = useState(10);

  // États pour la nomination
  const [isNominationDialogOpen, setIsNominationDialogOpen] = useState(false);
  const [serviteurId, setServiteurId] = useState("");
  const [isNominating, setIsNominating] = useState(false);

  // États pour l'affectation d'un vicaire
  const [isVicaireDialogOpen, setIsVicaireDialogOpen] = useState(false);
  const [vicaireServiteurId, setVicaireServiteurId] = useState("");
  const [isAffectingVicaire, setIsAffectingVicaire] = useState(false);

  // États pour le calendrier des événements
  const calendarState = useCalendarState();
  const [eventFilterType, setEventFilterType] = useState("tous");

  // Fonction pour transformer les événements en format compatible avec le calendrier
  const transformEventsForCalendar = (events: Evenement[]): APIEvent[] => {
    return events.map((event) => ({
      id: event.id,
      libelle: event.libelle,
      type: event.type,
      date_de_debut: normalizeTimestamp(event.date_de_debut),
      date_de_fin: event.date_de_fin
        ? normalizeTimestamp(event.date_de_fin)
        : undefined,
      est_actif: event.est_actif,
      est_limite_par_echeance: event.est_limite_par_echeance,
      image: event.image,
      extras: event.extras || {},
      created_at: normalizeTimestamp(Number(event.created_at)),
    }));
  };

  // Fonction pour obtenir les types d'événements uniques
  const getUniqueEventTypes = () => {
    if (!paroisseDetails) return [];
    const types = [...new Set(paroisseDetails.evenements.map((e) => e.type))];
    return types.filter(Boolean);
  };

  // Fonction d'export des événements
  const exportEvents = (format: "excel" | "pdf") => {
    if (!paroisseDetails) return;

    if (format === "excel") {
      const wb = XLSX.utils.book_new();
      const wsData = filteredEvenements.map((event) => ({
        Libellé: event.libelle,
        Type: event.type,
        "Date de début": formatDate(event.date_de_debut),
        "Date de fin": formatDate(event.date_de_fin),
        Statut: event.est_actif ? "Actif" : "Inactif",
        "Limité par échéance": event.est_limite_par_echeance ? "Oui" : "Non",
        "Créé le": formatDate(event.created_at),
      }));

      const ws = XLSX.utils.json_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, "Événements");
      XLSX.writeFile(
        wb,
        `evenements_${paroisseDetails.paroisse.nom}_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } else {
      // Export PDF
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Événements - ${paroisseDetails.paroisse.nom}`, 20, 20);

      const tableData = filteredEvenements.map((event) => [
        event.libelle,
        event.type,
        formatDate(event.date_de_debut),
        formatDate(event.date_de_fin),
        event.est_actif ? "Actif" : "Inactif",
      ]);

      autoTable(doc, {
        head: [["Libellé", "Type", "Début", "Fin", "Statut"]],
        body: tableData,
        startY: 30,
      });

      doc.save(
        `evenements_${paroisseDetails.paroisse.nom}_${new Date().toISOString().split("T")[0]}.pdf`
      );
    }

    toast.success("Export réussi", {
      description: `Les événements ont été exportés en ${format.toUpperCase()}.`,
    });
  };

  // Charger les détails de la paroisse au montage du composant
  useEffect(() => {
    const loadParoisseDetails = async () => {
      if (!paroisseId) {
        setError("ID de la paroisse non spécifié");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchParoisseDetails(parseInt(paroisseId));
        console.log("📊 Données reçues:", data);
        setParoisseDetails(data);
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
          setError("Paroisse non trouvée.");
        } else {
          setError("Une erreur est survenue lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadParoisseDetails();
  }, [paroisseId, router]);

  // Filtrer les données selon la recherche
  useEffect(() => {
    if (!paroisseDetails) return;

    const query = searchQuery.toLowerCase().trim();

    // Filtrer les paroissiens
    let paroissensResults = [...paroisseDetails.paroissiens];
    if (query) {
      paroissensResults = paroissensResults.filter(
        (paroissien) =>
          paroissien.nom?.toLowerCase().includes(query) ||
          paroissien.prenoms?.toLowerCase().includes(query) ||
          paroissien.num_de_telephone?.toLowerCase().includes(query) ||
          paroissien.statut?.toLowerCase().includes(query)
      );
    }
    setFilteredParoissiens(paroissensResults);

    // Filtrer les mouvements
    let mouvementsResults = [...paroisseDetails.mouvements];
    if (query) {
      mouvementsResults = mouvementsResults.filter(
        (mouvement) =>
          mouvement.nom?.toLowerCase().includes(query) ||
          mouvement.type?.toLowerCase().includes(query) ||
          mouvement.identifiant?.toLowerCase().includes(query) ||
          getFullName(mouvement.responsable)?.toLowerCase().includes(query) ||
          getFullName(mouvement.aumonier)?.toLowerCase().includes(query)
      );
    }
    setFilteredMouvements(mouvementsResults);

    // Filtrer les CEBs
    let cebsResults = [...paroisseDetails.cebs];
    if (query) {
      cebsResults = cebsResults.filter(
        (ceb) =>
          ceb.nom?.toLowerCase().includes(query) ||
          ceb.identifiant?.toLowerCase().includes(query) ||
          getFullName(ceb.president)?.toLowerCase().includes(query)
      );
    }
    setFilteredCebs(cebsResults);

    // Filtrer les événements
    let evenementsResults = [...paroisseDetails.evenements];
    if (query) {
      evenementsResults = evenementsResults.filter(
        (evenement) =>
          evenement.libelle?.toLowerCase().includes(query) ||
          evenement.type?.toLowerCase().includes(query)
      );
    }
    setFilteredEvenements(evenementsResults);

    // Réinitialiser les pages
    setCurrentPageParoissiens(1);
    setCurrentPageMouvements(1);
    setCurrentPageCebs(1);
    setCurrentPageEvenements(1);
  }, [searchQuery, paroisseDetails]);

  // Fonction pour nettoyer la recherche
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Fonction pour nommer un curé
  const handleNommerCure = async () => {
    if (!serviteurId || !paroisseId) {
      toast.error("Erreur", {
        description: "Veuillez sélectionner un serviteur valide.",
      });
      return;
    }

    try {
      setIsNominating(true);

      await nommerCure(parseInt(paroisseId), parseInt(serviteurId));
      const updatedDetails = await fetchParoisseDetails(parseInt(paroisseId));
      setParoisseDetails(updatedDetails);

      toast.success("Nomination réussie", {
        description: "Le curé a été nommé avec succès pour cette paroisse.",
      });

      setIsNominationDialogOpen(false);
      setServiteurId("");
    } catch (err) {
      console.error("Erreur lors de la nomination:", err);

      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else if (err instanceof ForbiddenError) {
        toast.error("Accès refusé", {
          description:
            "Vous n'avez pas les droits pour effectuer cette nomination.",
        });
      } else {
        toast.error("Erreur de nomination", {
          description: "Une erreur est survenue lors de la nomination du curé.",
        });
      }
    } finally {
      setIsNominating(false);
    }
  };

  // Fonction pour affecter un vicaire
  const handleAffecterVicaire = async () => {
    if (!vicaireServiteurId || !paroisseId) {
      toast.error("Erreur", {
        description: "Veuillez sélectionner un serviteur valide.",
      });
      return;
    }

    try {
      setIsAffectingVicaire(true);

      await affecterVicaire(parseInt(paroisseId), parseInt(vicaireServiteurId));
      const updatedDetails = await fetchParoisseDetails(parseInt(paroisseId));
      setParoisseDetails(updatedDetails);

      toast.success("Affectation réussie", {
        description: "Le vicaire a été affecté avec succès à cette paroisse.",
      });

      setIsVicaireDialogOpen(false);
      setVicaireServiteurId("");
    } catch (err) {
      console.error("Erreur lors de l'affectation:", err);

      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else if (err instanceof ForbiddenError) {
        toast.error("Accès refusé", {
          description:
            "Vous n'avez pas les droits pour effectuer cette affectation.",
        });
      } else if (err instanceof ValidationError) {
        toast.error("Données invalides", {
          description: "Les données fournies ne sont pas valides.",
        });
      } else {
        toast.error("Erreur d'affectation", {
          description:
            "Une erreur est survenue lors de l'affectation du vicaire.",
        });
      }
    } finally {
      setIsAffectingVicaire(false);
    }
  };

  // Fonctions de pagination
  const getPaginatedItems = (items: any[], currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems: number) => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Impossible de charger les données
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">{error}</p>
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  if (!paroisseDetails) {
    return null;
  }

  // Calculer les statistiques
  const getStatistics = () => {
    const totalParoissiens = paroisseDetails.paroissiens.length;
    const paroissensAbornes = paroisseDetails.paroissiens.filter(
      (p) => p.est_abonne
    ).length;
    const paroissiensBaptises = paroisseDetails.paroissiens.filter((p) =>
      p.statut?.toLowerCase().includes("baptis")
    ).length;
    const totalMouvements = paroisseDetails.mouvements.length;
    const totalCebs = paroisseDetails.cebs.length;
    const totalEvenements = paroisseDetails.evenements.length;

    return {
      totalParoissiens,
      paroissensAbornes,
      paroissiensBaptises,
      totalMouvements,
      totalCebs,
      totalEvenements,
    };
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      {/* Header avec bouton retour */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-10 w-20 p-0 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              <SafeValue>{paroisseDetails.paroisse.nom}</SafeValue>
            </h1>
            <div className="text-slate-500 flex items-center gap-2">
              <span>
                <SafeValue>{paroisseDetails.paroisse.quartier}</SafeValue>,{" "}
                <SafeValue>{paroisseDetails.paroisse.ville}</SafeValue>
              </span>
              <span>•</span>
              <Badge
                className={
                  paroisseDetails.paroisse.statut
                    ?.toLowerCase()
                    .includes("quasi")
                    ? "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200"
                    : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                }
              >
                {paroisseDetails.paroisse.statut}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SafeStatsCard
          title="Total Paroissiens"
          value={stats.totalParoissiens}
          icon={<Users size={24} />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <SafeStatsCard
          title="Mouvements"
          value={stats.totalMouvements}
          icon={<Star size={24} />}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />

        <SafeStatsCard
          title="CEBs"
          value={stats.totalCebs}
          icon={<Building2 size={24} />}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />

        <SafeStatsCard
          title="Événements"
          value={stats.totalEvenements}
          icon={<Activity size={24} />}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      {/* Barre de recherche */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalItems={
          activeTab === "paroissiens"
            ? filteredParoissiens.length
            : activeTab === "mouvements"
              ? filteredMouvements.length
              : activeTab === "cebs"
                ? filteredCebs.length
                : activeTab === "evenements"
                  ? filteredEvenements.length
                  : 0
        }
        onClearSearch={handleClearSearch}
        placeholder={
          activeTab === "paroissiens"
            ? "Rechercher par nom, prénom, téléphone..."
            : activeTab === "mouvements"
              ? "Rechercher par nom, type, responsable..."
              : activeTab === "cebs"
                ? "Rechercher par nom, identifiant..."
                : activeTab === "evenements"
                  ? "Rechercher par libellé, type..."
                  : "Rechercher..."
        }
      />

      {/* Onglets modernisés */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Header avec onglets */}
          <div className="px-6 py-4 border-b border-slate-200">
            <TabsList className="h-12 p-1 bg-slate-100 rounded-xl grid w-full grid-cols-5">
              <TabsTrigger
                value="organisation"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <Settings className="h-4 w-4 mr-2" />
                Organisation
              </TabsTrigger>
              <TabsTrigger
                value="paroissiens"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <Users className="h-4 w-4 mr-2" />
                Paroissiens ({filteredParoissiens.length})
              </TabsTrigger>
              <TabsTrigger
                value="mouvements"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <Star className="h-4 w-4 mr-2" />
                Mouvements ({filteredMouvements.length})
              </TabsTrigger>
              <TabsTrigger
                value="cebs"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <Building2 className="h-4 w-4 mr-2" />
                CEBs ({filteredCebs.length})
              </TabsTrigger>
              <TabsTrigger
                value="evenements"
                className="h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <Activity className="h-4 w-4 mr-2" />
                Événements ({filteredEvenements.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Onglet Organisation - (Code existant conservé) */}
            <TabsContent value="organisation" className="mt-0">
              <div className="space-y-6">
                {/* Structure d'organisation */}
                {paroisseDetails.organisation ? (
                  <div className="space-y-6">
                    {/* Curé */}
                    {paroisseDetails.organisation.cure ? (
                      <Card className="border-blue-200 bg-blue-50/30">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                <Crown className="h-6 w-6 text-blue-700" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                  Curé
                                </h3>
                                <p className="text-sm text-slate-600">
                                  Responsable de la paroisse
                                </p>
                              </div>
                            </div>

                            {/* Bouton pour changer de curé */}
                            <Dialog
                              open={isNominationDialogOpen}
                              onOpenChange={setIsNominationDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 cursor-pointer"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Changer
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Crown className="h-5 w-5 text-blue-500" />
                                    Nommer un nouveau curé
                                  </DialogTitle>
                                  <DialogDescription>
                                    Sélectionnez un serviteur pour le nommer
                                    comme curé de cette paroisse.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="serviteur_id">
                                      ID du Serviteur
                                    </Label>
                                    <Input
                                      id="serviteur_id"
                                      type="number"
                                      placeholder="Entrez l'ID du serviteur"
                                      value={serviteurId}
                                      onChange={(e) =>
                                        setServiteurId(e.target.value)
                                      }
                                      className="w-full"
                                      disabled={isNominating}
                                    />
                                    <p className="text-xs text-slate-500">
                                      Vous devez connaître l'ID du serviteur à
                                      nommer.
                                    </p>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsNominationDialogOpen(false);
                                      setServiteurId("");
                                    }}
                                    disabled={isNominating}
                                  >
                                    Annuler
                                  </Button>
                                  <Button
                                    onClick={handleNommerCure}
                                    disabled={!serviteurId || isNominating}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    {isNominating ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Nomination...
                                      </>
                                    ) : (
                                      "Nommer"
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <h4 className="text-xl font-bold text-slate-800 mb-2">
                              {getFullName(paroisseDetails.organisation.cure)}
                            </h4>

                            {paroisseDetails.organisation.cure
                              .num_de_telephone && (
                              <div className="flex items-center text-slate-600 mb-2">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>
                                  {
                                    paroisseDetails.organisation.cure
                                      .num_de_telephone
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      // Affichage quand il n'y a pas de curé
                      <Card className="border-gray-200 bg-gray-50/30">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                                <Crown className="h-6 w-6 text-gray-500" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                  Curé
                                </h3>
                                <p className="text-sm text-slate-600">
                                  Aucun curé assigné
                                </p>
                              </div>
                            </div>

                            {/* Bouton pour nommer un curé */}
                            <Dialog
                              open={isNominationDialogOpen}
                              onOpenChange={setIsNominationDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  className="h-8 bg-blue-600 hover:bg-blue-700"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Nommer
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Crown className="h-5 w-5 text-blue-500" />
                                    Nommer un curé
                                  </DialogTitle>
                                  <DialogDescription>
                                    Sélectionnez un serviteur pour le nommer
                                    comme curé de cette paroisse.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="serviteur_id_empty">
                                      ID du Serviteur
                                    </Label>
                                    <Input
                                      id="serviteur_id_empty"
                                      type="number"
                                      placeholder="Entrez l'ID du serviteur"
                                      value={serviteurId}
                                      onChange={(e) =>
                                        setServiteurId(e.target.value)
                                      }
                                      className="w-full"
                                      disabled={isNominating}
                                    />
                                    <p className="text-xs text-slate-500">
                                      Vous devez connaître l'ID du serviteur à
                                      nommer.
                                    </p>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsNominationDialogOpen(false);
                                      setServiteurId("");
                                    }}
                                    disabled={isNominating}
                                  >
                                    Annuler
                                  </Button>
                                  <Button
                                    onClick={handleNommerCure}
                                    disabled={!serviteurId || isNominating}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    {isNominating ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Nomination...
                                      </>
                                    ) : (
                                      "Nommer"
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                            <p className="text-slate-500">
                              Cette paroisse n'a pas encore de curé assigné.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Vicaires - SECTION MISE À JOUR */}
                    {paroisseDetails.organisation.vicaires &&
                    Array.isArray(paroisseDetails.organisation.vicaires) &&
                    paroisseDetails.organisation.vicaires.length > 0 ? (
                      <Card className="border-green-200 bg-green-50/30">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                                <UserCheck className="h-6 w-6 text-green-700" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                  Vicaires
                                </h3>
                                <p className="text-sm text-slate-600">
                                  {paroisseDetails.organisation.vicaires.length}{" "}
                                  vicaire(s)
                                </p>
                              </div>
                            </div>

                            {/* Bouton pour ajouter un vicaire */}
                            <Dialog
                              open={isVicaireDialogOpen}
                              onOpenChange={setIsVicaireDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 cursor-pointer"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Ajouter
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-green-600" />
                                    Affecter un vicaire
                                  </DialogTitle>
                                  <DialogDescription>
                                    Sélectionnez un serviteur pour l'affecter
                                    comme vicaire à cette paroisse.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="vicaire_serviteur_id">
                                      ID du Serviteur
                                    </Label>
                                    <Input
                                      id="vicaire_serviteur_id"
                                      type="number"
                                      placeholder="Entrez l'ID du serviteur"
                                      value={vicaireServiteurId}
                                      onChange={(e) =>
                                        setVicaireServiteurId(e.target.value)
                                      }
                                      className="w-full"
                                      disabled={isAffectingVicaire}
                                    />
                                    <p className="text-xs text-slate-500">
                                      Vous devez connaître l'ID du serviteur à
                                      affecter comme vicaire.
                                    </p>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsVicaireDialogOpen(false);
                                      setVicaireServiteurId("");
                                    }}
                                    disabled={isAffectingVicaire}
                                  >
                                    Annuler
                                  </Button>
                                  <Button
                                    onClick={handleAffecterVicaire}
                                    disabled={
                                      !vicaireServiteurId || isAffectingVicaire
                                    }
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {isAffectingVicaire ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Affectation...
                                      </>
                                    ) : (
                                      <>Affecter</>
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            {paroisseDetails.organisation.vicaires.map(
                              (vicaire: any, index: number) => (
                                <div key={vicaire.id || index}>
                                  <h4 className="text-xl font-bold text-slate-800 mb-2">
                                    {getFullName(vicaire)}
                                  </h4>

                                  {vicaire.num_de_telephone && (
                                    <div className="flex items-center text-slate-600 mb-2">
                                      <Phone className="h-3 w-3 mr-1" />
                                      <span>{vicaire.num_de_telephone}</span>
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      // Section pour ajouter des vicaires quand il n'y en a pas
                      <Card className="border-green-200 bg-green-50/30">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                                <UserCheck className="h-6 w-6 text-green-700" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                  Vicaires
                                </h3>
                                <p className="text-sm text-slate-600">
                                  Aucun vicaire assigné
                                </p>
                              </div>
                            </div>

                            {/* Bouton pour ajouter le premier vicaire */}
                            <Dialog
                              open={isVicaireDialogOpen}
                              onOpenChange={setIsVicaireDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 cursor-pointer"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Changer
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-green-600" />
                                    Affecter un vicaire
                                  </DialogTitle>
                                  <DialogDescription>
                                    Sélectionnez un serviteur pour l'affecter
                                    comme vicaire à cette paroisse.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="vicaire_serviteur_id_empty">
                                      ID du Serviteur
                                    </Label>
                                    <Input
                                      id="vicaire_serviteur_id_empty"
                                      type="number"
                                      placeholder="Entrez l'ID du serviteur"
                                      value={vicaireServiteurId}
                                      onChange={(e) =>
                                        setVicaireServiteurId(e.target.value)
                                      }
                                      className="w-full"
                                      disabled={isAffectingVicaire}
                                    />
                                    <p className="text-xs text-slate-500">
                                      Vous devez connaître l'ID du serviteur à
                                      affecter comme vicaire.
                                    </p>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsVicaireDialogOpen(false);
                                      setVicaireServiteurId("");
                                    }}
                                    disabled={isAffectingVicaire}
                                  >
                                    Annuler
                                  </Button>
                                  <Button
                                    onClick={handleAffecterVicaire}
                                    disabled={
                                      !vicaireServiteurId || isAffectingVicaire
                                    }
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {isAffectingVicaire ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Affectation...
                                      </>
                                    ) : (
                                      <>Affecter</>
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>

                          <div className="bg-white rounded-lg p-6 border border-green-200 text-center">
                            <UserCheck className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 mb-4">
                              Cette paroisse n'a pas encore de vicaires
                              assignés.
                            </p>
                            <p className="text-xs text-slate-400">
                              Cliquez sur "Ajouter" pour affecter un vicaire à
                              cette paroisse.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  // Cas où il n'y a pas d'organisation du tout
                  <div className="py-12 text-center">
                    <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Aucune organisation définie
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Cette paroisse n'a pas encore d'organisation structurée.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Dialog
                        open={isNominationDialogOpen}
                        onOpenChange={setIsNominationDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Nommer un curé
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Crown className="h-5 w-5 text-gray-500" />
                              Nommer un curé
                            </DialogTitle>
                            <DialogDescription>
                              Sélectionnez un serviteur pour le nommer comme
                              curé de cette paroisse.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="serviteur_id_no_org">
                                ID du Serviteur
                              </Label>
                              <Input
                                id="serviteur_id_no_org"
                                type="number"
                                placeholder="Entrez l'ID du serviteur"
                                value={serviteurId}
                                onChange={(e) => setServiteurId(e.target.value)}
                                className="w-full"
                                disabled={isNominating}
                              />
                              <p className="text-xs text-slate-500">
                                Vous devez connaître l'ID du serviteur à nommer.
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsNominationDialogOpen(false);
                                setServiteurId("");
                              }}
                              disabled={isNominating}
                            >
                              Annuler
                            </Button>
                            <Button
                              onClick={handleNommerCure}
                              disabled={!serviteurId || isNominating}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {isNominating ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Nomination...
                                </>
                              ) : (
                                "Nommer"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={isVicaireDialogOpen}
                        onOpenChange={setIsVicaireDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-50"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Affecter un vicaire
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-green-600" />
                              Affecter un vicaire
                            </DialogTitle>
                            <DialogDescription>
                              Sélectionnez un serviteur pour l'affecter comme
                              vicaire à cette paroisse.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="vicaire_serviteur_id_no_org">
                                ID du Serviteur
                              </Label>
                              <Input
                                id="vicaire_serviteur_id_no_org"
                                type="number"
                                placeholder="Entrez l'ID du serviteur"
                                value={vicaireServiteurId}
                                onChange={(e) =>
                                  setVicaireServiteurId(e.target.value)
                                }
                                className="w-full"
                                disabled={isAffectingVicaire}
                              />
                              <p className="text-xs text-slate-500">
                                Vous devez connaître l'ID du serviteur à
                                affecter comme vicaire.
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsVicaireDialogOpen(false);
                                setVicaireServiteurId("");
                              }}
                              disabled={isAffectingVicaire}
                            >
                              Annuler
                            </Button>
                            <Button
                              onClick={handleAffecterVicaire}
                              disabled={
                                !vicaireServiteurId || isAffectingVicaire
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isAffectingVicaire ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Affectation...
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Affecter
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Onglet Paroissiens */}
            <TabsContent value="paroissiens" className="mt-0">
              {filteredParoissiens.length === 0 ? (
                <EmptyTabContent
                  type="Paroissien"
                  icon={Users}
                  searchQuery={searchQuery}
                  onClearSearch={handleClearSearch}
                />
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-200 hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Paroissien
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Contact
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Genre
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Statut
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Abonnement
                        </TableHead>
                        {/* <TableHead className="font-semibold text-slate-700 py-3 px-4 text-right">
                           Actions
                         </TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedItems(
                        filteredParoissiens,
                        currentPageParoissiens
                      ).map((paroissien) => (
                        <TableRow
                          key={paroissien.id}
                          className="border-slate-200 hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3">
                                {paroissien.photo?.url ? (
                                  <img
                                    src={paroissien.photo.url}
                                    alt={`${paroissien.prenoms} ${paroissien.nom}`}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white font-medium text-sm">
                                    {paroissien.prenoms?.[0]?.toUpperCase()}
                                    {paroissien.nom?.[0]?.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className="font-medium text-slate-900">
                                  {paroissien.prenoms} {paroissien.nom}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="py-3 px-4">
                            <div className="flex items-center text-slate-600">
                              <Phone className="h-4 w-4 mr-2 text-slate-400" />
                              <span>
                                {paroissien.num_de_telephone || "Non renseigné"}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="py-3 px-4">
                            <Badge
                              className={
                                paroissien.genre === "M"
                                  ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                  : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
                              }
                            >
                              {formatGenre(paroissien.genre)}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-3 px-4">
                            <Badge
                              className={
                                paroissien.statut
                                  ?.toLowerCase()
                                  .includes("baptis")
                                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                  : paroissien.statut === "Aucun"
                                    ? "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                              }
                            >
                              {paroissien.statut || "Non défini"}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-3 px-4">
                            <div className="flex items-center">
                              {paroissien.est_abonne ? (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  <div>
                                    <span className="font-medium">Abonné</span>
                                    {paroissien.date_de_fin_abonnement && (
                                      <div className="text-xs text-slate-500">
                                        Jusqu'au{" "}
                                        {new Date(
                                          paroissien.date_de_fin_abonnement
                                        ).toLocaleDateString("fr-FR")}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center text-slate-500">
                                  <XIcon className="h-4 w-4 mr-2" />
                                  <span>Non abonné</span>
                                </div>
                              )}
                            </div>
                          </TableCell>

                          {/* <TableCell className="py-3 px-4 text-right">
                             <Button
                               variant="ghost"
                               size="sm"
                               className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                               onClick={() =>
                                 router.push(
                                   `/dashboard/diocese/paroissiens/${paroissien.id}`
                                 )
                               }
                               title="Voir les détails du paroissien"
                             >
                               <Eye className="h-4 w-4" />
                             </Button>
                           </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination pour les paroissiens */}
                  <PaginationControls
                    currentPage={currentPageParoissiens}
                    totalPages={getTotalPages(filteredParoissiens.length)}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredParoissiens.length}
                    onPreviousPage={() =>
                      setCurrentPageParoissiens((prev) => prev - 1)
                    }
                    onNextPage={() =>
                      setCurrentPageParoissiens((prev) => prev + 1)
                    }
                    type="paroissien"
                  />
                </div>
              )}
            </TabsContent>

            {/* Onglet Mouvements */}
            <TabsContent value="mouvements" className="mt-0">
              {filteredMouvements.length === 0 ? (
                <EmptyTabContent
                  type="Mouvement"
                  icon={Star}
                  searchQuery={searchQuery}
                  onClearSearch={handleClearSearch}
                />
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-200 hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Mouvement
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Type
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Responsable
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Aumônier
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Parrain
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedItems(
                        filteredMouvements,
                        currentPageMouvements
                      ).map((mouvement) => (
                        <TableRow
                          key={mouvement.id}
                          className="border-slate-200 hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <Star className="h-5 w-5 text-green-700" />
                              </div>
                              <div>
                                <span className="font-medium text-slate-900">
                                  {mouvement.nom}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="py-3 px-4">
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              {formatTypeMouvement(mouvement.type)}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-3 px-4">
                            {mouvement.responsable ? (
                              <div>
                                <div className="font-medium text-slate-900">
                                  {getFullName(mouvement.responsable)}
                                </div>
                                {mouvement.responsable.num_de_telephone && (
                                  <div className="flex items-center text-sm text-slate-600 mt-1">
                                    <Phone className="h-3 w-3 mr-1" />
                                    <span>
                                      {mouvement.responsable.num_de_telephone}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">
                                Non assigné
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="py-3 px-4">
                            {mouvement.aumonier ? (
                              <div>
                                <div className="font-medium text-slate-900">
                                  {getFullName(mouvement.aumonier)}
                                </div>
                                {mouvement.aumonier.num_de_telephone && (
                                  <div className="flex items-center text-sm text-slate-600 mt-1">
                                    <Phone className="h-3 w-3 mr-1" />
                                    <span>
                                      {mouvement.aumonier.num_de_telephone}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">
                                Non assigné
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="py-3 px-4">
                            {mouvement.parrain ? (
                              <div>
                                <div className="font-medium text-slate-900">
                                  {getFullName(mouvement.parrain)}
                                </div>
                                {mouvement.parrain.num_de_telephone && (
                                  <div className="flex items-center text-sm text-slate-600 mt-1">
                                    <Phone className="h-3 w-3 mr-1" />
                                    <span>
                                      {mouvement.parrain.num_de_telephone}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">
                                Non assigné
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination pour les mouvements */}
                  <PaginationControls
                    currentPage={currentPageMouvements}
                    totalPages={getTotalPages(filteredMouvements.length)}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredMouvements.length}
                    onPreviousPage={() =>
                      setCurrentPageMouvements((prev) => prev - 1)
                    }
                    onNextPage={() =>
                      setCurrentPageMouvements((prev) => prev + 1)
                    }
                    type="mouvement"
                  />
                </div>
              )}
            </TabsContent>

            {/* Onglet CEBs - (Code existant conservé) */}
            <TabsContent value="cebs" className="mt-0">
              {filteredCebs.length === 0 ? (
                <EmptyTabContent
                  type="CEB"
                  icon={Building2}
                  searchQuery={searchQuery}
                  onClearSearch={handleClearSearch}
                />
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-200 hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          CEB
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Président
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 px-4">
                          Contact
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedItems(filteredCebs, currentPageCebs).map(
                        (ceb) => (
                          <TableRow
                            key={ceb.id}
                            className="border-slate-200 hover:bg-slate-50/50 transition-colors"
                          >
                            <TableCell className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                  <Building2 className="h-5 w-5 text-purple-700" />
                                </div>
                                <div>
                                  <span className="font-medium text-slate-900">
                                    {ceb.nom}
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="py-3 px-4">
                              {ceb.president ? (
                                <div className="font-medium text-slate-900">
                                  {getFullName(ceb.president)}
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">
                                  Non assigné
                                </span>
                              )}
                            </TableCell>

                            <TableCell className="py-3 px-4">
                              {ceb.president?.num_de_telephone ? (
                                <div className="flex items-center text-slate-600">
                                  <Phone className="h-4 w-4 mr-2 text-slate-400" />
                                  <span>{ceb.president.num_de_telephone}</span>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">
                                  Non renseigné
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination pour les CEBs */}
                  <PaginationControls
                    currentPage={currentPageCebs}
                    totalPages={getTotalPages(filteredCebs.length)}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredCebs.length}
                    onPreviousPage={() =>
                      setCurrentPageCebs((prev) => prev - 1)
                    }
                    onNextPage={() => setCurrentPageCebs((prev) => prev + 1)}
                    type="CEB"
                  />
                </div>
              )}
            </TabsContent>

            {/* Onglet Événements - NOUVEAU AVEC CALENDRIER */}
            <TabsContent value="evenements" className="mt-0">
              <div className="space-y-6">
                {/* Barre d'outils pour les événements */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  {/* Filtre par type d'événement */}
                  <div className="flex flex-wrap gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                          <Filter className="h-4 w-4 mr-2" />
                          {eventFilterType === "tous"
                            ? "Tous les types"
                            : formatEventTypeForCalendar(eventFilterType)}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={() => setEventFilterType("tous")}
                        >
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-slate-300 mr-2" />
                            Tous les événements
                          </div>
                        </DropdownMenuItem>
                        {getUniqueEventTypes().map((type) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() => setEventFilterType(type)}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-3 h-3 rounded-full mr-2 ${getEventTypeColor(type).split(" ")[0]}`}
                              />
                              {formatEventTypeForCalendar(type)}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Actions d'export */}
                  {/* <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-9">
                            <Download className="h-4 w-4 mr-2" />
                            Exporter
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => exportEvents("excel")}>
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Excel (.xlsx)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => exportEvents("pdf")}>
                            <FileDown className="h-4 w-4 mr-2" />
                            PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </div> */}
                </div>

                {/* Vue calendrier uniquement */}
                {filteredEvenements.length === 0 ? (
                  <EmptyTabContent
                    type="Événement"
                    icon={Activity}
                    searchQuery={searchQuery}
                    onClearSearch={handleClearSearch}
                  />
                ) : (
                  <DatePicker
                    events={transformEventsForCalendar(filteredEvenements)}
                    moisActuel={calendarState.currentMonth}
                    anneeActuelle={calendarState.currentYear}
                    filtreType={eventFilterType}
                    selectedDates={[]}
                    onDatesChange={() => {}}
                    loading={loading}
                    allowPastDates={true}
                    showNavigation={true}
                    onEventClick={(event) => {
                      calendarState.setSelectedEvent(event);
                      toast.info("Événement sélectionné", {
                        description: `${event.libelle} - ${formatEventTypeForCalendar(event.type)} le ${event.date_de_debut ? new Date(event.date_de_debut).toLocaleDateString("fr-FR") : "date inconnue"}`,
                      });
                    }}
                    onMonthChange={(month, year) => {
                      calendarState.setMonth(month, year);
                    }}
                    className="bg-white rounded-lg"
                  />
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
