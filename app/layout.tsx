import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
