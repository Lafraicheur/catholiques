import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import { Plus, Search, Filter, Download, Building, MapPin, Phone, Mail, Church, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Gestion des Doyennés | Dashboard Église Catholique",
};

// Données fictives pour les doyennés
const doyennes = [
  {
    id: 1,
    nom: "Doyenné Centre",
    adresse: "24 avenue de la Cathédrale, 75001 Paris",
    telephone: "01 42 36 12 34",
    email: "doyen.centre@diocese.fr",
    doyen: "Père Thomas Bernard",
    nbParoisses: 8,
    statut: "actif",
    paroisses: [
      "Paroisse Saint-Joseph",
      "Paroisse Notre-Dame",
      "Paroisse Saint-Pierre",
      "Paroisse Sainte-Anne",
      "Paroisse Saint-Paul",
      "Paroisse Saint-Jean",
      "Paroisse Sainte-Marie",
      "Paroisse Saint-Michel"
    ]
  },
  {
    id: 2,
    nom: "Doyenné Est",
    adresse: "15 rue de l'Est, 75020 Paris",
    telephone: "01 42 38 45 67",
    email: "doyen.est@diocese.fr",
    doyen: "Père Jacques Martin",
    nbParoisses: 5,
    statut: "actif",
    paroisses: [
      "Paroisse Saint-Germain",
      "Paroisse Sainte-Thérèse",
      "Paroisse Saint-Luc",
      "Paroisse Saint-Marc",
      "Paroisse Saint-Matthieu"
    ]
  },
  {
    id: 3,
    nom: "Doyenné Ouest",
    adresse: "32 boulevard de l'Ouest, 75016 Paris",
    telephone: "01 45 78 23 56",
    email: "doyen.ouest@diocese.fr",
    doyen: "Père François Durand",
    nbParoisses: 6,
    statut: "actif",
    paroisses: [
      "Paroisse Saint-François",
      "Paroisse Saint-Antoine",
      "Paroisse Sainte-Claire",
      "Paroisse Saint-Dominique",
      "Paroisse Saint-Benoît",
      "Paroisse Saint-Bernard"
    ]
  },
  {
    id: 4,
    nom: "Doyenné Nord",
    adresse: "8 rue du Nord, 75018 Paris",
    telephone: "01 42 56 89 34",
    email: "doyen.nord@diocese.fr",
    doyen: "Père Louis Moreau",
    nbParoisses: 4,
    statut: "actif",
    paroisses: [
      "Paroisse Sainte-Jeanne",
      "Paroisse Saint-Patrick",
      "Paroisse Saint-Vincent",
      "Paroisse Sainte-Bernadette"
    ]
  },
  {
    id: 5,
    nom: "Doyenné Sud",
    adresse: "45 avenue du Sud, 75014 Paris",
    telephone: "01 43 67 12 98",
    email: "doyen.sud@diocese.fr",
    doyen: "Père Pierre Lefèvre",
    nbParoisses: 5,
    statut: "actif",
    paroisses: [
      "Paroisse Saint-Laurent",
      "Paroisse Sainte-Geneviève",
      "Paroisse Saint-Denis",
      "Paroisse Sainte-Odile",
      "Paroisse Saint-Rémi"
    ]
  }
];

// Formater statut pour Badge
const getStatusBadge = (statut: string) => {
  switch (statut) {
    case "actif":
      return <Badge variant="success">Actif</Badge>;
    case "inactif":
      return <Badge variant="secondary">Inactif</Badge>;
    default:
      return <Badge variant="outline">{statut}</Badge>;
  }
};

export default function DoyennesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Gestion des Doyennés</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un doyenné
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un doyenné..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {doyennes.map((doyenne) => (
            <div 
              key={doyenne.id} 
              className="border border-slate-200 rounded-lg overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white">
                <div className="flex items-start space-x-4 mb-4 md:mb-0">
                  <div className="w-16 h-16 flex-shrink-0 bg-slate-100 rounded-md flex items-center justify-center">
                    <Building className="h-8 w-8 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold text-slate-900">{doyenne.nom}</h2>
                      <div className="ml-2">
                        {getStatusBadge(doyenne.statut)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {doyenne.adresse}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <p className="text-sm text-slate-500 flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span className="font-medium">Doyen:</span> {doyenne.doyen}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center">
                        <Church className="h-4 w-4 mr-1" />
                        <span className="font-medium">Paroisses:</span> {doyenne.nbParoisses}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    {doyenne.telephone}
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    {doyenne.email}
                  </Button>
                  <a 
                    href={`/dashboard/vicariat/doyennes/${doyenne.id}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-9 px-4 py-2"
                  >
                    Détails
                  </a>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                <h3 className="font-medium text-slate-900 mb-2">Paroisses du doyenné</h3>
                <div className="flex flex-wrap gap-2">
                  {doyenne.paroisses.map((paroisse, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm"
                    >
                      <span className="text-slate-700">{paroisse}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {doyennes.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Aucun doyenné trouvé.
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Affichage de 1 à {doyennes.length} sur {doyennes.length} doyennés
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm" disabled>
              Suivant
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}