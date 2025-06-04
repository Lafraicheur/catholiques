/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Copy, Calendar } from "lucide-react";
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
  id: string; // ID unique pour React keys
  libelle: string;
  description: string;
  type_messe: "ORDINAIRE" | "SPECIALE";
  heure_de_debut: number;
  heure_de_fin: number;
}

// Interface pour le formulaire de messes multiples
interface MesseEventForm extends BaseEventForm {
  type: "MESSE";
  messes: SingleMesseForm[];
}

interface DonEventForm extends BaseEventForm {
  type: "DON";
  est_actif: boolean;
  date_de_fin: number;
  solde_cible: number;
  montant_par_paroissien: number;
  est_limite_par_echeance: boolean;
}

interface ActiviteEventForm extends BaseEventForm {
  type: "ACTIVITÉ";
  est_actif: boolean;
  montant_par_paroissien: number;
}

interface CotisationEventForm extends BaseEventForm {
  type: "COTISATION";
  est_actif: boolean;
  date_de_fin: number;
  solde_cible: number;
  montant_par_paroissien: number;
  est_limite_par_echeance: boolean;
}

interface InscriptionEventForm extends BaseEventForm {
  type: "INSCRIPTION";
  date_de_fin: number;
  montant_par_paroissien: number;
  est_limite_par_echeance: boolean;
}

type NewEventForm =
  | MesseEventForm
  | DonEventForm
  | ActiviteEventForm
  | CotisationEventForm
  | InscriptionEventForm;

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

const formatDateForInput = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0];
};

const convertDateInputToTimestamp = (dateString: string): number => {
  return new Date(dateString + "T23:59:59").getTime();
};

// Configuration des types d'événements
const EVENT_TYPES = [
  { value: "MESSE", label: "Messe" },
  { value: "ACTIVITÉ", label: "Activité" },
  { value: "COTISATION", label: "Cotisation" },
  { value: "INSCRIPTION", label: "Inscription" },
  { value: "DON", label: "Don" },
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

// Formulaires par défaut selon le type
const getDefaultFormData = (eventType: EventType): NewEventForm => {
  const baseData = {
    libelle: "",
    description: "",
  };

  const oneWeekFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000;

  switch (eventType) {
    case "MESSE":
      return {
        ...baseData,
        type: "MESSE",
        messes: [createNewMesse()],
      };

    case "DON":
      return {
        ...baseData,
        type: "DON",
        est_actif: true,
        date_de_fin: oneWeekFromNow,
        solde_cible: 0,
        montant_par_paroissien: 0,
        est_limite_par_echeance: false,
      };

    case "ACTIVITÉ":
      return {
        ...baseData,
        type: "ACTIVITÉ",
        est_actif: true,
        montant_par_paroissien: 0,
      };

    case "COTISATION":
      return {
        ...baseData,
        type: "COTISATION",
        est_actif: true,
        date_de_fin: oneWeekFromNow,
        solde_cible: 0,
        montant_par_paroissien: 0,
        est_limite_par_echeance: false,
      };

    case "INSCRIPTION":
      return {
        ...baseData,
        type: "INSCRIPTION",
        date_de_fin: oneWeekFromNow,
        montant_par_paroissien: 0,
        est_limite_par_echeance: false,
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

  // Ajouter des modèles rapides pour les messes courantes
  const ajouterMesseRapide = (type: "matin" | "soir" | "midi") => {
    if (formData.type === "MESSE") {
      let nouvelleMesse: SingleMesseForm;

      switch (type) {
        case "matin":
          nouvelleMesse = {
            ...createNewMesse(),
            libelle: "Messe du matin",
            description: "Messe matinale",
            heure_de_debut: 420, // 7h00
            heure_de_fin: 480, // 8h00
          };
          break;
        case "midi":
          nouvelleMesse = {
            ...createNewMesse(),
            libelle: "Messe de midi",
            description: "Messe de milieu de journée",
            heure_de_debut: 720, // 12h00
            heure_de_fin: 780, // 13h00
          };
          break;
        case "soir":
          nouvelleMesse = {
            ...createNewMesse(),
            libelle: "Messe du soir",
            description: "Messe vespérale",
            heure_de_debut: 1140, // 19h00
            heure_de_fin: 1200, // 20h00
          };
          break;
      }

      setFormData((prev) => {
        if (prev.type === "MESSE" && "messes" in prev) {
          return {
            ...prev,
            messes: [...prev.messes, nouvelleMesse],
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

      // Vérifier qu'au moins une date est sélectionnée
      if (selectedDates.length === 0) {
        return "Aucune date sélectionnée";
      }

      return null;
    }

    // Validation pour les autres types (code existant)
    if (!formData.libelle.trim()) {
      return "Le titre de l'événement est obligatoire";
    }

    if (
      "montant_par_paroissien" in formData &&
      formData.montant_par_paroissien < 0
    ) {
      return "Le montant par paroissien ne peut pas être négatif";
    }

    if ("solde_cible" in formData && formData.solde_cible < 0) {
      return "Le solde cible ne peut pas être négatif";
    }

    if (selectedDates.length === 0) {
      return "Aucune date sélectionnée";
    }

    return null;
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
        // Créer les messes pour toutes les dates sélectionnées
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
      } else {
        // Pour les autres types d'événements (code existant)
        const requestData: any = {
          type: formData.type,
          dates: selectedDates,
          libelle: formData.libelle.trim(),
          description: formData.description.trim(),
          paroisse_id: paroisseId,
        };

        // Ajouter les champs spécifiques selon le type
        switch (formData.type) {
          case "DON":
            requestData.est_actif = formData.est_actif;
            requestData.date_de_fin = formData.date_de_fin;
            requestData.solde_cible = formData.solde_cible;
            requestData.montant_par_paroissien =
              formData.montant_par_paroissien;
            requestData.est_limite_par_echeance =
              formData.est_limite_par_echeance;
            break;

          case "ACTIVITÉ":
            requestData.est_actif = formData.est_actif;
            requestData.montant_par_paroissien =
              formData.montant_par_paroissien;
            break;

          case "COTISATION":
            requestData.est_actif = formData.est_actif;
            requestData.date_de_fin = formData.date_de_fin;
            requestData.solde_cible = formData.solde_cible;
            requestData.montant_par_paroissien =
              formData.montant_par_paroissien;
            requestData.est_limite_par_echeance =
              formData.est_limite_par_echeance;
            break;

          case "INSCRIPTION":
            requestData.date_de_fin = formData.date_de_fin;
            requestData.montant_par_paroissien =
              formData.montant_par_paroissien;
            requestData.est_limite_par_echeance =
              formData.est_limite_par_echeance;
            break;
        }

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
              {/* Configuration des messes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">
                    Configuration des messes ({formData.messes.length})
                  </Label>
                  <div className="flex gap-2 flex-wrap">
                    {/* <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => ajouterMesseRapide("matin")}
                    >
                      + Messe matin
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => ajouterMesseRapide("midi")}
                    >
                      + Messe midi
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => ajouterMesseRapide("soir")}
                    >
                      + Messe soir
                    </Button> */}
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

          {/* Formulaires pour les autres types d'événements (code existant) */}
          {formData.type !== "MESSE" && (
            <>
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="libelle">Titre de l'événement *</Label>
                <Input
                  id="libelle"
                  value={formData.libelle}
                  onChange={(e) => updateFormField("libelle", e.target.value)}
                  placeholder="Ex: Catéchisme, Collecte..."
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    updateFormField("description", e.target.value)
                  }
                  placeholder="Description de l'événement (optionnel)"
                  rows={3}
                />
              </div>

              {/* Autres champs selon le type (code existant) */}
              {(formData.type === "DON" ||
                formData.type === "COTISATION" ||
                formData.type === "ACTIVITÉ") && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="est_actif"
                      checked={
                        "est_actif" in formData ? formData.est_actif : false
                      }
                      onCheckedChange={(checked) =>
                        updateFormField("est_actif", checked)
                      }
                    />
                    <Label htmlFor="est_actif">Événement actif</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="montant_par_paroissien">
                      Montant par paroissien (FCFA)
                    </Label>
                    <Input
                      id="montant_par_paroissien"
                      type="number"
                      min="0"
                      value={
                        "montant_par_paroissien" in formData
                          ? formData.montant_par_paroissien
                          : 0
                      }
                      onChange={(e) =>
                        updateFormField(
                          "montant_par_paroissien",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </>
              )}

              {/* Autres champs spécifiques */}
              {(formData.type === "DON" || formData.type === "COTISATION") && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="solde_cible">Solde cible (FCFA)</Label>
                    <Input
                      id="solde_cible"
                      type="number"
                      min="0"
                      value={
                        "solde_cible" in formData ? formData.solde_cible : 0
                      }
                      onChange={(e) =>
                        updateFormField("solde_cible", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_de_fin">Date de fin</Label>
                    <Input
                      id="date_de_fin"
                      type="date"
                      value={
                        "date_de_fin" in formData
                          ? formatDateForInput(formData.date_de_fin)
                          : ""
                      }
                      onChange={(e) =>
                        updateFormField(
                          "date_de_fin",
                          convertDateInputToTimestamp(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="est_limite_par_echeance"
                      checked={
                        "est_limite_par_echeance" in formData
                          ? formData.est_limite_par_echeance
                          : false
                      }
                      onCheckedChange={(checked) =>
                        updateFormField("est_limite_par_echeance", checked)
                      }
                    />
                    <Label htmlFor="est_limite_par_echeance">
                      Limité par échéance
                    </Label>
                  </div>
                </>
              )}

              {formData.type === "INSCRIPTION" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="montant_par_paroissien">
                      Montant par paroissien (FCFA)
                    </Label>
                    <Input
                      id="montant_par_paroissien"
                      type="number"
                      min="0"
                      value={formData.montant_par_paroissien}
                      onChange={(e) =>
                        updateFormField(
                          "montant_par_paroissien",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_de_fin">Date de fin</Label>
                    <Input
                      id="date_de_fin"
                      type="date"
                      value={formatDateForInput(formData.date_de_fin)}
                      onChange={(e) =>
                        updateFormField(
                          "date_de_fin",
                          convertDateInputToTimestamp(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="est_limite_par_echeance"
                      checked={formData.est_limite_par_echeance}
                      onCheckedChange={(checked) =>
                        updateFormField("est_limite_par_echeance", checked)
                      }
                    />
                    <Label htmlFor="est_limite_par_echeance">
                      Limité par échéance
                    </Label>
                  </div>
                </>
              )}
            </>
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
              selectedDates.length === 0
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
