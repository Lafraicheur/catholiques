import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface EventFiltersProps {
  // Filtres actuels
  moisActuel: number;
  anneeActuelle: number;
  filtreType: string;
  
  // Callbacks pour les changements
  onMoisChange: (mois: number) => void;
  onAnneeChange: (annee: number) => void;
  onTypeChange: (type: string) => void;
  onMoisPrecedent: () => void;
  onMoisSuivant: () => void;
  
  // Configuration optionnelle
  showNavigationButtons?: boolean;
  className?: string;
}

// Données statiques pour les filtres
const getTypesEvenements = () => {
  return [
    { value: "tous", label: "Tous les types" },
    { value: "MESSE", label: "Messe" },
    { value: "ACTIVITE", label: "Activité" },
    { value: "COTISATION", label: "Cotisation" },
    { value: "INSCRIPTION", label: "Inscription" },
    { value: "DON", label: "Don" },
  ];
};

const getMois = () => {
  return [
    { value: "0", label: "Janvier" },
    { value: "1", label: "Février" },
    { value: "2", label: "Mars" },
    { value: "3", label: "Avril" },
    { value: "4", label: "Mai" },
    { value: "5", label: "Juin" },
    { value: "6", label: "Juillet" },
    { value: "7", label: "Août" },
    { value: "8", label: "Septembre" },
    { value: "9", label: "Octobre" },
    { value: "10", label: "Novembre" },
    { value: "11", label: "Décembre" },
  ];
};

// Générer les années (5 ans avant et après l'année actuelle)
const getAnnees = () => {
  const anneeActuelle = new Date().getFullYear();
  return Array.from(
    { length: 11 },
    (_, i) => anneeActuelle - 5 + i
  );
};

// Obtenir le nom du mois en français
const getNomMois = (mois: number, annee: number): string => {
  return new Date(annee, mois, 1).toLocaleDateString("fr-FR", { 
    month: "long",
    year: "numeric"
  });
};

export default function EventFilters({
  moisActuel,
  anneeActuelle,
  filtreType,
  onMoisChange,
  onAnneeChange,
  onTypeChange,
  onMoisPrecedent,
  onMoisSuivant,
  showNavigationButtons = true,
  className = ""
}: EventFiltersProps) {
  const nomMoisActuel = getNomMois(moisActuel, anneeActuelle);
  const annees = getAnnees();
  const mois = getMois();
  const typesEvenements = getTypesEvenements();

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${className}`}>
      {/* Navigation du mois avec boutons */}
      {showNavigationButtons && (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onMoisPrecedent}
            aria-label="Mois précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-lg font-semibold min-w-[200px] text-center">
            {nomMoisActuel}
          </h2>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onMoisSuivant}
            aria-label="Mois suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Filtres par select */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {/* Sélecteur d'année */}
        <Select
          value={String(anneeActuelle)}
          onValueChange={(value) => onAnneeChange(Number(value))}
        >
          <SelectTrigger className="w-full sm:w-[120px]">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent>
            {annees.map((annee) => (
              <SelectItem key={annee} value={String(annee)}>
                {annee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sélecteur de mois */}
        <Select
          value={String(moisActuel)}
          onValueChange={(value) => onMoisChange(Number(value))}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Mois" />
          </SelectTrigger>
          <SelectContent>
            {mois.map((moisItem) => (
              <SelectItem key={moisItem.value} value={moisItem.value}>
                {moisItem.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sélecteur de type d'événement */}
        <Select value={filtreType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Type d'événement" />
          </SelectTrigger>
          <SelectContent>
            {typesEvenements.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Hook personnalisé pour gérer les filtres d'événements
export function useEventFilters() {
  const dateCourante = new Date();
  const [moisActuel, setMoisActuel] = useState<number>(dateCourante.getMonth());
  const [anneeActuelle, setAnneeActuelle] = useState<number>(dateCourante.getFullYear());
  const [filtreType, setFiltreType] = useState<string>("tous");

  const moisPrecedent = () => {
    if (moisActuel === 0) {
      setMoisActuel(11);
      setAnneeActuelle(anneeActuelle - 1);
    } else {
      setMoisActuel(moisActuel - 1);
    }
  };

  const moisSuivant = () => {
    if (moisActuel === 11) {
      setMoisActuel(0);
      setAnneeActuelle(anneeActuelle + 1);
    } else {
      setMoisActuel(moisActuel + 1);
    }
  };

  const resetToToday = () => {
    const today = new Date();
    setMoisActuel(today.getMonth());
    setAnneeActuelle(today.getFullYear());
  };

  return {
    // État
    moisActuel,
    anneeActuelle,
    filtreType,
    
    // Actions
    setMoisActuel,
    setAnneeActuelle,
    setFiltreType,
    moisPrecedent,
    moisSuivant,
    resetToToday,
    
    // Utilitaires
    getNomMoisActuel: () => getNomMois(moisActuel, anneeActuelle),
  };
}

// Export des utilitaires pour réutilisation
export { getTypesEvenements, getMois, getAnnees, getNomMois };