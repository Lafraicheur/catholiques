import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import { Plus, Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Gestion des Paroissiens | Dashboard Église Catholique",
};

// Données factices pour les paroissiens
const paroissiens = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@exemple.com",
    telephone: "06 12 34 56 78",
    adresse: "12 rue des Lilas, 75001 Paris",
    dateNaissance: "15/04/1975",
    statut: "actif",
    engagement: ["Lecteur", "Conseil pastoral"],
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Marie",
    email: "marie.martin@exemple.com",
    telephone: "06 23 45 67 89",
    adresse: "8 avenue des Roses, 75001 Paris",
    dateNaissance: "22/07/1982",
    statut: "actif",
    engagement: ["Catéchiste", "Chorale"],
  },
  {
    id: 3,
    nom: "Petit",
    prenom: "Sophie",
    email: "sophie.petit@exemple.com",
    telephone: "06 34 56 78 90",
    adresse: "15 boulevard des Tulipes, 75002 Paris",
    dateNaissance: "10/11/1990",
    statut: "actif",
    engagement: ["Servant d'autel"],
  },
  {
    id: 4,
    nom: "Bernard",
    prenom: "Michel",
    email: "michel.bernard@exemple.com",
    telephone: "06 45 67 89 01",
    adresse: "5 place des Marguerites, 75001 Paris",
    dateNaissance: "03/09/1968",
    statut: "inactif",
    engagement: [],
  },
  {
    id: 5,
    nom: "Dubois",
    prenom: "Lucie",
    email: "lucie.dubois@exemple.com",
    telephone: "06 56 78 90 12",
    adresse: "22 rue des Orchidées, 75002 Paris",
    dateNaissance: "29/12/1995",
    statut: "actif",
    engagement: ["Équipe d'accueil", "Conseil économique"],
  },
];

export default function ParoissiensPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Gestion des Paroissiens
        </h1>
        <Button className="w-full sm:w-auto" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un paroissien
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un paroissien..."
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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                  Nom
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                  Téléphone
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                  Statut
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-slate-500">
                  Engagement
                </th>
                <th className="py-3 px-4 text-right text-sm font-medium text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paroissiens.map((paroissien) => (
                <tr
                  key={paroissien.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">
                      {paroissien.nom} {paroissien.prenom}
                    </div>
                    <div className="text-xs text-slate-500">
                      Né(e) le {paroissien.dateNaissance}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {paroissien.email}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {paroissien.telephone}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        paroissien.statut === "actif" ? "success" : "secondary"
                      }
                    >
                      {paroissien.statut === "actif" ? "Actif" : "Inactif"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {paroissien.engagement.map((role, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {role}
                        </Badge>
                      ))}
                      {paroissien.engagement.length === 0 && (
                        <span className="text-xs text-slate-400">Aucun</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`/dashboard/paroisse/paroissiens/${paroissien.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Détails
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Affichage de 1 à {paroissiens.length} sur {paroissiens.length}{" "}
            paroissiens
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
