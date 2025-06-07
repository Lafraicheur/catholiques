/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Loader2, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import {
  AuthenticationError,
  ApiError,
  ForbiddenError,
  NotFoundError,
} from "@/services/api";

interface NewSacrementUnionFormProps {
  onSuccess: () => void;
}

export default function NewSacrementUnionForm({
  onSuccess,
}: NewSacrementUnionFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Obtenir l'ID de paroisse depuis le localStorage
  const getUserParoisseId = () => {
    try {
      const userProfileStr = localStorage.getItem("user_profile");
      if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        return userProfile.paroisse_id || 0;
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du profil:", err);
    }
    return 0;
  };

  const [formData, setFormData] = useState({
    type: "Mariage",
    date: "",
    description: "",
    marie_ou_mariee: "",
    premier_temoin: "",
    second_temoin: "",
    pere_celebrant: "",
    paroisse_id: getUserParoisseId(),
    numero_marie_ou_mariee: "",
  });

  // Réinitialiser le formulaire à chaque ouverture
  const resetForm = () => {
    setFormData({
      type: "Mariage",
      date: "",
      description: "",
      marie_ou_mariee: "",
      premier_temoin: "",
      second_temoin: "",
      pere_celebrant: "",
      paroisse_id: getUserParoisseId(),
      numero_marie_ou_mariee: "",
    });
  };

  // Gérer les changements dans le formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Valider le formulaire
  const validateForm = (paroisseId?: number): boolean => {
    // Vérifier la date
    if (!formData.date) {
      toast.error("Erreur de validation", {
        description: "La date du sacrement est requise.",
      });
      return false;
    }

    // Vérifier l'ID de paroisse
    const idToCheck =
      paroisseId !== undefined ? paroisseId : formData.paroisse_id;
    if (!idToCheck) {
      toast.error("Erreur de validation", {
        description:
          "ID de paroisse non disponible. Veuillez vous reconnecter.",
      });
      return false;
    }

    // Vérifier le numéro de téléphone
    if (!formData.numero_marie_ou_mariee) {
      toast.error("Erreur de validation", {
        description: "Le numéro de téléphone est requis.",
      });
      return false;
    }

    // Vérifier le nom du marié/mariée
    if (!formData.marie_ou_mariee) {
      toast.error("Erreur de validation", {
        description: "Le nom du marié/mariée est requis.",
      });
      return false;
    }

    return true;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mettre à jour l'ID de paroisse juste avant la soumission
    const paroisseId = getUserParoisseId();
    setFormData((prev) => ({ ...prev, paroisse_id: paroisseId }));

    if (!validateForm(paroisseId)) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new AuthenticationError("Token d'authentification non trouvé");
      }

      // Construire les données à envoyer selon le nouveau format de l'API
      const apiData = {
        type: formData.type,
        date: formData.date,
        description: formData.description || "",
        marie_ou_mariee: formData.marie_ou_mariee,
        premier_temoin: formData.premier_temoin || "",
        second_temoin: formData.second_temoin || "",
        pere_celebrant: formData.pere_celebrant || "",
        paroisse_id: Number(paroisseId),
        numero_marie_ou_mariee: formData.numero_marie_ou_mariee,
      };

      console.log("Données envoyées à l'API:", apiData);

      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-union/creer",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        const responseText = await response.text();
        console.error("Erreur de l'API:", responseText);

        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = {};
        }

        // Gérer les différents codes d'erreur
        if (response.status === 401) {
          throw new AuthenticationError("Session expirée");
        } else if (response.status === 403) {
          throw new ForbiddenError("Accès refusé");
        } else if (response.status === 404) {
          throw new NotFoundError("Ressource non trouvée");
        } else if (response.status === 429) {
          throw new ApiError(
            "Trop de requêtes, veuillez réessayer plus tard",
            429
          );
        } else {
          throw new ApiError(
            errorData.message ||
              "Erreur lors de la création du sacrement d'union",
            response.status
          );
        }
      }

      const data = await response.json();

      toast.success("Succès", {
        description: "Le sacrement d'union a été créé avec succès.",
      });

      // Fermer le dialogue et réinitialiser le formulaire
      setOpen(false);
      resetForm();

      // Appeler la fonction de callback en cas de succès
      onSuccess();
    } catch (err) {
      console.error("Erreur lors de la création du sacrement:", err);

      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else if (err instanceof ForbiddenError) {
        toast.error("Accès refusé", {
          description:
            "Vous n'avez pas les droits nécessaires pour cette action.",
        });
      } else if (err instanceof NotFoundError) {
        toast.error("Ressource non trouvée", {
          description: "La ressource demandée n'existe pas.",
        });
      } else {
        toast.error("Échec de la création", {
          description:
            err instanceof ApiError
              ? err.message
              : "Une erreur est survenue lors de la création du sacrement d'union.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="text-white cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Mariage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enregistrer un nouveau Mariage</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Date du sacrement */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                Date du sacrement <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border-blue-200"
                required
              />
            </div>

            {/* Nom du marié/mariée */}
            <div className="space-y-2">
              <Label htmlFor="marie_ou_mariee">
                Nom du marié/mariée <span className="text-red-500">*</span>
              </Label>
              <Input
                id="marie_ou_mariee"
                name="marie_ou_mariee"
                value={formData.marie_ou_mariee}
                onChange={handleChange}
                placeholder="Nom complet du marié ou de la mariée"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Premier témoin */}
            <div className="space-y-2">
              <Label htmlFor="premier_temoin">Premier témoin</Label>
              <Input
                id="premier_temoin"
                name="premier_temoin"
                value={formData.premier_temoin}
                onChange={handleChange}
                placeholder="Nom complet du premier témoin"
              />
            </div>

            {/* Second témoin */}
            <div className="space-y-2">
              <Label htmlFor="second_temoin">Second témoin</Label>
              <Input
                id="second_temoin"
                name="second_temoin"
                value={formData.second_temoin}
                onChange={handleChange}
                placeholder="Nom complet du second témoin"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Père célébrant */}
            <div className="space-y-2">
              <Label htmlFor="pere_celebrant">Père célébrant</Label>
              <Input
                id="pere_celebrant"
                name="pere_celebrant"
                value={formData.pere_celebrant}
                onChange={handleChange}
                placeholder="Nom du père célébrant"
              />
            </div>

            {/* Numéro de téléphone */}
            <div className="space-y-2">
              <Label htmlFor="numero_marie_ou_mariee">
                Numéro de téléphone <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs sm:text-sm">
                  +225
                </span>
                <Input
                  id="numero_marie_ou_mariee"
                  name="numero_marie_ou_mariee"
                  value={formData.numero_marie_ou_mariee}
                  onChange={handleChange}
                  placeholder="Ex: 0101020304"
                  className="pl-12"
                  maxLength={10}
                  inputMode="numeric"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Informations complémentaires sur le mariage..."
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                "Enregistrer le mariage"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
