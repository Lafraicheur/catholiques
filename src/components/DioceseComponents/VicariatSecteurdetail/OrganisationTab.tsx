// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-html-link-for-pages */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState, useEffect } from "react";
// import {
//   Settings,
//   Crown,
//   Users,
//   User,
//   Phone,
//   Mail,
//   ShieldCheck,
//   UserPlus,
//   Search,
// } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { nominerVicariatEpiscopal } from "@/services/VicariatSecteur";

// interface Serviteur {
//   id: number;
//   nom: string;
//   prenoms: string;
//   email?: string;
//   num_de_telephone?: string;
//   statut: string;
// }

// interface OrganisationTabProps {
//   organisation: any;
//   vicariatId: number;
//   onNominationSuccess?: () => void;
// }

// export const OrganisationTab = ({
//   organisation,
//   vicariatId,
//   onNominationSuccess,
// }: OrganisationTabProps) => {
//   const [isNominationDialogOpen, setIsNominationDialogOpen] = useState(false);
//   const [searchServiteur, setSearchServiteur] = useState("");
//   const [selectedServiteur, setSelectedServiteur] = useState<Serviteur | null>(
//     null
//   );
//   const [serviteurs, setServiteurs] = useState<Serviteur[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingServiteurs, setIsLoadingServiteurs] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Charger les serviteurs disponibles quand le dialog s'ouvre
//   useEffect(() => {
//     if (isNominationDialogOpen) {
//       fetchServiteursDisponibles();
//     }
//   }, [isNominationDialogOpen]);

//   const fetchServiteursDisponibles = async () => {
//     setIsLoadingServiteurs(true);
//     setError(null);
//     try {
//       // TODO: Remplacer par votre appel API réel pour récupérer les serviteurs
//       // const token = localStorage.getItem('auth_token');
//       // const response = await axios.get(`${API_URL}/serviteurs/disponibles`, {
//       //   headers: { Authorization: `Bearer ${token}` }
//       // });
//       // setServiteurs(response.data.items || []);

//       // Pour l'instant, on laisse vide - vous devez implémenter votre API
//       setServiteurs([]);
//     } catch (err: any) {
//       setError("Erreur lors du chargement des serviteurs disponibles");
//     } finally {
//       setIsLoadingServiteurs(false);
//     }
//   };

//   const serviteursFiltres = serviteurs.filter((serviteur) =>
//     `${serviteur.prenoms} ${serviteur.nom}`
//       .toLowerCase()
//       .includes(searchServiteur.toLowerCase())
//   );

//   const handleNomination = async () => {
//     if (!selectedServiteur) {
//       setError("Veuillez sélectionner un serviteur");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       await nominerVicariatEpiscopal(vicariatId, selectedServiteur.id);
//       setIsNominationDialogOpen(false);
//       resetNominationForm();

//       if (onNominationSuccess) {
//         onNominationSuccess();
//       }
//     } catch (err: any) {
//       setError(err.message || "Une erreur est survenue lors de la nomination");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetNominationForm = () => {
//     setSelectedServiteur(null);
//     setSearchServiteur("");
//     setError(null);
//   };

//   const handleDialogClose = (open: boolean) => {
//     setIsNominationDialogOpen(open);
//     if (!open) {
//       resetNominationForm();
//     }
//   };

//   if (!organisation || typeof organisation !== "object") {
//     return (
//       <div className="py-12 text-center">
//         <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//         <h3 className="text-lg font-medium text-slate-900 mb-2">
//           Aucune organisation définie
//         </h3>
//         <p className="text-sm text-slate-500 mb-4">
//           Ce vicariat/secteur n'a pas encore d'organisation structurée.
//         </p>

//         <Dialog open={isNominationDialogOpen} onOpenChange={handleDialogClose}>
//           <DialogTrigger asChild>
//             <Button className="bg-blue-600 hover:bg-blue-700">
//               <UserPlus className="h-4 w-4 mr-2" />
//               Nominer un Vicaire Épiscopal
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle className="flex items-center">
//                 <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
//                 Nominer un Vicaire Épiscopal
//               </DialogTitle>
//             </DialogHeader>

//             <div className="space-y-4">
//               {/* Recherche de serviteur */}
//               <div>
//                 <Label htmlFor="search">Rechercher un serviteur</Label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                   <Input
//                     id="search"
//                     placeholder="Nom ou prénom..."
//                     value={searchServiteur}
//                     onChange={(e) => setSearchServiteur(e.target.value)}
//                     className="pl-10"
//                     disabled={isLoadingServiteurs}
//                   />
//                 </div>
//               </div>

//               {/* Liste des serviteurs */}
//               <div className="max-h-60 overflow-y-auto space-y-2">
//                 {isLoadingServiteurs ? (
//                   <div className="text-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                     <p className="text-sm text-slate-500 mt-2">
//                       Chargement des serviteurs...
//                     </p>
//                   </div>
//                 ) : serviteursFiltres.length > 0 ? (
//                   serviteursFiltres.map((serviteur) => (
//                     <div
//                       key={serviteur.id}
//                       className={`p-3 rounded-lg border cursor-pointer transition-colors ${
//                         selectedServiteur?.id === serviteur.id
//                           ? "border-blue-500 bg-blue-50"
//                           : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
//                       }`}
//                       onClick={() => setSelectedServiteur(serviteur)}
//                     >
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <h4 className="font-medium text-slate-900">
//                             {serviteur.prenoms} {serviteur.nom}
//                           </h4>
//                           <Badge variant="secondary" className="text-xs mt-1">
//                             {serviteur.statut}
//                           </Badge>

//                           {serviteur.email && (
//                             <div className="flex items-center text-xs text-slate-500 mt-1">
//                               <Mail className="h-3 w-3 mr-1" />
//                               <span>{serviteur.email}</span>
//                             </div>
//                           )}

//                           {serviteur.num_de_telephone && (
//                             <div className="flex items-center text-xs text-slate-500 mt-1">
//                               <Phone className="h-3 w-3 mr-1" />
//                               <span>{serviteur.num_de_telephone}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : serviteurs.length === 0 && !isLoadingServiteurs ? (
//                   <div className="text-center py-8 text-slate-500">
//                     <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
//                     <p className="text-sm">Aucun serviteur disponible</p>
//                     <p className="text-xs mt-1">
//                       Implémentez l'API pour charger les serviteurs
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 text-slate-500">
//                     <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
//                     <p className="text-sm">Aucun serviteur trouvé</p>
//                     <p className="text-xs mt-1">
//                       Essayez avec d'autres termes de recherche
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Serviteur sélectionné */}
//               {selectedServiteur && (
//                 <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                   <p className="text-sm font-medium text-blue-900 mb-1">
//                     Serviteur sélectionné :
//                   </p>
//                   <p className="text-sm text-blue-800">
//                     {selectedServiteur.prenoms} {selectedServiteur.nom}
//                   </p>
//                 </div>
//               )}

//               {/* Affichage des erreurs */}
//               {error && (
//                 <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                   <p className="text-sm text-red-700">{error}</p>
//                 </div>
//               )}

//               {/* Boutons d'action */}
//               <div className="flex justify-end space-x-2 pt-4">
//                 <Button
//                   variant="outline"
//                   onClick={() => handleDialogClose(false)}
//                   disabled={isLoading}
//                 >
//                   Annuler
//                 </Button>
//                 <Button
//                   onClick={handleNomination}
//                   disabled={!selectedServiteur || isLoading}
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   {isLoading ? "Nomination..." : "Nominer"}
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     );
//   }

//   const hasVicaireEpiscopal =
//     organisation.vicaire_episcopal &&
//     organisation.vicaire_episcopal.nom &&
//     organisation.vicaire_episcopal.prenoms;

//   const hasCureDoyens =
//     organisation.cure_doyens &&
//     Array.isArray(organisation.cure_doyens) &&
//     organisation.cure_doyens.length > 0;

//   if (!hasVicaireEpiscopal && !hasCureDoyens) {
//     return (
//       <div className="py-12 text-center">
//         <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
//         <h3 className="text-lg font-medium text-slate-900 mb-2">
//           Organisation incomplète
//         </h3>
//         <p className="text-sm text-slate-500 mb-4">
//           Les informations d'organisation de ce vicariat/secteur sont
//           incomplètes.
//         </p>

//         <Dialog open={isNominationDialogOpen} onOpenChange={handleDialogClose}>
//           <DialogTrigger asChild>
//             <Button className="bg-blue-600 hover:bg-blue-700">
//               <UserPlus className="h-4 w-4 mr-2" />
//               Nominer un Vicaire Épiscopal
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle className="flex items-center">
//                 <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
//                 Nominer un Vicaire Épiscopal
//               </DialogTitle>
//             </DialogHeader>

//             <div className="space-y-4">
//               {/* Recherche de serviteur */}
//               <div>
//                 <Label htmlFor="search">Rechercher un serviteur</Label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                   <Input
//                     id="search"
//                     placeholder="Nom ou prénom..."
//                     value={searchServiteur}
//                     onChange={(e) => setSearchServiteur(e.target.value)}
//                     className="pl-10"
//                     disabled={isLoadingServiteurs}
//                   />
//                 </div>
//               </div>

//               {/* Liste des serviteurs */}
//               <div className="max-h-60 overflow-y-auto space-y-2">
//                 {isLoadingServiteurs ? (
//                   <div className="text-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                     <p className="text-sm text-slate-500 mt-2">
//                       Chargement des serviteurs...
//                     </p>
//                   </div>
//                 ) : serviteursFiltres.length > 0 ? (
//                   serviteursFiltres.map((serviteur) => (
//                     <div
//                       key={serviteur.id}
//                       className={`p-3 rounded-lg border cursor-pointer transition-colors ${
//                         selectedServiteur?.id === serviteur.id
//                           ? "border-blue-500 bg-blue-50"
//                           : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
//                       }`}
//                       onClick={() => setSelectedServiteur(serviteur)}
//                     >
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <h4 className="font-medium text-slate-900">
//                             {serviteur.prenoms} {serviteur.nom}
//                           </h4>
//                           <Badge variant="secondary" className="text-xs mt-1">
//                             {serviteur.statut}
//                           </Badge>

//                           {serviteur.email && (
//                             <div className="flex items-center text-xs text-slate-500 mt-1">
//                               <Mail className="h-3 w-3 mr-1" />
//                               <span>{serviteur.email}</span>
//                             </div>
//                           )}

//                           {serviteur.num_de_telephone && (
//                             <div className="flex items-center text-xs text-slate-500 mt-1">
//                               <Phone className="h-3 w-3 mr-1" />
//                               <span>{serviteur.num_de_telephone}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : serviteurs.length === 0 && !isLoadingServiteurs ? (
//                   <div className="text-center py-8 text-slate-500">
//                     <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
//                     <p className="text-sm">Aucun serviteur disponible</p>
//                     <p className="text-xs mt-1">
//                       Implémentez l'API pour charger les serviteurs
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 text-slate-500">
//                     <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
//                     <p className="text-sm">Aucun serviteur trouvé</p>
//                     <p className="text-xs mt-1">
//                       Essayez avec d'autres termes de recherche
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Serviteur sélectionné */}
//               {selectedServiteur && (
//                 <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                   <p className="text-sm font-medium text-blue-900 mb-1">
//                     Serviteur sélectionné :
//                   </p>
//                   <p className="text-sm text-blue-800">
//                     {selectedServiteur.prenoms} {selectedServiteur.nom}
//                   </p>
//                 </div>
//               )}

//               {/* Affichage des erreurs */}
//               {error && (
//                 <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                   <p className="text-sm text-red-700">{error}</p>
//                 </div>
//               )}

//               {/* Boutons d'action */}
//               <div className="flex justify-end space-x-2 pt-4">
//                 <Button
//                   variant="outline"
//                   onClick={() => handleDialogClose(false)}
//                   disabled={isLoading}
//                 >
//                   Annuler
//                 </Button>
//                 <Button
//                   onClick={handleNomination}
//                   disabled={!selectedServiteur || isLoading}
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   {isLoading ? "Nomination..." : "Nominer"}
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Vicaire Épiscopal */}
//       {hasVicaireEpiscopal ? (
//         <Card className="border-blue-200 bg-blue-50/30">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center">
//                 <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
//                   <ShieldCheck className="h-6 w-6 text-blue-700" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-slate-900">
//                     Vicaire Épiscopal
//                   </h3>
//                   <p className="text-sm text-slate-600">
//                     Responsable du vicariat/secteur
//                   </p>
//                 </div>
//               </div>

//               <Dialog
//                 open={isNominationDialogOpen}
//                 onOpenChange={handleDialogClose}
//               >
//                 <DialogTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="border-blue-300 text-blue-700 hover:bg-blue-50"
//                   >
//                     <UserPlus className="h-4 w-4 mr-2" />
//                     Changer
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-md">
//                   <DialogHeader>
//                     <DialogTitle className="flex items-center">
//                       <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
//                       Changer le Vicaire Épiscopal
//                     </DialogTitle>
//                   </DialogHeader>

//                   <div className="space-y-4">
//                     {/* Recherche de serviteur */}
//                     <div>
//                       <Label htmlFor="search">Rechercher un serviteur</Label>
//                       <div className="relative">
//                         <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                         <Input
//                           id="search"
//                           placeholder="Nom ou prénom..."
//                           value={searchServiteur}
//                           onChange={(e) => setSearchServiteur(e.target.value)}
//                           className="pl-10"
//                           disabled={isLoadingServiteurs}
//                         />
//                       </div>
//                     </div>

//                     {/* Liste des serviteurs */}
//                     <div className="max-h-60 overflow-y-auto space-y-2">
//                       {isLoadingServiteurs ? (
//                         <div className="text-center py-8">
//                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                           <p className="text-sm text-slate-500 mt-2">
//                             Chargement des serviteurs...
//                           </p>
//                         </div>
//                       ) : serviteursFiltres.length > 0 ? (
//                         serviteursFiltres.map((serviteur) => (
//                           <div
//                             key={serviteur.id}
//                             className={`p-3 rounded-lg border cursor-pointer transition-colors ${
//                               selectedServiteur?.id === serviteur.id
//                                 ? "border-blue-500 bg-blue-50"
//                                 : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
//                             }`}
//                             onClick={() => setSelectedServiteur(serviteur)}
//                           >
//                             <div className="flex items-start justify-between">
//                               <div className="flex-1">
//                                 <h4 className="font-medium text-slate-900">
//                                   {serviteur.prenoms} {serviteur.nom}
//                                 </h4>
//                                 <Badge
//                                   variant="secondary"
//                                   className="text-xs mt-1"
//                                 >
//                                   {serviteur.statut}
//                                 </Badge>

//                                 {serviteur.email && (
//                                   <div className="flex items-center text-xs text-slate-500 mt-1">
//                                     <Mail className="h-3 w-3 mr-1" />
//                                     <span>{serviteur.email}</span>
//                                   </div>
//                                 )}

//                                 {serviteur.num_de_telephone && (
//                                   <div className="flex items-center text-xs text-slate-500 mt-1">
//                                     <Phone className="h-3 w-3 mr-1" />
//                                     <span>{serviteur.num_de_telephone}</span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : serviteurs.length === 0 && !isLoadingServiteurs ? (
//                         <div className="text-center py-8 text-slate-500">
//                           <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
//                           <p className="text-sm">Aucun serviteur disponible</p>
//                           <p className="text-xs mt-1">
//                             Implémentez l'API pour charger les serviteurs
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="text-center py-8 text-slate-500">
//                           <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
//                           <p className="text-sm">Aucun serviteur trouvé</p>
//                           <p className="text-xs mt-1">
//                             Essayez avec d'autres termes de recherche
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     {/* Serviteur sélectionné */}
//                     {selectedServiteur && (
//                       <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                         <p className="text-sm font-medium text-blue-900 mb-1">
//                           Nouveau vicaire sélectionné :
//                         </p>
//                         <p className="text-sm text-blue-800">
//                           {selectedServiteur.prenoms} {selectedServiteur.nom}
//                         </p>
//                       </div>
//                     )}

//                     {/* Affichage des erreurs */}
//                     {error && (
//                       <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                         <p className="text-sm text-red-700">{error}</p>
//                       </div>
//                     )}

//                     {/* Boutons d'action */}
//                     <div className="flex justify-end space-x-2 pt-4">
//                       <Button
//                         variant="outline"
//                         onClick={() => handleDialogClose(false)}
//                         disabled={isLoading}
//                       >
//                         Annuler
//                       </Button>
//                       <Button
//                         onClick={handleNomination}
//                         disabled={!selectedServiteur || isLoading}
//                         className="bg-blue-600 hover:bg-blue-700"
//                       >
//                         {isLoading ? "Changement..." : "Changer"}
//                       </Button>
//                     </div>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             </div>

//             <div className="bg-white rounded-lg p-4 border border-blue-200">
//               <h4 className="text-xl font-bold text-slate-800 mb-2">
//                 {organisation.vicaire_episcopal.prenoms}{" "}
//                 {organisation.vicaire_episcopal.nom}
//               </h4>

//               {organisation.vicaire_episcopal.num_de_telephone && (
//                 <div className="flex items-center text-slate-600 mb-2">
//                   <Phone className="h-4 w-4 mr-2" />
//                   <span>{organisation.vicaire_episcopal.num_de_telephone}</span>
//                 </div>
//               )}

//               {organisation.vicaire_episcopal.email && (
//                 <div className="flex items-center text-slate-600">
//                   <Mail className="h-4 w-4 mr-2" />
//                   <span>{organisation.vicaire_episcopal.email}</span>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <Card className="border-blue-200 bg-blue-50/30 border-dashed">
//           <CardContent className="p-6 text-center">
//             <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
//               <ShieldCheck className="h-6 w-6 text-blue-700" />
//             </div>
//             <h3 className="text-lg font-semibold text-slate-900 mb-2">
//               Aucun Vicaire Épiscopal
//             </h3>
//             <p className="text-sm text-slate-600 mb-4">
//               Ce vicariat/secteur n'a pas encore de vicaire épiscopal assigné.
//             </p>

//             <Dialog
//               open={isNominationDialogOpen}
//               onOpenChange={handleDialogClose}
//             >
//               <DialogTrigger asChild>
//                 <Button className="bg-blue-600 hover:bg-blue-700">
//                   <UserPlus className="h-4 w-4 mr-2" />
//                   Nominer un Vicaire Épiscopal
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                   <DialogTitle className="flex items-center">
//                     <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
//                     Nominer un Vicaire Épiscopal
//                   </DialogTitle>
//                 </DialogHeader>

//                 <div className="space-y-4">
//                   {/* Recherche de serviteur */}
//                   <div>
//                     <Label htmlFor="search">Rechercher un serviteur</Label>
//                     <div className="relative">
//                       <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                       <Input
//                         id="search"
//                         placeholder="Nom ou prénom..."
//                         value={searchServiteur}
//                         onChange={(e) => setSearchServiteur(e.target.value)}
//                         className="pl-10"
//                         disabled={isLoadingServiteurs}
//                       />
//                     </div>
//                   </div>

//                   {/* Liste des serviteurs */}
//                   <div className="max-h-60 overflow-y-auto space-y-2">
//                     {isLoadingServiteurs ? (
//                       <div className="text-center py-8">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                         <p className="text-sm text-slate-500 mt-2">
//                           Chargement des serviteurs...
//                         </p>
//                       </div>
//                     ) : serviteursFiltres.length > 0 ? (
//                       serviteursFiltres.map((serviteur) => (
//                         <div
//                           key={serviteur.id}
//                           className={`p-3 rounded-lg border cursor-pointer transition-colors ${
//                             selectedServiteur?.id === serviteur.id
//                               ? "border-blue-500 bg-blue-50"
//                               : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
//                           }`}
//                           onClick={() => setSelectedServiteur(serviteur)}
//                         >
//                           <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                               <h4 className="font-medium text-slate-900">
//                                 {serviteur.prenoms} {serviteur.nom}
//                               </h4>
//                               <Badge
//                                 variant="secondary"
//                                 className="text-xs mt-1"
//                               >
//                                 {serviteur.statut}
//                               </Badge>

//                               {serviteur.email && (
//                                 <div className="flex items-center text-xs text-slate-500 mt-1">
//                                   <Mail className="h-3 w-3 mr-1" />
//                                   <span>{serviteur.email}</span>
//                                 </div>
//                               )}

//                               {serviteur.num_de_telephone && (
//                                 <div className="flex items-center text-xs text-slate-500 mt-1">
//                                   <Phone className="h-3 w-3 mr-1" />
//                                   <span>{serviteur.num_de_telephone}</span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     ) : serviteurs.length === 0 && !isLoadingServiteurs ? (
//                       <div className="text-center py-8 text-slate-500">
//                         <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
//                         <p className="text-sm">Aucun serviteur disponible</p>
//                         <p className="text-xs mt-1">
//                           Implémentez l'API pour charger les serviteurs
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="text-center py-8 text-slate-500">
//                         <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
//                         <p className="text-sm">Aucun serviteur trouvé</p>
//                         <p className="text-xs mt-1">
//                           Essayez avec d'autres termes de recherche
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   {/* Serviteur sélectionné */}
//                   {selectedServiteur && (
//                     <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                       <p className="text-sm font-medium text-blue-900 mb-1">
//                         Serviteur sélectionné :
//                       </p>
//                       <p className="text-sm text-blue-800">
//                         {selectedServiteur.prenoms} {selectedServiteur.nom}
//                       </p>
//                     </div>
//                   )}

//                   {/* Affichage des erreurs */}
//                   {error && (
//                     <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                       <p className="text-sm text-red-700">{error}</p>
//                     </div>
//                   )}

//                   {/* Boutons d'action */}
//                   <div className="flex justify-end space-x-2 pt-4">
//                     <Button
//                       variant="outline"
//                       onClick={() => handleDialogClose(false)}
//                       disabled={isLoading}
//                     >
//                       Annuler
//                     </Button>
//                     <Button
//                       onClick={handleNomination}
//                       disabled={!selectedServiteur || isLoading}
//                       className="bg-blue-600 hover:bg-blue-700"
//                     >
//                       {isLoading ? "Nomination..." : "Nominer"}
//                     </Button>
//                   </div>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </CardContent>
//         </Card>
//       )}

//       {/* Curés Doyens */}
//       {hasCureDoyens && (
//         <Card className="border-green-200 bg-green-50/30">
//           <CardContent className="p-6">
//             <div className="flex items-center mb-4">
//               <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
//                 <Crown className="h-6 w-6 text-green-700" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-slate-900">
//                   Curés Doyens
//                 </h3>
//                 <p className="text-sm text-slate-600">
//                   {organisation.cure_doyens.length} curé(s) doyen(s)
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {organisation.cure_doyens.map((cure: any, index: number) => (
//                 <div
//                   key={cure.id || index}
//                   className="bg-white rounded-lg p-4 border border-green-200"
//                 >
//                   <div className="flex items-start">
//                     <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
//                       <User className="h-5 w-5 text-green-700" />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-bold text-slate-800 mb-1">
//                         {cure.prenoms} {cure.nom}
//                       </h4>

//                       {cure.num_de_telephone && (
//                         <div className="flex items-center text-sm text-slate-600 mb-1">
//                           <Phone className="h-3 w-3 mr-1" />
//                           <span>{cure.num_de_telephone}</span>
//                         </div>
//                       )}

//                       {cure.email && (
//                         <div className="flex items-center text-sm text-slate-600">
//                           <Mail className="h-3 w-3 mr-1" />
//                           <span>{cure.email}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  Settings,
  Crown,
  Users,
  User,
  Phone,
  Mail,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { nominerVicariatEpiscopal } from "@/services/VicariatSecteur";

interface OrganisationTabProps {
  organisation: any;
  vicariatId: number;
  onNominationSuccess?: () => void;
}

export const OrganisationTab = ({
  organisation,
  vicariatId,
  onNominationSuccess,
}: OrganisationTabProps) => {
  const [isNominationDialogOpen, setIsNominationDialogOpen] = useState(false);
  const [serviteurId, setServiteurId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNomination = async () => {
    // Validation de l'ID du serviteur
    const parsedServiteurId = parseInt(serviteurId.trim());
    
    if (!serviteurId.trim()) {
      setError("Veuillez saisir l'ID du serviteur");
      return;
    }

    if (isNaN(parsedServiteurId) || parsedServiteurId <= 0) {
      setError("L'ID du serviteur doit être un nombre valide");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await nominerVicariatEpiscopal(vicariatId, parsedServiteurId);
      setIsNominationDialogOpen(false);
      resetNominationForm();

      if (onNominationSuccess) {
        onNominationSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la nomination");
    } finally {
      setIsLoading(false);
    }
  };

  const resetNominationForm = () => {
    setServiteurId("");
    setError(null);
  };

  const handleDialogClose = (open: boolean) => {
    setIsNominationDialogOpen(open);
    if (!open) {
      resetNominationForm();
    }
  };

  // Composant Dialog réutilisable
  const NominationDialog = ({ title }: { title: string }) => (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
          {title}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Saisie de l'ID du serviteur */}
        <div>
          <Label htmlFor="serviteur-id">ID du serviteur</Label>
          <Input
            id="serviteur-id"
            type="number"
            placeholder="Saisissez l'ID du serviteur..."
            value={serviteurId}
            onChange={(e) => setServiteurId(e.target.value)}
            disabled={isLoading}
            min="1"
          />
          <p className="text-xs text-slate-500 mt-1">
            Entrez l'identifiant numérique du serviteur à nominer
          </p>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => handleDialogClose(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleNomination}
            disabled={!serviteurId.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Nomination..." : "Nominer"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  if (!organisation || typeof organisation !== "object") {
    return (
      <div className="py-12 text-center">
        <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Aucune organisation définie
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Ce vicariat/secteur n'a pas encore d'organisation structurée.
        </p>

        <Dialog open={isNominationDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Nominer un Vicaire Épiscopal
            </Button>
          </DialogTrigger>
          <NominationDialog title="Nominer un Vicaire Épiscopal" />
        </Dialog>
      </div>
    );
  }

  const hasVicaireEpiscopal =
    organisation.vicaire_episcopal &&
    organisation.vicaire_episcopal.nom &&
    organisation.vicaire_episcopal.prenoms;

  const hasCureDoyens =
    organisation.cure_doyens &&
    Array.isArray(organisation.cure_doyens) &&
    organisation.cure_doyens.length > 0;

  if (!hasVicaireEpiscopal && !hasCureDoyens) {
    return (
      <div className="py-12 text-center">
        <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Organisation incomplète
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Les informations d'organisation de ce vicariat/secteur sont
          incomplètes.
        </p>

        <Dialog open={isNominationDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Nominer un Vicaire Épiscopal
            </Button>
          </DialogTrigger>
          <NominationDialog title="Nominer un Vicaire Épiscopal" />
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vicaire Épiscopal */}
      {hasVicaireEpiscopal ? (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <ShieldCheck className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Vicaire Épiscopal
                  </h3>
                  <p className="text-sm text-slate-600">
                    Responsable du vicariat/secteur
                  </p>
                </div>
              </div>

              <Dialog
                open={isNominationDialogOpen}
                onOpenChange={handleDialogClose}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Changer
                  </Button>
                </DialogTrigger>
                <NominationDialog title="Changer le Vicaire Épiscopal" />
              </Dialog>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-800 mb-2">
                    {organisation.vicaire_episcopal.prenoms}{" "}
                    {organisation.vicaire_episcopal.nom}
                  </h4>

                  {organisation.vicaire_episcopal.num_de_telephone && (
                    <div className="flex items-center text-slate-600 mb-2">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{organisation.vicaire_episcopal.num_de_telephone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-blue-200 bg-blue-50/30 border-dashed">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-6 w-6 text-blue-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Aucun Vicaire Épiscopal
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Ce vicariat/secteur n'a pas encore de vicaire épiscopal assigné.
            </p>

            <Dialog
              open={isNominationDialogOpen}
              onOpenChange={handleDialogClose}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nominer un Vicaire Épiscopal
                </Button>
              </DialogTrigger>
              <NominationDialog title="Nominer un Vicaire Épiscopal" />
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Curés Doyens */}
      {hasCureDoyens && (
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Crown className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Curés Doyens
                </h3>
                <p className="text-sm text-slate-600">
                  {organisation.cure_doyens.length} curé(s) doyen(s)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organisation.cure_doyens.map((cure: any, index: number) => (
                <div
                  key={cure.id || index}
                  className="bg-white rounded-lg p-4 border border-green-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                        <User className="h-5 w-5 text-green-700" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 mb-1">
                          {cure.prenoms} {cure.nom}
                        </h4>

                        {cure.num_de_telephone && (
                          <div className="flex items-center text-sm text-slate-600 mb-1">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{cure.num_de_telephone}</span>
                          </div>
                        )}

                        {cure.email && (
                          <div className="flex items-center text-sm text-slate-600">
                            <Mail className="h-3 w-3 mr-1" />
                            <span>{cure.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};