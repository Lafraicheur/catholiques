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