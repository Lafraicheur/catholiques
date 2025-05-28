// components/retrait/SuccessAnimationModal.tsx
import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Zap, CreditCard, Smartphone } from 'lucide-react';

interface SuccessAnimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  montant: number;
  operateur: string;
  numeroTelephone: string;
}

export const SuccessAnimationModal: React.FC<SuccessAnimationModalProps> = ({ 
  isOpen, 
  onClose, 
  montant, 
  operateur, 
  numeroTelephone 
}) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const timer1 = setTimeout(() => setPhase(1), 100);
      const timer2 = setTimeout(() => setPhase(2), 800);
      const timer3 = setTimeout(() => setPhase(3), 1500);
      const timer4 = setTimeout(() => setPhase(4), 2500);
      const timer5 = setTimeout(() => onClose(), 4500);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatMontant = (value: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(value);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Background avec effet de vague */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 animate-pulse">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Vagues animées */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-full h-full opacity-30 animate-bounce`}
              style={{
                background: `radial-gradient(circle at ${20 + i * 20}% ${30 + i * 15}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-white rounded-full opacity-80 animate-ping`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Rayons de lumière rotatifs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-full bg-gradient-to-t from-transparent via-white/20 to-transparent animate-spin origin-bottom"
            style={{
              left: '50%',
              bottom: '50%',
              transform: `rotate(${i * 45}deg)`,
              animationDuration: '4s',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center text-white px-8">
        
        {/* Phase 1: Explosion initiale */}
        <div className={`transition-all duration-1000 ${
          phase >= 1 
            ? 'scale-100 opacity-100 rotate-0' 
            : 'scale-0 opacity-0 rotate-180'
        }`}>
          
          {/* Icône de succès avec effet de pulsation */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping scale-150" />
            <div className="absolute inset-0 bg-green-300 rounded-full animate-pulse scale-125" />
            <div className="relative w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
              <Check 
                className={`w-16 h-16 text-green-600 transition-all duration-500 ${
                  phase >= 1 ? 'animate-bounce' : ''
                }`} 
                strokeWidth={3}
              />
            </div>
            
            {/* Sparkles autour de l'icône */}
            {[...Array(12)].map((_, i) => (
              <Sparkles
                key={i}
                className={`absolute w-6 h-6 text-yellow-300 animate-spin ${
                  phase >= 2 ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  left: `${50 + 40 * Math.cos(i * 30 * Math.PI / 180)}%`,
                  top: `${50 + 40 * Math.sin(i * 30 * Math.PI / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>

          {/* Titre principal */}
          <h1 className={`text-6xl font-bold mb-4 transition-all duration-1000 ${
            phase >= 2 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-10 opacity-0 scale-90'
          }`}>
            <span className="bg-gradient-to-r from-yellow-200 via-green-200 to-blue-200 bg-clip-text text-transparent animate-pulse">
              SUCCÈS !
            </span>
          </h1>

          {/* Message de confirmation */}
          <p className={`text-2xl mb-8 transition-all duration-1000 delay-300 ${
            phase >= 2 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}>
            Votre retrait a été effectué avec succès !
          </p>

          {/* Détails de la transaction */}
          <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20 transition-all duration-1000 delay-500 ${
            phase >= 3 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-10 opacity-0 scale-95'
          }`}>
            
            {/* Montant */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <CreditCard className="w-8 h-8 text-green-300" />
                <span className="text-lg text-white/80">Montant retiré</span>
              </div>
              <div className="text-4xl font-bold text-green-200 animate-pulse">
                {formatMontant(montant)}
              </div>
            </div>

            {/* Opérateur et numéro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center gap-3">
                <Smartphone className="w-6 h-6 text-blue-300" />
                <div className="text-left">
                  <div className="text-white/60 text-sm">Opérateur</div>
                  <div className="text-white font-semibold">{operateur}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <Zap className="w-6 h-6 text-yellow-300" />
                <div className="text-left">
                  <div className="text-white/60 text-sm">Numéro</div>
                  <div className="text-white font-semibold">{numeroTelephone}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Message de fermeture */}
          <div className={`transition-all duration-1000 delay-1000 ${
            phase >= 4 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-lg text-white/80 mb-4">
              Vous recevrez un SMS de confirmation dans quelques instants
            </p>
            
            {/* Barre de progression pour la fermeture automatique */}
            <div className="w-64 mx-auto bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-2000 ease-linear"
                style={{
                  width: phase >= 4 ? '100%' : '0%'
                }}
              />
            </div>
            <p className="text-sm text-white/60 mt-2">
              Fermeture automatique...
            </p>
          </div>
        </div>

        {/* Fireworks effet */}
        {phase >= 2 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '1s'
                }}
              >
                <div className="w-4 h-4 bg-yellow-400 rounded-full" />
                <div className="absolute inset-0 w-4 h-4 bg-red-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-bounce" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bouton de fermeture (optionnel) */}
      <button
        onClick={onClose}
        className={`absolute top-8 right-8 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
          phase >= 3 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        ✕
      </button>
    </div>
  );
};