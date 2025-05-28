/* eslint-disable react/no-unescaped-entities */
// ModifierMouvementForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Church, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  AuthenticationError,
  ApiError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";
import { TYPES_MOUVEMENT } from "@/lib/constants";

const ModifierMouvementForm = ({ onClose, mouvementData, onSuccess }) => {
  const router = useRouter();

  // État pour le formulaire
  const [formData, setFormData] = useState({
    nom: "",
    type: "PASTORALE DE LA SANTE",
  });

  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (mouvementData) {
      setFormData({
        nom: mouvementData.nom || "",
        type: mouvementData.type || "PASTORALE DE LA SANTE",
      });
    }

    // Réinitialiser les erreurs
    setFormErrors({});
  }, [mouvementData]);

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;

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

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    // Validation du nom (ne doit pas être vide)
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom ne peut pas être vide";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valider le formulaire avant soumission
    if (!validateForm()) {
      toast.error("Formulaire invalide", {
        description: "Veuillez corriger les erreurs avant de soumettre.",
      });
      return;
    }

    setFormLoading(true);
    await handleUpdate();
  };

  // Mise à jour d'un mouvement existant
  const handleUpdate = async () => {
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      // Préparation des données pour l'API
      const apiData = {
        mouvementassociation_id: mouvementData.id,
        nom: formData.nom,
        type: formData.type,
        paroisse_id: mouvementData.paroisse_id,
      };

      // Appel à l'API pour modifier le mouvement
      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/mouvementassociation/modifier",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Gérer les différents codes d'erreur
        if (response.status === 401) {
          throw new AuthenticationError("Session expirée");
        } else if (response.status === 403) {
          throw new ForbiddenError("Accès refusé");
        } else if (response.status === 404) {
          throw new NotFoundError("Ressource non trouvée");
        } else if (response.status === 400) {
          // Erreur de validation
          const errorMessage =
            errorData.message || "Le formulaire contient des erreurs.";
          throw new ApiError(errorMessage, 400);
        } else if (response.status === 429) {
          throw new ApiError(
            "Trop de requêtes, veuillez réessayer plus tard",
            429
          );
        } else {
          throw new ApiError(
            errorData.message || "Erreur lors de la modification du mouvement",
            response.status
          );
        }
      }

      const data = await response.json();

      // Fermer le formulaire et notifier le parent du succès
      onClose();
      onSuccess(data.item);
    } catch (err) {
      console.error("Erreur lors de la modification du mouvement:", err);

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
              : "Une erreur est survenue lors de la modification du mouvement.",
        });
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-2">
        {/* Nom du mouvement */}
        <div className="space-y-1">
          <label
            htmlFor="nom"
            className="flex items-center text-sm font-medium text-slate-700"
          >
            <Church className="h-4 w-4 mr-2 text-green-600" />
            Nom du mouvement <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Nom du mouvement"
            required
            className={`${formErrors.nom ? "border-red-500" : "border-green-200"} focus:border-green-500 focus:ring-green-500`}
          />
          {formErrors.nom && (
            <p className="text-xs text-red-500">{formErrors.nom}</p>
          )}
        </div>

        {/* Type de mouvement */}
        <div className="space-y-1">
          <label
            htmlFor="type"
            className="flex items-center text-sm font-medium text-slate-700"
          >
            <Shield className="h-4 w-4 mr-2 text-blue-600" />
            Type <span className="text-red-500 ml-1">*</span>
          </label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange("type", value)}
            required
          >
            <SelectTrigger
              id="type"
              className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent className="max-h-[40vh]">
              {TYPES_MOUVEMENT.map((type) => (
                <SelectItem key={type} value={type} className="text-sm">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Informations additionnelles (non modifiables) */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Informations non modifiables
          </h4>
          <p className="text-xs text-slate-600">
            Les numéros de téléphone (responsable, parrain, aumônier) ne peuvent
            pas être modifiés via ce formulaire. Pour mettre à jour ces
            informations, veuillez contacter l'administrateur.
          </p>
        </div>
      </div>

      <DialogFooter className="flex flex-col-reverse sm:flex-row justify-between items-center border-t border-slate-100 pt-4 gap-3 sm:gap-0 mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={formLoading}
          className="border-slate-300 hover:bg-slate-100 hover:text-slate-800 transition-colors w-full sm:w-auto"
        >
          Annuler
        </Button>
        &nbsp;&nbsp;
        <Button
          type="submit"
          disabled={formLoading}
          className=" text-white font-medium transition-colors w-full sm:w-auto"
        >
          {formLoading ? (
            <>
              <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Modification...
            </>
          ) : (
            "Mettre à jour"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ModifierMouvementForm;
