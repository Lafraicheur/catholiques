// =============================================================================
// 4. COMPOSANT HEADER - components/DemandeMesseHeader.tsx
// =============================================================================
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export const DemandeMesseHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Demandes de Messe
        </h1>
        <p className="text-slate-500">
          Consultez et gérez les demandes de messe de votre paroisse
        </p>
      </div>
    </div>
  );
};