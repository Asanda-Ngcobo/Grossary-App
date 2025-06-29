'use server'

import { Nunito_Sans } from "next/font/google";
import "../globals.css";
import { Toaster } from "react-hot-toast";


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
         <Toaster position="top-center" 
         reverseOrder={false} />
        {children}
       
      </body>

    </html>
  );
}
