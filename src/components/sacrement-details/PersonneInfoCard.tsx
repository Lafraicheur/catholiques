/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

// components/sacrement-details/PersonneInfoCard.tsx
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { User, Phone, Mail, MapPin, UserCheck, Calendar } from "lucide-react";

interface Personne {
  nom: string;
  prenoms: string;
  genre?: string;
  num_de_telephone: string;
  email?: string;
  date_de_naissance?: string;
  ville?: string;
  commune?: string;
  quartier?: string;
  pays?: string;
  statut?: string;
}

interface PersonneInfoCardProps {
  title: string;
  personne: Personne | null;
  emptyMessage?: string;
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: fr });
  } catch (error) {
    return "Date inconnue";
  }
};

export function PersonneInfoCard({ 
  title, 
  personne, 
  emptyMessage = "Aucune information disponible" 
}: PersonneInfoCardProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {personne ? (
        <div className="space-y-4">
          <div className="flex items-start">
            <User className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
            <div>
              <span className="font-medium">Nom complet:</span>
              <p className="mt-1">{`${personne.prenoms} ${personne.nom}`}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {personne.genre && (
              <div className="flex items-start">
                <UserCheck className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                <div>
                  <span className="font-medium">Genre:</span>
                  <p className="mt-1">
                    {personne.genre === "M" ? "Masculin" : "Féminin"}
                  </p>
                </div>
              </div>
            )}

            {personne.date_de_naissance && (
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                <div>
                  <span className="font-medium">Date de naissance:</span>
                  <p className="mt-1">{formatDate(personne.date_de_naissance)}</p>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
              <div>
                <span className="font-medium">Téléphone:</span>
                <p className="mt-1">{personne.num_de_telephone}</p>
              </div>
            </div>
          </div>

          {(personne.ville || personne.commune || personne.quartier) && (
            <div className="flex items-start mt-4">
              <MapPin className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
              <div>
                <span className="font-medium">Adresse:</span>
                <p className="mt-1">
                  {[personne.quartier, personne.commune, personne.ville, personne.pays]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 p-4 rounded-md text-slate-600 italic">
          {emptyMessage}
        </div>
      )}
    </Card>
  );
}