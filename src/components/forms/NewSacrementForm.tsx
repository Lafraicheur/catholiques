/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Importez tous les composants de la même bibliothèque
import { Calendar, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Importez tous les composants de Select depuis le même endroit

// Types de sacrements disponibles
const SACREMENT_TYPES = [
  "Baptême",
  "Communion",
  "Confirmation",
  "Mariage",
  "Onction des malades"
];

// Composant de formulaire d'ajout de sacrement
export default function NewSacrementForm() {
  const [showDialog, setShowDialog] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});
  
  // Récupérer l'ID de la paroisse à partir du localStorage
  const getUserParoisseId = (): number => {
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
  
  // État du formulaire
  const [formData, setFormData] = useState({
    type: "Baptême",
    date: new Date().toISOString().split('T')[0],
    description: "",
    celebrant_id: "",
    // On ne stocke plus paroisse_id ici car on le récupère automatiquement
    chapelle_id: "",
    certificateur_id: "",
  });

  // Gestion des changements de champs
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string | null> = {};
    
    // Validation du type (requis)
    if (!formData.type) {
      newErrors.type = "Le type de sacrement est requis";
    }
    
    // Validation de la date (requis et format valide)
    if (!formData.date) {
      newErrors.date = "La date est requise";
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.date)) {
        newErrors.date = "Format de date invalide (AAAA-MM-JJ)";
      }
    }
    
    // Validation de la description (requis)
    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }
    
    // Validation du célébrant (requis)
    if (!formData.celebrant_id) {
      newErrors.celebrant_id = "L'ID du célébrant est requis";
    } else if (isNaN(Number(formData.celebrant_id)) || Number(formData.celebrant_id) <= 0) {
      newErrors.celebrant_id = "L'ID du célébrant doit être un nombre positif";
    }
    
    // Vérifier si l'ID de la paroisse est disponible
    const paroisseId = getUserParoisseId();
    if (!paroisseId) {
      newErrors.paroisse = "Impossible de récupérer l'ID de la paroisse depuis votre profil";
    }
    
    // Chapelle ID (optionnel mais doit être un nombre si fourni)
    if (formData.chapelle_id && (isNaN(Number(formData.chapelle_id)) || Number(formData.chapelle_id) <= 0)) {
      newErrors.chapelle_id = "L'ID de la chapelle doit être un nombre positif";
    }
    
    // Certificateur ID (optionnel mais doit être un nombre si fourni)
    if (formData.certificateur_id && (isNaN(Number(formData.certificateur_id)) || Number(formData.certificateur_id) <= 0)) {
      newErrors.certificateur_id = "L'ID du certificateur doit être un nombre positif";
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    // Valider le formulaire
    if (!validateForm()) {
      toast.error("Formulaire invalide", {
        description: "Veuillez corriger les erreurs avant de soumettre.",
      });
      return;
    }
    
    setFormLoading(true);
    
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }
      
      // Récupérer l'ID de la paroisse
      const paroisseId = getUserParoisseId();
      
      if (!paroisseId) {
        throw new Error("ID de paroisse non disponible dans votre profil");
      }
      
      // Préparer les données pour l'API
      const apiData = {
        type: formData.type,
        date: formData.date,
        description: formData.description,
        celebrant_id: Number(formData.celebrant_id),
        paroisse_id: Number(paroisseId), // Utiliser l'ID récupéré automatiquement
        chapelle_id: formData.chapelle_id ? Number(formData.chapelle_id) : null,
        certificateur_id: formData.certificateur_id ? Number(formData.certificateur_id) : null,
      };
      
      // Appel à l'API
      const response = await fetch(
        "https://api.cathoconnect.ci/api:HzF8fFua/sacrement",
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Afficher un message de succès
      toast.success("Sacrement créé avec succès", {
        description: `Le ${formData.type.toLowerCase()} a été programmé pour le ${new Date(formData.date).toLocaleDateString('fr-FR')}`,
      });
      
      // Fermer le modal et réinitialiser le formulaire
      setShowDialog(false);
      
      // Rafraîchir la page pour afficher le nouveau sacrement
      window.location.reload();
      
    } catch (err) {
      console.error("Erreur lors de la création du sacrement:", err);
      toast.error("Échec de la création", {
        description: err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la création du sacrement.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setShowDialog(true)}
        className="w-full xs:w-auto"
        size="sm"
      >
        <Plus className="mr-2 h-4 w-4" /> Nouvelle demande
      </Button>
      
      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open);
        if (!open) {
          // Réinitialiser le formulaire à la fermeture
          setFormData({
            type: "Baptême",
            date: new Date().toISOString().split('T')[0],
            description: "",
            celebrant_id: "",
            // Plus de paroisse_id ici
            chapelle_id: "",
            certificateur_id: "",
          });
          setFormErrors({});
        }
      }}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Ajouter un nouveau sacrement
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations pour programmer un nouveau sacrement
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {/* Type de sacrement */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Type de sacrement <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, type: value }));
                  if (formErrors.type) {
                    setFormErrors(prev => ({ ...prev, type: null }));
                  }
                }}
              >
                <SelectTrigger id="type" className={formErrors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {SACREMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.type && (
                <p className="text-xs text-red-500">{formErrors.type}</p>
              )}
            </div>
            
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={formErrors.date ? "border-red-500" : ""}
                required
              />
              {formErrors.date && (
                <p className="text-xs text-red-500">{formErrors.date}</p>
              )}
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Entrez les détails du sacrement (nom de la personne, heure, lieu, etc.)"
                className={`min-h-[100px] ${formErrors.description ? "border-red-500" : ""}`}
                required
              />
              {formErrors.description && (
                <p className="text-xs text-red-500">{formErrors.description}</p>
              )}
              <p className="text-xs text-slate-500">
                Exemple: "Baptême pour Jean Dupont à 15h30 à l'église Sainte Marie"
              </p>
            </div>
            
            {/* IDs - placés dans une grille pour économiser de l'espace */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Célébrant ID */}
              <div className="space-y-2">
                <Label htmlFor="celebrant_id" className="text-sm font-medium">
                  ID du célébrant <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="celebrant_id"
                  name="celebrant_id"
                  type="number"
                  value={formData.celebrant_id}
                  onChange={handleChange}
                  placeholder="Ex: 1"
                  className={formErrors.celebrant_id ? "border-red-500" : ""}
                  min="1"
                  required
                />
                {formErrors.celebrant_id && (
                  <p className="text-xs text-red-500">{formErrors.celebrant_id}</p>
                )}
              </div>
              
              {/* Chapelle ID (optionnel) */}
              <div className="space-y-2">
                <Label htmlFor="chapelle_id" className="text-sm font-medium">
                  ID de la chapelle (optionnel)
                </Label>
                <Input
                  id="chapelle_id"
                  name="chapelle_id"
                  type="number"
                  value={formData.chapelle_id}
                  onChange={handleChange}
                  placeholder="Ex: 1"
                  className={formErrors.chapelle_id ? "border-red-500" : ""}
                  min="1"
                />
                {formErrors.chapelle_id && (
                  <p className="text-xs text-red-500">{formErrors.chapelle_id}</p>
                )}
              </div>
              
              {/* Certificateur ID (optionnel) */}
              <div className="space-y-2">
                <Label htmlFor="certificateur_id" className="text-sm font-medium">
                  ID du certificateur (optionnel)
                </Label>
                <Input
                  id="certificateur_id"
                  name="certificateur_id"
                  type="number"
                  value={formData.certificateur_id}
                  onChange={handleChange}
                  placeholder="Ex: 1"
                  className={formErrors.certificateur_id ? "border-red-500" : ""}
                  min="1"
                />
                {formErrors.certificateur_id && (
                  <p className="text-xs text-red-500">{formErrors.certificateur_id}</p>
                )}
              </div>
              
              {/* Affichage des erreurs de paroisse si nécessaire */}
              {formErrors.paroisse && (
                <div className="col-span-1 md:col-span-2">
                  <p className="text-xs text-red-500">{formErrors.paroisse}</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="pt-4 flex-col-reverse sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={formLoading}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={formLoading}
                className="w-full sm:w-auto"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer le sacrement"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}