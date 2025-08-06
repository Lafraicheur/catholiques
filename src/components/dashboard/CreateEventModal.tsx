// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-html-link-for-pages */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */

// import { useState, useEffect } from "react";
// import { Loader2, Plus, Trash2, Copy, Calendar } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { toast } from "sonner";
// import axios from "axios";
// import { EventType } from "./EventCard";

// interface CreateEventModalProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   selectedDates: number[];
//   paroisseId: number;
//   onEventsCreated: () => void;
// }

// interface BaseEventForm {
//   type: EventType;
//   libelle: string;
//   description: string;
// }

// // Interface pour une messe individuelle
// interface SingleMesseForm {
//   id: string; // ID unique pour React keys
//   libelle: string;
//   description: string;
//   type_messe: "ORDINAIRE" | "SPECIALE";
//   heure_de_debut: number;
//   heure_de_fin: number;
// }

// // Interface pour le formulaire de messes multiples
// interface MesseEventForm extends BaseEventForm {
//   type: "MESSE";
//   messes: SingleMesseForm[];
// }

// interface ActiviteEventForm extends BaseEventForm {
//   type: "ACTIVITÉ";
//   est_actif: boolean;
//   montant_par_paroissien: number;
// }

// type NewEventForm = MesseEventForm | ActiviteEventForm;

// // Utilitaires pour la conversion temps
// const formatMinutesToTime = (minutes: number): string => {
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
// };

// const convertTimeToMinutes = (time: string): number => {
//   const [hours, minutes] = time.split(":").map(Number);
//   return hours * 60 + minutes;
// };

// const formatDate = (timestamp: number): string => {
//   const date = new Date(timestamp);
//   return date.toLocaleDateString("fr-FR", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
// };

// const formatDateForInput = (timestamp: number): string => {
//   const date = new Date(timestamp);
//   return date.toISOString().split("T")[0];
// };

// const convertDateInputToTimestamp = (dateString: string): number => {
//   return new Date(dateString + "T23:59:59").getTime();
// };

// // Configuration des types d'événements
// const EVENT_TYPES = [
//   { value: "MESSE", label: "Messe" },
//   { value: "ACTIVITÉ", label: "Activité" },
// ] as const;

// const MESSE_TYPES = [
//   { value: "ORDINAIRE", label: "Ordinaire" },
//   { value: "SPECIALE", label: "Spéciale" },
// ] as const;

// // Fonction pour créer une nouvelle messe vide
// const createNewMesse = (): SingleMesseForm => ({
//   id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//   libelle: "",
//   description: "",
//   type_messe: "ORDINAIRE",
//   heure_de_debut: 420, // 7h00 par défaut
//   heure_de_fin: 480, // 8h00 par défaut
// });

// // Formulaires par défaut selon le type
// const getDefaultFormData = (eventType: EventType): NewEventForm => {
//   const baseData = {
//     libelle: "",
//     description: "",
//   };

//   const oneWeekFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000;

//   switch (eventType) {
//     case "MESSE":
//       return {
//         ...baseData,
//         type: "MESSE",
//         messes: [createNewMesse()],
//       };

//     case "ACTIVITÉ":
//       return {
//         ...baseData,
//         type: "ACTIVITÉ",
//         est_actif: true,
//         montant_par_paroissien: 0,
//       };

//     default:
//       return getDefaultFormData("MESSE");
//   }
// };

// export default function CreateEventModal({
//   isOpen,
//   onOpenChange,
//   selectedDates,
//   paroisseId,
//   onEventsCreated,
// }: CreateEventModalProps) {
//   const [creating, setCreating] = useState(false);
//   const [formData, setFormData] = useState<NewEventForm>(
//     getDefaultFormData("MESSE")
//   );

//   // Réinitialiser le formulaire à l'ouverture
//   const resetForm = () => {
//     setFormData(getDefaultFormData("MESSE"));
//   };

//   // Gérer le changement de type d'événement
//   const handleTypeChange = (newType: EventType) => {
//     setFormData(getDefaultFormData(newType));
//   };

//   // Fonctions pour gérer les messes multiples
//   const addMesse = () => {
//     if (formData.type === "MESSE") {
//       setFormData((prev) => {
//         if (prev.type === "MESSE") {
//           return {
//             ...prev,
//             messes: [...prev.messes, createNewMesse()],
//           };
//         }
//         return prev;
//       });
//     }
//   };

//   const removeMesse = (messeId: string) => {
//     if (formData.type === "MESSE" && formData.messes.length > 1) {
//       setFormData((prev) => {
//         if (prev.type === "MESSE" && prev.messes.length > 1) {
//           return {
//             ...prev,
//             messes: prev.messes.filter((m) => m.id !== messeId),
//           };
//         }
//         return prev;
//       });
//     }
//   };

//   const duplicateMesse = (messeId: string) => {
//     if (formData.type === "MESSE" && "messes" in formData) {
//       const messeToDuplicate = formData.messes.find((m) => m.id === messeId);
//       if (messeToDuplicate) {
//         const duplicatedMesse = {
//           ...messeToDuplicate,
//           id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//         };
//         setFormData((prev) => {
//           if (prev.type === "MESSE" && "messes" in prev) {
//             return {
//               ...prev,
//               messes: [...prev.messes, duplicatedMesse],
//             };
//           }
//           return prev;
//         });
//       }
//     }
//   };

//   const updateMesse = (
//     messeId: string,
//     field: keyof SingleMesseForm,
//     value: any
//   ) => {
//     if (formData.type === "MESSE") {
//       setFormData((prev) => {
//         if (prev.type === "MESSE") {
//           return {
//             ...prev,
//             messes: prev.messes.map((messe) =>
//               messe.id === messeId ? { ...messe, [field]: value } : messe
//             ),
//           };
//         }
//         return prev;
//       });
//     }
//   };

//   // Ajouter des modèles rapides pour les messes courantes
//   const ajouterMesseRapide = (type: "matin" | "soir" | "midi") => {
//     if (formData.type === "MESSE") {
//       let nouvelleMesse: SingleMesseForm;

//       switch (type) {
//         case "matin":
//           nouvelleMesse = {
//             ...createNewMesse(),
//             libelle: "Messe du matin",
//             description: "Messe matinale",
//             heure_de_debut: 420, // 7h00
//             heure_de_fin: 480, // 8h00
//           };
//           break;
//         case "midi":
//           nouvelleMesse = {
//             ...createNewMesse(),
//             libelle: "Messe de midi",
//             description: "Messe de milieu de journée",
//             heure_de_debut: 720, // 12h00
//             heure_de_fin: 780, // 13h00
//           };
//           break;
//         case "soir":
//           nouvelleMesse = {
//             ...createNewMesse(),
//             libelle: "Messe du soir",
//             description: "Messe vespérale",
//             heure_de_debut: 1140, // 19h00
//             heure_de_fin: 1200, // 20h00
//           };
//           break;
//       }

//       setFormData((prev) => {
//         if (prev.type === "MESSE" && "messes" in prev) {
//           return {
//             ...prev,
//             messes: [...prev.messes, nouvelleMesse],
//           };
//         }
//         return prev;
//       });
//     }
//   };

//   // Validation du formulaire
//   const validateForm = (): string | null => {
//     // Validation spécifique pour les messes
//     if (formData.type === "MESSE") {
//       if (formData.messes.length === 0) {
//         return "Au moins une messe est requise";
//       }

//       for (const messe of formData.messes) {
//         if (!messe.libelle.trim()) {
//           return "Tous les titres de messe sont obligatoires";
//         }
//         if (messe.heure_de_debut >= messe.heure_de_fin) {
//           return `L'heure de fin doit être après l'heure de début pour "${messe.libelle}"`;
//         }
//       }

//       // Vérifier les chevauchements d'heures
//       const sortedMesses = [...formData.messes].sort(
//         (a, b) => a.heure_de_debut - b.heure_de_debut
//       );
//       for (let i = 0; i < sortedMesses.length - 1; i++) {
//         if (sortedMesses[i].heure_de_fin > sortedMesses[i + 1].heure_de_debut) {
//           return `Chevauchement d'horaires entre "${sortedMesses[i].libelle}" et "${sortedMesses[i + 1].libelle}"`;
//         }
//       }

//       // Vérifier qu'au moins une date est sélectionnée
//       if (selectedDates.length === 0) {
//         return "Aucune date sélectionnée";
//       }

//       return null;
//     }

//     // Validation pour les autres types (code existant)
//     if (!formData.libelle.trim()) {
//       return "Le titre de l'événement est obligatoire";
//     }

//     if (
//       "montant_par_paroissien" in formData &&
//       formData.montant_par_paroissien < 0
//     ) {
//       return "Le montant par paroissien ne peut pas être négatif";
//     }

//     if (selectedDates.length === 0) {
//       return "Aucune date sélectionnée";
//     }

//     return null;
//   };

//   // Créer les événements
//   const handleCreateEvents = async () => {
//     const validationError = validateForm();
//     if (validationError) {
//       toast.error(validationError);
//       return;
//     }

//     setCreating(true);

//     try {
//       const API_URL_STATISTIQUE =
//         process.env.NEXT_PUBLIC_API_URL_STATISTIQUE ||
//         "https://api.cathoconnect.ci/api:HzF8fFua";
//       const token = localStorage.getItem("auth_token");

//       if (!token) {
//         throw new Error("Token d'authentification non trouvé");
//       }

//       let totalEventsCreated = 0;

//       // Pour les messes, créer chaque messe individuellement pour chaque date
//       if (formData.type === "MESSE") {
//         // Créer les messes pour toutes les dates sélectionnées
//         for (const date of selectedDates) {
//           for (const messe of formData.messes) {
//             const requestData = {
//               type: "MESSE",
//               dates: [date],
//               libelle: messe.libelle.trim(),
//               description: messe.description.trim(),
//               paroisse_id: paroisseId,
//               type_messe: messe.type_messe,
//               heure_de_debut: new Date(
//                 new Date(date).getFullYear(),
//                 new Date(date).getMonth(),
//                 new Date(date).getDate(),
//                 Math.floor(messe.heure_de_debut / 60),
//                 messe.heure_de_debut % 60
//               ).getTime(),
//               heure_de_fin: new Date(
//                 new Date(date).getFullYear(),
//                 new Date(date).getMonth(),
//                 new Date(date).getDate(),
//                 Math.floor(messe.heure_de_fin / 60),
//                 messe.heure_de_fin % 60
//               ).getTime(),
//             };

//             const response = await axios.post(
//               `${API_URL_STATISTIQUE}/evenements/creer`,
//               requestData,
//               {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                   Accept: "application/json",
//                   "Content-Type": "application/json",
//                 },
//               }
//             );

//             totalEventsCreated++;
//           }
//         }
//       } else {
//         // Pour les autres types d'événements (code existant)
//         const requestData: any = {
//           type: formData.type,
//           dates: selectedDates,
//           libelle: formData.libelle.trim(),
//           description: formData.description.trim(),
//           paroisse_id: paroisseId,
//         };

//         // Ajouter les champs spécifiques selon le type
//         switch (formData.type) {
//           case "ACTIVITÉ":
//             requestData.est_actif = formData.est_actif;
//             requestData.montant_par_paroissien =
//               formData.montant_par_paroissien;
//             break;
//         }

//         const response = await axios.post(
//           `${API_URL_STATISTIQUE}/evenements/creer`,
//           requestData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         totalEventsCreated = selectedDates.length;
//       }

//       // Succès
//       toast.success(
//         `${totalEventsCreated} événement${totalEventsCreated > 1 ? "s" : ""} créé${totalEventsCreated > 1 ? "s" : ""} avec succès`
//       );

//       // Fermer la modal et réinitialiser
//       onOpenChange(false);
//       resetForm();
//       onEventsCreated();
//     } catch (error: any) {
//       console.error("Erreur lors de la création des événements:", error);

//       if (axios.isAxiosError(error)) {
//         const errorMessage =
//           error.response?.data?.message ||
//           error.response?.data?.error ||
//           "Erreur lors de la création des événements";

//         toast.error(`Erreur: ${errorMessage}`);

//         if (error.response?.status === 401) {
//           toast.error("Session expirée. Veuillez vous reconnecter.");
//         }
//       } else {
//         toast.error("Une erreur inattendue est survenue");
//       }
//     } finally {
//       setCreating(false);
//     }
//   };

//   // Gérer la fermeture de la modal
//   const handleOpenChange = (open: boolean) => {
//     if (!open && !creating) {
//       resetForm();
//     }
//     onOpenChange(open);
//   };

//   // Fonctions pour mettre à jour les champs spécifiques
//   const updateFormField = (field: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Calculer le nombre total d'événements qui seront créés
//   const getTotalEventCount = () => {
//     if (formData.type === "MESSE") {
//       return selectedDates.length * formData.messes.length;
//     }
//     return selectedDates.length;
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleOpenChange}>
//       <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Plus className="h-5 w-5" />
//             Créer des événements multiples
//           </DialogTitle>
//           <DialogDescription>
//             {formData.type === "MESSE" ? (
//               <>
//                 Configurez votre programmation de messes pour{" "}
//                 {selectedDates.length} date{selectedDates.length > 1 ? "s" : ""}
//               </>
//             ) : (
//               <>
//                 Vous allez créer{" "}
//                 <span className="font-medium text-slate-900">
//                   {getTotalEventCount()}
//                 </span>{" "}
//                 événement
//                 {getTotalEventCount() > 1 ? "s" : ""} aux dates sélectionnées.
//               </>
//             )}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           {/* Type d'événement */}
//           <div className="space-y-2">
//             <Label htmlFor="type">Type d'événement *</Label>
//             <Select value={formData.type} onValueChange={handleTypeChange}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Sélectionner un type" />
//               </SelectTrigger>
//               <SelectContent>
//                 {EVENT_TYPES.map((type) => (
//                   <SelectItem key={type.value} value={type.value}>
//                     {type.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Formulaire spécifique pour les messes */}
//           {formData.type === "MESSE" && (
//             <div className="space-y-6">
//               {/* Configuration des messes */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <Label className="text-lg font-medium">
//                     Configuration des messes ({formData.messes.length})
//                   </Label>
//                   <div className="flex gap-2 flex-wrap">
//                     {/* <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => ajouterMesseRapide("matin")}
//                     >
//                       + Messe matin
//                     </Button>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => ajouterMesseRapide("midi")}
//                     >
//                       + Messe midi
//                     </Button>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => ajouterMesseRapide("soir")}
//                     >
//                       + Messe soir
//                     </Button> */}
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={addMesse}
//                     >
//                       <Plus className="h-4 w-4 mr-1" />
//                       Messe vide
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="space-y-4 max-h-96 overflow-y-auto">
//                   {formData.messes.map((messe, index) => (
//                     <div
//                       key={messe.id}
//                       className="border rounded-lg p-4 bg-slate-50 space-y-4"
//                     >
//                       <div className="flex items-center justify-between">
//                         <Label className="font-medium">
//                           Messe #{index + 1}
//                         </Label>
//                         <div className="flex gap-1">
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => duplicateMesse(messe.id)}
//                             title="Dupliquer cette messe"
//                           >
//                             <Copy className="h-3 w-3" />
//                           </Button>
//                           {formData.messes.length > 1 && (
//                             <Button
//                               type="button"
//                               variant="outline"
//                               size="sm"
//                               onClick={() => removeMesse(messe.id)}
//                               title="Supprimer cette messe"
//                             >
//                               <Trash2 className="h-3 w-3" />
//                             </Button>
//                           )}
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label>Titre de la messe *</Label>
//                           <Input
//                             value={messe.libelle}
//                             onChange={(e) =>
//                               updateMesse(messe.id, "libelle", e.target.value)
//                             }
//                             placeholder="Ex: Messe du matin, Messe dominicale..."
//                             required
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label>Type de messe</Label>
//                           <Select
//                             value={messe.type_messe}
//                             onValueChange={(value) =>
//                               updateMesse(messe.id, "type_messe", value)
//                             }
//                           >
//                             <SelectTrigger>
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {MESSE_TYPES.map((type) => (
//                                 <SelectItem key={type.value} value={type.value}>
//                                   {type.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>

//                         <div className="space-y-2">
//                           <Label>Heure de début *</Label>
//                           <Input
//                             type="time"
//                             value={formatMinutesToTime(messe.heure_de_debut)}
//                             onChange={(e) =>
//                               updateMesse(
//                                 messe.id,
//                                 "heure_de_debut",
//                                 convertTimeToMinutes(e.target.value)
//                               )
//                             }
//                             required
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label>Heure de fin *</Label>
//                           <Input
//                             type="time"
//                             value={formatMinutesToTime(messe.heure_de_fin)}
//                             onChange={(e) =>
//                               updateMesse(
//                                 messe.id,
//                                 "heure_de_fin",
//                                 convertTimeToMinutes(e.target.value)
//                               )
//                             }
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label>Description</Label>
//                         <Textarea
//                           value={messe.description}
//                           onChange={(e) =>
//                             updateMesse(messe.id, "description", e.target.value)
//                           }
//                           placeholder="Description de cette messe..."
//                           rows={2}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Formulaires pour les autres types d'événements (code existant) */}
//           {formData.type !== "MESSE" && (
//             <>
//               {/* Titre */}
//               <div className="space-y-2">
//                 <Label htmlFor="libelle">Titre de l'événement *</Label>
//                 <Input
//                   id="libelle"
//                   value={formData.libelle}
//                   onChange={(e) => updateFormField("libelle", e.target.value)}
//                   placeholder="Ex: Catéchisme, Collecte..."
//                   required
//                 />
//               </div>

//               {/* Description */}
//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) =>
//                     updateFormField("description", e.target.value)
//                   }
//                   placeholder="Description de l'événement (optionnel)"
//                   rows={3}
//                 />
//               </div>

//               {/* Autres champs selon le type (code existant) */}
//               {formData.type === "ACTIVITÉ" && (
//                 <>
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="est_actif"
//                       checked={
//                         "est_actif" in formData ? formData.est_actif : false
//                       }
//                       onCheckedChange={(checked) =>
//                         updateFormField("est_actif", checked)
//                       }
//                     />
//                     <Label htmlFor="est_actif">Événement actif</Label>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="montant_par_paroissien">
//                       Montant par paroissien (FCFA)
//                     </Label>
//                     <Input
//                       id="montant_par_paroissien"
//                       type="number"
//                       min="0"
//                       value={
//                         "montant_par_paroissien" in formData
//                           ? formData.montant_par_paroissien
//                           : 0
//                       }
//                       onChange={(e) =>
//                         updateFormField(
//                           "montant_par_paroissien",
//                           Number(e.target.value)
//                         )
//                       }
//                     />
//                   </div>
//                 </>
//               )}
//             </>
//           )}

//           {/* Liste des dates sélectionnées */}
//           <div className="space-y-2">
//             <Label>Dates sélectionnées ({selectedDates.length})</Label>
//             <div className="max-h-32 overflow-y-auto border rounded-md p-3 bg-slate-50">
//               {selectedDates.length === 0 ? (
//                 <div className="text-sm text-slate-500 italic">
//                   Aucune date sélectionnée
//                 </div>
//               ) : (
//                 <div className="space-y-1">
//                   {selectedDates.map((timestamp) => (
//                     <div key={timestamp} className="text-sm">
//                       • {formatDate(timestamp)}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <DialogFooter className="gap-2">
//           <Button
//             variant="outline"
//             onClick={() => handleOpenChange(false)}
//             disabled={creating}
//           >
//             Annuler
//           </Button>
//           <Button
//             onClick={handleCreateEvents}
//             disabled={
//               creating ||
//               (formData.type === "MESSE" && formData.messes.length === 0) ||
//               selectedDates.length === 0
//             }
//           >
//             {creating ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 Création en cours...
//               </>
//             ) : (
//               <>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Créer {getTotalEventCount() > 0 && `(${getTotalEventCount()})`}
//               </>
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // Hook pour gérer l'état de la modal
// export function useCreateEventModal() {
//   const [isOpen, setIsOpen] = useState(false);

//   const openModal = () => setIsOpen(true);
//   const closeModal = () => setIsOpen(false);

//   return {
//     isOpen,
//     openModal,
//     closeModal,
//     setIsOpen,
//   };
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Copy, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import axios from "axios";
import { EventType } from "./EventCard";

interface CreateEventModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDates: number[];
  paroisseId: number;
  onEventsCreated: () => void;
}

interface BaseEventForm {
  type: EventType;
  libelle: string;
  description: string;
}

// Interface pour une messe individuelle
interface SingleMesseForm {
  id: string;
  libelle: string;
  description: string;
  type_messe: "ORDINAIRE" | "SPECIALE";
  heure_de_debut: number;
  heure_de_fin: number;
}

// Interface pour une option d'activité
interface ActivityOption {
  id: string;
  label: string;
  montant: number;
}

// Interface pour le formulaire de messes multiples
interface MesseEventForm extends BaseEventForm {
  type: "MESSE";
  messes: SingleMesseForm[];
}

// Interface modifiée pour les activités
interface ActiviteEventForm extends BaseEventForm {
  type: "ACTIVITÉ";
  date_de_debut: number;
  lieu: string;
  options: ActivityOption[];
  categorie: string; // Changé en string libre
  est_gratuit: boolean;
  image: File | null;
  imagePreview: string | null;
}

type NewEventForm = MesseEventForm | ActiviteEventForm;

const CATEGORIES_ACTIVITE = [
  { value: "Retraites", label: "Retraites" },
  { value: "Pélérinage", label: "Pélerinage" },
  { value: "Formations", label: "Formations" },
  { value: "Détente", label: "Détente" },
] as const;

// Utilitaires pour la conversion temps
const formatMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatDateTimeForInput = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toISOString().slice(0, 16);
};

const convertDateTimeInputToTimestamp = (dateTimeString: string): number => {
  return new Date(dateTimeString).getTime();
};

// Configuration des types d'événements
const EVENT_TYPES = [
  { value: "MESSE", label: "Messe" },
  { value: "ACTIVITÉ", label: "Activité" },
] as const;

const MESSE_TYPES = [
  { value: "ORDINAIRE", label: "Ordinaire" },
  { value: "SPECIALE", label: "Spéciale" },
] as const;

// Fonction pour créer une nouvelle messe vide
const createNewMesse = (): SingleMesseForm => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  libelle: "",
  description: "",
  type_messe: "ORDINAIRE",
  heure_de_debut: 420, // 7h00 par défaut
  heure_de_fin: 480, // 8h00 par défaut
});

// Fonction pour créer une nouvelle option d'activité
const createNewOption = (): ActivityOption => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  label: "",
  montant: 0,
});

// Formulaires par défaut selon le type
const getDefaultFormData = (eventType: EventType): NewEventForm => {
  const baseData = {
    libelle: "",
    description: "",
  };

  const tomorrow = Date.now() + 24 * 60 * 60 * 1000;

  switch (eventType) {
    case "MESSE":
      return {
        ...baseData,
        type: "MESSE",
        messes: [createNewMesse()],
      };

    case "ACTIVITÉ":
      return {
        ...baseData,
        type: "ACTIVITÉ",
        date_de_debut: tomorrow,
        lieu: "",
        options: [createNewOption()], // Option par défaut
        categorie: "Retraites", // String libre
        est_gratuit: false, // Par défaut payant pour voir les options
        image: null,
        imagePreview: null,
      };

    default:
      return getDefaultFormData("MESSE");
  }
};

export default function CreateEventModal({
  isOpen,
  onOpenChange,
  selectedDates,
  paroisseId,
  onEventsCreated,
}: CreateEventModalProps) {
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<NewEventForm>(
    getDefaultFormData("MESSE")
  );

  // Réinitialiser le formulaire à l'ouverture
  const resetForm = () => {
    setFormData(getDefaultFormData("MESSE"));
  };

  // Gérer le changement de type d'événement
  const handleTypeChange = (newType: EventType) => {
    setFormData(getDefaultFormData(newType));
  };

  // Fonctions pour gérer les messes multiples
  const addMesse = () => {
    if (formData.type === "MESSE") {
      setFormData((prev) => {
        if (prev.type === "MESSE") {
          return {
            ...prev,
            messes: [...prev.messes, createNewMesse()],
          };
        }
        return prev;
      });
    }
  };

  const removeMesse = (messeId: string) => {
    if (formData.type === "MESSE" && formData.messes.length > 1) {
      setFormData((prev) => {
        if (prev.type === "MESSE" && prev.messes.length > 1) {
          return {
            ...prev,
            messes: prev.messes.filter((m) => m.id !== messeId),
          };
        }
        return prev;
      });
    }
  };

  const duplicateMesse = (messeId: string) => {
    if (formData.type === "MESSE" && "messes" in formData) {
      const messeToDuplicate = formData.messes.find((m) => m.id === messeId);
      if (messeToDuplicate) {
        const duplicatedMesse = {
          ...messeToDuplicate,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        setFormData((prev) => {
          if (prev.type === "MESSE" && "messes" in prev) {
            return {
              ...prev,
              messes: [...prev.messes, duplicatedMesse],
            };
          }
          return prev;
        });
      }
    }
  };

  const updateMesse = (
    messeId: string,
    field: keyof SingleMesseForm,
    value: any
  ) => {
    if (formData.type === "MESSE") {
      setFormData((prev) => {
        if (prev.type === "MESSE") {
          return {
            ...prev,
            messes: prev.messes.map((messe) =>
              messe.id === messeId ? { ...messe, [field]: value } : messe
            ),
          };
        }
        return prev;
      });
    }
  };

  // Fonctions pour gérer les options d'activité
  const addOption = () => {
    if (formData.type === "ACTIVITÉ") {
      setFormData((prev) => {
        if (prev.type === "ACTIVITÉ") {
          return {
            ...prev,
            options: [...prev.options, createNewOption()],
          };
        }
        return prev;
      });
    }
  };

  const removeOption = (optionId: string) => {
    if (formData.type === "ACTIVITÉ" && formData.options.length > 1) {
      setFormData((prev) => {
        if (prev.type === "ACTIVITÉ" && prev.options.length > 1) {
          return {
            ...prev,
            options: prev.options.filter((o) => o.id !== optionId),
          };
        }
        return prev;
      });
    }
  };

  const updateOption = (
    optionId: string,
    field: keyof ActivityOption,
    value: any
  ) => {
    if (formData.type === "ACTIVITÉ") {
      setFormData((prev) => {
        if (prev.type === "ACTIVITÉ") {
          return {
            ...prev,
            options: prev.options.map((option) =>
              option.id === optionId ? { ...option, [field]: value } : option
            ),
          };
        }
        return prev;
      });
    }
  };

  // Gérer l'upload d'image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && formData.type === "ACTIVITÉ") {
      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner un fichier image valide");
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 45 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 45MB");
        return;
      }

      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => {
          if (prev.type === "ACTIVITÉ") {
            return {
              ...prev,
              image: file,
              imagePreview: event.target?.result as string,
            };
          }
          return prev;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    if (formData.type === "ACTIVITÉ") {
      setFormData((prev) => {
        if (prev.type === "ACTIVITÉ") {
          return {
            ...prev,
            image: null,
            imagePreview: null,
          };
        }
        return prev;
      });
    }
  };

  // Validation du formulaire
  const validateForm = (): string | null => {
    // Validation spécifique pour les messes
    if (formData.type === "MESSE") {
      if (formData.messes.length === 0) {
        return "Au moins une messe est requise";
      }

      for (const messe of formData.messes) {
        if (!messe.libelle.trim()) {
          return "Tous les titres de messe sont obligatoires";
        }
        if (messe.heure_de_debut >= messe.heure_de_fin) {
          return `L'heure de fin doit être après l'heure de début pour "${messe.libelle}"`;
        }
      }

      // Vérifier les chevauchements d'heures
      const sortedMesses = [...formData.messes].sort(
        (a, b) => a.heure_de_debut - b.heure_de_debut
      );
      for (let i = 0; i < sortedMesses.length - 1; i++) {
        if (sortedMesses[i].heure_de_fin > sortedMesses[i + 1].heure_de_debut) {
          return `Chevauchement d'horaires entre "${sortedMesses[i].libelle}" et "${sortedMesses[i + 1].libelle}"`;
        }
      }

      if (selectedDates.length === 0) {
        return "Aucune date sélectionnée";
      }

      return null;
    }

    // Validation pour les activités
    if (formData.type === "ACTIVITÉ") {
      if (!formData.libelle.trim()) {
        return "Le titre de l'activité est obligatoire";
      }

      if (!formData.lieu.trim()) {
        return "Le lieu de l'activité est obligatoire";
      }

      if (!formData.categorie.trim()) {
        return "La catégorie de l'activité est obligatoire";
      }

      // Validation des options si l'activité n'est pas gratuite
      if (!formData.est_gratuit) {
        if (formData.options.length === 0) {
          return "Au moins une option tarifaire est requise pour une activité payante";
        }

        for (const option of formData.options) {
          if (!option.label.trim()) {
            return "Tous les libellés d'options sont obligatoires";
          }
          if (option.montant < 0) {
            return "Le montant ne peut pas être négatif";
          }
        }
      }

      if (selectedDates.length === 0) {
        return "Aucune date sélectionnée";
      }

      return null;
    }

    return "Type d'événement non valide";
  };

  // Créer les événements
  const handleCreateEvents = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setCreating(true);

    try {
      const API_URL_STATISTIQUE =
        process.env.NEXT_PUBLIC_API_URL_STATISTIQUE ||
        "https://api.cathoconnect.ci/api:HzF8fFua";
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      let totalEventsCreated = 0;

      // Pour les messes, créer chaque messe individuellement pour chaque date
      if (formData.type === "MESSE") {
        for (const date of selectedDates) {
          for (const messe of formData.messes) {
            const requestData = {
              type: "MESSE",
              dates: [date],
              libelle: messe.libelle.trim(),
              description: messe.description.trim(),
              paroisse_id: paroisseId,
              type_messe: messe.type_messe,
              heure_de_debut: new Date(
                new Date(date).getFullYear(),
                new Date(date).getMonth(),
                new Date(date).getDate(),
                Math.floor(messe.heure_de_debut / 60),
                messe.heure_de_debut % 60
              ).getTime(),
              heure_de_fin: new Date(
                new Date(date).getFullYear(),
                new Date(date).getMonth(),
                new Date(date).getDate(),
                Math.floor(messe.heure_de_fin / 60),
                messe.heure_de_fin % 60
              ).getTime(),
            };

            const response = await axios.post(
              `${API_URL_STATISTIQUE}/evenements/creer`,
              requestData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              }
            );

            totalEventsCreated++;
          }
        }
      } else if (formData.type === "ACTIVITÉ") {
        // Pour les activités, utiliser FormData pour l'upload d'image
        const formDataToSend = new FormData();

        formDataToSend.append("type", "ACTIVITÉ");
        formDataToSend.append("libelle", formData.libelle.trim());
        formDataToSend.append("description", formData.description.trim());
        formDataToSend.append("paroisse_id", paroisseId.toString());
        formDataToSend.append("dates", JSON.stringify(selectedDates));
        formDataToSend.append(
          "date_de_debut",
          formData.date_de_debut.toString()
        );
        formDataToSend.append("lieu", formData.lieu.trim());
        formDataToSend.append("categorie_activite", formData.categorie);
        formDataToSend.append("est_gratuit", formData.est_gratuit.toString());

        // Ajouter les options si l'activité n'est pas gratuite
        if (!formData.est_gratuit && formData.options.length > 0) {
          formDataToSend.append(
            "options",
            JSON.stringify(
              formData.options.map((opt) => ({
                label: opt.label.trim(),
                montant: opt.montant,
              }))
            )
          );
        }

        // Ajouter l'image si présente
        if (formData.image) {
          formDataToSend.append("iimage", formData.image);
        }

        const response = await axios.post(
          `${API_URL_STATISTIQUE}/evenements/creer`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );

        totalEventsCreated = selectedDates.length;
      }

      // Succès
      toast.success(
        `${totalEventsCreated} événement${totalEventsCreated > 1 ? "s" : ""} créé${totalEventsCreated > 1 ? "s" : ""} avec succès`
      );

      // Fermer la modal et réinitialiser
      onOpenChange(false);
      resetForm();
      onEventsCreated();
    } catch (error: any) {
      console.error("Erreur lors de la création des événements:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erreur lors de la création des événements";

        toast.error(`Erreur: ${errorMessage}`);

        if (error.response?.status === 401) {
          toast.error("Session expirée. Veuillez vous reconnecter.");
        }
      } else {
        toast.error("Une erreur inattendue est survenue");
      }
    } finally {
      setCreating(false);
    }
  };

  // Gérer la fermeture de la modal
  const handleOpenChange = (open: boolean) => {
    if (!open && !creating) {
      resetForm();
    }
    onOpenChange(open);
  };

  // Fonctions pour mettre à jour les champs spécifiques
  const updateFormField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculer le nombre total d'événements qui seront créés
  const getTotalEventCount = () => {
    if (formData.type === "MESSE") {
      return selectedDates.length * formData.messes.length;
    }
    return selectedDates.length;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Créer des événements multiples
          </DialogTitle>
          <DialogDescription>
            {formData.type === "MESSE" ? (
              <>
                Configurez votre programmation de messes pour{" "}
                {selectedDates.length} date{selectedDates.length > 1 ? "s" : ""}
              </>
            ) : (
              <>
                Vous allez créer{" "}
                <span className="font-medium text-slate-900">
                  {getTotalEventCount()}
                </span>{" "}
                événement
                {getTotalEventCount() > 1 ? "s" : ""} aux dates sélectionnées.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Type d'événement */}
          <div className="space-y-2">
            <Label htmlFor="type">Type d'événement *</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Formulaire spécifique pour les messes */}
          {formData.type === "MESSE" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">
                    Configuration des messes ({formData.messes.length})
                  </Label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addMesse}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Messe vide
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {formData.messes.map((messe, index) => (
                    <div
                      key={messe.id}
                      className="border rounded-lg p-4 bg-slate-50 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">
                          Messe #{index + 1}
                        </Label>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => duplicateMesse(messe.id)}
                            title="Dupliquer cette messe"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          {formData.messes.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeMesse(messe.id)}
                              title="Supprimer cette messe"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Titre de la messe *</Label>
                          <Input
                            value={messe.libelle}
                            onChange={(e) =>
                              updateMesse(messe.id, "libelle", e.target.value)
                            }
                            placeholder="Ex: Messe du matin, Messe dominicale..."
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Type de messe</Label>
                          <Select
                            value={messe.type_messe}
                            onValueChange={(value) =>
                              updateMesse(messe.id, "type_messe", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {MESSE_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Heure de début *</Label>
                          <Input
                            type="time"
                            value={formatMinutesToTime(messe.heure_de_debut)}
                            onChange={(e) =>
                              updateMesse(
                                messe.id,
                                "heure_de_debut",
                                convertTimeToMinutes(e.target.value)
                              )
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Heure de fin *</Label>
                          <Input
                            type="time"
                            value={formatMinutesToTime(messe.heure_de_fin)}
                            onChange={(e) =>
                              updateMesse(
                                messe.id,
                                "heure_de_fin",
                                convertTimeToMinutes(e.target.value)
                              )
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={messe.description}
                          onChange={(e) =>
                            updateMesse(messe.id, "description", e.target.value)
                          }
                          placeholder="Description de cette messe..."
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Formulaire pour les activités */}
          {formData.type === "ACTIVITÉ" && (
            <div className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="libelle">Titre de l'activité *</Label>
                  <Input
                    id="libelle"
                    value={formData.libelle}
                    onChange={(e) => updateFormField("libelle", e.target.value)}
                    placeholder="Ex: Retraite spirituelle, Concert..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lieu">Lieu *</Label>
                  <Input
                    id="lieu"
                    value={formData.lieu}
                    onChange={(e) => updateFormField("lieu", e.target.value)}
                    placeholder="Ex: Église, Salle paroissiale..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    updateFormField("description", e.target.value)
                  }
                  placeholder="Description de l'activité..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categorie">Catégorie *</Label>
                  <Select
                    value={formData.categorie}
                    onValueChange={(value) =>
                      updateFormField("categorie", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES_ACTIVITE.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Gratuit/Payant */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="est_gratuit"
                    checked={formData.est_gratuit}
                    onCheckedChange={(checked) =>
                      updateFormField("est_gratuit", checked)
                    }
                  />
                  <Label htmlFor="est_gratuit">Activité gratuite</Label>
                </div>

                {/* Options tarifaires - Toujours affichées */}
                {!formData.est_gratuit ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-medium">
                        Options tarifaires ({formData.options.length})
                        {formData.est_gratuit && (
                          <span className="text-sm font-normal text-slate-500 ml-2">
                            (optionnel pour activité gratuite)
                          </span>
                        )}
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addOption}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter une option
                      </Button>
                    </div>

                    {formData.options.length > 0 && (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {formData.options.map((option, index) => (
                          <div
                            key={option.id}
                            className="border rounded-lg p-3 bg-slate-50 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">
                                Option #{index + 1}
                              </Label>
                              {formData.options.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeOption(option.id)}
                                  title="Supprimer cette option"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label>Libellé de l'option *</Label>
                                <Input
                                  value={option.label}
                                  onChange={(e) =>
                                    updateOption(
                                      option.id,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Ex: Tarif étudiant, Tarif famille..."
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Montant (FCFA) *</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={option.montant}
                                  onChange={(e) =>
                                    updateOption(
                                      option.id,
                                      "montant",
                                      Number(e.target.value)
                                    )
                                  }
                                  placeholder="0"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {formData.options.length === 0 && (
                      <div className="text-center py-4 text-slate-500 text-sm border rounded-lg bg-slate-50">
                        Aucune option tarifaire définie. Cliquez sur "Ajouter
                        une option" pour commencer.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Upload d'image */}
              <div className="space-y-4">
                <Label>Image de l'activité *</Label>

                {!formData.imagePreview ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="mt-4">
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500"
                        >
                          <span>Télécharger une image</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="text-slate-500 text-sm mt-1">
                          PNG, JPG, GIF jusqu'à 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={formData.imagePreview}
                      alt="Aperçu"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Liste des dates sélectionnées */}
          <div className="space-y-2">
            <Label>Dates sélectionnées ({selectedDates.length})</Label>
            <div className="max-h-32 overflow-y-auto border rounded-md p-3 bg-slate-50">
              {selectedDates.length === 0 ? (
                <div className="text-sm text-slate-500 italic">
                  Aucune date sélectionnée
                </div>
              ) : (
                <div className="space-y-1">
                  {selectedDates.map((timestamp) => (
                    <div key={timestamp} className="text-sm">
                      • {formatDate(timestamp)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={creating}
          >
            Annuler
          </Button>
          <Button
            onClick={handleCreateEvents}
            disabled={
              creating ||
              (formData.type === "MESSE" && formData.messes.length === 0) ||
              selectedDates.length === 0 ||
              (formData.type === "ACTIVITÉ" && !formData.libelle.trim()) ||
              (formData.type === "ACTIVITÉ" && !formData.lieu.trim()) ||
              (formData.type === "ACTIVITÉ" && !formData.categorie.trim()) ||
              (formData.type === "ACTIVITÉ" &&
                !formData.est_gratuit &&
                formData.options.length === 0)
            }
          >
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Créer {getTotalEventCount() > 0 && `(${getTotalEventCount()})`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook pour gérer l'état de la modal
export function useCreateEventModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal,
    setIsOpen,
  };
}
