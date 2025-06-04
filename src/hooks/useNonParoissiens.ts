// hooks/useNonParoissiens.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { NonParoissien, NonParoissienService } from '@/services/nonParoissienService';
import { AuthenticationError, ForbiddenError, NotFoundError } from '@/services/api';

interface UseNonParoissiensReturn {
  nonParoissiens: NonParoissien[];
  filteredNonParoissiens: NonParoissien[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    hommes: number;
    femmes: number;
  };
  // Actions
  refetch: () => Promise<void>;
  handleCreate: (data: NonParoissien) => void;
  handleUpdate: (data: NonParoissien) => void;
  handleDelete: (id: number) => void;
  handleConvert: (id: number) => void;
}

interface UseNonParoissiensOptions {
  searchQuery: string;
  genreFilter: string;
}

export const useNonParoissiens = ({ 
  searchQuery, 
  genreFilter 
}: UseNonParoissiensOptions): UseNonParoissiensReturn => {
  const router = useRouter();
  const [nonParoissiens, setNonParoissiens] = useState<NonParoissien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calcul des statistiques mémorisé
  const stats = useMemo(() => ({
    total: nonParoissiens.length,
    hommes: nonParoissiens.filter(np => np.genre === "M").length,
    femmes: nonParoissiens.filter(np => np.genre === "F").length,
  }), [nonParoissiens]);

  // Filtrage mémorisé pour éviter les recalculs inutiles
  const filteredNonParoissiens = useMemo(() => {
    let results = nonParoissiens;

    // Filtrer par genre
    if (genreFilter !== "TOUS") {
      results = results.filter(np => np.genre === genreFilter);
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(np =>
        np.nom.toLowerCase().includes(query) ||
        np.prenom.toLowerCase().includes(query) ||
        np.num_de_telephone?.includes(query)
      );
    }

    return results;
  }, [nonParoissiens, searchQuery, genreFilter]);

  // Fonction de chargement des données
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await NonParoissienService.fetchAll();
      setNonParoissiens(data);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);

      if (err instanceof AuthenticationError) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter pour continuer.",
        });
        router.push("/login");
      } else if (err instanceof ForbiddenError) {
        setError("Vous n'avez pas les droits nécessaires pour accéder à cette ressource.");
      } else if (err instanceof NotFoundError) {
        setError("Aucun non-paroissien trouvé.");
      } else {
        setError("Une erreur est survenue lors du chargement des données.");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Chargement initial
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Actions mémorisées
  const handleCreate = useCallback((newNonParoissien: NonParoissien) => {
    setNonParoissiens(prev => [newNonParoissien, ...prev]);
    toast.success("Non-paroissien ajouté avec succès");
  }, []);

  const handleUpdate = useCallback((updatedNonParoissien: NonParoissien) => {
    setNonParoissiens(prev =>
      prev.map(item =>
        item.id === updatedNonParoissien.id ? updatedNonParoissien : item
      )
    );
    toast.success("Non-paroissien modifié avec succès");
  }, []);

  const handleDelete = useCallback((deletedId: number) => {
    setNonParoissiens(prev =>
      prev.filter(item => item.id !== deletedId)
    );
    toast.success("Non-paroissien supprimé avec succès");
  }, []);

  const handleConvert = useCallback((convertedId: number) => {
    setNonParoissiens(prev =>
      prev.filter(item => item.id !== convertedId)
    );
    toast.success("Conversion en paroissien réussie");
  }, []);

  return {
    nonParoissiens,
    filteredNonParoissiens,
    loading,
    error,
    stats,
    refetch: fetchData,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleConvert,
  };
};