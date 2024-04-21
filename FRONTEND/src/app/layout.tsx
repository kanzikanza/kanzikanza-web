import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local';
import Navbar from "../component/navbar/Navbar";
import {container} from './layout.css.ts';

const inter = Inter({ subsets: ["latin"] });

const pretendard = localFont({
  src: "../assets/fonts/Pretendard-Regular.woff",
  display: "swap",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: "한자 한 자",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Navbar />
        <div className={`${pretendard.className} ${container}`}>
          {children}
        </div>
      </body>
    </html>
  );
}