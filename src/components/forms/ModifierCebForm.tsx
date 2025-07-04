// ModifierCebForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Church } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  AuthenticationError,
  ApiError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";

// Interface Ceb complète (copiée depuis le fichier principal)
interface Ceb {
  id: number;
  created_at: string;
  identifiant: string;
  nom: string;
  solde: number;
  paroisse_id: number;
  chapelle_id: number | null;
  president_id: number | null;
  president?: {
    id: number;
    nom: string;
    prenoms: string;
    num_de_telephone: string;
  };
}

interface ModifierCebFormProps {
  onClose: () => void;
  cebData: Ceb; // Utilisation du type Ceb complet
  onSuccess: (item: Ceb) => void; // Type plus précis pour le retour
}

const ModifierCebForm: React.FC<ModifierCebFormProps> = ({ 
  onClose, 
  cebData, 
  onSuccess 
}) => {
  const router = useRouter();

  // État pour le formulaire
  const [formData, setFormData] = useState({
    nom: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string | null }>({});
  const [formLoading, setFormLoading] = useState(false);

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (cebData) {
      setFormData({
        nom: cebData.nom || "",
      });
    }

    // Réinitialiser les erreurs
    setFormErrors({});
  }, [cebData]);

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: { nom?: string } = {};

    // Validation du nom (ne doit pas être vide)
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom ne peut pas être vide";
    }

    // Validation de longueur minimale
    if (formData.nom.trim().length < 3) {
      newErrors.nom = "Le nom doit contenir au moins 3 caractères";
    }

    // Validation de longueur maximale
    if (formData.nom.trim().length > 100) {
      newErrors.nom = "Le nom ne peut pas dépasser 100 caractères";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  // Mise à jour d'une CEB existante
  const handleUpdate = async () => {
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      // Préparation des données pour l'API
      const apiData = {
        ceb_id: cebData.id, // Maintenant c'est un number, comme attendu
        nom: formData.nom.trim(),
      };

      // Appel à l'API pour modifier la CEB
      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/ceb/modifier",
        {
          method: "PATCH",
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
        switch (response.status) {
          case 401:
            throw new AuthenticationError("Session expirée");
          case 403:
            throw new ForbiddenError("Accès refusé");
          case 404:
            throw new NotFoundError("CEB non trouvée");
          case 400:
            const errorMessage = errorData.message || "Le formulaire contient des erreurs.";
            throw new ApiError(errorMessage, 400);
          case 429:
            throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
          default:
            throw new ApiError(
              errorData.message || "Erreur lors de la modification de la CEB",
              response.status
            );
        }
      }

      const data = await response.json();

      // Créer l'objet CEB mis à jour avec toutes les propriétés
      const updatedCeb: Ceb = {
        ...cebData,
        nom: formData.nom.trim(),
        // Autres propriétés peuvent être mises à jour ici si l'API les retourne
        ...data.item
      };

      // Fermer le formulaire et notifier le parent du succès
      onClose();
      onSuccess(updatedCeb);

    } catch (err) {
      console.error("Erreur lors de la modification de la CEB:", err);

      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else if (err instanceof ForbiddenError) {
        toast.error("Accès refusé", {
          description: "Vous n'avez pas les droits pour modifier cette CEB.",
        });
      } else if (err instanceof NotFoundError) {
        toast.error("CEB non trouvée", {
          description: "La CEB que vous tentez de modifier n'existe plus.",
        });
      } else {
        toast.error("Échec de la modification", {
          description: err instanceof ApiError
            ? err.message
            : "Une erreur est survenue lors de la modification de la CEB.",
        });
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-2">
        {/* Nom de la CEB */}
        <div className="space-y-1">
          <label
            htmlFor="nom"
            className="flex items-center text-sm font-medium text-slate-700"
          >
            <Church className="h-4 w-4 mr-2 text-green-600" />
            Nom de la CEB <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Nom de la communauté"
            required
            maxLength={100}
            className={`${
              formErrors.nom ? "border-red-500" : "border-green-200"
            } focus:border-green-500 focus:ring-green-500`}
          />
          {formErrors.nom && (
            <p className="text-xs text-red-500">{formErrors.nom}</p>
          )}
          <p className="text-xs text-slate-500">
            {formData.nom.length}/100 caractères
          </p>
        </div>

        {/* Informations de la CEB */}
        <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-200">
          <h4 className="text-sm font-medium text-slate-800 mb-2">
            Informations de la CEB
          </h4>
          <div className="space-y-1 text-xs text-slate-600">
            <p><strong>Date de création:</strong> {new Date(cebData.created_at).toLocaleDateString('fr-FR')}</p>
            {cebData.president && (
              <p><strong>Président:</strong> {cebData.president.nom} {cebData.president.prenoms}</p>
            )}
          </div>
        </div>

        {/* Informations additionnelles */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Informations non modifiables
          </h4>
          <p className="text-xs text-slate-600">
            L'identifiant, le président et les autres informations ne peuvent pas être modifiés
            via ce formulaire. Pour mettre à jour ces informations, veuillez
            contacter l'administrateur.
          </p>
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
        &nbsp;
        <Button
          type="submit"
          disabled={formLoading || !formData.nom.trim()}
          className="text-white font-medium transition-colors w-full sm:w-auto cursor-pointer disabled:opacity-50"
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

export default ModifierCebForm;