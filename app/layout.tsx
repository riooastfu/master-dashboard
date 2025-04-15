import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import axios from "axios";
import AuthProvider from "@/components/providers/auth-provider";
import { getSession } from "@/auth";
import { ModalProvider } from "@/components/providers/modal-provider";
import "leaflet/dist/leaflet.css";

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
  title: "PAS Master Dashboard",
  description: "",
};

axios.defaults.withCredentials = true

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider session={session}>
          <ModalProvider />
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
