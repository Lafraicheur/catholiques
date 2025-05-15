/* eslint-disable react/no-unescaped-entities */
// AjouterMouvementForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Church,
  Shield,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AuthenticationError, ApiError, ForbiddenError, NotFoundError } from "@/services/api";
import { TYPES_MOUVEMENT } from "@/lib/constants";

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

const AjouterMouvementForm = ({ 
  onClose, 
  onSuccess 
}) => {
  const router = useRouter();
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    nom: "",
    type: "PASTORALE DE LA SANTE",
    responsable: "",
    parrain: "",
    aumonier: "",
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  
  // Réinitialiser le formulaire à l'ouverture
  useEffect(() => {
    setFormData({
      nom: "",
      type: "PASTORALE DE LA SANTE",
      responsable: "",
      parrain: "",
      aumonier: "",
    });
    
    // Réinitialiser les erreurs
    setFormErrors({});
  }, []);
  
  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Pour les champs téléphone, n'accepter que les chiffres
    if (["responsable", "parrain", "aumonier"].includes(name)) {
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
  
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Formater le numéro pour l'affichage (XX XX XX XX XX)
  const formatPhoneDisplay = (phone) => {
    if (!phone) return "";
    const groups = [];
    for (let i = 0; i < phone.length; i += 2) {
      groups.push(phone.slice(i, i + 2));
    }
    return groups.join(" ");
  };
  
  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Validation du nom (minimum 10 caractères)
     if (!formData.nom.trim()) {
      newErrors.nom = "Le nom ne peut pas être vide";
    }
    
    // Validation des numéros de téléphone (si fournis)
    if (formData.responsable && formData.responsable.length !== 10) {
      newErrors.responsable = "Le numéro de téléphone doit comporter 10 chiffres";
    }
    
    if (formData.parrain && formData.parrain.length !== 10) {
      newErrors.parrain = "Le numéro de téléphone doit comporter 10 chiffres";
    }
    
    if (formData.aumonier && formData.aumonier.length !== 10) {
      newErrors.aumonier = "Le numéro de téléphone doit comporter 10 chiffres";
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
    await handleCreate();
  };
  
  // Création d'un nouveau mouvement
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
        type: formData.type,
        paroisse_id: paroisseId,
        responsable: formData.responsable || null,
        parrain: formData.parrain || null,
        aumonier: formData.aumonier || null
      };
      
      // Appel à l'API pour créer le mouvement
      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/mouvementassociation/creer",
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
            errorData.message || "Erreur lors de la création du mouvement",
            response.status
          );
        }
      }
      
      const data = await response.json();
      
      toast.success("Mouvement créé avec succès", {
        description: `"${formData.nom}" a été ajouté aux mouvements et associations.`,
      });
      
      // Fermer le formulaire et notifier le parent du succès
      onClose();
      onSuccess(data.item);
      
    } catch (err) {
      console.error("Erreur lors de la création du mouvement:", err);
      
      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else {
        toast.error("Échec de la création", {
          description: err instanceof ApiError
            ? err.message
            : "Une erreur est survenue lors de la création du mouvement.",
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
            placeholder="Nom (min. 10 caractères)"
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
              {TYPES_MOUVEMENT.map(
                (type) => (
                  <SelectItem key={type} value={type} className="text-sm">
                    {type}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
        
        {/* Numéros de téléphone */}
        <div className="space-y-4 mt-3">
          {/* Responsable */}
          <div className="space-y-1">
            <label
              htmlFor="responsable"
              className="flex items-center text-sm font-medium text-slate-700"
            >
              <Phone className="h-4 w-4 mr-2 text-violet-600" />
              Téléphone du responsable
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs sm:text-sm">
                +225
              </span>
              <Input
                id="responsable"
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                placeholder="Ex: 0101020304"
                type="tel"
                className={`${
                  formErrors.responsable
                    ? "border-red-500"
                    : "border-violet-200"
                } focus:border-violet-500 focus:ring-violet-500 pl-12 text-sm`}
                maxLength={10}
                inputMode="numeric"
              />
            </div>
            {formErrors.responsable && (
              <p className="text-xs text-red-500">
                {formErrors.responsable}
              </p>
            )}
            {formData.responsable &&
              formData.responsable.length > 0 &&
              !formErrors.responsable && (
                <p className="text-xs text-slate-600 font-medium pl-6">
                  {/* {formatPhoneDisplay(formData.responsable)} */}
                </p>
              )}
          </div>
          
          {/* Parrain */}
          <div className="space-y-1">
            <label
              htmlFor="parrain"
              className="flex items-center text-sm font-medium text-slate-700"
            >
              <Phone className="h-4 w-4 mr-2 text-amber-600" />
              Téléphone du parrain
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs sm:text-sm">
                +225
              </span>
              <Input
                id="parrain"
                name="parrain"
                value={formData.parrain}
                onChange={handleChange}
                placeholder="Ex: 0708091011"
                type="tel"
                className={`${
                  formErrors.parrain
                    ? "border-red-500"
                    : "border-amber-200"
                } focus:border-amber-500 focus:ring-amber-500 pl-12 text-sm`}
                maxLength={10}
                inputMode="numeric"
              />
            </div>
            {formErrors.parrain && (
              <p className="text-xs text-red-500">{formErrors.parrain}</p>
            )}
            {formData.parrain &&
              formData.parrain.length > 0 &&
              !formErrors.parrain && (
                <p className="text-xs text-slate-600 font-medium pl-6">
                  {/* {formatPhoneDisplay(formData.parrain)} */}
                </p>
              )}
          </div>
          
          {/* Aumônier */}
          <div className="space-y-1">
            <label
              htmlFor="aumonier"
              className="flex items-center text-sm font-medium text-slate-700"
            >
              <Phone className="h-4 w-4 mr-2 text-red-600" />
              Téléphone de l'aumônier
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs sm:text-sm">
                +225
              </span>
              <Input
                id="aumonier"
                name="aumonier"
                value={formData.aumonier}
                onChange={handleChange}
                placeholder="Ex: 0506070809"
                type="tel"
                className={`${
                  formErrors.aumonier
                    ? "border-red-500"
                    : "border-red-200"
                } focus:border-red-500 focus:ring-red-500 pl-12 text-sm`}
                maxLength={10}
                inputMode="numeric"
              />
            </div>
            {formErrors.aumonier && (
              <p className="text-xs text-red-500">
                {formErrors.aumonier}
              </p>
            )}
            {formData.aumonier &&
              formData.aumonier.length > 0 &&
              !formErrors.aumonier && (
                <p className="text-xs text-slate-600 font-medium pl-6">
                  {/* {formatPhoneDisplay(formData.aumonier)} */}
                </p>
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
        <Button
          type="submit"
          disabled={formLoading}
          className="bg-green-600 hover:bg-green-700 text-white font-medium transition-colors w-full sm:w-auto"
        >
          {formLoading ? (
            <>
              <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Création...
            </>
          ) : (
            "Créer le mouvement"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AjouterMouvementForm;