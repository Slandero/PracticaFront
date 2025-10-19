import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Telecom Plus - Gestión de Contratos",
  description: "Sistema de gestión de contratos y servicios de telecomunicaciones",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Limpiar sesión al iniciar la app
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <AuthProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
