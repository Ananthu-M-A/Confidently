import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { ExpertProvider } from "@/contexts/auth/ExpertAuthContext";
import { AdminProvider } from "@/contexts/auth/AdminAuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title:
    "Confidently | Interview Practice App | Powered by Smart Depot | Developed by Ananthu M A",
  description: "An app for practicing real interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AdminProvider>
          <ExpertProvider>
            <AuthProvider>
              <Header />
              {children}
              <Toaster />
              <Footer />
            </AuthProvider>
          </ExpertProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
