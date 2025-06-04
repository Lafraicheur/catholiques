/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import axios from "axios";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// ✅ Interface pour les données de l'API
interface GraphData {
  date: string;
  abonnement: number;
  "demande de messe": number;
  "denier de culte": number;
  don: number;
}

// ✅ Interface pour les données transformées du graphique
interface ChartDataItem {
  date: string;
  abonnements: number;
  demandes_messe: number;
  denier_culte: number;
  dons: number;
  total: number;
}

// ✅ Props du composant
interface ChartAreaInteractiveProps {
  paroisse_id: number;
}

// Couleurs Tailwind définies pour chaque métrique
const tailwindColors = {
  abonnements: {
    main: "#3b82f6", // blue-500
    light: "#93c5fd", // blue-300
  },
  demandes_messe: {
    main: "#10b981", // emerald-500
    light: "#6ee7b7", // emerald-300
  },
  denier_culte: {
    main: "#f59e0b", // amber-500
    light: "#fcd34d", // amber-300
  },
  dons: {
    main: "#ef4444", // red-500
    light: "#fca5a5", // red-300
  },
};

const chartConfig = {
  total: {
    label: "Total Activités",
  },
  abonnements: {
    label: "Abonnements",
    color: tailwindColors.abonnements.main,
  },
  demandes_messe: {
    label: "Demandes de Messe",
    color: tailwindColors.demandes_messe.main,
  },
  denier_culte: {
    label: "Denier de Culte",
    color: tailwindColors.denier_culte.main,
  },
  dons: {
    label: "Dons",
    color: tailwindColors.dons.main,
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ paroisse_id }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const API_URL_STATISTIQUE = process.env.NEXT_PUBLIC_API_URL_STATISTIQUE || "https://api.cathoconnect.ci/api:HzF8fFua";

  // ✅ Fonction pour transformer les données de l'API
  const transformApiData = (apiData: GraphData[]): ChartDataItem[] => {
    // Grouper les données par date et sommer les valeurs
    const groupedData = apiData.reduce((acc, item) => {
      const date = item.date;
      
      if (!acc[date]) {
        acc[date] = {
          date,
          abonnements: 0,
          demandes_messe: 0,
          denier_culte: 0,
          dons: 0,
          total: 0,
        };
      }
      
      acc[date].abonnements += item.abonnement;
      acc[date].demandes_messe += item["demande de messe"];
      acc[date].denier_culte += item["denier de culte"];
      acc[date].dons += item.don;
      acc[date].total = acc[date].abonnements + acc[date].demandes_messe + acc[date].denier_culte + acc[date].dons;
      
      return acc;
    }, {} as Record<string, ChartDataItem>);

    // Convertir en tableau et trier par date
    return Object.values(groupedData).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  // ✅ Fonction pour récupérer les données du graphique
  const fetchGraphData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      const response = await axios.get(`${API_URL_STATISTIQUE}/accueil/graphe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          paroisse_id,
        },
      });

      const transformedData = transformApiData(response.data);
      setChartData(transformedData);
      setLoading(false);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des données du graphique:", error);
      
      // Gestion spécifique des erreurs
      if (error.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.response?.status === 403) {
        setError("Accès refusé. Privilèges insuffisants.");
      } else if (error.response?.status === 404) {
        setError("Données non trouvées pour cette paroisse.");
      } else if (error.response?.status >= 500) {
        setError("Erreur serveur. Veuillez réessayer plus tard.");
      } else {
        setError("Erreur de réseau. Vérifiez votre connexion.");
      }
      
      setLoading(false);
    }
  };

  // ✅ Effet pour charger les données au montage et lors du changement de paroisse
  React.useEffect(() => {
    if (paroisse_id) {
      fetchGraphData();
    }
  }, [paroisse_id]);

  // ✅ Effet pour ajuster la période sur mobile
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // ✅ Filtrage des données selon la période sélectionnée
  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];

    const now = new Date();
    let daysToSubtract = 90;
    
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    
    return chartData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= now;
    });
  }, [chartData, timeRange]);

  // ✅ Composant de loading
  const LoadingSkeleton = () => (
    <div className="h-[250px] w-full animate-pulse bg-gray-200 rounded-md" />
  );

  // ✅ Composant d'erreur
  const ErrorDisplay = () => (
    <div className="h-[250px] w-full flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={fetchGraphData}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Activités de la Paroisse</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            {loading ? "Chargement..." : `${filteredData.length} enregistrements`}
          </span>
          <span className="@[540px]/card:hidden">
            {loading ? "..." : `${filteredData.length} records`}
          </span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
            disabled={loading}
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              3 derniers mois
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              30 derniers jours
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              7 derniers jours
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange} disabled={loading}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Sélectionner une période"
            >
              <SelectValue placeholder="3 derniers mois" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 derniers mois
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 derniers jours
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 derniers jours
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorDisplay />
        ) : filteredData.length === 0 ? (
          <div className="h-[250px] w-full flex items-center justify-center">
            <p className="text-gray-500">Aucune donnée disponible pour cette période</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillAbonnements" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={tailwindColors.abonnements.main}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={tailwindColors.abonnements.main}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillDemandesMesse" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={tailwindColors.demandes_messe.main}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={tailwindColors.demandes_messe.main}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillDenierCulte" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={tailwindColors.denier_culte.main}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={tailwindColors.denier_culte.main}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillDons" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={tailwindColors.dons.main}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={tailwindColors.dons.main}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("fr-FR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="abonnements"
                type="natural"
                fill="url(#fillAbonnements)"
                stroke={tailwindColors.abonnements.main}
                stackId="a"
              />
              <Area
                dataKey="demandes_messe"
                type="natural"
                fill="url(#fillDemandesMesse)"
                stroke={tailwindColors.demandes_messe.main}
                stackId="a"
              />
              <Area
                dataKey="denier_culte"
                type="natural"
                fill="url(#fillDenierCulte)"
                stroke={tailwindColors.denier_culte.main}
                stackId="a"
              />
              <Area
                dataKey="dons"
                type="natural"
                fill="url(#fillDons)"
                stroke={tailwindColors.dons.main}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}