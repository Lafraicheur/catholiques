// ModifierNonParoissienForm.jsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Venus, Mars, Phone } from "lucide-react";
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

interface NonParoissien {
  id: number;
  created_at: string; // ← Ajouté
  nom: string;
  prenom: string;
  genre: "M" | "F"; // ← Type précisé
  num_de_telephone: string;
}

interface ModifierNonParoissienFormProps {
  nonParoissien: NonParoissien;
  onClose: () => void;
  onSuccess: (updatedNonParoissien: NonParoissien) => void;
}

const ModifierNonParoissienForm = ({
  nonParoissien,
  onClose,
  onSuccess,
}: ModifierNonParoissienFormProps) => {
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);

  // État pour le formulaire
  const [formData, setFormData] = useState({
    nonparoissien_id: 0,
    nom: "",
    prenom: "",
    genre: "M",
    num_de_telephone: "",
  });

  const [formErrors, setFormErrors] = useState<{
    [key: string]: string | null;
  }>({});

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (nonParoissien) {
      setFormData({
        nonparoissien_id: nonParoissien.id,
        nom: nonParoissien.nom || "",
        prenom: nonParoissien.prenom || "",
        genre: nonParoissien.genre || "M",
        num_de_telephone: nonParoissien.num_de_telephone || "",
      });
    }
  }, [nonParoissien]);

  // Gestion des changements dans le formulaire
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;

    // Pour le champ téléphone, n'accepter que les chiffres
    if (name === "num_de_telephone") {
      const onlyNumbers = value.replace(/[^\d]/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: onlyNumbers,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
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

  // Formater le numéro pour l'affichage (XX XX XX XX XX)
  const formatPhoneDisplay = (phone: string | any[]) => {
    if (!phone) return "";
    const groups = [];
    for (let i = 0; i < phone.length; i += 2) {
      groups.push(phone.slice(i, i + 2));
    }
    return groups.join(" ");
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {};

    // Validation du nom et prénom (non vide)
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }

    // Validation du numéro de téléphone (10 chiffres si fourni)
    if (formData.num_de_telephone && formData.num_de_telephone.length !== 10) {
      newErrors.num_de_telephone =
        "Le numéro de téléphone doit comporter 10 chiffres";
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
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      // Appel à l'API pour modifier le non-paroissien
      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/nonparoissien/modifier",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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
            errorData.message || "Erreur lors de la modification",
            response.status
          );
        }
      }

      const updatedData = await response.json();

      // const updatedNonParoissien = await response.json();

      const updatedNonParoissien: NonParoissien = {
        id: formData.nonparoissien_id,
        created_at: nonParoissien.created_at, // Conserver la date originale
        nom: formData.nom,
        prenom: formData.prenom,
        genre: formData.genre as "M" | "F",
        num_de_telephone: formData.num_de_telephone,
        // Ou utiliser les données retournées par l'API si elles incluent created_at
        ...updatedData,
      };

      toast.success("Non-paroissien modifié avec succès", {
        description: `${formData.prenom} ${formData.nom} a été mis à jour.`,
      });

      // Fermer le formulaire et notifier le parent
      onClose();
      onSuccess(updatedNonParoissien);
    } catch (err) {
      console.error("Erreur lors de la modification:", err);

      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else {
        toast.error("Échec de la modification", {
          description:
            err instanceof ApiError ? err.message : "Une erreur est survenue.",
        });
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nom */}
          <div className="space-y-1">
            <label htmlFor="nom" className="text-sm font-medium text-slate-700">
              Nom <span className="text-red-500">*</span>
            </label>
            <Input
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Nom"
              required
              className={formErrors.nom ? "border-red-500" : ""}
            />
            {formErrors.nom && (
              <p className="text-xs text-red-500">{formErrors.nom}</p>
            )}
          </div>

          {/* Prénom */}
          <div className="space-y-1">
            <label
              htmlFor="prenom"
              className="text-sm font-medium text-slate-700"
            >
              Prénom <span className="text-red-500">*</span>
            </label>
            <Input
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Prénom"
              required
              className={formErrors.prenom ? "border-red-500" : ""}
            />
            {formErrors.prenom && (
              <p className="text-xs text-red-500">{formErrors.prenom}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Genre */}
          <div className="space-y-1">
            <label
              htmlFor="genre"
              className="text-sm font-medium text-slate-700"
            >
              Genre <span className="text-red-500">*</span>
            </label>

            <Select
              value={formData.genre}
              onValueChange={(value) => handleSelectChange("genre", value)}
              required
            >
              <SelectTrigger id="genre">
                <SelectValue placeholder="Sélectionner un genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">
                  <div className="flex items-center">
                    <Mars className="h-4 w-4 mr-2 text-blue-600" />
                    Homme
                  </div>
                </SelectItem>
                <SelectItem value="F">
                  <div className="flex items-center">
                    <Venus className="h-4 w-4 mr-2 text-pink-600" />
                    Femme
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Téléphone */}
          <div className="space-y-1">
            <label
              htmlFor="num_de_telephone"
              className="text-sm font-medium text-slate-700"
            >
              Numéro de téléphone
            </label>
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
                className={`${formErrors.num_de_telephone ? "border-red-500" : ""} pl-12 text-sm`}
                maxLength={10}
                inputMode="numeric"
              />
            </div>
            {formErrors.num_de_telephone && (
              <p className="text-xs text-red-500">
                {formErrors.num_de_telephone}
              </p>
            )}
            {formData.num_de_telephone &&
              formData.num_de_telephone.length > 0 &&
              !formErrors.num_de_telephone && (
                <p className="text-xs text-slate-600 font-medium pl-2"></p>
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
          className="border-slate-300 hover:bg-slate-100 hover:text-slate-800 transition-colors w-full sm:w-auto"
        >
          Annuler
        </Button>
        &nbsp;&nbsp;
        <Button
          type="submit"
          disabled={formLoading}
          className="text-white font-medium transition-colors w-full sm:w-auto cursor-pointer"
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

export default ModifierNonParoissienForm;
