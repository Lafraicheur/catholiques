/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Target,
  Save,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { modifierEvenement, validateEvenementData } from "@/services/evenement-services";
import { debugEvenementData } from "@/lib/debug-evenement";

// Types pour les différents événements
type BaseEvenement = {
  type: string;
  dates: number[];
  libelle: string;
  description: string;
  paroisse_id: number;
};

type DonEvenement = BaseEvenement & {
  type: "DON";
  est_actif: boolean;
  date_de_fin: number;
  solde_cible: number;
  montant_par_paroissien: number;
  est_limite_par_echeance: boolean;
};

type MesseEvenement = BaseEvenement & {
  type: "MESSE";
  type_messe: "ORDINAIRE" | "SPECIALE";
  heure_de_fin: number;
  heure_de_debut: number;
};

type ActiviteEvenement = BaseEvenement & {
  type: "ACTIVITÉ";
  est_actif: boolean;
  montant_par_paroissien: number;
};

type CotisationEvenement = BaseEvenement & {
  type: "COTISATION";
  est_actif: boolean;
  date_de_fin: number;
  solde_cible: number;
  montant_par_paroissien: number;
  est_limite_par_echeance: boolean;
};

type InscriptionEvenement = BaseEvenement & {
  type: "INSCRIPTION";
  date_de_fin: number;
  montant_par_paroissien: number;
  est_limite_par_echeance: boolean;
};

type EvenementModification = 
  | DonEvenement 
  | MesseEvenement 
  | ActiviteEvenement 
  | CotisationEvenement 
  | InscriptionEvenement;

interface EvenementEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  evenement: any; // L'événement actuel à modifier
  onSuccess: (updatedEvenement: any) => void;
}

export default function EvenementEditModal({
  isOpen,
  onClose,
  evenement,
  onSuccess,
}: EvenementEditModalProps) {
  const [formData, setFormData] = useState<Partial<EvenementModification>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialiser le formulaire avec les données de l'événement
  useEffect(() => {
    if (evenement && isOpen) {
      const initialData: Partial<EvenementModification> = {
        type: evenement.type,
        libelle: evenement.libelle || "",
        description: evenement.description || "",
        paroisse_id: evenement.paroisse_id || 0,
        dates: evenement.date_de_debut ? [evenement.date_de_debut] : [Date.now()],
      };

      // Ajouter les champs spécifiques selon le type
      switch (evenement.type) {
        case "DON":
          Object.assign(initialData, {
            est_actif: evenement.est_actif || true,
            date_de_fin: evenement.date_de_fin || 0,
            solde_cible: evenement.solde_cible || 0,
            montant_par_paroissien: evenement.montant_par_paroissien || 0,
            est_limite_par_echeance: evenement.est_limite_par_echeance || false,
          });
          break;

        case "MESSE":
          Object.assign(initialData, {
            type_messe: evenement.extras?.type_messe || "ORDINAIRE",
            heure_de_debut: evenement.heure_de_debut || 0,
            heure_de_fin: evenement.heure_de_fin || 0,
          });
          break;

        case "ACTIVITÉ":
          Object.assign(initialData, {
            est_actif: evenement.est_actif || true,
            montant_par_paroissien: evenement.montant_par_paroissien || 0,
          });
          break;

        case "COTISATION":
          Object.assign(initialData, {
            est_actif: evenement.est_actif || true,
            date_de_fin: evenement.date_de_fin || 0,
            solde_cible: evenement.solde_cible || 0,
            montant_par_paroissien: evenement.montant_par_paroissien || 0,
            est_limite_par_echeance: evenement.est_limite_par_echeance || false,
          });
          break;

        case "INSCRIPTION":
          Object.assign(initialData, {
            date_de_fin: evenement.date_de_fin || 0,
            montant_par_paroissien: evenement.montant_par_paroissien || 0,
            est_limite_par_echeance: evenement.est_limite_par_echeance || false,
          });
          break;
      }

      setFormData(initialData);
    }
  }, [evenement, isOpen]);

  // Fonction pour mettre à jour les données du formulaire
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Supprimer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.libelle?.trim()) {
      newErrors.libelle = "Le libellé est obligatoire";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "La description est obligatoire";
    }

    if (!formData.paroisse_id || formData.paroisse_id <= 0) {
      newErrors.paroisse_id = "La paroisse est obligatoire";
    }

    // Validations spécifiques selon le type
    if (formData.type === "MESSE") {
      if (!formData.type_messe) {
        newErrors.type_messe = "Le type de messe est obligatoire";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction pour formater la date pour l'input datetime-local
  const formatDateForInput = (timestamp: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toISOString().slice(0, 16);
  };

  // Fonction pour convertir la date de l'input en timestamp
  const parseInputDate = (dateString: string) => {
    if (!dateString) return 0;
    return Math.floor(new Date(dateString).getTime() / 1000);
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }

    if (!evenement?.id) {
      toast.error("ID de l'événement manquant");
      return;
    }

    setLoading(true);
    try {
      // Vérifier que le type est bien défini
      if (!formData.type) {
        throw new Error("Le type d'événement est obligatoire");
      }

      // S'assurer que les dates sont au bon format
      const finalFormData = {
        ...formData,
        dates: formData.dates && formData.dates.length > 0 ? formData.dates : [Math.floor(Date.now() / 1000)],
      };

      // Debug avant envoi
      debugEvenementData(evenement, finalFormData);
      
      // Valider les données avec la fonction du service
      validateEvenementData(finalFormData as EvenementModification);
      
      // Appeler le service de modification
      const updatedEvenement = await modifierEvenement(evenement.id, finalFormData as EvenementModification);
      
      toast.success("Événement modifié avec succès");
      onSuccess(updatedEvenement);
      onClose();
    } catch (error: any) {
      console.error("❌ Erreur lors de la modification:", error);
      toast.error(error.message || "Erreur lors de la modification de l'événement");
    } finally {
      setLoading(false);
    }
  };

  // Rendu des champs selon le type
  const renderTypeSpecificFields = () => {
    if (!formData.type) return null;

    switch (formData.type) {
      case "DON":
      case "COTISATION":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="solde_cible">Objectif (FCFA)</Label>
                <Input
                  id="solde_cible"
                  type="number"
                  min="0"
                  value={(formData as any).solde_cible || ""}
                  onChange={(e) => updateFormData("solde_cible", parseFloat(e.target.value) || 0)}
                  className={errors.solde_cible ? "border-red-500" : ""}
                />
                {errors.solde_cible && (
                  <p className="text-red-500 text-sm mt-1">{errors.solde_cible}</p>
                )}
              </div>

              <div>
                <Label htmlFor="montant_par_paroissien">Montant par paroissien (FCFA)</Label>
                <Input
                  id="montant_par_paroissien"
                  type="number"
                  min="0"
                  value={(formData as any).montant_par_paroissien || ""}
                  onChange={(e) => updateFormData("montant_par_paroissien", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date_de_fin">Date de fin</Label>
              <Input
                id="date_de_fin"
                type="datetime-local"
                value={formatDateForInput((formData as any).date_de_fin)}
                onChange={(e) => updateFormData("date_de_fin", parseInputDate(e.target.value))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="est_limite_par_echeance"
                checked={(formData as any).est_limite_par_echeance || false}
                onCheckedChange={(checked) => updateFormData("est_limite_par_echeance", checked)}
              />
              <Label htmlFor="est_limite_par_echeance">Limité par échéance</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="est_actif"
                checked={(formData as any).est_actif || false}
                onCheckedChange={(checked) => updateFormData("est_actif", checked)}
              />
              <Label htmlFor="est_actif">Événement actif</Label>
            </div>
          </div>
        );

      case "MESSE":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="type_messe">Type de messe</Label>
              <Select
                value={(formData as any).type_messe || ""}
                onValueChange={(value) => updateFormData("type_messe", value)}
              >
                <SelectTrigger className={errors.type_messe ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionner le type de messe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORDINAIRE">Ordinaire</SelectItem>
                  <SelectItem value="SPECIALE">Spéciale</SelectItem>
                </SelectContent>
              </Select>
              {errors.type_messe && (
                <p className="text-red-500 text-sm mt-1">{errors.type_messe}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heure_de_debut">Heure de début</Label>
                <Input
                  id="heure_de_debut"
                  type="time"
                  value={formatDateForInput((formData as any).heure_de_debut)}
                  onChange={(e) => updateFormData("heure_de_debut", parseInputDate(`1970-01-01T${e.target.value}:00`))}
                />
              </div>

              <div>
                <Label htmlFor="heure_de_fin">Heure de fin</Label>
                <Input
                  id="heure_de_fin"
                  type="time"
                  value={formatDateForInput((formData as any).heure_de_fin)}
                  onChange={(e) => updateFormData("heure_de_fin", parseInputDate(`1970-01-01T${e.target.value}:00`))}
                />
              </div>
            </div>
          </div>
        );

      case "ACTIVITÉ":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="montant_par_paroissien">Montant par paroissien (FCFA)</Label>
              <Input
                id="montant_par_paroissien"
                type="number"
                min="0"
                value={(formData as any).montant_par_paroissien || ""}
                onChange={(e) => updateFormData("montant_par_paroissien", parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="est_actif"
                checked={(formData as any).est_actif || false}
                onCheckedChange={(checked) => updateFormData("est_actif", checked)}
              />
              <Label htmlFor="est_actif">Événement actif</Label>
            </div>
          </div>
        );

      case "INSCRIPTION":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="montant_par_paroissien">Montant par paroissien (FCFA)</Label>
                <Input
                  id="montant_par_paroissien"
                  type="number"
                  min="0"
                  value={(formData as any).montant_par_paroissien || ""}
                  onChange={(e) => updateFormData("montant_par_paroissien", parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="date_de_fin">Date de fin d'inscription</Label>
                <Input
                  id="date_de_fin"
                  type="datetime-local"
                  value={formatDateForInput((formData as any).date_de_fin)}
                  onChange={(e) => updateFormData("date_de_fin", parseInputDate(e.target.value))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="est_limite_par_echeance"
                checked={(formData as any).est_limite_par_echeance || false}
                onCheckedChange={(checked) => updateFormData("est_limite_par_echeance", checked)}
              />
              <Label htmlFor="est_limite_par_echeance">Limité par échéance</Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Modifier l'événement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Badge du type d'événement */}
          {formData.type && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Type d'événement :</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {formData.type}
              </Badge>
            </div>
          )}

          {/* Champs communs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="libelle">Libellé *</Label>
                <Input
                  id="libelle"
                  value={formData.libelle || ""}
                  onChange={(e) => updateFormData("libelle", e.target.value)}
                  placeholder="Nom de l'événement"
                  className={errors.libelle ? "border-red-500" : ""}
                />
                {errors.libelle && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.libelle}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder="Description de l'événement"
                  rows={3}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="dates">Date de début</Label>
                <Input
                  id="dates"
                  type="datetime-local"
                  value={formatDateForInput(formData.dates?.[0] || 0)}
                  onChange={(e) => updateFormData("dates", [parseInputDate(e.target.value)])}
                />
              </div>

              <div>
                <Label htmlFor="paroisse_id">ID Paroisse *</Label>
                <Input
                  id="paroisse_id"
                  type="number"
                  min="1"
                  value={formData.paroisse_id || ""}
                  onChange={(e) => updateFormData("paroisse_id", parseInt(e.target.value) || 0)}
                  placeholder="Identifiant de la paroisse"
                  className={errors.paroisse_id ? "border-red-500" : ""}
                />
                {errors.paroisse_id && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.paroisse_id}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Champs spécifiques au type */}
          {formData.type && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Paramètres spécifiques - {formData.type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderTypeSpecificFields()}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? "Modification..." : "Modifier l'événement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}