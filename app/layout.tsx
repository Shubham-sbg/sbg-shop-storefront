import type { Metadata, Viewport } from "next";
import "./globals.css";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://sbgshop.in"),
  title: "SBG SHOP — Official Virtual Showroom & Premium Jerseys",
  description:
    "Explore the SBG athletic jersey lineup in our interactive virtual showroom. Engineered for performance, designed with precision.",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/jerseys/transparent/02_black_front_main.png",
    apple: "/images/jerseys/transparent/02_black_front_main.png",
  },
  openGraph: {
    title: "SBG SHOP — Official Virtual Showroom",
    description: "EVERY MOVE MATTERS. Official SBG Performance Jerseys.",
    url: "https://sbgshop.in",
    siteName: "SBG SHOP",
    images: [
      {
        url: "/images/jerseys/transparent/02_black_front_main.png",
        width: 1200,
        height: 630,
        alt: "SBG Signature Pro Jersey",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Banner />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
