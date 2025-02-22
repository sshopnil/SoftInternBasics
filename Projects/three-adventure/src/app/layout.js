import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Scene } from "@/components/Scene";
import GlobalNavigation from "./global-navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Scene>
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 bg-white p-3 rounded-lg shadow-md">
            <GlobalNavigation />
          </div>
          {children}
        </Scene>
      </body>
    </html>
  );
}
