/* eslint-disable @typescript-eslint/no-unused-vars */
// ConvertirEnParoissienForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Building } from "lucide-react";
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
import { toast } from "sonner";
import {
  AuthenticationError,
  ApiError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";

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

const ConvertirEnParoissienForm = ({ nonParoissien, onClose, onSuccess }) => {
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    nonparoissien_id: 0,
    paroisse_id: 0,
  });
  
  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (nonParoissien) {
      const paroisseId = getUserParoisseId();
      setFormData({
        nonparoissien_id: nonParoissien.id,
        paroisse_id: paroisseId,
      });
    }
  }, [nonParoissien]);

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nonparoissien_id || !formData.paroisse_id) {
      toast.error("Données invalides", {
        description: "L'ID du non-paroissien ou de la paroisse est manquant.",
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

      // Appel à l'API pour convertir le non-paroissien en paroissien
      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/nonparoissien/devenir-paroissien",
        {
          method: "POST",
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
          const errorMessage = errorData.message || "Le formulaire contient des erreurs.";
          throw new ApiError(errorMessage, 400);
        } else if (response.status === 429) {
          throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
        } else {
          throw new ApiError(
            errorData.message || "Erreur lors de la conversion",
            response.status
          );
        }
      }

      const result = await response.json();

      toast.success("Conversion réussie", {
        description: `${nonParoissien.prenom} ${nonParoissien.nom} est désormais un paroissien.`,
      });

      // Fermer le formulaire et notifier le parent
      onClose();
      onSuccess(nonParoissien.id);
    } catch (err) {
      console.error("Erreur lors de la conversion:", err);

      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else {
        toast.error("Échec de la conversion", {
          description: err instanceof ApiError ? err.message : "Une erreur est survenue.",
        });
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-2">
        <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mb-4">
          <div className="flex items-start">
            <UserPlus className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Conversion en paroissien</h3>
              <p className="text-sm text-amber-700">
                Vous êtes sur le point de convertir{" "}
                <span className="font-medium">
                  {nonParoissien?.prenom} {nonParoissien?.nom}
                </span>{" "}
                en paroissien officiel de votre paroisse. Cette action attribuera automatiquement la paroisse active à ce profil.
              </p>
            </div>
          </div>
        </div>
        
        {/* <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-md border border-blue-100">
          <Building className="h-5 w-5 text-blue-600" />
          <div>
            <div className="text-sm font-medium text-blue-800">Paroisse assignée</div>
            <div className="text-sm text-blue-700">ID: {formData.paroisse_id}</div>
          </div>
        </div> */}
        
        <div className="p-4 border border-slate-200 rounded-md">
          <h4 className="font-medium text-slate-900 mb-3">Que se passe-t-il après la conversion ?</h4>
          <ul className="space-y-1 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500 mt-1.5 mr-2"></span>
              Le profil sera converti en paroissien complet
            </li>
            <li className="flex items-start">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500 mt-1.5 mr-2"></span>
              Il apparaîtra dans la liste des paroissiens
            </li>
            <li className="flex items-start">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500 mt-1.5 mr-2"></span>
              Vous pourrez compléter ses informations à tout moment
            </li>
            <li className="flex items-start">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500 mt-1.5 mr-2"></span>
              Il sera retiré de la liste des non-paroissiens
            </li>
          </ul>
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
              Conversion en cours...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Convertir en paroissien
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ConvertirEnParoissienForm;