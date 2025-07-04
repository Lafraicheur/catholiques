// components/sacrements/SacrementsPageSkeleton.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XCircle } from "lucide-react";
import { Button } from "../ui/button";

export function SacrementsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" /> {/* Titre */}
          <Skeleton className="h-4 w-80" /> {/* Description */}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" /> {/* Label */}
                  <Skeleton className="h-8 w-12" /> {/* Nombre */}
                </div>
                <Skeleton className="h-12 w-12 rounded-full" /> {/* Icône */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Barre de recherche */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Skeleton className="h-10 w-full" /> {/* Champ de recherche */}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" /> {/* Bouton export */}
              <Skeleton className="h-10 w-32" /> {/* Bouton ajouter */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets et contenu */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header avec onglets skeleton */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="h-12 p-1 bg-slate-100 rounded-xl grid w-full grid-cols-5 gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Contenu du tableau */}
        <div className="p-6">
          <div className="space-y-4">
            {/* En-tête du tableau */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 p-4 bg-slate-50 rounded-lg">
              <Skeleton className="h-4 w-20" /> {/* Type */}
              <Skeleton className="h-4 w-24" /> {/* Date */}
              <Skeleton className="h-4 w-32" /> {/* Description */}
              <Skeleton className="h-4 w-20" /> {/* Célébrant */}
              <Skeleton className="h-4 w-16" /> {/* Statut */}
              <Skeleton className="h-4 w-16" /> {/* Actions */}
            </div>

            {/* Lignes du tableau */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-1 lg:grid-cols-6 gap-4 p-4 border border-slate-100 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />{" "}
                  {/* Badge type */}
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" /> {/* Icône date */}
                  <Skeleton className="h-4 w-20" /> {/* Date */}
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />{" "}
                  {/* Description ligne 1 */}
                  <Skeleton className="h-3 w-3/4" /> {/* Description ligne 2 */}
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
                  <Skeleton className="h-4 w-20" /> {/* Nom célébrant */}
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />{" "}
                {/* Badge statut */}
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8 rounded" /> {/* Bouton voir */}
                  <Skeleton className="h-8 w-8 rounded" />{" "}
                  {/* Bouton modifier */}
                  <Skeleton className="h-8 w-8 rounded" />{" "}
                  {/* Bouton supprimer */}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Skeleton className="h-4 w-48" /> {/* Info pagination */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" /> {/* Bouton précédent */}
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-9 w-9" /> /* Numéros de page */
                ))}
              </div>
              <Skeleton className="h-9 w-20" /> {/* Bouton suivant */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Version alternative plus simple si vous préférez
export function SacrementsPageSkeletonSimple() {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-12" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal */}
      <Card>
        <CardContent className="p-6">
          {/* Onglets */}
          <div className="mb-6">
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-20" />
              ))}
            </div>
          </div>

          {/* Tableau */}
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="flex-1 h-4" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SacrementErrorProps {
  error: string | null;
  onRetry: () => void;
}

export function SacrementError({ error, onRetry }: SacrementErrorProps) {
  if (!error) return null;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <XCircle className="h-12 w-12 text-red-400 mb-4" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        Une erreur est survenue
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
      <Button onClick={onRetry}>Réessayer</Button>
    </div>
  );
}
