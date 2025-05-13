export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-3 px-4 bg-white border-t border-slate-200 text-xs text-slate-500 text-center">
      <p>© {currentYear} Dashboard Église Catholique. Tous droits réservés.</p>
    </footer>
  );
}