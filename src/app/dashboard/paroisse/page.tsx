/* eslint-disable react/no-unescaped-entities */
import { Card } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import EventsList from "@/components/dashboard/EventsList";
import { Metadata } from "next";
import { Calendar, User, Heart, CreditCard, Church } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard Paroisse | Église Catholique",
};

export default function ParoisseDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Paroisse Saint-Joseph</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Paroissiens"
          value="1,234"
          description="+12 dernière semaine"
          icon={<User className="h-5 w-5 text-blue-600" />}
          trend="up"
          trendValue="0.8%"
        />
        <StatsCard
          title="Sacrements"
          value="28"
          description="ce mois-ci"
          icon={<Heart className="h-5 w-5 text-red-600" />}
          trend="up"
          trendValue="12.2%"
        />
        <StatsCard
          title="Messes"
          value="18"
          description="cette semaine"
          icon={<Calendar className="h-5 w-5 text-green-600" />}
          trend="same"
          trendValue="0%"
        />
        <StatsCard
          title="Revenus"
          value="12 500 €"
          description="ce mois-ci"
          icon={<CreditCard className="h-5 w-5 text-amber-600" />}
          trend="down"
          trendValue="3.1%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Événements à venir</h2>
          <EventsList />
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Informations paroissiales</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Church className="h-5 w-5 text-slate-700 mt-0.5" />
              <div>
                <h3 className="font-medium">Paroisse Saint-Joseph</h3>
                <p className="text-sm text-slate-500">12 rue des Églises, 75001 Paris</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Curé</h3>
              <p className="text-sm text-slate-500">Père Jean Dupont</p>
            </div>
            
            <div>
              <h3 className="font-medium">Horaires d'ouverture du secrétariat</h3>
              <p className="text-sm text-slate-500">Du lundi au vendredi, 9h-12h / 14h-18h</p>
            </div>
            
            <div>
              <h3 className="font-medium">Doyenné</h3>
              <p className="text-sm text-slate-500">Doyenné Centre</p>
            </div>
            
            <div>
              <h3 className="font-medium">Site web</h3>
              <p className="text-sm text-blue-500">www.paroisse-stjoseph.fr</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}