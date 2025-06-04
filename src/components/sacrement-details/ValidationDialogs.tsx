/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/sacrement-details/ValidationDialogs.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface ValidationDialogsProps {
  showValidateDialog: boolean;
  showRejectDialog: boolean;
  validationLoading: boolean;
  rejectionLoading: boolean;
  rejectionReason: string;
  onValidateDialogChange: (open: boolean) => void;
  onRejectDialogChange: (open: boolean) => void;
  onRejectionReasonChange: (reason: string) => void;
  onConfirmValidation: () => void;
  onConfirmRejection: () => void;
}

export function ValidationDialogs({
  showValidateDialog,
  showRejectDialog,
  validationLoading,
  rejectionLoading,
  rejectionReason,
  onValidateDialogChange,
  onRejectDialogChange,
  onRejectionReasonChange,
  onConfirmValidation,
  onConfirmRejection,
}: ValidationDialogsProps) {
  return (
    <>
      {/* Dialog de confirmation de validation */}
      <Dialog open={showValidateDialog} onOpenChange={onValidateDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la validation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir valider cette soumission de sacrement ?
              Une fois validée, elle sera convertie en sacrement officiel et
              apparaîtra dans les listes correspondantes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onValidateDialogChange(false)}
              disabled={validationLoading}
            >
              Annuler
            </Button>
            <Button
              variant="default"
              onClick={onConfirmValidation}
              disabled={validationLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {validationLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Validation en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Valider
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de rejet */}
      <Dialog open={showRejectDialog} onOpenChange={onRejectDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le rejet</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir rejeter cette soumission de sacrement ?
              Cette action est définitive et le paroissien devra soumettre une
              nouvelle demande si nécessaire.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label
              htmlFor="rejectionReason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Motif du rejet <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="rejectionReason"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Veuillez préciser la raison du rejet..."
              value={rejectionReason}
              onChange={(e) => onRejectionReasonChange(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Ce message sera communiqué au paroissien pour l'informer de la
              raison du rejet.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onRejectDialogChange(false)}
              disabled={rejectionLoading}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmRejection}
              disabled={rejectionLoading || !rejectionReason.trim()}
            >
              {rejectionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejet en cours...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeter
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}