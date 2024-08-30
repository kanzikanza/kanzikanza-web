import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local';
import VerticalNavbar from "@/components/Navbar/VerticalNavbar.tsx";
import * as styles from './layout.css.ts';
import '@/styles/reset.css'

const inter = Inter({ subsets: ["latin"] });

const pretendard = localFont({
  src: "../../../public/fonts/Pretendard-Regular.otf",
  display: "swap",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: "한자 한 자",
  description: "Generated by create next app",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${styles.layout} ${pretendard.className}`}>
        <VerticalNavbar />
        <div className={styles.container}>
         {children}
        </div>
      </body>
    </html>
    // <html>
    //   <body>{children}</body>
    // </html>
  )
}