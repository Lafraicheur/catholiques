/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// NominerPresidentForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
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
import { nominatePresident } from "@/services/ceb-services";

const NominerPresidentForm = ({ cebId, onClose, onSuccess }) => {
  const router = useRouter();
  const [paroissienId, setParoissienId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation de l'ID du paroissien
  const validateParoissienId = () => {
    // Vérifier que l'ID est un nombre positif
    const id = parseInt(paroissienId, 10);
    if (isNaN(id) || id <= 0) {
      setError("Veuillez entrer un ID de paroissien valide");
      return false;
    }
    
    setError("");
    return true;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider l'ID du paroissien
    if (!validateParoissienId()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Convertir en nombre l'ID du paroissien
      const paroissienIdNum = parseInt(paroissienId, 10);
      
      // Appeler l'API pour nommer le président
      const updatedCeb = await nominatePresident(cebId, paroissienIdNum);
      
      // Notifier le succès
      toast.success("Président nommé avec succès", {
        description: "Le paroissien a été nommé président de cette CEB.",
      });
      
      // Fermer le formulaire et notifier le composant parent
      onClose();
      onSuccess(updatedCeb);
      
    } catch (err) {
      console.error("Erreur lors de la nomination du président:", err);
      
      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else if (err instanceof NotFoundError) {
        setError("Paroissien non trouvé. Veuillez vérifier l'ID.");
      } else {
        setError(
          err instanceof ApiError
            ? err.message
            : "Une erreur est survenue lors de la nomination du président."
        );
        toast.error("Échec de la nomination", {
          description: "Vérifiez que l'ID du paroissien est correct.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="space-y-2">
        <label
          htmlFor="paroissienId"
          className="flex items-center text-sm font-medium text-slate-700"
        >
          <User className="h-4 w-4 mr-2 text-blue-600" />
          ID du paroissien <span className="text-red-500 ml-1">*</span>
        </label>
        <Input
          id="paroissienId"
          type="number"
          value={paroissienId}
          onChange={(e) => setParoissienId(e.target.value)}
          placeholder="Entrez l'ID du paroissien"
          required
          min="1"
          className={`${
            error ? "border-red-500" : "border-blue-200"
          } focus:border-blue-500 focus:ring-blue-500`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        
        {/* Instructions explicatives */}
        <div className="p-3 bg-blue-50 rounded-md border border-blue-100 mt-3">
          <h4 className="text-sm font-medium text-blue-800 mb-1">
            Comment trouver l'ID du paroissien ?
          </h4>
          <p className="text-xs text-slate-600">
            L'ID du paroissien est un numéro unique qui identifie chaque membre de la paroisse.
            Vous pouvez le trouver dans la liste des paroissiens ou sur la page de profil du paroissien.
          </p>
        </div>
      </div>
      
      <DialogFooter className="flex flex-col-reverse sm:flex-row justify-between items-center border-t border-slate-100 pt-4 gap-3 sm:gap-0 mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="border-slate-300 hover:bg-slate-100 hover:text-slate-800 transition-colors w-full sm:w-auto"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors w-full sm:w-auto"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Nomination en cours...
            </>
          ) : (
            "Nommer comme président"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default NominerPresidentForm;