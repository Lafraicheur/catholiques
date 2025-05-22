import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
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

interface MesseEventForm extends BaseEventForm {
  type: "MESSE";
  type_messe: "ORDINAIRE" | "SPECIALE";
  heure_de_debut: number;
  heure_de_fin: number;
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
        type_messe: "ORDINAIRE",
        heure_de_debut: 630, // 10h30
        heure_de_fin: 720, // 12h00
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

  // Validation du formulaire
  const validateForm = (): string | null => {
    if (!formData.libelle.trim()) {
      return "Le titre de l'événement est obligatoire";
    }

    // Validation spécifique pour les messes
    if (formData.type === "MESSE") {
      if (formData.heure_de_debut >= formData.heure_de_fin) {
        return "L'heure de fin doit être après l'heure de début";
      }
    }

    // Validation pour les montants
    if (
      "montant_par_paroissien" in formData &&
      formData.montant_par_paroissien < 0
    ) {
      return "Le montant par paroissien ne peut pas être négatif";
    }

    // Validation pour les soldes cibles
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

      // Préparer les données selon le type d'événement
      const requestData: any = {
        type: formData.type,
        dates: selectedDates,
        libelle: formData.libelle.trim(),
        description: formData.description.trim(),
        paroisse_id: paroisseId,
      };

      // Ajouter les champs spécifiques selon le type
      switch (formData.type) {
        case "MESSE":
          requestData.type_messe = formData.type_messe;

          // Convertir les minutes en timestamps pour les heures
          const today = new Date();
          requestData.heure_de_debut = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            Math.floor(formData.heure_de_debut / 60),
            formData.heure_de_debut % 60
          ).getTime();

          requestData.heure_de_fin = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            Math.floor(formData.heure_de_fin / 60),
            formData.heure_de_fin % 60
          ).getTime();
          break;

        case "DON":
          requestData.est_actif = formData.est_actif;
          requestData.date_de_fin = formData.date_de_fin;
          requestData.solde_cible = formData.solde_cible;
          requestData.montant_par_paroissien = formData.montant_par_paroissien;
          requestData.est_limite_par_echeance =
            formData.est_limite_par_echeance;
          break;

        case "ACTIVITÉ":
          requestData.est_actif = formData.est_actif;
          requestData.montant_par_paroissien = formData.montant_par_paroissien;
          break;

        case "COTISATION":
          requestData.est_actif = formData.est_actif;
          requestData.date_de_fin = formData.date_de_fin;
          requestData.solde_cible = formData.solde_cible;
          requestData.montant_par_paroissien = formData.montant_par_paroissien;
          requestData.est_limite_par_echeance =
            formData.est_limite_par_echeance;
          break;

        case "INSCRIPTION":
          requestData.date_de_fin = formData.date_de_fin;
          requestData.montant_par_paroissien = formData.montant_par_paroissien;
          requestData.est_limite_par_echeance =
            formData.est_limite_par_echeance;
          break;
      }

      console.log(
        "Données envoyées à l'API:",
        JSON.stringify(requestData, null, 2)
      );

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

      console.log("Réponse de l'API:", response.data);

      // Succès
      const eventCount = selectedDates.length;
      toast.success(
        `${eventCount} événement${eventCount > 1 ? "s" : ""} créé${eventCount > 1 ? "s" : ""} avec succès`
      );

      // Fermer la modal et réinitialiser
      onOpenChange(false);
      resetForm();
      onEventsCreated();
    } catch (error: any) {
      console.error("Erreur lors de la création des événements:", error);

      // Gestion des erreurs détaillée
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Créer des événements multiples
          </DialogTitle>
          <DialogDescription>
            Vous allez créer{" "}
            <span className="font-medium text-slate-900">
              {selectedDates.length}
            </span>{" "}
            événement
            {selectedDates.length > 1 ? "s" : ""} identique
            {selectedDates.length > 1 ? "s" : ""} aux dates sélectionnées.
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

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="libelle">Titre de l'événement *</Label>
            <Input
              id="libelle"
              value={formData.libelle}
              onChange={(e) => updateFormField("libelle", e.target.value)}
              placeholder="Ex: Messe dominicale, Catéchisme..."
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormField("description", e.target.value)}
              placeholder="Description de l'événement (optionnel)"
              rows={3}
            />
          </div>

          {/* Champs spécifiques selon le type */}
          {formData.type === "MESSE" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="type_messe">Type de messe *</Label>
                <Select
                  value={formData.type_messe}
                  onValueChange={(value) =>
                    updateFormField("type_messe", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type de messe" />
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heure_debut">Heure de début *</Label>
                  <Input
                    id="heure_debut"
                    type="time"
                    value={formatMinutesToTime(formData.heure_de_debut)}
                    onChange={(e) =>
                      updateFormField(
                        "heure_de_debut",
                        convertTimeToMinutes(e.target.value)
                      )
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heure_fin">Heure de fin *</Label>
                  <Input
                    id="heure_fin"
                    type="time"
                    value={formatMinutesToTime(formData.heure_de_fin)}
                    onChange={(e) =>
                      updateFormField(
                        "heure_de_fin",
                        convertTimeToMinutes(e.target.value)
                      )
                    }
                    required
                  />
                </div>
              </div>
            </>
          )}

          {(formData.type === "DON" ||
            formData.type === "COTISATION" ||
            formData.type === "ACTIVITÉ") && (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="est_actif"
                  checked={"est_actif" in formData ? formData.est_actif : false}
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

          {(formData.type === "DON" || formData.type === "COTISATION") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="solde_cible">Solde cible (FCFA)</Label>
                <Input
                  id="solde_cible"
                  type="number"
                  min="0"
                  value={"solde_cible" in formData ? formData.solde_cible : 0}
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
            disabled={creating || selectedDates.length === 0}
          >
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Créer {selectedDates.length > 0 && `(${selectedDates.length})`}
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
