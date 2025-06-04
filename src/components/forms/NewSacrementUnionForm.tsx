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

  // État du formulaire
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
    temoin_marie: "",
    temoin_mariee: "",
    paroisse_id: getUserParoisseId(),
    numero_celebrant: "",
    numero_marie: "",
    numero_mariee: "",
  });

  // Réinitialiser le formulaire à chaque ouverture
  const resetForm = () => {
    setFormData({
      type: "Mariage",
      date: "",
      description: "",
      temoin_marie: "",
      temoin_mariee: "",
      paroisse_id: 0,
      numero_celebrant: "",
      numero_marie: "",
      numero_mariee: "",
    });
  };

  // Gérer les changements dans le formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gérer la sélection de la date
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date: date.toISOString().split("T")[0],
      }));
    }
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
    // Vérifier au moins un numéro de téléphone (marié ou mariée)
    if (!formData.numero_marie && !formData.numero_mariee) {
      toast.error("Erreur de validation", {
        description:
          "Veuillez saisir au moins un numéro de téléphone (marié ou mariée).",
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

      // Construire les données à envoyer
      const apiData = {
        type: formData.type,
        date: formData.date,
        description: formData.description || "",
        temoin_marie: formData.temoin_marie || "",
        temoin_mariee: formData.temoin_mariee || "",
        paroisse_id: Number(paroisseId),
        numero_celebrant: formData.numero_celebrant || "",
        numero_marie: formData.numero_marie || "",
        numero_mariee: formData.numero_mariee || "",
        field_value: true, // Comme pour les sacrements individuels
      };

      console.log("Données envoyées à l'API:", apiData);

      // Première tentative avec le format standard
      let response = await fetch(
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

      // Si erreur, essayer un format alternatif
      if (!response.ok) {
        const responseText = await response.text();
        console.error("Première tentative échouée:", responseText);

        const errorData = await response.json().catch(() => ({}));

        // Gérer les différents codes d'erreur
        if (response.status === 401) {
          throw new AuthenticationError("Session expirée");
        } else if (response.status === 403) {
          throw new ForbiddenError("Accès refusé");
        } else if (response.status === 404) {
          throw new NotFoundError("Ressource non trouvée");
        } else if (response.status === 400) {
          // Si erreur de validation liée au format de données, essayer un format alternatif
          if (responseText.includes("Text filter requires")) {
            console.log("Tentative avec format alternatif...");

            // Format alternatif
            const alternativeData = {
              ...apiData,
              formData: apiData,
            };

            response = await fetch(
              "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-union/creer",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(alternativeData),
              }
            );

            if (!response.ok) {
              throw new ApiError(
                `Erreur HTTP: ${response.status}`,
                response.status
              );
            }
          } else {
            // Autre erreur de validation
            const errorMessage =
              errorData.message || "Le formulaire contient des erreurs.";
            throw new ApiError(errorMessage, 400);
          }
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
        <Button className=" text-white cursor-pointer">
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
            <div className="space-y-2">
              <Label htmlFor="date">
                Date du mariage <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(new Date(formData.date), "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionnez une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      formData.date ? new Date(formData.date) : undefined
                    }
                    onSelect={handleDateSelect}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero_marie">
                Numéro de téléphone du marié{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs sm:text-sm">
                  +225
                </span>
                <Input
                  id="numero_marie"
                  name="numero_marie"
                  value={formData.numero_marie}
                  onChange={handleChange}
                  placeholder="Ex: 0101020304"
                  className="pl-12"
                  maxLength={10}
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Témoin du marié */}
            <div className="space-y-2">
              <Label htmlFor="temoin_marie">Témoin du marié</Label>
              <Input
                id="temoin_marie"
                name="temoin_marie"
                value={formData.temoin_marie}
                onChange={handleChange}
                placeholder="Nom complet du témoin"
              />
            </div>

            {/* Numéro de la mariée */}
            <div className="space-y-2">
              <Label htmlFor="numero_mariee">
                Numéro de téléphone de la mariée{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs sm:text-sm">
                  +225
                </span>
                <Input
                  id="numero_mariee"
                  name="numero_mariee"
                  value={formData.numero_mariee}
                  onChange={handleChange}
                  placeholder="Ex: 0101020304"
                  className="pl-12"
                  maxLength={10}
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Témoin de la mariée */}
            <div className="space-y-2">
              <Label htmlFor="temoin_mariee">Témoin de la mariée</Label>
              <Input
                id="temoin_mariee"
                name="temoin_mariee"
                value={formData.temoin_mariee}
                onChange={handleChange}
                placeholder="Nom complet du témoin"
              />
            </div>

            {/* Numéro du célébrant */}
            <div className="space-y-2">
              <Label htmlFor="numero_celebrant">
                Numéro de téléphone du célébrant
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs sm:text-sm">
                  +225
                </span>
                <Input
                  id="numero_celebrant"
                  name="numero_celebrant"
                  value={formData.numero_celebrant}
                  onChange={handleChange}
                  placeholder="Ex: 0101020304"
                  className="pl-12"
                  maxLength={10}
                  inputMode="numeric"
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
