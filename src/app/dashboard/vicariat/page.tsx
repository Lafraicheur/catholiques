/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
import { Card } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import { Metadata } from "next";
import { Building, Church, Users, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard Vicariat | Église Catholique",
};

export default function VicariatDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Vicariat Nord</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Doyennés"
          value="5"
          icon={<Building className="h-5 w-5 text-blue-600" />}
        />
        <StatsCard
          title="Paroisses"
          value="28"
          icon={<Church className="h-5 w-5 text-green-600" />}
        />
        <StatsCard
          title="Prêtres"
          value="62"
          icon={<Users className="h-5 w-5 text-amber-600" />}
        />
        <StatsCard
          title="Événements"
          value="12"
          description="prévus ce mois-ci"
          icon={<Calendar className="h-5 w-5 text-indigo-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1">
          <h2 className="text-xl font-bold mb-4">Doyennés</h2>
          <div className="space-y-3">
            <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">
              <h3 className="font-medium">Doyenné Centre</h3>
              <p className="text-sm text-slate-500 mt-1">8 paroisses</p>
            </div>
            <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">
              <h3 className="font-medium">Doyenné Est</h3>
              <p className="text-sm text-slate-500 mt-1">5 paroisses</p>
            </div>
            <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">
              <h3 className="font-medium">Doyenné Ouest</h3>
              <p className="text-sm text-slate-500 mt-1">6 paroisses</p>
            </div>
            <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">
              <h3 className="font-medium">Doyenné Nord</h3>
              <p className="text-sm text-slate-500 mt-1">4 paroisses</p>
            </div>
            <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">
              <h3 className="font-medium">Doyenné Sud</h3>
              <p className="text-sm text-slate-500 mt-1">5 paroisses</p>
            </div>
          </div>
          <div className="mt-4 text-right">
            <a href="/dashboard/vicariat/doyennes" className="text-sm text-blue-600 hover:text-blue-800">
              Gérer les doyennés →
            </a>
          </div>
        </Card>
        
        <Card className="p-6 col-span-2">
          <h2 className="text-xl font-bold mb-4">Événements à venir</h2>
          <div className="space-y-3">
            <div className="p-3 border border-slate-200 rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Rencontre des responsables pastoraux</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">22 Mai 2025</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Centre pastoral du vicariat</p>
            </div>
            
            <div className="p-3 border border-slate-200 rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Formation des catéchistes</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">5 Juin 2025</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Maison vicariéle</p>
            </div>
            
            <div className="p-3 border border-slate-200 rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Pèlerinage vicarial</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">12-13 Juillet 2025</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Sanctuaire Notre-Dame</p>
            </div>
          </div>
          
          <div className="mt-4 text-right">
            <a href="/dashboard/vicariat/evenements" className="text-sm text-blue-600 hover:text-blue-800">
              Voir tous les événements →
            </a>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Informations du Vicariat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Vicaire épiscopal</h3>
              <p className="text-sm text-slate-500">Père Michel Lefevre</p>
            </div>
            
            <div>
              <h3 className="font-medium">Secrétariat</h3>
              <p className="text-sm text-slate-500">8 rue Saint-Antoine, 75004 Paris</p>
              <p className="text-sm text-slate-500">secretariat.vicariat-nord@diocese.fr</p>
            </div>
            
            <div>
              <h3 className="font-medium">Téléphone</h3>
              <p className="text-sm text-slate-500">01 42 36 78 90</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Horaires d'ouverture</h3>
              <p className="text-sm text-slate-500">Du lundi au vendredi, 9h-12h / 14h-17h</p>
            </div>
            
            <div>
              <h3 className="font-medium">Conseil vicarial</h3>
              <p className="text-sm text-slate-500">Prochaine réunion: 28 mai 2025</p>
            </div>
            
            <div>
              <h3 className="font-medium">Communications</h3>
              <a href="/dashboard/vicariat/communications" className="text-sm text-blue-600 hover:text-blue-800">
                Voir les dernières communications →
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
};