import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/app/providers/StoreProvider";

export const metadata: Metadata = {
  title: "Weather Dashboard",
  description: "Multi-user weather dashboard application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
