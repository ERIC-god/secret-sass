import type { Metadata } from "next";
import "asecretman/build/index.css";
import "./globals.css";
import { TrpcProvider } from "./TrpcProvider";
import { Toaster } from "@/components/ui/sonner";
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <TrpcProvider>
        <body>
          {children}
          <Toaster className=" absolute " />
        </body>
      </TrpcProvider>
    </html>
  );
}
