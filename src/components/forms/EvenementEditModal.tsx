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
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Target,
  Save,
  X,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  modifierEvenement,
  validateEvenementData,
  Evenement,
  isMesseEvent,
  isActiviteEvent,
} from "@/services/evenement-services";

// Interface pour une option d'activité
interface ActivityOption {
  label: string;
  montant: number;
}

// Types pour les modifications d'événements (alignés avec evenement-services.ts)
type BaseEvenement = {
  evenement_id?: number;
  type: string;
  dates?: number[];
  libelle: string;
  description: string;
  paroisse_id: number;
};

type MesseEvenement = BaseEvenement & {
  type: "MESSE";
  type_messe: "ORDINAIRE" | "SPECIALE";
  heure_de_fin: number;
  heure_de_debut: number;
  prix_demande_de_messe?: number;
};

type ActiviteEvenement = BaseEvenement & {
  type: "ACTIVITÉ";
  lieu: string;
  options: ActivityOption[];
  categorie: string;
  est_gratuit: boolean;
  date_de_debut?: number;
  image?: File | string | null;
};

type EvenementModification = MesseEvenement | ActiviteEvenement;

interface EvenementEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  evenement: Evenement | null;
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
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Initialiser le formulaire avec les données de l'événement
  useEffect(() => {
    if (evenement && isOpen) {
      const initialData: Partial<EvenementModification> = {
        type: evenement.type,
        libelle: evenement.libelle || "",
        description: evenement.description || "",
        paroisse_id: evenement.paroisse_id || 0,
        dates: evenement.date_de_debut
          ? [evenement.date_de_debut]
          : [Date.now()],
      };

      // Ajouter les champs spécifiques selon le type
      if (isMesseEvent(evenement)) {
        Object.assign(initialData, {
          type_messe: evenement.extras?.type_messe || "ORDINAIRE",
          heure_de_debut: evenement.extras?.heure_de_debut || 0,
          heure_de_fin: evenement.extras?.heure_de_fin || 0,
          prix_demande_de_messe: evenement.extras?.prix_demande_de_messe || 0,
        });
      } else if (isActiviteEvent(evenement)) {
        Object.assign(initialData, {
          lieu: evenement.extras?.lieu || "",
          options: evenement.extras?.options || [{ label: "", montant: 0 }],
          categorie: evenement.extras?.categorie || "Détente",
          est_gratuit: evenement.extras?.est_gratuit || false,
          date_de_debut: evenement.date_de_debut,
        });
      }

      setFormData(initialData);
    }
  }, [evenement, isOpen]);

  // Fonction pour mettre à jour les données du formulaire
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Supprimer l'erreur du champ modifié
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Gestion des options d'activité
  const addOption = () => {
    const currentOptions = (formData as ActiviteEvenement).options || [];
    updateFormData("options", [...currentOptions, { label: "", montant: 0 }]);
  };

  const removeOption = (index: number) => {
    const currentOptions = (formData as ActiviteEvenement).options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    updateFormData("options", newOptions);
  };

  const updateOption = (
    index: number,
    field: "label" | "montant",
    value: string | number
  ) => {
    const currentOptions = (formData as ActiviteEvenement).options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = {
      ...newOptions[index],
      [field]: value,
    };
    updateFormData("options", newOptions);
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
      const messeData = formData as MesseEvenement;
      if (!messeData.type_messe) {
        newErrors.type_messe = "Le type de messe est obligatoire";
      }
      if (
        messeData.heure_de_debut &&
        messeData.heure_de_fin &&
        messeData.heure_de_debut >= messeData.heure_de_fin
      ) {
        newErrors.heure_de_fin =
          "L'heure de fin doit être après l'heure de début";
      }
    }

    if (formData.type === "ACTIVITÉ") {
      const activiteData = formData as ActiviteEvenement;
      if (!activiteData.lieu?.trim()) {
        newErrors.lieu = "Le lieu est obligatoire pour une activité";
      }
      if (!activiteData.categorie) {
        newErrors.categorie = "La catégorie est obligatoire";
      }
      if (
        !activiteData.est_gratuit &&
        (!activiteData.options || activiteData.options.length === 0)
      ) {
        newErrors.options =
          "Au moins une option tarifaire est requise pour une activité payante";
      }
      if (activiteData.options) {
        for (let i = 0; i < activiteData.options.length; i++) {
          const option = activiteData.options[i];
          if (!option.label?.trim()) {
            newErrors[`option_${i}_label`] = "Le libellé est obligatoire";
          }
          if (option.montant < 0) {
            newErrors[`option_${i}_montant`] =
              "Le montant ne peut pas être négatif";
          }
        }
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

  // Fonction pour formater l'heure pour l'input time
  const formatTimeForInput = (timestamp: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toTimeString().slice(0, 5);
  };

  // Fonction pour convertir la date de l'input en timestamp
  const parseInputDate = (dateString: string) => {
    if (!dateString) return 0;
    return new Date(dateString).getTime();
  };

  // Fonction pour convertir l'heure de l'input en timestamp
  const parseInputTime = (timeString: string) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.getTime();
  };

  // Gestion de l'upload d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      updateFormData("image", file);
    }
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

      // Préparer les données finales avec l'image si nécessaire
      const finalFormData = {
        ...formData,
        dates:
          formData.dates && formData.dates.length > 0
            ? formData.dates
            : [Date.now()],
      };

      // Ajouter l'image pour les activités si elle a été sélectionnée
      if (formData.type === "ACTIVITÉ" && imageFile) {
        (finalFormData as ActiviteEvenement).image = imageFile;
      }

      // Valider les données avec la fonction du service
      validateEvenementData(finalFormData as EvenementModification);

      // Appeler le service de modification
      const updatedEvenement = await modifierEvenement(
        evenement.id,
        finalFormData as EvenementModification
      );

      toast.success("Événement modifié avec succès");
      onSuccess(updatedEvenement);
      onClose();
    } catch (error: any) {
      console.error("❌ Erreur lors de la modification:", error);
      toast.error(
        error.message || "Erreur lors de la modification de l'événement"
      );
    } finally {
      setLoading(false);
    }
  };

  // Rendu des champs selon le type
  const renderTypeSpecificFields = () => {
    if (!formData.type) return null;

    switch (formData.type) {
      case "MESSE":
        const messeData = formData as MesseEvenement;
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="type_messe">Type de messe *</Label>
              <Select
                value={messeData.type_messe || ""}
                onValueChange={(value) => updateFormData("type_messe", value)}
              >
                <SelectTrigger
                  className={errors.type_messe ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Sélectionner le type de messe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORDINAIRE">Ordinaire</SelectItem>
                  <SelectItem value="SPECIALE">Spéciale</SelectItem>
                </SelectContent>
              </Select>
              {errors.type_messe && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.type_messe}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heure_de_debut">Heure de début</Label>
                <Input
                  id="heure_de_debut"
                  type="time"
                  value={formatTimeForInput(messeData.heure_de_debut || 0)}
                  onChange={(e) =>
                    updateFormData(
                      "heure_de_debut",
                      parseInputTime(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <Label htmlFor="heure_de_fin">Heure de fin</Label>
                <Input
                  id="heure_de_fin"
                  type="time"
                  value={formatTimeForInput(messeData.heure_de_fin || 0)}
                  onChange={(e) =>
                    updateFormData(
                      "heure_de_fin",
                      parseInputTime(e.target.value)
                    )
                  }
                  className={errors.heure_de_fin ? "border-red-500" : ""}
                />
                {errors.heure_de_fin && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.heure_de_fin}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="prix_demande_de_messe">
                Prix demande de messe (FCFA)
              </Label>
              <Input
                id="prix_demande_de_messe"
                type="number"
                min="0"
                value={messeData.prix_demande_de_messe || ""}
                onChange={(e) =>
                  updateFormData(
                    "prix_demande_de_messe",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>
          </div>
        );

      case "ACTIVITÉ":
        const activiteData = formData as ActiviteEvenement;
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="lieu">Lieu *</Label>
              <Input
                id="lieu"
                value={activiteData.lieu || ""}
                onChange={(e) => updateFormData("lieu", e.target.value)}
                placeholder="Lieu de l'activité"
                className={errors.lieu ? "border-red-500" : ""}
              />
              {errors.lieu && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.lieu}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="categorie">Catégorie *</Label>
              <Select
                value={activiteData.categorie || ""}
                onValueChange={(value) => updateFormData("categorie", value)}
              >
                <SelectTrigger
                  className={errors.categorie ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Sélectionner la catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Détente">Détente</SelectItem>
                  <SelectItem value="Retraites">Retraites</SelectItem>
                  <SelectItem value="Pèlerinage">Pèlerinage</SelectItem>
                  <SelectItem value="Formations">Formations</SelectItem>
                </SelectContent>
              </Select>
              {errors.categorie && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.categorie}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="est_gratuit"
                checked={activiteData.est_gratuit || false}
                onCheckedChange={(checked) =>
                  updateFormData("est_gratuit", checked)
                }
              />
              <Label htmlFor="est_gratuit">Activité gratuite</Label>
            </div>

            {/* Options tarifaires (seulement si pas gratuit) */}
            {!activiteData.est_gratuit && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Options tarifaires *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Ajouter une option
                  </Button>
                </div>

                {errors.options && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.options}
                  </p>
                )}

                {activiteData.options?.map((option, index) => (
                  <Card key={index} className="p-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                      <div className="md:col-span-2">
                        <Label htmlFor={`option_${index}_label`}>Libellé</Label>
                        <Input
                          id={`option_${index}_label`}
                          value={option.label}
                          onChange={(e) =>
                            updateOption(index, "label", e.target.value)
                          }
                          placeholder="Ex: Tarif standard"
                          className={
                            errors[`option_${index}_label`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors[`option_${index}_label`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`option_${index}_label`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`option_${index}_montant`}>
                          Montant (FCFA)
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={`option_${index}_montant`}
                            type="number"
                            min="0"
                            value={option.montant || ""}
                            onChange={(e) =>
                              updateOption(
                                index,
                                "montant",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className={
                              errors[`option_${index}_montant`]
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {activiteData.options &&
                            activiteData.options.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeOption(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                        </div>
                        {errors[`option_${index}_montant`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`option_${index}_montant`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div>
              <Label htmlFor="image">Image de l'événement</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-slate-500 mt-1">
                Formats acceptés : JPG, PNG, GIF (max 5MB)
              </p>
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
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
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
                  onChange={(e) =>
                    updateFormData("description", e.target.value)
                  }
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
                  onChange={(e) =>
                    updateFormData("dates", [parseInputDate(e.target.value)])
                  }
                />
              </div>

              <div>
                <Label htmlFor="paroisse_id">ID Paroisse *</Label>
                <Input
                  id="paroisse_id"
                  type="number"
                  min="1"
                  value={formData.paroisse_id || ""}
                  onChange={(e) =>
                    updateFormData("paroisse_id", parseInt(e.target.value) || 0)
                  }
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
              <CardContent>{renderTypeSpecificFields()}</CardContent>
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
