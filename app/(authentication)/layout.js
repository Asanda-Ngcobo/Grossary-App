'use server'

import { Nunito_Sans } from "next/font/google";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";


const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default async function AuthLayout({ children }) {
  
  return (
    <html lang="en">
           <head>
             
        <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-JW5VT5KYJX"
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-JW5VT5KYJX');
                `}
              </Script>

       <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        />
            </head>
      <body
        className={`${MainFont.className}`}
      >
         <Toaster position="top-center" 
         reverseOrder={false} />
        {children}
        <Analytics/>
      </body>

    </html>
  );
}
