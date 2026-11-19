import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import SyncStore from "./_components/SyncStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Registration Ticket & Token",
  description: "My Next.js App",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* ซิงก์ข้อมูลกับที่เก็บกลาง /api/store ให้หลายเครื่องเห็นข้อมูลเดียวกัน */}
        <SyncStore>{children}</SyncStore>
      </body>
    </html>
  );
}