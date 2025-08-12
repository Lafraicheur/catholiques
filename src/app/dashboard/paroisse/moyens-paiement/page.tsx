// app/dashboard/paroisse/moyens-paiement/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CreditCard,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Import du hook personnalisé
import { useMoyensPaiement } from "@/hooks/useMoyensPaiement";
import { MoyenPaiement } from "@/types/moyens-paiement";

// Formulaire d'ajout
interface AddMoyenForm {
  label: string;
  numero: string;
  provider_id: number;
}

// Composant Skeleton pour les cartes de moyens de paiement
function MoyenPaiementCardSkeleton() {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant Skeleton pour l'en-tête
function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-8 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="w-36 h-10 rounded" />
    </div>
  );
}

export default function MoyensPaiementPage() {
  const router = useRouter();

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

  // Hook personnalisé pour gérer les données
  const {
    moyensPaiement,
    providers,
    loading,
    addingMoyen,
    removingMoyen,
    addMoyenPaiement,
    removeMoyenPaiement,
    refreshData,
  } = useMoyensPaiement(paroisseId);

  // États pour les modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [moyenToDelete, setMoyenToDelete] = useState<MoyenPaiement | null>(
    null
  );

  // Formulaire d'ajout
  const [addForm, setAddForm] = useState<AddMoyenForm>({
    label: "",
    numero: "",
    provider_id: 0,
  });

  // Définir le provider par défaut quand la liste des providers est chargée
  useEffect(() => {
    if (providers.length > 0 && addForm.provider_id === 0) {
      // Sélectionner Wave par défaut, sinon le premier opérateur
      const defaultProvider =
        providers.find((p) => p.valeur_stricte === "WAVE") || providers[0];
      setAddForm((prev) => ({
        ...prev,
        provider_id: defaultProvider.id,
      }));
    }
  }, [providers, addForm.provider_id]);

  // Ajouter un moyen de paiement
  const handleAddMoyen = async () => {
    if (
      !addForm.label.trim() ||
      !addForm.numero.trim() ||
      !addForm.provider_id
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const success = await addMoyenPaiement(addForm);

    if (success) {
      setShowAddModal(false);
      resetAddForm();
    }
  };

  // Supprimer un moyen de paiement
  const handleDeleteMoyen = async () => {
    if (!moyenToDelete) return;

    const success = await removeMoyenPaiement(moyenToDelete.id);

    if (success) {
      setShowDeleteDialog(false);
      setMoyenToDelete(null);
    }
  };

  // Ouvrir le dialog de suppression
  const confirmDelete = (moyen: MoyenPaiement) => {
    setMoyenToDelete(moyen);
    setShowDeleteDialog(true);
  };

  // Réinitialiser le formulaire d'ajout
  const resetAddForm = () => {
    const defaultProvider =
      providers.find((p) => p.valeur_stricte === "WAVE") || providers[0];
    setAddForm({
      label: "",
      numero: "",
      provider_id: defaultProvider?.id || 0,
    });
  };

  // Valider le numéro de téléphone
  const validatePhoneNumber = (numero: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(numero.replace(/\s/g, ""));
  };

  // Formater le numéro de téléphone
  const formatPhoneNumber = (numero: string) => {
    return numero.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
  };

  // Affichage du skeleton pendant le chargement
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton de l'en-tête */}
        <HeaderSkeleton />

        {/* Skeleton des cartes */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <MoyenPaiementCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:bg-slate-100 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Moyens de Retrait
            </h1>
            <p className="text-slate-500">Gérez vos moyens de retrait</p>
          </div>
        </div>

        <Button
          onClick={() => {
            resetAddForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-800 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Ajouter un moyen
        </Button>
      </div>

      {/* Liste des moyens de paiement */}
      {moyensPaiement.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Aucun moyen de paiement
            </h3>
            <p className="text-slate-500 text-center mb-4">
              Vous n'avez pas encore configuré de moyens de paiement.
              <br />
              Ajoutez-en un pour commencer à effectuer des retraits.
            </p>
            <Button
              onClick={() => {
                resetAddForm();
                setShowAddModal(true);
              }}
              className="bg-slate-600 hover:bg-slate-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le premier moyen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {moyensPaiement.map((moyen) => (
            <Card key={moyen.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={moyen.provider.photo.url}
                        alt={moyen.provider.label}
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{moyen.label}</CardTitle>
                      <CardDescription>{moyen.provider.label}</CardDescription>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDelete(moyen)}
                    disabled={removingMoyen === moyen.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    title="Supprimer ce moyen de paiement"
                  >
                    {removingMoyen === moyen.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Numéro:</span>
                    <span className="font-mono">
                      {formatPhoneNumber(moyen.numero)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal d'ajout */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un moyen de retrait</DialogTitle>
            <DialogDescription>
              Configurez un nouveau compte pour les retraits
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Opérateur *</Label>
              <Select
                value={addForm.provider_id.toString()}
                onValueChange={(value) =>
                  setAddForm((prev) => ({
                    ...prev,
                    provider_id: parseInt(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un opérateur" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem
                      key={provider.id}
                      value={provider.id.toString()}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={provider.photo.url}
                          alt={provider.label}
                          className="w-5 h-5 rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                        <span>{provider.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Libellé *</Label>
              <Input
                id="label"
                placeholder="Ex: Principal, Secondaire..."
                value={addForm.label}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, label: e.target.value }))
                }
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Numéro de téléphone *</Label>
              <Input
                id="numero"
                placeholder="Ex: 0712345678"
                value={addForm.numero}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    setAddForm((prev) => ({ ...prev, numero: value }));
                  }
                }}
                className={
                  addForm.numero && !validatePhoneNumber(addForm.numero)
                    ? "border-red-300 focus:ring-red-500"
                    : ""
                }
              />
              {addForm.numero && !validatePhoneNumber(addForm.numero) && (
                <p className="text-sm text-red-500">
                  Le numéro doit contenir exactement 10 chiffres
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setShowAddModal(false)}
              disabled={addingMoyen}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddMoyen}
              disabled={
                addingMoyen ||
                !addForm.label ||
                !addForm.numero ||
                !addForm.provider_id ||
                !validatePhoneNumber(addForm.numero)
              }
              className="bg-slate-800 hover:bg-slate-800 cursor-pointer"
            >
              {addingMoyen ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le moyen de paiement{" "}
              <strong>"{moyenToDelete?.label}"</strong> (
              {formatPhoneNumber(moyenToDelete?.numero || "")}) ?
              <br />
              <br />
              Cette action est irréversible et vous ne pourrez plus utiliser ce
              moyen pour effectuer des retraits.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removingMoyen !== null}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMoyen}
              disabled={removingMoyen !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {removingMoyen !== null ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
