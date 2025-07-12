

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { sanitizeForRender } from "./formatUtils";

// Composant pour affichage sécurisé
export const SafeValue = ({
  children,
  className = "",
}: {
  children: any;
  className?: string;
}) => {
  const safeContent = sanitizeForRender(children);
  return <span className={className}>{safeContent}</span>;
};