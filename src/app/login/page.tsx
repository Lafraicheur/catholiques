import { Metadata } from "next";
import LoginForm from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Connexion | Dashboard Église Catholique",
  description: "Connectez-vous à votre tableau de bord",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Église Catholique</h1>
          <p className="mt-2 text-sm text-slate-600">Connectez-vous à votre compte</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}