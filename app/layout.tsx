import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next"

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xandeum Network | pNode Explore",
  description: "Advanced analytics and monitoring platform for the Xandeum storage network.",
};

import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
