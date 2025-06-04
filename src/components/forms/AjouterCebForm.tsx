/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// AjouterCebForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Church,
  User,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AuthenticationError, ApiError, ForbiddenError, NotFoundError } from "@/services/api";

// Récupération de l'ID paroisse
const getUserParoisseId = () => {
  try {
    const userProfileStr = localStorage.getItem("user_profile");
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr);
      return userProfile.paroisse_id || 0;
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du profil:", err);
  }
  return 0;
};

interface AjouterCebFormProps {
  onClose: () => void;
  onSuccess: (item: any) => void;
}

const AjouterCebForm = ({ 
  onClose, 
  onSuccess 
}: AjouterCebFormProps) => {
  const router = useRouter();
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    nom: "",
    president: "",
  });
  
  const [formErrors, setFormErrors] = useState<{ [key: string]: string | null }>({});
  const [formLoading, setFormLoading] = useState(false);
  
  // Réinitialiser le formulaire à l'ouverture
  useEffect(() => {
    setFormData({
      nom: "",
      president: "",
    });
    
    // Réinitialiser les erreurs
    setFormErrors({});
  }, []);
  
  // Gestion des changements dans le formulaire
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    
    // Pour le champ téléphone du président, n'accepter que les chiffres
    if (name === "president") {
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
    
    // Validation du nom (ne doit pas être vide)
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom ne peut pas être vide";
    }
    
    // Validation du numéro de téléphone du président (si fourni)
    if (formData.president && formData.president.length !== 10) {
      newErrors.president = "Le numéro de téléphone doit comporter 10 chiffres";
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    // Valider le formulaire avant soumission
    if (!validateForm()) {
      toast.error("Formulaire invalide", {
        description: "Veuillez corriger les erreurs avant de soumettre.",
      });
      return;
    }
    
    setFormLoading(true);
    await handleCreate();
  };
  
  // Création d'une nouvelle CEB
  const handleCreate = async () => {
    const paroisseId = getUserParoisseId();
    if (!paroisseId) {
      toast.error("Erreur", {
        description: "ID de paroisse non disponible. Veuillez vous reconnecter.",
      });
      router.push("/login");
      return;
    }
    
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }
      
      // Préparation des données pour l'API
      const apiData = {
        nom: formData.nom,
        paroisse_id: paroisseId,
        president: formData.president || null
      };
      
      // Appel à l'API pour créer la CEB
      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/ceb/creer",
        {
          method: "POST",
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
          const errorMessage = errorData.message || "Le formulaire contient des erreurs.";
          throw new ApiError(errorMessage, 400);
        } else if (response.status === 429) {
          throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
        } else {
          throw new ApiError(
            errorData.message || "Erreur lors de la création de la CEB",
            response.status
          );
        }
      }
      
      const data = await response.json();
      
      toast.success("CEB créée avec succès", {
        description: `"${formData.nom}" a été ajoutée.`,
      });
      
      // Fermer le formulaire et notifier le parent du succès
      onClose();
      onSuccess(data.item);
      
    } catch (err) {
      console.error("Erreur lors de la création de la CEB:", err);
      
      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else {
        toast.error("Échec de la création", {
          description: err instanceof ApiError
            ? err.message
            : "Une erreur est survenue lors de la création de la CEB.",
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
            className={`${formErrors.nom ? "border-red-500" : "border-green-500"} focus:border-green-500 focus:ring-green-500`}
          />
          {formErrors.nom && (
            <p className="text-xs text-red-500">{formErrors.nom}</p>
          )}
        </div>
        
        {/* Numéro du président */}
        <div className="space-y-1">
          <label
            htmlFor="president"
            className="flex items-center text-sm font-medium text-slate-700"
          >
            <User className="h-4 w-4 mr-2 text-violet-600" />
            Téléphone du président
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs sm:text-sm">
              +225
            </span>
            <Input
              id="president"
              name="president"
              value={formData.president}
              onChange={handleChange}
              placeholder="Ex: 0101020304"
              type="tel"
              className={`${
                formErrors.president
                  ? "border-red-500"
                  : "border-violet-200"
              } focus:border-violet-500 focus:ring-violet-500 pl-12 text-sm`}
              maxLength={10}
              inputMode="numeric"
            />
          </div>
          {formErrors.president && (
            <p className="text-xs text-red-500">
              {formErrors.president}
            </p>
          )}
          {formData.president &&
            formData.president.length > 0 &&
            !formErrors.president && (
              <p className="text-xs text-slate-600 font-medium pl-6">
                {/* {formatPhoneDisplay(formData.president)} */}
              </p>
            )}
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
          className="text-white font-medium transition-colors w-full sm:w-auto cursor-pointer"
        >
          {formLoading ? (
            <>
              <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Création...
            </>
          ) : (
            "Créer la CEB"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AjouterCebForm;