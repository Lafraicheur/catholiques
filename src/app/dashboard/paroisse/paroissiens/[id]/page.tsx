/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Heart,
  Clock,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Détail Paroissien | Dashboard Église Catholique",
};

interface ParoissienDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Simulation de la récupération des données d'un paroissien
const getParoissien = (id: string) => {
  // Dans une application réelle, vous feriez un appel API ici
  const paroissiens = [
    {
      id: "1",
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@exemple.com",
      telephone: "06 12 34 56 78",
      adresse: "12 rue des Lilas, 75001 Paris",
      dateNaissance: "15/04/1975",
      statut: "actif",
      engagement: ["Lecteur", "Conseil pastoral"],
      sacrements: [
        { type: "Baptême", date: "22/05/1975", lieu: "Église Saint-Joseph" },
        { type: "Communion", date: "10/06/1985", lieu: "Église Saint-Joseph" },
        {
          type: "Confirmation",
          date: "15/09/1990",
          lieu: "Cathédrale Notre-Dame",
        },
        {
          type: "Mariage",
          date: "08/07/2000",
          lieu: "Église Saint-Joseph",
          conjoint: "Marie Durant",
        },
      ],
      dons: [
        { date: "15/01/2025", montant: "50 €", type: "Denier de l'Église" },
        { date: "10/03/2025", montant: "30 €", type: "Offrande de messe" },
        { date: "05/05/2025", montant: "100 €", type: "Don exceptionnel" },
      ],
      notes:
        "Participe régulièrement aux activités paroissiales. Disponible pour les lectures durant les messes dominicales. A exprimé son intérêt pour rejoindre l'équipe d'animation liturgique.",
    },
    {
      id: "2",
      nom: "Martin",
      prenom: "Marie",
      email: "marie.martin@exemple.com",
      telephone: "06 23 45 67 89",
      adresse: "8 avenue des Roses, 75001 Paris",
      dateNaissance: "22/07/1982",
      statut: "actif",
      engagement: ["Catéchiste", "Chorale"],
      sacrements: [
        { type: "Baptême", date: "15/08/1982", lieu: "Église Notre-Dame" },
        { type: "Communion", date: "05/05/1993", lieu: "Église Notre-Dame" },
        {
          type: "Confirmation",
          date: "20/06/1998",
          lieu: "Cathédrale Notre-Dame",
        },
      ],
      dons: [
        { date: "05/01/2025", montant: "100 €", type: "Denier de l'Église" },
        { date: "20/04/2025", montant: "20 €", type: "Offrande de messe" },
      ],
      notes:
        "Très impliquée dans la catéchèse des enfants. Membre de la chorale paroissiale depuis 2015. A proposé d'organiser un événement pour les familles à Noël.",
    },
  ];

  return paroissiens.find((p) => p.id === id);
};

export default async function ParoissienDetailPage({
  params,
}: ParoissienDetailPageProps) {
  const { id } = await params; // ✅ Await la Promise
  const paroissien = getParoissien(id);

  if (!paroissien) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Paroissien non trouvé
        </h1>
        <p className="text-slate-600 mb-6">
          Le paroissien que vous recherchez n'existe pas.
        </p>
        <Link href="/dashboard/paroisse/paroissiens" passHref>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/paroisse/paroissiens" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {paroissien.prenom} {paroissien.nom}
          </h1>
          <Badge
            variant={paroissien.statut === "actif" ? "success" : "secondary"}
          >
            {paroissien.statut === "actif" ? "Actif" : "Inactif"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" /> Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">
                    Nom complet
                  </p>
                  <p>
                    {paroissien.prenom} {paroissien.nom}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">
                    Date de naissance
                  </p>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    {paroissien.dateNaissance}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Email</p>
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-slate-400" />
                    <a
                      href={`mailto:${paroissien.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {paroissien.email}
                    </a>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">
                    Téléphone
                  </p>
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-slate-400" />
                    <a
                      href={`tel:${paroissien.telephone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {paroissien.telephone}
                    </a>
                  </p>
                </div>
                <div className="space-y-1 col-span-full">
                  <p className="text-sm font-medium text-slate-500">Adresse</p>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    {paroissien.adresse}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sacrements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paroissien.sacrements.map((sacrement, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-200 rounded-md"
                  >
                    <div className="flex items-center mb-2 sm:mb-0">
                      <Heart className="h-5 w-5 mr-3 text-red-500" />
                      <div>
                        <h3 className="font-medium">{sacrement.type}</h3>
                        {sacrement.conjoint && (
                          <p className="text-sm text-slate-500">
                            avec {sacrement.conjoint}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      <p className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {sacrement.date}
                      </p>
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {sacrement.lieu}
                      </p>
                    </div>
                  </div>
                ))}

                {paroissien.sacrements.length === 0 && (
                  <p className="text-center py-4 text-slate-500">
                    Aucun sacrement enregistré
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dons et contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-2 px-4 text-left text-sm font-medium text-slate-500">
                        Date
                      </th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-slate-500">
                        Type
                      </th>
                      <th className="py-2 px-4 text-right text-sm font-medium text-slate-500">
                        Montant
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paroissien.dons.map((don, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-2 px-4 text-slate-700">{don.date}</td>
                        <td className="py-2 px-4 text-slate-700">{don.type}</td>
                        <td className="py-2 px-4 text-right font-medium text-slate-900">
                          {don.montant}
                        </td>
                      </tr>
                    ))}

                    {paroissien.dons.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-4 text-center text-slate-500"
                        >
                          Aucun don enregistré
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {paroissien.dons.length > 0 && (
                    <tfoot>
                      <tr>
                        <td
                          colSpan={2}
                          className="py-2 px-4 text-right font-medium text-slate-700"
                        >
                          Total
                        </td>
                        <td className="py-2 px-4 text-right font-bold text-slate-900">
                          {paroissien.dons
                            .reduce((total, don) => {
                              const montant = parseFloat(
                                don.montant
                                  .replace(/[^0-9,.-]/g, "")
                                  .replace(",", ".")
                              );
                              return total + montant;
                            }, 0)
                            .toFixed(2)}{" "}
                          €
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
