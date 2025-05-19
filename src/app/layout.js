import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { DatabaseProvider, useDatabase } from "@/context/DatabaseContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata = {
  title: "Budget Tracker 9000",
  description: "Its a budget tracker thats broken more than its not",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <DatabaseProvider>
        <html lang="en">
          <body
            className={`${roboto.variable} ${geistMono.variable} antialiased`}
          >
            <Toaster />
            {children}
          </body>
        </html>
      </DatabaseProvider>
    </ClerkProvider>
  );
}
