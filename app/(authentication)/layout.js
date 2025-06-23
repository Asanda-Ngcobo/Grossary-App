'use server'

import { Nunito_Sans } from "next/font/google";
import "../globals.css";


const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default async function AuthLayout({ children }) {
  
  return (
    <html lang="en">
      <body
        className={`${MainFont.className}`}
      >
        {children}
       
      </body>

    </html>
  );
}
