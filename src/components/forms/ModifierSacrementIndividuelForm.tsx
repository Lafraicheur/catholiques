/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Edit, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

// Interface pour représenter un sacrement individuel
interface SacrementIndividuel {
  id: number;
  created_at: string;
  type: string;
  soustype: string;
  date: string;
  description: string;
  celebrant_id: number;
  paroisse_id: number;
  chapelle_id: number | null;
  certificateur_id: number | null;
  celebrant?: {
    id: number;
    nom: string;
    prenoms: string;
  };
  chapelle?: {
    id: number;
    nom: string;
  };
}

// Props du composant
interface ModifierSacrementIndividuelFormProps {
  sacrement: SacrementIndividuel;
  onSuccess?: () => void;
}

export default function ModifierSacrementIndividuelForm({
  sacrement,
  onSuccess,
}: ModifierSacrementIndividuelFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    sacrement_id: sacrement.id.toString(),
    soustype: sacrement.soustype,
    date: sacrement.date,
    description: sacrement.description,
    paroisse_id: sacrement.paroisse_id.toString(),
  });

  // Réinitialiser le formulaire à chaque ouverture
  useEffect(() => {
    if (open) {
      setFormData({
        sacrement_id: sacrement.id.toString(),
        soustype: sacrement.soustype,
        date: sacrement.date,
        description: sacrement.description,
        paroisse_id: sacrement.paroisse_id.toString(),
      });
    }
  }, [open, sacrement]);

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

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      // Préparation des données pour l'API
      const apiData = {
        sacrement_id: formData.sacrement_id,
        soustype: formData.soustype,
        date: formData.date,
        description: formData.description,
        paroisse_id: parseInt(formData.paroisse_id),
        field_value: true, // Ajout du champ field_value comme dans le formulaire de création
      };

      console.log("Données envoyées à l'API:", apiData);

      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-individuel/modifier",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      // Gérer les erreurs potentielles
      const responseText = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Réponse non-JSON:", responseText);
        throw new Error("Format de réponse invalide du serveur");
      }

      if (!response.ok) {
        // Journaliser l'erreur pour le débogage
        console.error("Erreur API:", {
          status: response.status,
          data: responseData,
          text: responseText,
        });

        // Vérifier si l'erreur est liée au field_value
        if (responseText.includes("Text filter requires")) {
          // Essayer une approche alternative
          const alternativeResponse = await fetch(
            "https://api.cathoconnect.ci/api:HzF8fFua/sacrement-individuel/modifier",
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...formData,
                paroisse_id: parseInt(formData.paroisse_id),
                formData: apiData,
              }),
            }
          );

          if (!alternativeResponse.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          responseData = await alternativeResponse.json();
        } else {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
      }

      toast.success("Succès", {
        description: "Le sacrement a été modifié avec succès.",
      });

      // Fermer le dialogue
      setOpen(false);

      // Appeler la fonction de callback en cas de succès
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Erreur lors de la modification du sacrement:", err);
      toast.error("Erreur", {
        description: "Impossible de modifier le sacrement.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" /> Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le sacrement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Type de sacrement */}
          <div className="space-y-2">
            <Label htmlFor="soustype">Type de sacrement</Label>
            <Select
              value={formData.soustype}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, soustype: value }))
              }
            >
              <SelectTrigger id="soustype">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baptême">Baptême</SelectItem>
                <SelectItem value="Première Communion">Première Communion</SelectItem>
                <SelectItem value="Profession De Foi">Profession de Foi</SelectItem>
                <SelectItem value="Sacrement De Malade">
                  Sacrement de Malade
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date du sacrement</Label>
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
                  selected={formData.date ? new Date(formData.date) : undefined}
                  onSelect={handleDateSelect}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Entrez les détails du sacrement..."
              className="min-h-[100px]"
              required
            />
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
