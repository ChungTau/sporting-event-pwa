import type { Metadata } from "next";
import "../styles/globals.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import { LayoutProps } from "@/types/layoutProps";
import { languages } from "@/lib/i18n/settings";

export const metadata: Metadata = {
  title: "FYP GIB5",
  description: "Generated by create next app",
};

export async function generateStaticParams() {
  return languages.map((lng) => ({lng}));
}

export default function RootLayout({children, params: {
  lng
}} : LayoutProps) {
  return (
      <html lang={lng}
       suppressHydrationWarning>
          {children}
      </html>
  );
}