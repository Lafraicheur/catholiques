/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AjouterSacrementIndividuelForm from "./AjouterSacrementIndividuelForm";

interface NewSacrementIndividuelFormProps {
  onSuccess: () => void;
}

const NewSacrementIndividuelForm = ({
  onSuccess,
}: NewSacrementIndividuelFormProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Ouvrir le modal d'ajout
  const openAddModal = () => {
    setShowAddDialog(true);
  };

  // Fermer le modal d'ajout
  const closeAddModal = () => {
    setShowAddDialog(false);
  };

  // Gérer le succès de l'ajout
  const handleCreateSuccess = (newSacrement) => {
    // Fermer le modal
    closeAddModal();

    // Notifier le parent du succès (qui actualisera la liste)
    onSuccess();
  };

  return (
    <>
      {/* Bouton pour ouvrir le modal */}
      <Button onClick={openAddModal} className="cursor-pointer">
        <Plus className="h-4 w-4 mr-2" />
        Nouveau Sacrement
      </Button>

      {/* Dialog d'ajout de sacrement */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px] w-[92vw] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center">
              Nouveau Sacrement Individuel
            </DialogTitle>
          </DialogHeader>

          <AjouterSacrementIndividuelForm
            onClose={closeAddModal}
            onSuccess={handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewSacrementIndividuelForm;
