/* eslint-disable @typescript-eslint/no-unused-vars */
// ParrainModal.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import PhoneNumberModal from "./PhoneNumberModal";

interface ParrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  mouvementId: number;
  onAssigned: () => void;
}

const ParrainModal = ({
  isOpen,
  onClose,
  mouvementId,
  onAssigned,
}: ParrainModalProps) => {
  const handleSubmit = async (phoneNumber: string) => {
    try {
      const API_URL = "https://api.cathoconnect.ci/api:HzF8fFua";
      const token = localStorage.getItem("auth_token");

      // Envoyer directement le numéro de téléphone pour assigner le parrain
      await axios.post(
        `${API_URL}/mouvementassociation/nommer-parrain`,
        {
          mouvementassociation_id: mouvementId,
          parrain: phoneNumber,  // Envoi du numéro de téléphone directement
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Parrain assigné avec succès");
      onAssigned();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'assignation du parrain:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Une erreur est survenue");
      } else {
        toast.error("Une erreur est survenue lors de l'assignation du parrain");
      }
      
      throw error;
    }
  };

  return (
    <PhoneNumberModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Assigner un parrain"
      roleDescription="Entrez le numéro de téléphone de la personne que vous souhaitez assigner comme parrain de ce mouvement ou association."
    />
  );
};

export default ParrainModal;