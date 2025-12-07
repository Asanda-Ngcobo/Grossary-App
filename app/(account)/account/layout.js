import { Nunito_Sans } from "next/font/google";
import "@/app/globals.css";

import AppNav from '@/app/(account)/_ui/AppNav'
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { FormProvider } from "@/app/providers/Provider";
import Menu from "./Menu";



const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default function WebAppLayout({ children }) {
  

  return (
    <html>
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
      </head>
 <body
        className={`${MainFont.className} bg-[#041527]
         text-white lg:grid grid-cols-[16rem_1fr] h-screen 
        gap-12`}
      >
        <FormProvider>
            <Menu/>
        <div>{children}</div>

        </FormProvider>
     
        
          <Analytics/>
        
        
        
      </body>
    </html>
     

   
  );
}
