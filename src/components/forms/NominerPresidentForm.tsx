/* eslint-disable @typescript-eslint/no-unused-vars */
// NominerPresidentForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone } from "lucide-react";
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
  const [telephone, setTelephone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Nettoyage et formatage du numéro de téléphone
  const formatPhoneNumber = (phone) => {
    // Supprimer tous les caractères non numériques
    return phone.replace(/\D/g, "");
  };

  // Validation du numéro de téléphone
  const validateTelephone = () => {
    const cleanPhone = formatPhoneNumber(telephone);

    // Vérifier que le téléphone contient 10 chiffres après nettoyage
    if (cleanPhone.length !== 10) {
      setError("Veuillez entrer un numéro de téléphone valide à 10 chiffres");
      return false;
    }

    setError("");
    return cleanPhone; // Retourner le numéro nettoyé
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valider et formater le numéro de téléphone
    const cleanPhone = validateTelephone();
    if (!cleanPhone) {
      return;
    }

    setLoading(true);

    try {
      // Appeler l'API pour nommer le président avec le numéro formaté
      const updatedCeb = await nominatePresident(cebId, cleanPhone);

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
        setError(
          "Paroissien non trouvé. Veuillez vérifier que ce numéro est enregistré dans le système."
        );
      } else if (err instanceof ApiError && err.status === 400) {
        setError(
          "Format de numéro invalide. Veuillez fournir un numéro à 10 chiffres."
        );
      } else {
        setError(
          err instanceof ApiError
            ? err.message
            : "Une erreur est survenue lors de la nomination du président."
        );
        toast.error("Échec de la nomination", {
          description:
            "Vérifiez que le numéro de téléphone est correct et que le paroissien est inscrit.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="telephone" className="block text-sm font-medium">
          Numéro de téléphone du paroissien *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="telephone"
            type="tel"
            value={telephone}
            onChange={(e) => {
              setTelephone(e.target.value);
              // Effacer l'erreur lorsque l'utilisateur commence à taper
              if (error) setError("");
            }}
            placeholder="0XXXXXXXXX (10 chiffres)"
            required
            className={`pl-10 ${
              error ? "border-red-500" : "border-blue-200"
            } focus:border-blue-500 focus:ring-blue-500`}
          />
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      {/* Instructions explicatives */}
      <div className="bg-blue-50 p-3 rounded-md">
        <h4 className="text-sm font-medium text-blue-800 mb-1">
          Comment identifier le paroissien ?
        </h4>
        <p className="text-sm text-blue-700">
          Utilisez le numéro de téléphone exactement comme enregistré dans le
          système. Format: 10 chiffres commençant par 0 (ex: 0779123456). Le
          paroissien doit déjà être enregistré dans la paroisse avec ce numéro.
        </p>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
          Annuler
        </Button>
        &nbsp;&nbsp;
        <Button type="submit" disabled={loading} className="cursor-pointer">
          {loading ? (
            <>
              <span className="animate-spin mr-2">&#9696;</span>
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
