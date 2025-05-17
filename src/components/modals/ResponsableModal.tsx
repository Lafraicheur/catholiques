/* eslint-disable @typescript-eslint/no-unused-vars */
// ResponsableModal.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import PhoneNumberModal from "./PhoneNumberModal";

interface ResponsableModalProps {
  isOpen: boolean;
  onClose: () => void;
  mouvementId: number;
  onAssigned: () => void;
}

const ResponsableModal = ({
  isOpen,
  onClose,
  mouvementId,
  onAssigned,
}: ResponsableModalProps) => {
  const handleSubmit = async (phoneNumber: string) => {
    try {
      const API_URL = "https://api.cathoconnect.ci/api:HzF8fFua";
      const token = localStorage.getItem("auth_token");

      // Envoyer directement le numéro de téléphone pour assigner le responsable
      await axios.post(
        `${API_URL}/mouvementassociation/nommer-responsable`,
        {
          mouvementassociation_id: mouvementId,
          responsable: phoneNumber,  // Envoi du numéro de téléphone directement
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Responsable assigné avec succès");
      onAssigned();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'assignation du responsable:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Une erreur est survenue");
      } else {
        toast.error("Une erreur est survenue lors de l'assignation du responsable");
      }
      
      throw error;
    }
  };

  return (
    <PhoneNumberModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Assigner un responsable"
      roleDescription="Entrez le numéro de téléphone de la personne que vous souhaitez assigner comme responsable de ce mouvement ou association."
    />
  );
};

export default ResponsableModal;