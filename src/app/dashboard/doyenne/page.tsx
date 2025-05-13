import { Card } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import { Metadata } from "next";
import { Church, Users, Calendar, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard Doyenné | Église Catholique",
};

export default function DoyenneDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Doyenné Centre</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Paroisses"
          value="8"
          icon={<Church className="h-5 w-5 text-green-600" />}
        />
        <StatsCard
          title="Prêtres"
          value="16"
          icon={<Users className="h-5 w-5 text-amber-600" />}
        />
        <StatsCard
          title="Événements"
          value="6"
          description="prévus ce mois-ci"
          icon={<Calendar className="h-5 w-5 text-indigo-600" />}
        />
        <StatsCard
          title="Communications"
          value="12"
          description="derniers 30 jours"
          icon={<MessageSquare className="h-5 w-5 text-blue-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Paroisses du doyenné</h2>
          <div className="space-y-3">
            <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">
              <h3 className="font-medium">Paroisse Saint-Joseph</h3>
              <p className="text-sm text-slate-500 mt-1">12 rue des Églises, 75001 Paris</p>
            </div>
            <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">
              <h3 className="font-medium">Paroisse Notre-Dame</h3>
              <p className="text-sm text-slate-500 mt-1">24 avenue de la Cathédrale, 75001 Paris</p>
            </div>
            <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">
              <h3 className="font-medium">Paroisse Saint-Pierre</h3>
              <p className="text-sm text-slate-500 mt-1">3 rue des Apôtres, 75001 Paris</p>
            </div>
            <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">
              <h3 className="font-medium">Paroisse Sainte-Anne</h3>
              <p className="text-sm text-slate-500 mt-1">15 rue Sainte-Anne, 75001 Paris</p>
            </div>
            <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">
              <h3 className="font-medium">Paroisse Saint-Paul</h3>
              <p className="text-sm text-slate-500 mt-1">42 rue Saint-Paul, 75002 Paris</p>
            </div>
          </div>
          <div className="mt-4 text-right">
            <a href="/dashboard/doyenne/paroisses" className="text-sm text-blue-600 hover:text-blue-800">
              Voir toutes les paroisses →
            </a>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Événements à venir</h2>
          <div className="space-y-3">
            <div className="p-3 border border-slate-200 rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Réunion des curés</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">20 Mai 2025</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Maison du doyenné</p>
            </div>
            
            <div className="p-3 border border-slate-200 rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Formation liturgique</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">2 Juin 2025</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Paroisse Saint-Joseph</p>
            </div>
            
            <div className="p-3 border border-slate-200 rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Veillée de prière pour les vocations</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">15 Juin 2025</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Paroisse Notre-Dame</p>
            </div>
          </div>
          
          <div className="mt-4 text-right">
            <a href="/dashboard/doyenne/evenements" className="text-sm text-blue-600 hover:text-blue-800">
              Voir tous les événements →
            </a>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Informations du Doyenné</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Doyen</h3>
              <p className="text-sm text-slate-500">Père Thomas Bernard</p>
            </div>
            
            <div>
              <h3 className="font-medium">Adresse</h3>
              <p className="text-sm text-slate-500">24 avenue de la Cathédrale, 75001 Paris</p>
            </div>
            
            <div>
              <h3 className="font-medium">Contact</h3>
              <p className="text-sm text-slate-500">doyen.centre@diocese.fr</p>
              <p className="text-sm text-slate-500">01 42 36 12 34</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Vicariat</h3>
              <p className="text-sm text-slate-500">Vicariat Nord</p>
            </div>
            
            <div>
              <h3 className="font-medium">Équipe décanale</h3>
              <p className="text-sm text-slate-500">Prochaine réunion: 25 mai 2025</p>
            </div>
            
            <div>
              <h3 className="font-medium">Communications</h3>
              <a href="/dashboard/doyenne/communications" className="text-sm text-blue-600 hover:text-blue-800">
                Voir les dernières communications →
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}