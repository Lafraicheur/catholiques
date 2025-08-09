// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-html-link-for-pages */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */

// // components/retrait/RetraitForm.tsx
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Loader2, Smartphone, CreditCard } from "lucide-react";
// import { useRetrait } from "@/hooks/useRetrait";
// import {
//   OPERATEURS,
//   OPERATEUR_LOGOS,
//   SOUS_COMPTES,
//   type Operateur,
//   type SousCompteId,
// } from "@/types/retrait";

// import { SuccessAnimationModal } from "./SuccessAnimationModal";

// const retraitSchema = z.object({
//   id_sous_compte: z.string().min(1, "Veuillez sélectionner un sous-compte"),
//   montant: z
//     .number()
//     .min(20, "Le montant minimum est de 100 FCFA")
//     .max(1000000, "Le montant maximum est de 1 000 000 FCFA"),
//   operateur: z.string().min(1, "Veuillez sélectionner un opérateur"),
//   num_de_telephone: z
//     .string()
//     .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres")
//     .max(15, "Le numéro de téléphone ne peut pas dépasser 15 chiffres")
//     .regex(/^[0-9+\-\s()]+$/, "Format de numéro de téléphone invalide")
//     .transform((val) => val.replace(/[\s\-\(\)]/g, "")),
// });

// type RetraitFormData = z.infer<typeof retraitSchema>;

// // 🔧 Type pour les données transformées (correspond exactement à l'API)
// type TransformedRetraitData = {
//   id_sous_compte: string;
//   montant: number;
//   operateur: string;
//   num_de_telephone: string; // ← Garder le nom original
// };

// interface RetraitFormProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSuccess?: () => void;
// }

// export default function RetraitForm({
//   open,
//   onOpenChange,
//   onSuccess,
// }: RetraitFormProps) {
//   const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
//   const [successData, setSuccessData] = useState<{
//     montant: number;
//     operateur: string;
//     numeroTelephone: string;
//   } | null>(null);

//   const {
//     faireRetrait,
//     loading,
//     error,
//     soldes,
//     loadingSoldes,
//     getSoldeForCompte,
//   } = useRetrait();

//   const form = useForm<RetraitFormData>({
//     resolver: zodResolver(retraitSchema),
//     defaultValues: {
//       id_sous_compte: "",
//       montant: 0,
//       operateur: "",
//       num_de_telephone: "",
//     },
//   });

//   const onSubmit = async (data: RetraitFormData) => {
//     // 🔍 LOG POUR DÉBOGAGE
//     console.log("=== DÉBOGAGE FORMULAIRE ===");
//     console.log("Données du formulaire (avant validation):", form.getValues());
//     console.log("Données validées par Zod:", data);

//     const soldeDisponible = getSoldeForCompte(data.id_sous_compte) ?? 0;
//     if (data.montant > soldeDisponible) {
//       form.setError("montant", {
//         type: "manual",
//         message: `Solde insuffisant. Solde disponible: ${formatMontant(soldeDisponible)}`,
//       });
//       return;
//     }

//     const result = await faireRetrait(data);

//     if (result) {
//       // Sauvegarder les données pour l'animation
//       setSuccessData({
//         montant: data.montant,
//         operateur: data.operateur,
//         numeroTelephone: data.num_de_telephone, // ← Nom original du champ
//       });

//       // Fermer le formulaire
//       form.reset();
//       onOpenChange(false);

//       // Lancer l'animation après une courte pause
//       setTimeout(() => {
//         setShowSuccessAnimation(true);
//       }, 100);
//     }
//   };

//   const handleAnimationClose = () => {
//     setShowSuccessAnimation(false);
//     setSuccessData(null);
//     onSuccess?.();
//   };

//   const formatMontant = (value: number): string => {
//     return new Intl.NumberFormat("fr-FR", {
//       style: "currency",
//       currency: "XOF",
//     }).format(value);
//   };

//   const watchedValues = form.watch();

//   return (
//     <>
//       <Dialog
//         open={open}
//         onOpenChange={(isOpen) => {
//           if (!isOpen) {
//             form.reset(); // Réinitialise quand on ferme
//           }
//           onOpenChange(isOpen);
//         }}
//       >
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <CreditCard className="h-5 w-5 text-green-600" />
//               Effectuer un Retrait
//             </DialogTitle>
//             {/* <DialogDescription>
//               Remplissez les informations ci-dessous pour effectuer un retrait
//               depuis votre compte.
//             </DialogDescription> */}
//             {watchedValues.id_sous_compte && !loadingSoldes && (
//               <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium text-blue-900">
//                     Solde disponible (
//                     {SOUS_COMPTES[watchedValues.id_sous_compte as SousCompteId]}
//                     ) :
//                   </span>
//                   <span className="text-lg font-bold text-blue-700">
//                     {formatMontant(
//                       getSoldeForCompte(watchedValues.id_sous_compte) ?? 0
//                     )}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </DialogHeader>

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {/* Sélection du sous-compte */}
//                 <FormField
//                   control={form.control}
//                   name="id_sous_compte"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Sous-compte source</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Sélectionnez sous-compte" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {Object.entries(SOUS_COMPTES).map(([id, nom]) => (
//                             <SelectItem key={id} value={id}>
//                               <div className="flex items-center justify-between w-full">
//                                 <span className="capitalize">{nom}</span>
//                               </div>
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Opérateur */}
//                 <FormField
//                   control={form.control}
//                   name="operateur"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Opérateurs</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Sélectionnez l'opérateur" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {OPERATEURS.map((operateur) => (
//                             <SelectItem key={operateur} value={operateur}>
//                               <div className="flex items-center gap-2">
//                                 <img
//                                   src={OPERATEUR_LOGOS[operateur]}
//                                   alt={`Logo ${operateur}`}
//                                   className="h-4 w-4 object-contain"
//                                   onError={(e) => {
//                                     // Fallback vers l'icône si l'image ne charge pas
//                                     e.currentTarget.style.display = "none";
//                                     e.currentTarget.nextElementSibling?.classList.remove(
//                                       "hidden"
//                                     );
//                                   }}
//                                 />
//                                 <Smartphone className="h-4 w-4 hidden" />{" "}
//                                 {/* Fallback caché */}
//                                 {operateur}
//                               </div>
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Montant */}
//                 <FormField
//                   control={form.control}
//                   name="montant"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Montant du retrait</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Input
//                             placeholder="Entrez le montant"
//                             {...field}
//                             onChange={(e) =>
//                               field.onChange(Number(e.target.value))
//                             }
//                             className="pr-16"
//                           />
//                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
//                             FCFA
//                           </span>
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Numéro de téléphone */}
//                 <FormField
//                   control={form.control}
//                   name="num_de_telephone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Numéro de téléphone</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                           <Input
//                             placeholder="Ex: +225 07 XX XX XX XX"
//                             {...field}
//                             className="pl-10"
//                           />
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Message d'erreur global */}
//               {error && (
//                 <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
//                   {error}
//                 </div>
//               )}

//               {/* Résumé */}
//               {watchedValues.id_sous_compte &&
//                 watchedValues.montant > 0 &&
//                 watchedValues.operateur && (
//                   <div className="p-4 bg-slate-50 rounded-lg border">
//                     <h4 className="font-medium text-slate-900 mb-2">
//                       Résumé du retrait
//                     </h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-600">
//                       <div className="flex justify-between">
//                         <span>Source:</span>
//                         <span className="capitalize font-medium">
//                           {
//                             SOUS_COMPTES[
//                               watchedValues.id_sous_compte as SousCompteId
//                             ]
//                           }
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Opérateur:</span>
//                         <span className="font-medium">
//                           {watchedValues.operateur}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Solde disponible:</span>
//                         <span className="font-medium text-blue-600">
//                           {formatMontant(
//                             getSoldeForCompte(watchedValues.id_sous_compte) ?? 0
//                           )}
//                         </span>
//                       </div>
//                       {watchedValues.num_de_telephone && (
//                         <div className="flex justify-between">
//                           <span>Numéro:</span>
//                           <span className="font-medium">
//                             {watchedValues.num_de_telephone}
//                           </span>
//                         </div>
//                       )}
//                       <div className="flex justify-between">
//                         <span>Montant à retirer:</span>
//                         <span
//                           className={`font-medium ${
//                             watchedValues.montant >
//                             (getSoldeForCompte(watchedValues.id_sous_compte) ??
//                               0)
//                               ? "text-red-600"
//                               : "text-green-600"
//                           }`}
//                         >
//                           {formatMontant(watchedValues.montant)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//               {/* Boutons d'action */}
//               <div className="flex gap-3 pt-4">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => {
//                     form.reset(); // Réinitialise le formulaire
//                     onOpenChange(false); // Ferme le modal
//                   }}
//                   className="flex-1"
//                   disabled={loading}
//                 >
//                   Annuler
//                 </Button>
//                 <Button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Traitement...
//                     </>
//                   ) : (
//                     "Effectuer le retrait"
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>

//       {/* Animation de succès */}
//       {successData && (
//         <SuccessAnimationModal
//           isOpen={showSuccessAnimation}
//           onClose={handleAnimationClose}
//           montant={successData.montant}
//           operateur={successData.operateur}
//           numeroTelephone={successData.numeroTelephone}
//         />
//       )}
//     </>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/retrait/RetraitForm.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Calculator, Phone } from "lucide-react";
import { useRetrait } from "@/hooks/useRetrait";
import { useMoyensPaiement } from "@/hooks/useMoyensPaiement";
import { MoyenPaiement, SousCompte } from "@/types/retrait";
import {
  calculateFrais,
  formatMontant,
  SOUSCOMPTE_LABELS,
} from "@/utils/retrait";
import { SuccessAnimationModal } from "./SuccessAnimationModal";

const sousCompteSchema = z.object({
  field: z.string().min(1, "Champ requis"),
  label: z.string().min(1, "Libellé requis"),
  montant: z.number().min(0, "Le montant doit être positif"),
});

const retraitSchema = z.object({
  moyen_paiement_id: z
    .number()
    .min(1, "Veuillez sélectionner un moyen de paiement"),
  souscomptes: z
    .array(sousCompteSchema)
    .min(1, "Au moins un compte doit avoir un montant")
    .refine((souscomptes) => {
      const totalMontant = souscomptes.reduce((sum, sc) => sum + sc.montant, 0);
      return totalMontant > 0;
    }, "Le montant total doit être supérieur à 0"),
});

type RetraitFormData = z.infer<typeof retraitSchema>;

interface RetraitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function RetraitForm({
  open,
  onOpenChange,
  onSuccess,
}: RetraitFormProps) {
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successData, setSuccessData] = useState<{
    montant: number;
    operateur: string;
    numeroTelephone: string;
  } | null>(null);

  // États pour les montants par compte
  const [comptesMontants, setComptesMontants] = useState<{
    [key: string]: number;
  }>({});

  const {
    faireRetrait,
    loading,
    error,
    soldes,
    loadingSoldes,
    getSoldeForCompte,
  } = useRetrait();

  // Récupérer l'ID de la paroisse (à adapter selon votre logique)
  const getParoisseId = () => {
    try {
      const userProfileStr = localStorage.getItem("user_profile");
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        return userProfile.paroisse_id || 1;
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du profil:", err);
    }
    return 1;
  };

  const paroisseId = getParoisseId();

  // Hook pour les moyens de paiement
  const { moyensPaiement, loading: loadingMoyens } =
    useMoyensPaiement(paroisseId);

  const form = useForm<RetraitFormData>({
    resolver: zodResolver(retraitSchema),
    defaultValues: {
      moyen_paiement_id: 0,
      souscomptes: [],
    },
  });

  // Options de sous-comptes disponibles
  const sousCompteOptions = Object.entries(SOUSCOMPTE_LABELS)
    .map(([field, label]) => ({
      field,
      label,
      solde: getSoldeForCompte(field),
    }))
    .filter((option) => option.solde > 0);

  const watchedMoyenId = form.watch("moyen_paiement_id");

  // Calculer le montant total des comptes
  const getTotalMontant = () => {
    return Object.values(comptesMontants).reduce(
      (sum, montant) => sum + montant,
      0
    );
  };

  // Mettre à jour les sous-comptes dans le formulaire
  useEffect(() => {
    const souscomptes: SousCompte[] = Object.entries(comptesMontants)
      .filter(([_, montant]) => montant > 0)
      .map(([field, montant]) => ({
        field,
        label: SOUSCOMPTE_LABELS[field] || field,
        montant,
      }));

    form.setValue("souscomptes", souscomptes);
  }, [comptesMontants, form]);

  // Gérer le changement de montant pour un compte
  const handleMontantChange = (field: string, montant: number) => {
    const soldeDisponible = getSoldeForCompte(field);
    const montantFinal = Math.min(Math.max(0, montant), soldeDisponible);

    setComptesMontants((prev) => ({
      ...prev,
      [field]: montantFinal,
    }));
  };

  // Obtenir le moyen de paiement sélectionné
  const getMoyenPaiementSelectionne = () => {
    return moyensPaiement.find((moyen) => moyen.id === watchedMoyenId);
  };

  // Grouper les moyens de paiement par opérateur
  const getMoyensGroupes = () => {
    const groupes: { [key: string]: typeof moyensPaiement } = {};

    moyensPaiement.forEach((moyen) => {
      const operateur = moyen.provider.valeur_stricte;
      if (!groupes[operateur]) {
        groupes[operateur] = [];
      }
      groupes[operateur].push(moyen);
    });

    return groupes;
  };

  const moyensGroupes = getMoyensGroupes();
  const totalMontant = getTotalMontant();
  const fraisCalculation =
    totalMontant > 0 && watchedMoyenId
      ? (() => {
          const moyenSelectionne = getMoyenPaiementSelectionne();
          if (moyenSelectionne) {
            const frais = Math.round(
              (totalMontant * moyenSelectionne.provider.frais) / 100
            );
            const montantARecevoir = totalMontant - frais;
            return {
              montant: totalMontant,
              frais: frais,
              montantARecevoir: montantARecevoir,
              tauxFrais: moyenSelectionne.provider.frais,
              montantAvecFrais: totalMontant, // Le montant débité = montant saisi
            };
          }
          return null;
        })()
      : null;

  const onSubmit = async (data: RetraitFormData) => {
    console.log("=== DÉBOGAGE FORMULAIRE ===");
    console.log("Données du formulaire:", data);
    console.log("Montants par compte:", comptesMontants);
    console.log("Total calculé:", totalMontant);

    const moyenSelectionne = getMoyenPaiementSelectionne();
    if (!moyenSelectionne) {
      form.setError("moyen_paiement_id", {
        type: "manual",
        message: "Moyen de paiement non trouvé",
      });
      return;
    }

    // Calculer le montant que l'utilisateur va réellement recevoir
    const frais = Math.round(
      (totalMontant * moyenSelectionne.provider.frais) / 100
    );
    const montantARecevoir = totalMontant - frais;

    console.log("=== CALCUL DES FRAIS ===");
    console.log("Montant total débité:", totalMontant);
    console.log("Frais calculés:", frais);
    console.log("Montant à recevoir:", montantARecevoir);

    // Préparer les données pour l'API
    const retraitData = {
      montant: totalMontant, // Montant à débiter des comptes
      souscomptes: data.souscomptes,
      num_de_telephone: moyenSelectionne.numero,
      moyen: moyenSelectionne.provider.valeur_stricte as MoyenPaiement,
    };

    console.log("Données envoyées à l'API:", retraitData);

    const result = await faireRetrait(retraitData);

    if (result) {
      // Sauvegarder les données pour l'animation - CORRECTION ICI
      setSuccessData({
        montant: montantARecevoir, // ← Utiliser le montant après déduction des frais
        operateur: moyenSelectionne.provider.label,
        numeroTelephone: moyenSelectionne.numero,
      });

      console.log("=== DONNÉES POUR L'ANIMATION ===");
      console.log(
        "Montant qui sera affiché dans l'animation:",
        montantARecevoir
      );

      // Réinitialiser le formulaire
      form.reset();
      setComptesMontants({});
      onOpenChange(false);

      // Lancer l'animation après une courte pause
      setTimeout(() => {
        setShowSuccessAnimation(true);
      }, 100);
    }
  };

  const handleAnimationClose = () => {
    setShowSuccessAnimation(false);
    setSuccessData(null);
    onSuccess?.();
  };

  const resetForm = () => {
    form.reset();
    setComptesMontants({});
  };

  // Réinitialiser le montant total quand on change de moyen
  const handleMoyenChange = (moyenId: string) => {
    form.setValue("moyen_paiement_id", parseInt(moyenId));
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetForm();
          }
          onOpenChange(isOpen);
        }}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              Effectuer un Retrait
            </DialogTitle>
            <DialogDescription>
              Sélectionnez les montants par compte et votre moyen de paiement
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Sélection du moyen de paiement */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Moyen de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="moyen_paiement_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={handleMoyenChange}
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choisissez un moyen de paiement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {loadingMoyens ? (
                              <SelectItem value="loading" disabled>
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Chargement...
                                </div>
                              </SelectItem>
                            ) : Object.entries(moyensGroupes).length === 0 ? (
                              <SelectItem value="empty" disabled>
                                Aucun moyen de paiement configuré
                              </SelectItem>
                            ) : (
                              Object.entries(moyensGroupes).map(
                                ([operateur, moyens]) => (
                                  <div key={operateur}>
                                    {/* En-tête de groupe */}
                                    <div className="px-2 py-1 text-sm font-medium text-gray-500 bg-gray-50">
                                      {moyens[0].provider.label}
                                    </div>
                                    {/* Options du groupe */}
                                    {moyens.map((moyen) => (
                                      <SelectItem
                                        key={moyen.id}
                                        value={moyen.id.toString()}
                                      >
                                        <div className="flex items-center gap-4 w-full">
                                          <img
                                            src={moyen.provider.photo.url}
                                            alt={moyen.provider.label}
                                            className="w-5 h-5 rounded"
                                            onError={(e) => {
                                              const target =
                                                e.target as HTMLImageElement;
                                              target.style.display = "none";
                                            }}
                                          />
                                          <div className="flex-1">
                                            <div className="font-medium">
                                              {moyen.label}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              {moyen.numero.replace(
                                                /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                                                "$1 $2 $3 $4 $5"
                                              )}
                                            </div>
                                          </div>
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {moyen.provider.frais}%
                                          </Badge>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </div>
                                )
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Section des comptes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Montants par compte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingSoldes ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="h-32 bg-gray-100 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sousCompteOptions.map((option) => {
                        const montant = comptesMontants[option.field] || 0;

                        return (
                          <div
                            key={option.field}
                            className="p-4 border rounded-lg hover:border-blue-200 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-slate-900">
                                  {option.label}
                                </h4>
                              </div>
                              <Badge variant="outline" className="ml-2">
                                {formatMontant(option.solde)}
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <Input
                                    type="number"
                                    placeholder="Montant"
                                    value={montant || ""}
                                    onChange={(e) =>
                                      handleMontantChange(
                                        option.field,
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-full"
                                    min="0"
                                    max={option.solde}
                                    step="1"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleMontantChange(
                                      option.field,
                                      option.solde
                                    )
                                  }
                                  disabled={option.solde === 0}
                                  className="px-3"
                                >
                                  Max
                                </Button>
                              </div>

                              {montant > option.solde && (
                                <p className="text-xs text-red-500">
                                  Montant supérieur au solde
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Total calculé */}
              {totalMontant > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-blue-900">
                        Montant total à débiter:
                      </span>
                      <span className="text-2xl font-bold text-blue-700">
                        {formatMontant(totalMontant)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Résumé final */}
              {totalMontant > 0 && fraisCalculation && watchedMoyenId && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Résumé du retrait
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Montant à débiter:</span>
                        <span className="font-medium">
                          {formatMontant(totalMontant)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frais ({fraisCalculation.tauxFrais}%):</span>
                        <span className="font-medium text-orange-600">
                          {formatMontant(fraisCalculation.frais)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Opérateur:</span>
                        <span className="font-medium">
                          {getMoyenPaiementSelectionne()?.provider.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Numéro:</span>
                        <span className="font-medium font-mono">
                          {getMoyenPaiementSelectionne()?.numero.replace(
                            /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                            "$1 $2 $3 $4 $5"
                          )}
                        </span>
                      </div>
                      <hr />
                      <div className="flex justify-between border-t pt-3">
                        <span className="font-medium text-lg">
                          Vous allez recevoir:
                        </span>
                        <span className="font-bold text-xl text-green-600">
                          {formatMontant(fraisCalculation.montantARecevoir)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Message d'erreur global */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    onOpenChange(false);
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading || totalMontant === 0 || !watchedMoyenId}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traitement...
                    </>
                  ) : fraisCalculation ? (
                    `Confirmer`
                  ) : (
                    `Confirmer`
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Animation de succès */}
      {successData && (
        <SuccessAnimationModal
          isOpen={showSuccessAnimation}
          onClose={handleAnimationClose}
          montant={successData.montant}
          operateur={successData.operateur}
          numeroTelephone={successData.numeroTelephone}
        />
      )}
    </>
  );
}
