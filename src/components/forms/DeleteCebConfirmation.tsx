// DeleteCebConfirmation.jsx
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

const DeleteCebConfirmation = ({ ceb, onClose, onSuccess }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Gestion de la suppression
  const handleDelete = async () => {
    if (!ceb) return;
    
    setLoading(true);
    
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }
      
      // Appel à l'API pour supprimer la CEB
      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/ceb/supprimer",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ceb_id: ceb.id
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
          throw new NotFoundError("CEB non trouvée");
        } else if (response.status === 429) {
          throw new ApiError("Trop de requêtes, veuillez réessayer plus tard", 429);
        } else {
          throw new ApiError("Erreur lors de la suppression", response.status);
        }
      }
      
      // Si la suppression est réussie
      toast.success("CEB supprimée avec succès", {
        description: `"${ceb.nom}" a été supprimée.`,
      });
      
      // Notifier le succès au composant parent
      onSuccess(ceb.id);
      
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
          Êtes-vous sûr de vouloir supprimer la CEB{" "}
          <span className="font-medium text-slate-900">
            {ceb?.nom}
          </span>
          ? Cette action est irréversible et supprimera toutes les données
          associées.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-4">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Annuler
        </Button>
        &nbsp;&nbsp;
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          disabled={loading}
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

export default DeleteCebConfirmation;