import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Par défaut, rediriger vers le dashboard paroisse
  redirect("/dashboard/vicariat");
  
  return null;
}