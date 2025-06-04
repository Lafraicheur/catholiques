/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/retrait/RetraitForm.tsx
import { useState } from "react";
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
import { Loader2, Smartphone, CreditCard } from "lucide-react";
import { useRetrait } from "@/hooks/useRetrait";
import {
  OPERATEURS,
  OPERATEUR_LOGOS,
  SOUS_COMPTES,
  type Operateur,
  type SousCompteId,
} from "@/types/retrait";

import { SuccessAnimationModal } from "./SuccessAnimationModal";

const retraitSchema = z.object({
  id_sous_compte: z.string().min(1, "Veuillez sélectionner un sous-compte"),
  montant: z
    .number()
    .min(20, "Le montant minimum est de 100 FCFA")
    .max(1000000, "Le montant maximum est de 1 000 000 FCFA"),
  operateur: z.string().min(1, "Veuillez sélectionner un opérateur"),
  num_de_telephone: z
    .string()
    .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres")
    .max(15, "Le numéro de téléphone ne peut pas dépasser 15 chiffres")
    .regex(/^[0-9+\-\s()]+$/, "Format de numéro de téléphone invalide")
    .transform((val) => val.replace(/[\s\-\(\)]/g, "")),
});

type RetraitFormData = z.infer<typeof retraitSchema>;

// 🔧 Type pour les données transformées (correspond exactement à l'API)
type TransformedRetraitData = {
  id_sous_compte: string;
  montant: number;
  operateur: string;
  num_de_telephone: string; // ← Garder le nom original
};

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

  const {
    faireRetrait,
    loading,
    error,
    soldes,
    loadingSoldes,
    getSoldeForCompte,
  } = useRetrait();

  const form = useForm<RetraitFormData>({
    resolver: zodResolver(retraitSchema),
    defaultValues: {
      id_sous_compte: "",
      montant: 0,
      operateur: "",
      num_de_telephone: "",
    },
  });

  const onSubmit = async (data: RetraitFormData) => {
    // 🔍 LOG POUR DÉBOGAGE
    console.log("=== DÉBOGAGE FORMULAIRE ===");
    console.log("Données du formulaire (avant validation):", form.getValues());
    console.log("Données validées par Zod:", data);

    const soldeDisponible = getSoldeForCompte(data.id_sous_compte) ?? 0;
    if (data.montant > soldeDisponible) {
      form.setError("montant", {
        type: "manual",
        message: `Solde insuffisant. Solde disponible: ${formatMontant(soldeDisponible)}`,
      });
      return;
    }

    const result = await faireRetrait(data);

    if (result) {
      // Sauvegarder les données pour l'animation
      setSuccessData({
        montant: data.montant,
        operateur: data.operateur,
        numeroTelephone: data.num_de_telephone, // ← Nom original du champ
      });

      // Fermer le formulaire
      form.reset();
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

  const formatMontant = (value: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(value);
  };

  const watchedValues = form.watch();

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            form.reset(); // Réinitialise quand on ferme
          }
          onOpenChange(isOpen);
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              Effectuer un Retrait
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour effectuer un retrait
              depuis votre compte.
            </DialogDescription>
            {watchedValues.id_sous_compte && !loadingSoldes && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    Solde disponible (
                    {SOUS_COMPTES[watchedValues.id_sous_compte as SousCompteId]}
                    ) :
                  </span>
                  <span className="text-lg font-bold text-blue-700">
                    {formatMontant(
                      getSoldeForCompte(watchedValues.id_sous_compte) ?? 0
                    )}
                  </span>
                </div>
              </div>
            )}
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sélection du sous-compte */}
                <FormField
                  control={form.control}
                  name="id_sous_compte"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sous-compte source</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez le sous-compte" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(SOUS_COMPTES).map(([id, nom]) => (
                            <SelectItem key={id} value={id}>
                              <div className="flex items-center justify-between w-full">
                                <span className="capitalize">{nom}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Montant */}
                <FormField
                  control={form.control}
                  name="montant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant du retrait</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Entrez le montant"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="pr-16"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            FCFA
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Opérateur */}
                <FormField
                  control={form.control}
                  name="operateur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opérateur Mobile Money</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez l'opérateur" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OPERATEURS.map((operateur) => (
                            <SelectItem key={operateur} value={operateur}>
                              <div className="flex items-center gap-2">
                                <img
                                  src={OPERATEUR_LOGOS[operateur]}
                                  alt={`Logo ${operateur}`}
                                  className="h-4 w-4 object-contain"
                                  onError={(e) => {
                                    // Fallback vers l'icône si l'image ne charge pas
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.nextElementSibling?.classList.remove(
                                      "hidden"
                                    );
                                  }}
                                />
                                <Smartphone className="h-4 w-4 hidden" />{" "}
                                {/* Fallback caché */}
                                {operateur}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Numéro de téléphone */}
                <FormField
                  control={form.control}
                  name="num_de_telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de téléphone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Ex: +225 07 XX XX XX XX"
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Message d'erreur global */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              {/* Résumé */}
              {watchedValues.id_sous_compte &&
                watchedValues.montant > 0 &&
                watchedValues.operateur && (
                  <div className="p-4 bg-slate-50 rounded-lg border">
                    <h4 className="font-medium text-slate-900 mb-2">
                      Résumé du retrait
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Source:</span>
                        <span className="capitalize font-medium">
                          {
                            SOUS_COMPTES[
                              watchedValues.id_sous_compte as SousCompteId
                            ]
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Opérateur:</span>
                        <span className="font-medium">
                          {watchedValues.operateur}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Solde disponible:</span>
                        <span className="font-medium text-blue-600">
                          {formatMontant(
                            getSoldeForCompte(watchedValues.id_sous_compte) ?? 0
                          )}
                        </span>
                      </div>
                      {watchedValues.num_de_telephone && (
                        <div className="flex justify-between">
                          <span>Numéro:</span>
                          <span className="font-medium">
                            {watchedValues.num_de_telephone}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Montant à retirer:</span>
                        <span
                          className={`font-medium ${
                            watchedValues.montant >
                            (getSoldeForCompte(watchedValues.id_sous_compte) ??
                              0)
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {formatMontant(watchedValues.montant)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset(); // Réinitialise le formulaire
                    onOpenChange(false); // Ferme le modal
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    "Effectuer le retrait"
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
