/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ModifierParoissienForm.jsx - Version corrigée
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Map,
  Flag,
  Home,
  UserCircle,
  Globe,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import {
  AuthenticationError,
  ApiError,
  ForbiddenError,
  NotFoundError,
  updateParoissien,
} from "@/services/parishioner-service";
import { toast } from "sonner";

// Types pour TypeScript
type ParoissienData = {
  id: number;
  paroissien_id: number; // Ajouté pour correspondre au paramètre requis
  nom: string;
  prenoms: string;
  genre: string;
  num_de_telephone: string;
  email: string;
  date_de_naissance: string;
  pays: string;
  nationalite: string;
  ville: string;
  commune: string;
  quartier: string;
  est_abonne: boolean;
  date_de_fin_abonnement: number;
  statut: string;
  statut_social?: string; // Nouveau champ
  abonnement_id: number;
  mouvements?: string[]; // Nouveau champ
  [key: string]: any;
};

interface ModifierParoissienFormProps {
  onClose: () => void;
  paroissienData: ParoissienData;
  onSuccess: (updatedParoissien: ParoissienData) => void;
}

// Constantes pour les options
const STATUTS_RELIGIEUX = ["Aucun", "Baptisé", "Confirmé", "Marié à l'église"];

const STATUTS_SOCIAUX = [
  "Bébé",
  "Enfant",
  "Adolescent",
  "Jeune",
  "Adulte",
  "Personne âgée",
];

const ModifierParoissienForm = ({
  onClose,
  paroissienData,
  onSuccess,
}: ModifierParoissienFormProps) => {
  const router = useRouter();

  // État pour le formulaire avec tous les champs requis
  const [formData, setFormData] = useState<ParoissienData>({
    id: 0,
    paroissien_id: 0,
    nom: "",
    prenoms: "",
    genre: "M",
    num_de_telephone: "",
    email: "",
    date_de_naissance: "",
    pays: "",
    nationalite: "",
    ville: "",
    commune: "",
    quartier: "",
    est_abonne: false,
    date_de_fin_abonnement: 0,
    statut: "Aucun",
    statut_social: "Bébé", // Nouveau champ
    abonnement_id: 0,
    mouvements: [], // Nouveau champ
  });

  const [formErrors, setFormErrors] = useState<Record<string, string | null>>(
    {}
  );
  const [formLoading, setFormLoading] = useState(false);

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (paroissienData) {
      // Formatage de la date de naissance
      const dateNaissance = paroissienData.date_de_naissance
        ? new Date(paroissienData.date_de_naissance).toISOString().split("T")[0]
        : "";

      setFormData({
        id: paroissienData.id,
        paroissien_id: paroissienData.id,
        nom: paroissienData.nom || "",
        prenoms: paroissienData.prenoms || "",
        genre: paroissienData.genre || "M",
        num_de_telephone: paroissienData.num_de_telephone || "",
        email: paroissienData.email || "",
        date_de_naissance: dateNaissance,
        pays: paroissienData.pays || "",
        nationalite: paroissienData.nationalite || "",
        ville: paroissienData.ville || "",
        commune: paroissienData.commune || "",
        quartier: paroissienData.quartier || "",
        est_abonne: paroissienData.est_abonne || false,
        date_de_fin_abonnement: paroissienData.date_de_fin_abonnement || 0,
        statut: paroissienData.statut || "Aucun",
        statut_social: paroissienData.statut_social || "Bébé",
        abonnement_id: paroissienData.abonnement_id || 0,
        mouvements: paroissienData.mouvements || [],
      });
    }

    // Réinitialiser les erreurs
    setFormErrors({});
  }, [paroissienData]);

  // Gestion des changements dans le formulaire
  const handleChange = (e: {
    target: { name: any; value: any; type: any; checked: any };
  }) => {
    const { name, value, type, checked } = e.target;

    // Pour les cases à cocher, utilisez la propriété checked
    const newValue = type === "checkbox" ? checked : value;

    // Pour le numéro de téléphone, n'accepter que les chiffres
    if (name === "num_de_telephone") {
      const onlyNumbers = value.replace(/[^\d]/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: onlyNumbers,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }

    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validation du nom (requis)
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    // Validation du prénom (requis)
    if (!formData.prenoms.trim()) {
      newErrors.prenoms = "Le prénom est requis";
    }

    // Validation du numéro de téléphone (10 chiffres si fourni)
    if (formData.num_de_telephone && formData.num_de_telephone.length !== 10) {
      newErrors.num_de_telephone =
        "Le numéro de téléphone doit comporter 10 chiffres";
    }

    // Validation de l'email (format valide si fourni)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation de la date de naissance (pas dans le futur)
    if (formData.date_de_naissance) {
      const birthDate = new Date(formData.date_de_naissance);
      const today = new Date();
      if (birthDate > today) {
        newErrors.date_de_naissance =
          "La date de naissance ne peut pas être dans le futur";
      }
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Valider le formulaire avant soumission
    if (!validateForm()) {
      toast.error("Formulaire invalide", {
        description: "Veuillez corriger les erreurs avant de soumettre.",
      });
      return;
    }

    setFormLoading(true);

    try {
      // Appel API pour mettre à jour le paroissien
      console.log("Modification du paroissien avec les données:", formData);

      const result = await updateParoissien(formData);

      // Fermer le formulaire et notifier le parent du succès
      onClose();

      // Créer l'objet mis à jour pour l'UI
      const updatedParoissien = {
        ...paroissienData,
        ...formData,
        id: formData.paroissien_id, // S'assurer que l'ID est correct
      };
      onSuccess(updatedParoissien);
    } catch (err) {
      console.error("Erreur lors de la modification du paroissien:", err);

      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else {
        toast.error("Échec de la modification", {
          description:
            err instanceof ApiError
              ? err.message
              : "Une erreur est survenue lors de la modification du paroissien.",
        });
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Nom et Prénom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom" className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-slate-500" />
              Nom <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Nom de famille"
              required
              className={formErrors.nom ? "border-red-500" : ""}
            />
            {formErrors.nom && (
              <p className="text-xs text-red-500">{formErrors.nom}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prenoms" className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-slate-500" />
              Prénom(s) <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="prenoms"
              name="prenoms"
              value={formData.prenoms}
              onChange={handleChange}
              placeholder="Prénom(s)"
              required
              className={formErrors.prenoms ? "border-red-500" : ""}
            />
            {formErrors.prenoms && (
              <p className="text-xs text-red-500">{formErrors.prenoms}</p>
            )}
          </div>
        </div>

        {/* Genre, Téléphone et Email */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="genre" className="flex items-center text-sm">
              <UserCircle className="h-4 w-4 mr-2 text-slate-500" />
              Genre <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={formData.genre}
              onValueChange={(value) => handleSelectChange("genre", value)}
              required
            >
              <SelectTrigger
                id="genre"
                className={formErrors.genre ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Sélectionner le genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculin</SelectItem>
                <SelectItem value="F">Féminin</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.genre && (
              <p className="text-xs text-red-500">{formErrors.genre}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="num_de_telephone"
              className="flex items-center text-sm"
            >
              <Phone className="h-4 w-4 mr-2 text-slate-500" />
              Téléphone
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs sm:text-sm">
                +225
              </span>
              <Input
                id="num_de_telephone"
                name="num_de_telephone"
                value={formData.num_de_telephone}
                onChange={handleChange}
                placeholder="Ex: 0101020304"
                type="tel"
                className={`pl-12 ${formErrors.num_de_telephone ? "border-red-500" : ""}`}
                maxLength={10}
                inputMode="numeric"
              />
            </div>
            {formErrors.num_de_telephone && (
              <p className="text-xs text-red-500">
                {formErrors.num_de_telephone}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-slate-500" />
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemple@mail.com"
              className={formErrors.email ? "border-red-500" : ""}
            />
            {formErrors.email && (
              <p className="text-xs text-red-500">{formErrors.email}</p>
            )}
          </div>
        </div>

        {/* Date de naissance et Statuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="date_de_naissance"
              className="flex items-center text-sm"
            >
              <Calendar className="h-4 w-4 mr-2 text-slate-500" />
              Date de naissance
            </Label>
            <Input
              id="date_de_naissance"
              name="date_de_naissance"
              type="date"
              value={formData.date_de_naissance}
              onChange={handleChange}
              className={formErrors.date_de_naissance ? "border-red-500" : ""}
            />
            {formErrors.date_de_naissance && (
              <p className="text-xs text-red-500">
                {formErrors.date_de_naissance}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="statut" className="flex items-center text-sm">
              <UserCircle className="h-4 w-4 mr-2 text-slate-500" />
              Statut religieux
            </Label>
            <Select
              value={formData.statut}
              onValueChange={(value) => handleSelectChange("statut", value)}
            >
              <SelectTrigger
                id="statut"
                className={formErrors.statut ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Sélectionner statut" />
              </SelectTrigger>
              <SelectContent>
                {STATUTS_RELIGIEUX.map((statut) => (
                  <SelectItem key={statut} value={statut}>
                    {statut}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.statut && (
              <p className="text-xs text-red-500">{formErrors.statut}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="statut_social"
              className="flex items-center text-sm"
            >
              <Users className="h-4 w-4 mr-2 text-slate-500" />
              Statut social
            </Label>
            <Select
              value={formData.statut_social}
              onValueChange={(value) =>
                handleSelectChange("statut_social", value)
              }
            >
              <SelectTrigger
                id="statut_social"
                className={formErrors.statut_social ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Sélectionner le statut social" />
              </SelectTrigger>
              <SelectContent>
                {STATUTS_SOCIAUX.map((statut) => (
                  <SelectItem key={statut} value={statut}>
                    {statut}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.statut_social && (
              <p className="text-xs text-red-500">{formErrors.statut_social}</p>
            )}
          </div>
        </div>

        {/* Localisation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pays" className="flex items-center text-sm">
              <Globe className="h-4 w-4 mr-2 text-slate-500" />
              Pays
            </Label>
            <Input
              id="pays"
              name="pays"
              value={formData.pays}
              onChange={handleChange}
              placeholder="Pays"
              className={formErrors.pays ? "border-red-500" : ""}
            />
            {formErrors.pays && (
              <p className="text-xs text-red-500">{formErrors.pays}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationalite" className="flex items-center text-sm">
              <Flag className="h-4 w-4 mr-2 text-slate-500" />
              Nationalité
            </Label>
            <Input
              id="nationalite"
              name="nationalite"
              value={formData.nationalite}
              onChange={handleChange}
              placeholder="Nationalité"
              className={formErrors.nationalite ? "border-red-500" : ""}
            />
            {formErrors.nationalite && (
              <p className="text-xs text-red-500">{formErrors.nationalite}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ville" className="flex items-center text-sm">
              <Map className="h-4 w-4 mr-2 text-slate-500" />
              Ville
            </Label>
            <Input
              id="ville"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              placeholder="Ville"
              className={formErrors.ville ? "border-red-500" : ""}
            />
            {formErrors.ville && (
              <p className="text-xs text-red-500">{formErrors.ville}</p>
            )}
          </div>
        </div>

        {/* Commune et Quartier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="commune" className="flex items-center text-sm">
              <Map className="h-4 w-4 mr-2 text-slate-500" />
              Commune
            </Label>
            <Input
              id="commune"
              name="commune"
              value={formData.commune}
              onChange={handleChange}
              placeholder="Commune"
              className={formErrors.commune ? "border-red-500" : ""}
            />
            {formErrors.commune && (
              <p className="text-xs text-red-500">{formErrors.commune}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quartier" className="flex items-center text-sm">
              <Home className="h-4 w-4 mr-2 text-slate-500" />
              Quartier
            </Label>
            <Input
              id="quartier"
              name="quartier"
              value={formData.quartier}
              onChange={handleChange}
              placeholder="Quartier"
              className={formErrors.quartier ? "border-red-500" : ""}
            />
            {formErrors.quartier && (
              <p className="text-xs text-red-500">{formErrors.quartier}</p>
            )}
          </div>
        </div>
      </div>

      <DialogFooter className="flex flex-col-reverse sm:flex-row justify-between items-center border-t border-slate-100 pt-4 gap-3 sm:gap-0 mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={formLoading}
          className="border-slate-300 hover:bg-slate-100 hover:text-slate-800 transition-colors w-full sm:w-auto cursor-pointer"
        >
          Annuler
        </Button>
        &nbsp;&nbsp;
        <Button
          type="submit"
          disabled={formLoading}
          className="bg-slate-800 hover:bg-slate-800 text-white font-medium transition-colors w-full sm:w-auto cursor-pointer"
        >
          {formLoading ? (
            <>
              <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Modification...
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ModifierParoissienForm;
