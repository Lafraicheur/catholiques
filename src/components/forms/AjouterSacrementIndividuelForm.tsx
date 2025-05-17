/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// AjouterSacrementIndividuelForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Church, User, FileText, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  AuthenticationError,
  ApiError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Interface pour les props
interface AjouterSacrementIndividuelFormProps {
  onClose: () => void;
  onSuccess: (newSacrement: any) => void;
}

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

  // Récupérer depuis un autre emplacement si nécessaire
  const paroisseId = localStorage.getItem("paroisse_id");
  if (paroisseId && !isNaN(parseInt(paroisseId))) {
    return parseInt(paroisseId);
  }

  return 0; // Valeur par défaut
};

// Types de sacrements disponibles
const TYPES_SACREMENTS = [
  "Baptême",
  "Première Communion",
  "Profession De Foi",
  "Sacrement De Malade"
];

const AjouterSacrementIndividuelForm = ({
  onClose,
  onSuccess,
}: AjouterSacrementIndividuelFormProps) => {
  const router = useRouter();

  // État pour le formulaire
  const [formData, setFormData] = useState({
    soustype: "",
    date: "",
    description: "",
    paroisse_id: getUserParoisseId(),
    celebrant: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  // Réinitialiser le formulaire à l'ouverture
  useEffect(() => {
    const paroisseId = getUserParoisseId();

    if (!paroisseId) {
      console.warn(
        "Aucun ID de paroisse trouvé lors de l'initialisation du formulaire"
      );
    }

    setFormData({
      soustype: "",
      date: "",
      description: "",
      paroisse_id: paroisseId,
      celebrant: "",
    });

    // Réinitialiser les erreurs
    setFormErrors({});
  }, []);

  // Gestion des changements dans le formulaire pour les champs texte
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

  // Gestion du changement pour le select (type de sacrement)
  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      soustype: value,
    }));

    if (formErrors.soustype) {
      setFormErrors((prev) => ({
        ...prev,
        soustype: null,
      }));
    }
  };

  // Gestion du changement de date
  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      date: date ? format(date, "yyyy-MM-dd") : "",
    }));

    if (formErrors.date) {
      setFormErrors((prev) => ({
        ...prev,
        date: null,
      }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    // Validation du type de sacrement (requis)
    if (!formData.soustype) {
      newErrors.soustype = "Le type de sacrement est requis";
    }

    // Validation de la date (requise)
    if (!formData.date) {
      newErrors.date = "La date est requise";
    }

    // Validation de l'ID paroisse
    if (!formData.paroisse_id) {
      newErrors.paroisse_id = "ID de paroisse non disponible";
      console.error("ID de paroisse manquant :", formData.paroisse_id);
    }

    console.log("Données du formulaire:", formData);
    console.log("Erreurs de validation:", newErrors);

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

    // Essayons différentes approches pour soumettre les données
    try {
      // Première tentative : format standard
      const result = await handleCreate();
      if (result) return; // Si réussi, terminé

      // Deuxième tentative : format alternatif
      const result2 = await handleCreateAlternative();
      if (result2) return; // Si réussi, terminé

      // Si aucune approche n'a fonctionné
      toast.error("Échec de la création", {
        description:
          "Impossible de créer le sacrement malgré plusieurs tentatives.",
      });
    } catch (err) {
      // Géré dans les fonctions handleCreate/handleCreateAlternative
    } finally {
      setFormLoading(false);
    }
  };

  // Création d'un nouveau sacrement individuel
  const handleCreate = async () => {
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      // Préparation des données pour l'API
      const apiData = {
        type: "individuel", // Ajout d'un champ type
        soustype: formData.soustype,
        date: formData.date,
        description: formData.description ? formData.description : "",
        paroisse_id: Number(formData.paroisse_id), // Forcer en nombre
        celebrant: formData.celebrant ? formData.celebrant : "",
        field_value: true, // Ajout d'un champ potentiellement requis par l'API
      };

      console.log("Données envoyées à l'API:", apiData);

      // Appel à l'API pour créer le sacrement individuel
      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-individuel/creer",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      // Récupérer le corps de la réponse pour analyser les erreurs
      const responseText = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Réponse non-JSON:", responseText);
        throw new ApiError(
          "Format de réponse invalide du serveur",
          response.status
        );
      }

      if (!response.ok) {
        // Journaliser l'erreur complète pour le débogage
        console.error("Erreur API:", {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        });

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
            responseData?.message ||
            responseData?.error?.message ||
            "Le formulaire contient des erreurs.";

          // Si l'erreur concerne un filtre de texte, donnons plus d'informations
          if (responseText.includes("Text filter requires")) {
            console.error("Erreur de type de données:", responseText);
            throw new ApiError(
              "Erreur de validation: Un champ contient une valeur de type incorrect. Vérifiez que tous les champs sont remplis correctement.",
              400
            );
          }

          throw new ApiError(errorMessage, 400);
        } else if (response.status === 429) {
          throw new ApiError(
            "Trop de requêtes, veuillez réessayer plus tard",
            429
          );
        } else {
          throw new ApiError(
            responseData?.message || "Erreur lors de la création du sacrement",
            response.status
          );
        }
      }

      const data = responseData;

      toast.success("Sacrement créé avec succès", {
        description: `${formData.soustype} a été ajouté.`,
      });

      // Fermer le formulaire et notifier le parent du succès
      onSuccess(data.item);
      onClose();
    } catch (err) {
      console.error("Erreur lors de la création du sacrement:", err);

      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else {
        toast.error("Échec de la création", {
          description:
            err instanceof ApiError
              ? err.message
              : "Une erreur est survenue lors de la création du sacrement.",
        });
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-2">
        {/* Type de sacrement */}
        <div className="space-y-1">
          <label
            htmlFor="soustype"
            className="flex items-center text-sm font-medium text-slate-700"
          >
            <BookOpen className="h-4 w-4 mr-2 text-green-600" />
            Type de sacrement <span className="text-red-500 ml-1">*</span>
          </label>
          <Select value={formData.soustype} onValueChange={handleSelectChange}>
            <SelectTrigger
              className={`${
                formErrors.soustype ? "border-red-500" : "border-green-200"
              } focus:border-green-500 focus:ring-green-500`}
            >
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {TYPES_SACREMENTS.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.soustype && (
            <p className="text-xs text-red-500">{formErrors.soustype}</p>
          )}
        </div>

        {/* Date du sacrement */}
        <div className="space-y-1">
          <label
            htmlFor="date"
            className="flex items-center text-sm font-medium text-slate-700"
          >
            <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
            Date du sacrement <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${
                    formErrors.date ? "border-red-500" : "border-blue-200"
                  } focus:border-blue-500 focus:ring-blue-500`}
                >
                  {formData.date ? (
                    format(new Date(formData.date), "dd MMMM yyyy", {
                      locale: fr,
                    })
                  ) : (
                    <span className="text-slate-500">
                      Sélectionner une date
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date ? new Date(formData.date) : undefined}
                  onSelect={handleDateChange}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
          {formErrors.date && (
            <p className="text-xs text-red-500">{formErrors.date}</p>
          )}
        </div>

        {/* Célébrant */}
        <div className="space-y-1">
          <label
            htmlFor="celebrant"
            className="flex items-center text-sm font-medium text-slate-700"
          >
            <User className="h-4 w-4 mr-2 text-violet-600" />
            Célébrant
          </label>
          <Input
            id="celebrant"
            name="celebrant"
            value={formData.celebrant}
            onChange={handleChange}
            placeholder="Numéro du célébrant"
            className="border-violet-200 focus:border-violet-500 focus:ring-violet-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label
            htmlFor="description"
            className="flex items-center text-sm font-medium text-slate-700"
          >
            <FileText className="h-4 w-4 mr-2 text-amber-600" />
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Informations complémentaires sur le sacrement"
            className="border-amber-200 focus:border-amber-500 focus:ring-amber-500 min-h-24"
          />
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
          className="bg-green-600 hover:bg-green-700 text-white font-medium transition-colors w-full sm:w-auto"
        >
          {formLoading ? (
            <>
              <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Création...
            </>
          ) : (
            "Créer le sacrement"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AjouterSacrementIndividuelForm;
