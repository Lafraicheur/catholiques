// SupprimerNonParoissienConfirmation.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AuthenticationError, ApiError, ForbiddenError, NotFoundError } from "@/services/api";

interface NonParoissien {
  id: string | number;
  prenom: string;
  nom: string;
  // Ajoutez d'autres propriétés si nécessaire
}

interface SupprimerNonParoissienConfirmationProps {
  nonParoissien: NonParoissien;
  onClose: () => void;
  onSuccess: (id: NonParoissien["id"]) => void;
}

const SupprimerNonParoissienConfirmation = ({
  nonParoissien,
  onClose,
  onSuccess,
}: SupprimerNonParoissienConfirmationProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Gestion de la suppression
  const handleDelete = async () => {
    if (!nonParoissien) return;
    
    setLoading(true);
    
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }
      
      // Appel à l'API pour supprimer le non-paroissien
      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/nonparoissien/supprimer",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nonparoissien_id: nonParoissien.id
          }),
        }
      );
      
      if (!response.ok) {
        // Gérer les différents codes d'erreur
        if (response.status === 401) {
          throw new AuthenticationError("Session expirée");
        } else if (response.status === 403) {
          throw new ForbiddenError("Accès refusé");
        } else if (response.status === 404) {
          throw new NotFoundError("Non-paroissien non trouvé");
        } else if (response.status === 429) {
          throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
        } else {
          throw new ApiError("Erreur lors de la suppression", response.status);
        }
      }
      
      // Si la suppression est réussie
      toast.success("Non-paroissien supprimé avec succès", {
        description: `${nonParoissien.prenom} ${nonParoissien.nom} a été supprimé.`,
      });
      
      // Notifier le succès au composant parent
      onSuccess(nonParoissien.id);
      
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      
      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else {
        toast.error("Échec de la suppression", {
          description: err instanceof ApiError
            ? err.message
            : "Une erreur est survenue lors de la suppression.",
        });
      }
    } finally {
      setLoading(false);
      onClose();
    }
  };
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogDescription>
          Êtes-vous sûr de vouloir supprimer{" "}
          <span className="font-medium text-slate-900">
            {nonParoissien?.prenom} {nonParoissien?.nom}
          </span>
          ? Cette action est irréversible.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-4 sm:justify-between">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="sm:mt-0 cursor-pointer"
        >
          Annuler
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          disabled={loading}
          className="cursor-pointer"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Suppression...
            </>
          ) : (
            "Supprimer"
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default SupprimerNonParoissienConfirmation;