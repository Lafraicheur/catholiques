// components/unions/SacrementUnionDetailsSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SacrementUnionDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20" /> {/* Bouton retour */}
          <Skeleton className="h-8 w-80" /> {/* Titre */}
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-24" /> {/* Bouton supprimer */}
        </div>
      </div>

      {/* Carte principale */}
      <Card>
        <CardHeader>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
          
          {/* Titre principal */}
          <Skeleton className="h-8 w-96 mb-2" />
          
          {/* Date */}
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-5 w-32" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Onglets */}
          <Tabs defaultValue="informations">
            <TabsList className="mb-4">
              <TabsTrigger value="informations">
                <Skeleton className="h-4 w-20" />
              </TabsTrigger>
              <TabsTrigger value="images">
                <Skeleton className="h-4 w-16" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="informations" className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" /> {/* Titre section */}
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </div>

              {/* Détails du sacrement */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" /> {/* Titre section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Colonne 1 */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex justify-between px-4 py-2 bg-slate-50 rounded-md">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Colonne 2 */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex justify-between px-4 py-2 bg-slate-50 rounded-md">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section personnes */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" /> {/* Titre section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 3 cartes pour Marié, Mariée, Célébrant */}
                  {[1, 2, 3].map((card) => (
                    <Card key={card} className="h-full">
                      <CardHeader>
                        <div className="flex items-center">
                          <Skeleton className="h-5 w-5 mr-2" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Nom et info principale */}
                        <div className="flex items-start">
                          <Skeleton className="h-4 w-4 mt-1 mr-2" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-28" />
                          </div>
                        </div>
                        
                        {/* Téléphone */}
                        <div className="flex items-center">
                          <Skeleton className="h-4 w-4 mr-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        
                        {/* Email */}
                        <div className="flex items-center">
                          <Skeleton className="h-4 w-4 mr-2" />
                          <Skeleton className="h-4 w-36" />
                        </div>
                        
                        {/* Adresse */}
                        <div className="flex items-start">
                          <Skeleton className="h-4 w-4 mt-1 mr-2" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images">
              {/* Galerie d'images skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Skeleton key={item} className="aspect-square rounded-md" />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}