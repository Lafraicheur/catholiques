// PhoneNumberModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Phone } from "lucide-react";
import { toast } from "sonner";

interface PhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => Promise<void>;
  title: string;
  roleDescription: string;
}

const PhoneNumberModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  roleDescription,
}: PhoneNumberModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Accepter uniquement les chiffres (et éventuellement + pour l'indicatif)
    const value = e.target.value;
    if (/^[+\d]*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      toast.error("Veuillez entrer un numéro de téléphone");
      return;
    }

    // Validation de format simple (longueur minimale)
    if (phoneNumber.replace(/\+/g, "").length < 8) {
      toast.error("Veuillez entrer un numéro de téléphone valide");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(phoneNumber);
      setPhoneNumber("");
    } catch (error) {
      // L'erreur est gérée dans la fonction parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <p className="text-sm text-slate-500 mb-4">{roleDescription}</p>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Numéro de téléphone
            </label>
            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-slate-950 focus-within:border-slate-950">
              <div className="pl-3 text-slate-500">
                <Phone className="h-4 w-4" />
              </div>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Ex: 0709080706"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <p className="text-xs text-slate-500">
              Entrez le numéro de téléphone complet de la personne
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !phoneNumber.trim()}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Traitement...
                </>
              ) : (
                "Confirmer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneNumberModal;
