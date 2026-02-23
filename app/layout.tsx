import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { cn } from "@/lib/utils";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import { RoutePrefetcher } from "@/components/RoutePrefetcher";
import { AccessibilityReporter } from "@/components/AccessibilityReporter";
import { StorageFallbackBanner } from "@/components/StorageFallbackBanner";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "BandReady",
  description: "Band practice made easy",
  other: { "screen-orientation": "landscape" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          nunito.variable,
          "font-nunito antialiased min-h-design-height min-w-design-width bg-bg-soft text-slate-text"
        )}
      >
        <div className="max-w-[1024px] mx-auto min-h-design-height w-full relative">
          <RoutePrefetcher />
          <StorageFallbackBanner />
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
          <AccessibilityReporter />
        </div>
      </body>
    </html>
  );
}
