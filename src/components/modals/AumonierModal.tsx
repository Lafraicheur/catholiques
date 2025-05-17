/* eslint-disable @typescript-eslint/no-unused-vars */
// AumonierModal.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import PhoneNumberModal from "./PhoneNumberModal";

interface AumonierModalProps {
  isOpen: boolean;
  onClose: () => void;
  mouvementId: number;
  onAssigned: () => void;
}

const AumonierModal = ({
  isOpen,
  onClose,
  mouvementId,
  onAssigned,
}: AumonierModalProps) => {
  const handleSubmit = async (phoneNumber: string) => {
    try {
      const API_URL = "https://api.cathoconnect.ci/api:HzF8fFua";
      const token = localStorage.getItem("auth_token");

      // Envoyer directement le numéro de téléphone pour assigner l'aumônier
      await axios.post(
        `${API_URL}/mouvementassociation/nommer-aumonier`,
        {
          mouvementassociation_id: mouvementId,
          aumonier: phoneNumber,  // Envoi du numéro de téléphone directement
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Aumônier assigné avec succès");
      onAssigned();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'assignation de l'aumônier:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Une erreur est survenue");
      } else {
        toast.error("Une erreur est survenue lors de l'assignation de l'aumônier");
      }
      
      throw error;
    }
  };

  return (
    <PhoneNumberModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Assigner un aumônier"
      roleDescription="Entrez le numéro de téléphone de la personne que vous souhaitez assigner comme aumônier de ce mouvement ou association."
    />
  );
};

export default AumonierModal;