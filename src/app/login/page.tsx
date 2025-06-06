/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { Metadata } from "next";
import { motion } from "framer-motion";
import loginImage from "@/assets/login.jpg";

import LoginForm from "@/components/forms/LoginForm";
import Image from "next/image";
import Link from "next/link";
import ButterfliesAnimation from "@/components/ui/ButterfliesAnimation";

export default function LoginPage() {
  return (
    <>
      <ButterfliesAnimation />

      <main className="flex h-screen items-center justify-center p-5">
        <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
          {/* Partie formulaire */}
          <div className="flex w-full flex-col justify-center space-y-10 p-10 md:w-1/2">
            {/* Titre animé */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-4xl font-extrabold text-primary"
            >
              Catho Connect
            </motion.h1>

            <h2 className="text-center text-2xl font-bold text-muted-foreground">
              Connectez-vous
            </h2>

            <div className="space-y-5">
              <LoginForm />
            </div>
          </div>

          {/* Image */}
          <Image
            src={loginImage}
            alt="Image de connexion"
            className="hidden w-1/2 object-cover md:block"
          />
        </div>
      </main>
    </>
  );
}

// export const metadata: Metadata = {
//   title: "Connexion | Dashboard Église Catholique",
//   description: "Connectez-vous à votre tableau de bord",
// };

// <div className="flex items-center justify-center min-h-screen bg-slate-100">
//   <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//     <div className="text-center">
//       <h1 className="text-2xl font-bold text-slate-900">Dashboard Église Catholique</h1>
//       <p className="mt-2 text-sm text-slate-600">Connectez-vous à votre compte</p>
//     </div>

//     <LoginForm />
//   </div>
// </div>
